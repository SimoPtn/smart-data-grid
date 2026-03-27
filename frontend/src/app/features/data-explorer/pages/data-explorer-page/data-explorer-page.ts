import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { DataExplorerStore } from '../../store/data-explorer-store';
import { DataExplorerToolbar } from '../../components/data-explorer-toolbar/data-explorer-toolbar';
import { DataExplorerTable } from '../../components/data-explorer-table/data-explorer-table';
import { DataExplorerPagination } from '../../components/data-explorer-pagination/data-explorer-pagination';
import { DataRecord } from '../../models/data-record';
import { RecordFormDialog } from '../../components/record-form-dialog/record-form-dialog';
import { ConfirmDeleteDialog } from '../../components/confirm-delete-dialog/confirm-delete-dialog';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RecordDetailsDialog } from '../../components/record-details-dialog/record-details-dialog';
import { TablePreferencesService } from '../../services/table-preferences.service';
import { TableColumn, DataTableColumnKey } from '../../models/table-column.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from "@angular/material/icon";


@Component({
  selector: 'app-data-explorer-page',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    DataExplorerToolbar,
    DataExplorerTable,
    DataExplorerPagination,
    MatCheckboxModule,
    MatMenuModule,
    MatIcon
],
  templateUrl: './data-explorer-page.html',
  styleUrl: './data-explorer-page.scss',
})
export class DataExplorerPage implements OnInit {
  private readonly store = inject(DataExplorerStore);
  private readonly dialog = inject(MatDialog);
  private readonly tablePreferencesService = inject(TablePreferencesService);

  columns: TableColumn[] = this.tablePreferencesService.getColumns();

  readonly vm$ = combineLatest({
  records: this.store.records$,
  loading: this.store.loading$,
  filteredRecords: this.store.filteredRecords$,
  paginatedRecords: this.store.paginatedRecords$,
  pageIndex: this.store.pageIndex$,
  pageSize: this.store.pageSize$,
  totalPages: this.store.totalPages$,
  canGoPrev: this.store.canGoPrev$,
  canGoNext: this.store.canGoNext$,
  sortState: this.store.sort$,
  searchTerm: this.store.searchTerm$,
  hasActiveFilters: this.store.hasActiveFilters$,
}).pipe(
  map(vm => {
  const totalRecords = vm.filteredRecords.length;
  const visibleRecords = vm.paginatedRecords.length;

  const summaryText =
    vm.totalPages > 1
      ? `Showing ${visibleRecords} of ${totalRecords} records`
      : `${totalRecords} records total`;

  return {
    ...vm,
    summaryText
  };
})
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

  onResetFilters(): void {
  this.store.resetFilters();
  }

 onViewRecord(record: DataRecord): void {
  this.dialog.open(RecordDetailsDialog, {
    data: { record },
    maxWidth: 'none',
  });
}

  onAddRecord(): void {
    const dialogRef = this.dialog.open(RecordFormDialog, {
      data: {
        mode: 'add'
      },
      maxWidth: 'none'
    });

    dialogRef.afterClosed().subscribe((result: DataRecord | undefined) => {
      if (!result) {
        return;
      }

      this.store.addRecord(result);
    });
  }

  onEditRecord(record: DataRecord): void {
    const dialogRef = this.dialog.open(RecordFormDialog, {
      data: {
        mode: 'edit',
        record
      },
      maxWidth: 'none'
    });

    dialogRef.afterClosed().subscribe((result: DataRecord | undefined) => {
      if (!result) {
        return
      }
      this.store.updateRecord(result)
    })
  }

  onDeleteRecord(record: DataRecord): void {
  const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
    data: { record },
    maxWidth: 'none',
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (!confirmed) {
      return;
    }

    this.store.deleteRecord(record.id);
  });
}

get displayedColumns(): DataTableColumnKey[] {
  return this.columns
    .filter(column => column.visible)
    .map(column => column.key);
}

toggleColumnVisibility(columnKey: DataTableColumnKey): void {
  this.columns = this.columns.map(column => {
    if (column.key !== columnKey || !column.hideable) {
      return column;
    }

    return {
      ...column,
      visible: !column.visible
    };
  });

  this.tablePreferencesService.saveColumns(this.columns);
}

resetColumnVisibility(): void {
  this.columns = this.tablePreferencesService.resetColumns();
}

}