import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fnol-card" [ngClass]="[variant, { 'hoverable': hoverable, 'bordered': bordered }]">
      <div class="card-header" *ngIf="showHeader">
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="card-body" [ngClass]="{ 'no-padding': noPadding }">
        <ng-content></ng-content>
      </div>
      <div class="card-footer" *ngIf="showFooter">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .fnol-card {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .fnol-card.bordered {
      border: 1px solid #e2e8f0;
    }

    .fnol-card.hoverable {
      transition: all 0.25s ease;
    }

    .fnol-card.hoverable:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    }

    .fnol-card.flat {
      box-shadow: none;
      border: 1px solid #e2e8f0;
    }

    .fnol-card.elevated {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .card-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #fafbfc 0%, #ffffff 100%);
    }

    .card-body {
      padding: 1.25rem;
      flex: 1;
    }

    .card-body.no-padding {
      padding: 0;
    }

    .card-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }
  `]
})
export class CardComponent {
  @Input() variant: 'default' | 'flat' | 'elevated' = 'default';
  @Input() hoverable: boolean = false;
  @Input() bordered: boolean = true;
  @Input() showHeader: boolean = false;
  @Input() showFooter: boolean = false;
  @Input() noPadding: boolean = false;
}
