import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DataRecord } from '../../models/data-record';

@Component({
  selector: 'app-record-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './record-details-dialog.html',
  styleUrl: './record-details-dialog.scss',
})
export class RecordDetailsDialog {
  readonly data = inject<{ record: DataRecord }>(MAT_DIALOG_DATA);
}
