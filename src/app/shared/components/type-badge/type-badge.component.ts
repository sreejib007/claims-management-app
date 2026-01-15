import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-type-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="type-badge" [ngClass]="getTypeClass()">
      <i [class]="getIcon()" *ngIf="showIcon"></i>
      <span *ngIf="showLabel">{{ type }}</span>
    </span>
  `,
  styles: [`
    .type-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .type-badge i {
      font-size: 0.875rem;
    }

    /* Product/Policy Types */
    .type-badge.motor {
      background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
      color: #6d28d9;
    }

    .type-badge.home {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #b45309;
    }

    /* Loss Types */
    .type-badge.accident {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #991b1b;
    }

    .type-badge.theft {
      background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
      color: #4338ca;
    }

    .type-badge.water-damage {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1d4ed8;
    }

    .type-badge.fire {
      background: linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%);
      color: #c2410c;
    }

    .type-badge.wind-damage {
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      color: #0369a1;
    }

    .type-badge.other {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: #475569;
    }

    /* Team Types */
    .type-badge.fnol {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #1d4ed8;
    }

    .type-badge.triage {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #b45309;
    }

    .type-badge.siu {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      color: #991b1b;
    }
  `]
})
export class TypeBadgeComponent {
  @Input() type: string = '';
  @Input() category: 'product' | 'loss' | 'team' = 'product';
  @Input() showIcon: boolean = true;
  @Input() showLabel: boolean = true;

  getTypeClass(): string {
    return this.type.toLowerCase().replace(/\s+/g, '-');
  }

  getIcon(): string {
    const iconMap: { [key: string]: string } = {
      'motor': 'pi pi-car',
      'home': 'pi pi-home',
      'accident': 'pi pi-exclamation-triangle',
      'theft': 'pi pi-lock',
      'water-damage': 'pi pi-cloud',
      'fire': 'pi pi-bolt',
      'wind-damage': 'pi pi-sun',
      'other': 'pi pi-question-circle',
      'fnol': 'pi pi-inbox',
      'triage': 'pi pi-filter',
      'siu': 'pi pi-shield'
    };
    return iconMap[this.type.toLowerCase().replace(/\s+/g, '-')] || 'pi pi-tag';
  }
}
