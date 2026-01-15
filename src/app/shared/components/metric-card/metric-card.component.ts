import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card" [ngClass]="colorVariant">
      <div class="metric-header">
        <span class="metric-label">{{ label }}</span>
        <div class="metric-icon" [ngClass]="iconBg">
          <i [class]="icon"></i>
        </div>
      </div>
      <div class="metric-body">
        <div class="metric-value">{{ value }}</div>
        <div class="metric-trend" *ngIf="trend">
          <span class="trend-indicator" [ngClass]="trendUp ? 'up' : 'neutral'">
            <i class="pi" [ngClass]="trendUp ? 'pi-arrow-up-right' : 'pi-minus'"></i>
          </span>
          <span class="trend-text">{{ trend }}</span>
        </div>
      </div>
      <div class="metric-accent"></div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: #ffffff;
      border-radius: 10px;
      padding: 0.625rem 0.875rem;
      height: 100%;
      position: relative;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      transition: all 0.25s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
      border-color: transparent;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.375rem;
    }

    .metric-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-icon {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      color: #ffffff;
    }

    .metric-icon.primary { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%); }
    .metric-icon.warning { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); }
    .metric-icon.danger { background: linear-gradient(135deg, #ef4444 0%, #f87171 100%); }
    .metric-icon.info { background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%); }
    .metric-icon.success { background: linear-gradient(135deg, #10b981 0%, #34d399 100%); }

    .metric-value {
      font-size: 1.375rem;
      font-weight: 700;
      color: #1e293b;
      line-height: 1.2;
    }

    .metric-trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.25rem;
    }

    .trend-indicator {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.6rem;
    }

    .trend-indicator.up { background: rgba(16, 185, 129, 0.15); color: #059669; }
    .trend-indicator.neutral { background: rgba(100, 116, 139, 0.15); color: #64748b; }

    .trend-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    .metric-accent {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: transparent;
      transition: all 0.25s ease;
    }

    .metric-card:hover .metric-accent { height: 4px; }

    .metric-card.variant-0:hover .metric-accent { background: linear-gradient(90deg, #6366f1, #818cf8); }
    .metric-card.variant-1:hover .metric-accent { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .metric-card.variant-2:hover .metric-accent { background: linear-gradient(90deg, #ef4444, #f87171); }
    .metric-card.variant-3:hover .metric-accent { background: linear-gradient(90deg, #0ea5e9, #38bdf8); }
    .metric-card.variant-4:hover .metric-accent { background: linear-gradient(90deg, #10b981, #34d399); }
  `]
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = 'pi pi-chart-bar';
  @Input() iconBg: 'primary' | 'warning' | 'danger' | 'info' | 'success' = 'primary';
  @Input() trend: string = '';
  @Input() trendUp: boolean = false;
  @Input() colorVariant: string = 'variant-0';
}
