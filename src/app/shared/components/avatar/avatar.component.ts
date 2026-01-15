import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [ngClass]="[size, variant, getColorClass()]" [class.unassigned]="!name">
      <i [class]="icon" *ngIf="icon && !name"></i>
      <span *ngIf="!icon || name">{{ getInitials() }}</span>
    </div>
  `,
  styles: [`
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-weight: 600;
      flex-shrink: 0;
    }

    /* Sizes */
    .avatar.sm {
      width: 28px;
      height: 28px;
      font-size: 0.7rem;
    }

    .avatar.md {
      width: 36px;
      height: 36px;
      font-size: 0.8rem;
    }

    .avatar.lg {
      width: 44px;
      height: 44px;
      font-size: 1rem;
    }

    .avatar.xl {
      width: 56px;
      height: 56px;
      font-size: 1.25rem;
    }

    /* Variants */
    .avatar.circle { border-radius: 50%; }
    .avatar.rounded { border-radius: 10px; }
    .avatar.square { border-radius: 6px; }

    /* Colors */
    .avatar.primary {
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      color: #ffffff;
    }

    .avatar.secondary {
      background: linear-gradient(135deg, #5e81ac 0%, #81a1c1 100%);
      color: #ffffff;
    }

    .avatar.success {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      color: #ffffff;
    }

    .avatar.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      color: #ffffff;
    }

    .avatar.danger {
      background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
      color: #ffffff;
    }

    .avatar.info {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
      color: #ffffff;
    }

    .avatar.light {
      background: #f1f5f9;
      color: #64748b;
    }

    .avatar.unassigned {
      background: #e2e8f0;
      color: #94a3b8;
    }

    .avatar i {
      font-size: inherit;
    }
  `]
})
export class AvatarComponent {
  @Input() name: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() variant: 'circle' | 'rounded' | 'square' = 'circle';
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' = 'secondary';
  @Input() icon: string = '';

  getInitials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  }

  getColorClass(): string {
    return this.name ? this.color : 'unassigned';
  }
}
