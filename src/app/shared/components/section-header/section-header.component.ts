import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="section-header" [ngClass]="variant">
      <div class="d-flex align-items-center gap-3">
        <div class="header-icon" *ngIf="icon">
          <i [class]="icon"></i>
        </div>
        <div>
          <h2 class="section-title mb-0">{{ title }}</h2>
          <small class="section-subtitle" *ngIf="subtitle">{{ subtitle }}</small>
        </div>
      </div>
      <div class="header-actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-bottom: 1px solid #e2e8f0;
    }

    .section-header.compact {
      padding: 0.875rem 1.25rem;
    }

    .section-header.dark {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .section-header.dark .section-title {
      color: #ffffff;
    }

    .section-header.dark .section-subtitle {
      color: rgba(255, 255, 255, 0.7);
    }

    .header-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 1.1rem;
    }

    .section-header.dark .header-icon {
      background: rgba(255, 255, 255, 0.15);
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }

    .section-subtitle {
      color: #64748b;
      font-size: 0.875rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .section-header {
        padding: 1rem;
      }

      .section-title {
        font-size: 1.125rem;
      }
    }
  `]
})
export class SectionHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() variant: 'default' | 'compact' | 'dark' = 'default';
}
