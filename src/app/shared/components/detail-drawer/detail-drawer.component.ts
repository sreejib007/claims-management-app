import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-detail-drawer',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="drawer-overlay" [class.open]="isOpen" (click)="close()"></div>
    <div class="drawer-panel" [class.open]="isOpen">
      <div class="drawer-header">
        <div class="d-flex align-items-center gap-3">
          <div class="drawer-icon">
            <i [class]="icon"></i>
          </div>
          <div>
            <h5 class="drawer-title mb-0">{{ title }}</h5>
            <small class="drawer-subtitle" *ngIf="subtitle">{{ subtitle }}</small>
          </div>
        </div>
        <button pButton type="button" class="p-button-text p-button-rounded close-btn"
                icon="pi pi-times" (click)="close()"></button>
      </div>
      <div class="drawer-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .drawer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 1040;
    }

    .drawer-overlay.open {
      opacity: 1;
      visibility: visible;
    }

    .drawer-panel {
      position: fixed;
      top: 0;
      right: -700px;
      width: 680px;
      max-width: 100vw;
      height: 100vh;
      background: #ffffff;
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
      transition: right 0.3s ease;
      z-index: 1050;
      display: flex;
      flex-direction: column;
    }

    .drawer-panel.open {
      right: 0;
    }

    .drawer-header {
      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
      color: #ffffff;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .drawer-icon {
      width: 42px;
      height: 42px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
    }

    .drawer-title {
      font-size: 1.125rem;
      font-weight: 600;
    }

    .drawer-subtitle {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
    }

    .close-btn {
      color: #ffffff !important;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      background: #f8fafc;
    }

    @media (max-width: 768px) {
      .drawer-panel {
        width: 100vw;
        right: -100vw;
      }
    }
  `]
})
export class DetailDrawerComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = 'pi pi-info-circle';
  @Output() isOpenChange = new EventEmitter<boolean>();

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
