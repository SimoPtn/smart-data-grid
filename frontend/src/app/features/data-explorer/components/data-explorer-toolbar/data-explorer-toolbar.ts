import { Component, EventEmitter, Output, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-data-explorer-toolbar',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './data-explorer-toolbar.html',
  styleUrl: './data-explorer-toolbar.scss',
})
export class DataExplorerToolbar {
  @Input() searchTerm = '';
  @Input() pageSize = 5;
  @Input() hasActiveFilters = false;

  @Output() searchChanged = new EventEmitter<string>();
  @Output() pageSizeChanged = new EventEmitter<number>();
  @Output() resetClicked = new EventEmitter<void>();
  @Output() addClicked = new EventEmitter<void>();



  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(value);
  }

  onPageSizeChange(event: MatSelectChange): void {
    this.pageSizeChanged.emit(event.value);
  }

  clearSearch(): void {
    this.searchChanged.emit('');
  }

  resetFilters(): void {
  this.resetClicked.emit();
  }

  addRecord(): void {
    this.addClicked.emit();
  }

}