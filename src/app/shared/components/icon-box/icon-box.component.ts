import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="icon-box" [ngClass]="[size, variant, color]">
      <i [class]="icon"></i>
    </div>
  `,
  styles: [`
    .icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* Sizes */
    .icon-box.sm { width: 28px; height: 28px; font-size: 0.875rem; }
    .icon-box.md { width: 36px; height: 36px; font-size: 1rem; }
    .icon-box.lg { width: 44px; height: 44px; font-size: 1.25rem; }
    .icon-box.xl { width: 56px; height: 56px; font-size: 1.5rem; }

    /* Variants */
    .icon-box.circle { border-radius: 50%; }
    .icon-box.rounded { border-radius: 10px; }
    .icon-box.square { border-radius: 6px; }

    /* Colors */
    .icon-box.primary {
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      color: #ffffff;
    }

    .icon-box.secondary {
      background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
      color: #ffffff;
    }

    .icon-box.success {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      color: #ffffff;
    }

    .icon-box.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      color: #ffffff;
    }

    .icon-box.danger {
      background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
      color: #ffffff;
    }

    .icon-box.info {
      background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
      color: #ffffff;
    }

    .icon-box.light {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }

    .icon-box.subtle-primary {
      background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
      color: #7c3aed;
    }

    .icon-box.subtle-success {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      color: #16a34a;
    }

    .icon-box.subtle-warning {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #b45309;
    }

    .icon-box.subtle-danger {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #dc2626;
    }

    .icon-box.subtle-info {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #2563eb;
    }
  `]
})
export class IconBoxComponent {
  @Input() icon: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() variant: 'circle' | 'rounded' | 'square' = 'rounded';
  @Input() color: string = 'primary';
}
