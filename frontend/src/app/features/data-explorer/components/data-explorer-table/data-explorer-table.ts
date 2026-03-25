import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DataRecord } from '../../models/data-record';
import { StatusBadge } from '../status-badge/status-badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: keyof DataRecord | null;
  direction: SortDirection;
}

type SortableColumn = 'name' | 'email' | 'score';

@Component({
  selector: 'app-data-explorer-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, StatusBadge, MatIconModule, MatButtonModule],
  templateUrl: './data-explorer-table.html',
  styleUrl: './data-explorer-table.scss',
})
export class DataExplorerTable {
  @Input({ required: true }) records: DataRecord[] = [];
  @Input({ required: true }) displayedColumns: string[] = [];
  @Input({ required: true }) sortState: SortState | null = null;

  @Output() sortChanged = new EventEmitter<SortableColumn>();
  @Output() viewRecord = new EventEmitter<DataRecord>();
  @Output() deleteRecord = new EventEmitter<DataRecord>();
  @Output() editRecord = new EventEmitter<DataRecord>();

  onSort(key: SortableColumn): void {
    this.sortChanged.emit(key);
  }

  onView(record: DataRecord): void {
    this.viewRecord.emit(record);
  }

  onDelete(record: DataRecord): void {
    this.deleteRecord.emit(record);
  }
  isActiveSort(key: SortableColumn): boolean {
    return this.sortState?.key === key;
  }

  getSortIcon(key: SortableColumn): string {
    if (this.sortState?.key !== key) {
      return 'unfold_more';
    }

    return this.sortState.direction === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  onEdit(record: DataRecord ): void {
    this.editRecord.emit(record)
  }
}