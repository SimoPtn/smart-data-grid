import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { DataExplorerStore } from '../../store/data-explorer-store';
import { DataExplorerToolbar } from '../../components/data-explorer-toolbar/data-explorer-toolbar';
import { DataExplorerTable } from '../../components/data-explorer-table/data-explorer-table';
import { DataExplorerPagination } from '../../components/data-explorer-pagination/data-explorer-pagination';

@Component({
  selector: 'app-data-explorer-page',
  standalone: true,
  imports: [
    CommonModule,
    DataExplorerToolbar,
    DataExplorerTable,
    DataExplorerPagination
  ],
  templateUrl: './data-explorer-page.html',
  styleUrl: './data-explorer-page.scss',
})
export class DataExplorerPage implements OnInit {
  private readonly store = inject(DataExplorerStore);

  readonly displayedColumns: string[] = [
    'name',
    'email',
    'company',
    'status',
    'score'
  ];

  readonly vm$ = combineLatest({
    loading: this.store.loading$,
    filteredRecords: this.store.filteredRecords$,
    paginatedRecords: this.store.paginatedRecords$,
    pageIndex: this.store.pageIndex$,
    totalPages: this.store.totalPages$,
    canGoPrev: this.store.canGoPrev$,
    canGoNext: this.store.canGoNext$,
    sortState: this.store.sort$
  }).pipe(
    map(vm => ({
      ...vm,
      displayedColumns: this.displayedColumns
    }))
  );

  ngOnInit(): void {
    this.store.loadData();
  }

  setSort(key: 'name' | 'email' | 'score'): void {
    this.store.setSort(key);
  }

  nextPage(): void {
    this.store.nextPage();
  }

  prevPage(): void {
    this.store.prevPage();
  }

  onSearchValueChanged(value: string): void {
    this.store.setSearchTerm(value);
  }

  onPageSizeValueChanged(value: number): void {
    this.store.setPageSize(value);
  }
}