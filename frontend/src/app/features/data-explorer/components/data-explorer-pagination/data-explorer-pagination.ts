import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-data-explorer-pagination',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './data-explorer-pagination.html',
  styleUrl: './data-explorer-pagination.scss',
})
export class DataExplorerPagination {
  @Input({ required: true }) pageIndex = 0;
  @Input({ required: true }) totalPages = 0;
  @Input({ required: true }) canGoPrev = false;
  @Input({ required: true }) canGoNext = false;

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  onPrev(): void {
    this.prev.emit();
  }

  onNext(): void {
    this.next.emit();
  }
}
