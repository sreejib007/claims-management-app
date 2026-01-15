import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { DetailDrawerComponent } from '../shared/components/detail-drawer/detail-drawer.component';
import { AvatarComponent, TypeBadgeComponent } from '../shared/components';
import { Handler, Claim, Policy } from '../models/fnol-data.model';
import { FnolDataService } from '../services/fnol-data.service';

@Component({
  selector: 'app-handler-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TagModule,
    TabsModule,
    TooltipModule,
    DetailDrawerComponent,
    AvatarComponent,
    TypeBadgeComponent
  ],
  templateUrl: './handler-detail.component.html',
  styleUrl: './handler-detail.component.css'
})
export class HandlerDetailComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() handlerId: string | null = null;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() claimClick = new EventEmitter<string>();

  handler: Handler | null = null;
  assignedClaims: Claim[] = [];
  policies: Policy[] = [];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['handlerId'] && this.handlerId) {
      this.loadHandlerDetails();
    }
  }

  private loadHandlerDetails(): void {
    if (!this.handlerId) return;

    const handlers = this.fnolDataService.getHandlers();
    this.handler = handlers.find(h => h.id === this.handlerId) || null;

    if (this.handler) {
      const claims = this.fnolDataService.getClaims();
      this.assignedClaims = claims.filter(c => c.assignedTo === this.handlerId);
      this.policies = this.fnolDataService.getPolicies();
    }
  }

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(value);
  }

  getClaimStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'New': return 'info';
      case 'In Review': return 'warn';
      case 'Referred': return 'danger';
      case 'Resolved': return 'success';
      default: return 'secondary';
    }
  }

  getPolicyNumber(policyId: string): string {
    const policy = this.policies.find(p => p.id === policyId);
    return policy?.policyNumber || 'N/A';
  }

  getCustomerName(policyId: string): string {
    const policy = this.policies.find(p => p.id === policyId);
    return policy?.customer.name || 'N/A';
  }

  getTotalExposure(): number {
    return this.assignedClaims.reduce((sum, c) => sum + c.estimatedImpactGBP, 0);
  }

  getClaimsByStatus(status: string): number {
    return this.assignedClaims.filter(c => c.status === status).length;
  }

  getTeamColor(): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'light' {
    switch (this.handler?.team) {
      case 'FNOL': return 'primary';
      case 'Triage': return 'warning';
      case 'SIU': return 'danger';
      default: return 'secondary';
    }
  }

  onClaimClick(claim: Claim, event: Event): void {
    event.stopPropagation();
    this.claimClick.emit(claim.id);
  }
}
