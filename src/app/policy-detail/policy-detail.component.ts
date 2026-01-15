import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { DetailDrawerComponent } from '../shared/components/detail-drawer/detail-drawer.component';
import { AvatarComponent, StatusBadgeComponent, TypeBadgeComponent, IconBoxComponent } from '../shared/components';
import { Policy, Claim, VehicleAsset, PropertyAsset, MotorCoverage, HomeCoverage } from '../models/fnol-data.model';
import { FnolDataService } from '../services/fnol-data.service';

@Component({
  selector: 'app-policy-detail',
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
    StatusBadgeComponent,
    TypeBadgeComponent,
    IconBoxComponent
  ],
  templateUrl: './policy-detail.component.html',
  styleUrl: './policy-detail.component.css'
})
export class PolicyDetailComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() policyId: string | null = null;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() claimClick = new EventEmitter<string>();

  policy: Policy | null = null;
  relatedClaims: Claim[] = [];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['policyId'] && this.policyId) {
      this.loadPolicyDetails();
    }
  }

  private loadPolicyDetails(): void {
    if (!this.policyId) return;

    const policies = this.fnolDataService.getPolicies();
    this.policy = policies.find(p => p.id === this.policyId) || null;

    if (this.policy) {
      const claims = this.fnolDataService.getClaims();
      this.relatedClaims = claims.filter(c => c.policyId === this.policyId);
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

  getDaysRemaining(): number {
    if (!this.policy) return 0;
    const endDate = new Date(this.policy.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'danger';
      case 'Cancelled': return 'secondary';
      default: return 'info';
    }
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

  isMotorPolicy(): boolean {
    return this.policy?.product === 'Motor';
  }

  getVehicleAsset(): VehicleAsset | null {
    if (this.policy && this.isMotorPolicy()) {
      return this.policy.asset as VehicleAsset;
    }
    return null;
  }

  getPropertyAsset(): PropertyAsset | null {
    if (this.policy && !this.isMotorPolicy()) {
      return this.policy.asset as PropertyAsset;
    }
    return null;
  }

  getMotorCoverage(): MotorCoverage | null {
    if (this.policy && this.isMotorPolicy()) {
      return this.policy.coverage as MotorCoverage;
    }
    return null;
  }

  getHomeCoverage(): HomeCoverage | null {
    if (this.policy && !this.isMotorPolicy()) {
      return this.policy.coverage as HomeCoverage;
    }
    return null;
  }

  onClaimClick(claim: Claim, event: Event): void {
    event.stopPropagation();
    this.claimClick.emit(claim.id);
  }
}
