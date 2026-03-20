import { Component, Input } from '@angular/core';
import { UserStatus } from '../../models/data-record';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.scss',
})
export class StatusBadge {
  @Input({ required: true }) status!: UserStatus;

  get statusClass(): string {
    switch (this.status) {
      case 'Active':
        return 'status-active';
      case 'Pending':
        return 'status-pending';
      case 'Suspended':
        return 'status-suspended';
      default:
        return '';
    }
  }
}