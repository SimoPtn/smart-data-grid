import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataRecord } from '../models/data-record';
import { DataService } from '../services/data';
type SortDirection = 'asc' | 'desc' | null;
interface SortState {
  key: keyof DataRecord | null;
  direction: SortDirection;
}
interface PersistedDataExplorerState {
  searchTerm: string;
  pageSize: number;
  sort: SortState;
}
@Injectable({
  providedIn: 'root'
})
export class DataExplorerStore {
  
  private readonly dataService = inject(DataService);

  private readonly storageKey = 'smart-data-grid-state';
  private readonly recordsStorageKey = 'smart-data-grid-records';

  private readonly recordsSubject = new BehaviorSubject<DataRecord[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly searchTermSubject = new BehaviorSubject<string>('');
  private readonly pageIndexSubject = new BehaviorSubject<number>(0);
  private readonly pageSizeSubject = new BehaviorSubject<number>(5);

  readonly pageIndex$ = this.pageIndexSubject.asObservable();
  readonly pageSize$ = this.pageSizeSubject.asObservable();

  readonly records$ = this.recordsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly searchTerm$ = this.searchTermSubject.asObservable();

  private readonly debouncedSearchTerm$ = this.searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

   private readonly sortSubject = new BehaviorSubject<SortState>({
  key: null,
  direction: null
});

readonly sort$ = this.sortSubject.asObservable();

readonly hasActiveFilters$ = combineLatest([
  this.searchTerm$,
  this.pageSize$,
  this.sort$
]).pipe(
  map(([searchTerm, pageSize, sort]) => {
    const hasSearch = searchTerm.trim().length > 0;
    const hasCustomPageSize = pageSize !== 5;
    const hasSort = sort.key !== null && sort.direction !== null;

    return hasSearch || hasCustomPageSize || hasSort;
  })
);


  readonly filteredRecords$ = combineLatest([
  this.records$,
  this.debouncedSearchTerm$,
  this.sort$
]).pipe(
  map(([records, searchTerm, sort]) => {
    const term = searchTerm.trim().toLowerCase();

    let result = records;

    // filtro
    if (term) {
      result = result.filter(record =>
        record.name.toLowerCase().includes(term) ||
        record.email.toLowerCase().includes(term) ||
        record.company.toLowerCase().includes(term)
      );
    }

    // sort
    if (sort.key && sort.direction) {
      result = [...result].sort((a, b) => {
        const valueA = a[sort.key!];
        const valueB = b[sort.key!];

        if (valueA < valueB) return sort.direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  })
);

readonly paginatedRecords$ = combineLatest([
  this.filteredRecords$,
  this.pageIndex$,
  this.pageSize$
]).pipe(
  map(([records, pageIndex, pageSize]) => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return records.slice(start, end);
  })
);

readonly totalPages$ = combineLatest([
  this.filteredRecords$,
  this.pageSize$
]).pipe(
  map(([records, pageSize]) =>
    Math.ceil(records.length / pageSize)
  )
);

readonly canGoNext$ = combineLatest([
  this.filteredRecords$,
  this.pageIndex$,
  this.pageSize$
]).pipe(
  map(([records, pageIndex, pageSize]) => {
    return (pageIndex + 1) * pageSize < records.length;
  })
);

readonly canGoPrev$ = this.pageIndex$.pipe(
  map(pageIndex => pageIndex > 0)
);

  loadData(): void {
    this.restoreState();
    this.loadingSubject.next(true);

    const storedRecords = this.getStoredRecords();

    if (storedRecords) {
      this.recordsSubject.next(storedRecords);
      this.loadingSubject.next(false);
      return;
    }

    this.dataService.getData().subscribe({
      next: (data) => {
        this.recordsSubject.next(data);
        this.saveRecords(data);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.loadingSubject.next(false);
      }
    });
  }

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
    this.pageIndexSubject.next(0);
    this.saveState();
  }

 setSort(key: keyof DataRecord): void {
  const current = this.sortSubject.value;

  let nextSort: SortState;

  if (current.key !== key) {
    nextSort = { key, direction: 'asc' };
  } else if (current.direction === 'asc') {
    nextSort = { key, direction: 'desc' };
  } else if (current.direction === 'desc') {
    nextSort = { key: null, direction: null };
  } else {
    nextSort = { key, direction: 'asc' };
  }

  this.sortSubject.next(nextSort);
  this.pageIndexSubject.next(0);
  this.saveState();
}

setPage(index: number): void {
  this.pageIndexSubject.next(index);
}

setPageSize(size: number): void {
  this.pageSizeSubject.next(size);
  this.pageIndexSubject.next(0);
  this.saveState();
}

nextPage(): void {
  const current = this.pageIndexSubject.value;
  this.pageIndexSubject.next(current + 1);
}

prevPage(): void {
  const current = this.pageIndexSubject.value;
  if (current > 0) {
    this.pageIndexSubject.next(current - 1);
  }
}

private saveState(): void {
  const state: PersistedDataExplorerState = {
    searchTerm: this.searchTermSubject.value,
    pageSize: this.pageSizeSubject.value,
    sort: this.sortSubject.value
  };

  localStorage.setItem(this.storageKey, JSON.stringify(state));
}

private restoreState(): void {
  const rawState = localStorage.getItem(this.storageKey);

  if (!rawState) {
    return;
  }

  try {
    const parsedState = JSON.parse(rawState) as PersistedDataExplorerState;

    this.searchTermSubject.next(parsedState.searchTerm ?? '');
    this.pageSizeSubject.next(parsedState.pageSize ?? 5);
    this.sortSubject.next(parsedState.sort ?? { key: null, direction: null });
  } catch (error) {
    console.error('Error restoring persisted state', error);
    localStorage.removeItem(this.storageKey);
  }
}

resetFilters(): void {
  this.searchTermSubject.next('');
  this.pageSizeSubject.next(5);
  this.sortSubject.next({ key: null, direction: null });
  this.pageIndexSubject.next(0);
  this.saveState();
}

private saveRecords(records: DataRecord[]): void {
  localStorage.setItem(this.recordsStorageKey, JSON.stringify(records));
}

private getStoredRecords(): DataRecord[] | null {
  const rawRecords = localStorage.getItem(this.recordsStorageKey);

  if (!rawRecords) {
    return null;
  }

  try {
    return JSON.parse(rawRecords) as DataRecord[];
  } catch (error) {
    console.error('Error restoring stored records', error);
    localStorage.removeItem(this.recordsStorageKey);
    return null;
  }
}

deleteRecord(recordId: number): void {
  const currentRecords = this.recordsSubject.value;
  const updatedRecords = currentRecords.filter(record => record.id !== recordId);

  this.recordsSubject.next(updatedRecords);
  this.saveRecords(updatedRecords);

  const currentPageIndex = this.pageIndexSubject.value;
  const pageSize = this.pageSizeSubject.value;
  const startIndex = currentPageIndex * pageSize;

  if (startIndex >= updatedRecords.length && currentPageIndex > 0) {
    this.pageIndexSubject.next(currentPageIndex - 1);
  }
}

addRecord(record: DataRecord): void {
  const currentRecords = this.recordsSubject.value;
  const updatedRecords = [record, ...currentRecords];

  this.recordsSubject.next(updatedRecords);
  this.saveRecords(updatedRecords);
  this.pageIndexSubject.next(0);
}

updateRecord(updatedRecord: DataRecord): void {
  const currentRecords = this.recordsSubject.value;

  const updatedRecords = currentRecords.map(record =>
    record.id === updatedRecord.id ? updatedRecord : record
  );

  this.recordsSubject.next(updatedRecords);
  this.saveRecords(updatedRecords);
}
}