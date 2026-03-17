import { Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-data-explorer-toolbar',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './data-explorer-toolbar.html',
  styleUrl: './data-explorer-toolbar.scss',
})
export class DataExplorerToolbar {
  @Output() searchChanged = new EventEmitter<string>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChanged.emit(value);
  }

  onPageSizeChange(event: MatSelectChange): void {
    this.pageSizeChanged.emit(event.value);
  }
}