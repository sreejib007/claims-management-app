import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type StatusType = 'claim' | 'policy' | 'recommendation';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="[getStatusClass(), size]">
      <span class="status-dot" *ngIf="showDot"></span>
      {{ status }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-badge.sm {
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
    }

    .status-badge.lg {
      padding: 0.375rem 0.875rem;
      font-size: 0.875rem;
    }

    .status-badge.rounded {
      border-radius: 20px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    /* Claim Statuses */
    .status-badge.new { background: #dbeafe; color: #1d4ed8; }
    .status-badge.in-review { background: #fef3c7; color: #b45309; }
    .status-badge.referred { background: #fee2e2; color: #991b1b; }
    .status-badge.approved { background: #dcfce7; color: #166534; }
    .status-badge.closed { background: #e2e8f0; color: #475569; }

    /* Policy Statuses */
    .status-badge.active { background: #dcfce7; color: #166534; }
    .status-badge.expired { background: #fee2e2; color: #991b1b; }
    .status-badge.cancelled { background: #e2e8f0; color: #475569; }

    /* Recommendations */
    .status-badge.stp { background: #dcfce7; color: #166534; }
    .status-badge.refer { background: #fef3c7; color: #b45309; }
    .status-badge.request-docs { background: #dbeafe; color: #1d4ed8; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = '';
  @Input() type: StatusType = 'claim';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showDot: boolean = false;
  @Input() rounded: boolean = false;

  getStatusClass(): string {
    const baseClass = this.status.toLowerCase().replace(/\s+/g, '-');
    return this.rounded ? `${baseClass} rounded` : baseClass;
  }
}
