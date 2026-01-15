import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FnolDataService } from '../services/fnol-data.service';
import { Claim, Policy, Handler } from '../models/fnol-data.model';

interface SearchResult {
  type: 'claim' | 'policy' | 'handler';
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  status?: string;
  statusSeverity?: 'success' | 'info' | 'warn' | 'danger' | 'secondary';
}

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    OverlayPanelModule,
    TagModule,
    ButtonModule
  ],
  template: `
    <div class="global-search-container">
      <p-iconfield>
        <p-inputicon styleClass="pi pi-search" />
        <input
          type="text"
          pInputText
          [(ngModel)]="searchTerm"
          (input)="onSearch()"
          (focus)="onFocus($event)"
          placeholder="Search claims, policies, handlers..."
          class="global-search-input" />
      </p-iconfield>

      <p-overlayPanel #searchResults [style]="{ width: '400px', maxHeight: '70vh' }">
        <div class="search-results-container">
          <!-- Loading -->
          <div class="search-loading" *ngIf="isSearching">
            <i class="pi pi-spin pi-spinner"></i>
            <span>Searching...</span>
          </div>

          <!-- Results -->
          <div *ngIf="!isSearching && results.length > 0" class="search-results">
            <!-- Claims -->
            <div *ngIf="getResultsByType('claim').length > 0" class="result-group">
              <div class="result-group-header">
                <i class="pi pi-file-edit"></i>
                <span>Claims ({{ getResultsByType('claim').length }})</span>
              </div>
              <div
                *ngFor="let result of getResultsByType('claim')"
                class="result-item"
                (click)="onResultClick(result)">
                <div class="result-icon claim">
                  <i [class]="result.icon"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">{{ result.title }}</div>
                  <div class="result-subtitle">{{ result.subtitle }}</div>
                </div>
                <p-tag *ngIf="result.status" [value]="result.status" [severity]="result.statusSeverity" />
              </div>
            </div>

            <!-- Policies -->
            <div *ngIf="getResultsByType('policy').length > 0" class="result-group">
              <div class="result-group-header">
                <i class="pi pi-folder"></i>
                <span>Policies ({{ getResultsByType('policy').length }})</span>
              </div>
              <div
                *ngFor="let result of getResultsByType('policy')"
                class="result-item"
                (click)="onResultClick(result)">
                <div class="result-icon policy">
                  <i [class]="result.icon"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">{{ result.title }}</div>
                  <div class="result-subtitle">{{ result.subtitle }}</div>
                </div>
                <p-tag *ngIf="result.status" [value]="result.status" [severity]="result.statusSeverity" />
              </div>
            </div>

            <!-- Handlers -->
            <div *ngIf="getResultsByType('handler').length > 0" class="result-group">
              <div class="result-group-header">
                <i class="pi pi-users"></i>
                <span>Handlers ({{ getResultsByType('handler').length }})</span>
              </div>
              <div
                *ngFor="let result of getResultsByType('handler')"
                class="result-item"
                (click)="onResultClick(result)">
                <div class="result-icon handler">
                  <i [class]="result.icon"></i>
                </div>
                <div class="result-content">
                  <div class="result-title">{{ result.title }}</div>
                  <div class="result-subtitle">{{ result.subtitle }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div *ngIf="!isSearching && results.length === 0 && searchTerm.trim()" class="no-results">
            <i class="pi pi-search"></i>
            <span>No results found for "{{ searchTerm }}"</span>
          </div>

          <!-- Empty State -->
          <div *ngIf="!searchTerm.trim()" class="search-hint">
            <i class="pi pi-info-circle"></i>
            <span>Type to search claims, policies, or handlers</span>
          </div>
        </div>
      </p-overlayPanel>
    </div>
  `,
  styles: [`
    .global-search-container {
      position: relative;
    }

    .global-search-input {
      width: 300px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      border-radius: 8px;
    }

    .global-search-input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .global-search-input:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
    }

    :host ::ng-deep .p-inputicon {
      color: rgba(255, 255, 255, 0.6);
    }

    .search-results-container {
      max-height: 60vh;
      overflow-y: auto;
    }

    .search-loading, .no-results, .search-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 2rem;
      color: #64748b;
      font-size: 0.875rem;
    }

    .search-loading i {
      font-size: 1.25rem;
    }

    .result-group {
      margin-bottom: 1rem;
    }

    .result-group:last-child {
      margin-bottom: 0;
    }

    .result-group-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.7rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: #f8fafc;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .result-item:hover {
      background: #f1f5f9;
    }

    .result-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      flex-shrink: 0;
    }

    .result-icon.claim {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #2563eb;
    }

    .result-icon.policy {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
    }

    .result-icon.handler {
      background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
      color: #4f46e5;
    }

    .result-content {
      flex: 1;
      min-width: 0;
    }

    .result-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-subtitle {
      font-size: 0.75rem;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .global-search-input {
        width: 200px;
      }
    }

    @media (max-width: 576px) {
      .global-search-input {
        width: 150px;
      }
    }
  `]
})
export class GlobalSearchComponent {
  @ViewChild('searchResults') searchResultsPanel!: OverlayPanel;

  @Output() claimSelect = new EventEmitter<string>();
  @Output() policySelect = new EventEmitter<string>();
  @Output() handlerSelect = new EventEmitter<string>();

  searchTerm = '';
  results: SearchResult[] = [];
  isSearching = false;

  private searchTimeout: any;

  constructor(private fnolDataService: FnolDataService) {}

  onFocus(event: Event): void {
    if (this.searchResultsPanel) {
      this.searchResultsPanel.show(event);
    }
  }

  onSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.results = [];
      return;
    }

    this.isSearching = true;

    // Debounce search
    this.searchTimeout = setTimeout(() => {
      this.performSearch(term);
      this.isSearching = false;
    }, 300);
  }

  private performSearch(term: string): void {
    this.results = [];

    // Search Claims
    const claims = this.fnolDataService.getClaims();
    const policies = this.fnolDataService.getPolicies();
    const handlers = this.fnolDataService.getHandlers();

    // Search claims
    claims.forEach(claim => {
      const policy = policies.find(p => p.id === claim.policyId);
      const customerName = policy?.customer.name || '';

      if (
        claim.claimNumber.toLowerCase().includes(term) ||
        claim.lossType.toLowerCase().includes(term) ||
        claim.incidentDescription.toLowerCase().includes(term) ||
        claim.status.toLowerCase().includes(term) ||
        customerName.toLowerCase().includes(term)
      ) {
        this.results.push({
          type: 'claim',
          id: claim.id,
          title: claim.claimNumber,
          subtitle: `${claim.lossType} • ${customerName}`,
          icon: 'pi pi-file-edit',
          status: claim.status,
          statusSeverity: this.getClaimStatusSeverity(claim.status)
        });
      }
    });

    // Search policies
    policies.forEach(policy => {
      if (
        policy.policyNumber.toLowerCase().includes(term) ||
        policy.customer.name.toLowerCase().includes(term) ||
        policy.customer.email.toLowerCase().includes(term) ||
        policy.product.toLowerCase().includes(term) ||
        policy.status.toLowerCase().includes(term)
      ) {
        this.results.push({
          type: 'policy',
          id: policy.id,
          title: policy.policyNumber,
          subtitle: `${policy.product} • ${policy.customer.name}`,
          icon: policy.product === 'Motor' ? 'pi pi-car' : 'pi pi-home',
          status: policy.status,
          statusSeverity: this.getPolicyStatusSeverity(policy.status)
        });
      }
    });

    // Search handlers
    handlers.forEach(handler => {
      if (
        handler.name.toLowerCase().includes(term) ||
        handler.team.toLowerCase().includes(term) ||
        handler.id.toLowerCase().includes(term)
      ) {
        this.results.push({
          type: 'handler',
          id: handler.id,
          title: handler.name,
          subtitle: `${handler.team} Team`,
          icon: 'pi pi-user'
        });
      }
    });

    // Limit results
    this.results = this.results.slice(0, 15);
  }

  getResultsByType(type: 'claim' | 'policy' | 'handler'): SearchResult[] {
    return this.results.filter(r => r.type === type);
  }

  onResultClick(result: SearchResult): void {
    switch (result.type) {
      case 'claim':
        this.claimSelect.emit(result.id);
        break;
      case 'policy':
        this.policySelect.emit(result.id);
        break;
      case 'handler':
        this.handlerSelect.emit(result.id);
        break;
    }
    this.searchTerm = '';
    this.results = [];
    if (this.searchResultsPanel) {
      this.searchResultsPanel.hide();
    }
  }

  private getClaimStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'New': return 'info';
      case 'In Review': return 'warn';
      case 'Referred': return 'danger';
      case 'Resolved': return 'success';
      default: return 'secondary';
    }
  }

  private getPolicyStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'Active': return 'success';
      case 'Lapsed': return 'danger';
      case 'Cancelled': return 'warn';
      default: return 'secondary';
    }
  }
}
