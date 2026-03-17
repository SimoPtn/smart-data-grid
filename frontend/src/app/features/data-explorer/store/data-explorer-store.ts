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
@Injectable({
  providedIn: 'root'
})
export class DataExplorerStore {
  
  private readonly dataService = inject(DataService);

  private readonly recordsSubject = new BehaviorSubject<DataRecord[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly searchTermSubject = new BehaviorSubject<string>('');
  private readonly pageIndexSubject = new BehaviorSubject<number>(0);
  private readonly pageSizeSubject = new BehaviorSubject<number>(5);

  readonly pageIndex$ = this.pageIndexSubject.asObservable();
  readonly pageSize$ = this.pageSizeSubject.asObservable();

  readonly records$ = this.recordsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly searchTerm$ = this.searchTermSubject.asObservable().pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

   private readonly sortSubject = new BehaviorSubject<SortState>({
  key: null,
  direction: null
});

readonly sort$ = this.sortSubject.asObservable();


  readonly filteredRecords$ = combineLatest([
  this.records$,
  this.searchTerm$,
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
    this.loadingSubject.next(true);

    this.dataService.getData().subscribe({
      next: (data) => {
        this.recordsSubject.next(data);
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
}

setPage(index: number): void {
  this.pageIndexSubject.next(index);
}

setPageSize(size: number): void {
  this.pageSizeSubject.next(size);
  this.pageIndexSubject.next(0);
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
}