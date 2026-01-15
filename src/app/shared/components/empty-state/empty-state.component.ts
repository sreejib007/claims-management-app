import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state" [ngClass]="size">
      <div class="empty-icon">
        <i [class]="icon"></i>
      </div>
      <h4 class="empty-title" *ngIf="title">{{ title }}</h4>
      <p class="empty-message">{{ message }}</p>
      <div class="empty-actions" *ngIf="showAction">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1.5rem;
      color: #64748b;
    }

    .empty-state.sm {
      padding: 2rem 1rem;
    }

    .empty-state.lg {
      padding: 4rem 2rem;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }

    .empty-state.sm .empty-icon {
      width: 48px;
      height: 48px;
    }

    .empty-icon i {
      font-size: 1.75rem;
      color: #94a3b8;
    }

    .empty-state.sm .empty-icon i {
      font-size: 1.25rem;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #475569;
      margin: 0 0 0.5rem 0;
    }

    .empty-message {
      font-size: 0.9rem;
      color: #94a3b8;
      margin: 0;
      max-width: 300px;
    }

    .empty-actions {
      margin-top: 1.5rem;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'pi pi-inbox';
  @Input() title: string = '';
  @Input() message: string = 'No data available';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showAction: boolean = false;
}
