import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DataRecord, UserRole, UserStatus } from '../../models/data-record';

interface RecordDialogData {
  mode: 'add' | 'edit';
  record?: DataRecord;
}

@Component({
  selector: 'app-record-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './record-form-dialog.html',
  styleUrl: './record-form-dialog.scss',
})
export class RecordFormDialog {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<RecordFormDialog>);
  readonly data = inject<RecordDialogData>(MAT_DIALOG_DATA);

  readonly roles: UserRole[] = ['Admin', 'Editor', 'Viewer'];
  readonly statuses: UserStatus[] = ['Active', 'Pending', 'Suspended'];

  readonly isEditMode = computed(() => this.data.mode === 'edit');

  readonly form = this.fb.nonNullable.group({
    name: [this.data.record?.name ?? '', Validators.required],
    email: [this.data.record?.email ?? '', [Validators.required, Validators.email]],
    company: [this.data.record?.company ?? '', Validators.required],
    role: [this.data.record?.role ?? 'Viewer' as UserRole, Validators.required],
    status: [this.data.record?.status ?? 'Active' as UserStatus, Validators.required],
    country: [this.data.record?.country ?? '', Validators.required],
    score: [this.data.record?.score ?? 50, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    const recordId = this.data.record?.id ?? Date.now();
    const createdAt = this.data.record?.createdAt ?? new Date().toISOString().split('T')[0];

    const record: DataRecord = {
      id: recordId,
      name: formValue.name,
      email: formValue.email,
      company: formValue.company,
      role: formValue.role,
      status: formValue.status,
      country: formValue.country,
      createdAt,
      score: formValue.score
    };

    this.dialogRef.close(record);
  }
}