import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { DataRecord } from '../../models/data-record';

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: keyof DataRecord | null;
  direction: SortDirection;
}

type SortableColumn = 'name' | 'email' | 'score';

@Component({
  selector: 'app-data-explorer-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './data-explorer-table.html',
  styleUrl: './data-explorer-table.scss',
})
export class DataExplorerTable {
  @Input({ required: true }) records: DataRecord[] = [];
  @Input({ required: true }) displayedColumns: string[] = [];
  @Input({ required: true }) sortState: SortState | null = null;

  @Output() sortChanged = new EventEmitter<SortableColumn>();

  onSort(key: SortableColumn): void {
    this.sortChanged.emit(key);
  }
}