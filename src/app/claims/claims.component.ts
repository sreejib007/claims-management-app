import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { FnolDataService } from '../services/fnol-data.service';
import { Claim, Policy, Handler } from '../models/fnol-data.model';
import { ClaimDetailComponent } from '../claim-detail/claim-detail.component';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SelectButtonModule,
    CardModule,
    TooltipModule,
    SelectModule,
    ClaimDetailComponent
  ],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.css'
})
export class ClaimsComponent implements OnInit {
  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  policies: Policy[] = [];
  handlers: Handler[] = [];

  searchTerm: string = '';
  viewMode: string = 'table';
  selectedStatus: string = '';
  selectedLossType: string = '';

  // Claim Detail Drawer
  isDetailDrawerOpen = false;
  selectedClaimId: string | null = null;

  viewOptions = [
    { label: 'Table', value: 'table', icon: 'pi pi-list' },
    { label: 'Cards', value: 'cards', icon: 'pi pi-th-large' }
  ];

  statusOptions: { label: string; value: string }[] = [];
  lossTypeOptions: { label: string; value: string }[] = [];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.claims = this.fnolDataService.getClaims();
    this.filteredClaims = [...this.claims];
    this.policies = this.fnolDataService.getPolicies();
    this.handlers = this.fnolDataService.getHandlers();

    const statuses = this.fnolDataService.getClaimStatuses();
    this.statusOptions = [
      { label: 'All Statuses', value: '' },
      ...statuses.map(s => ({ label: s, value: s }))
    ];

    const lossTypes = this.fnolDataService.getLossTypes();
    this.lossTypeOptions = [
      { label: 'All Types', value: '' },
      ...lossTypes.map(lt => ({ label: lt, value: lt }))
    ];
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredClaims = this.claims.filter(claim => {
      const matchesSearch = !term ||
        claim.claimNumber.toLowerCase().includes(term) ||
        claim.lossType.toLowerCase().includes(term) ||
        claim.incidentDescription.toLowerCase().includes(term) ||
        this.getPolicyNumber(claim.policyId).toLowerCase().includes(term);

      const matchesStatus = !this.selectedStatus || claim.status === this.selectedStatus;
      const matchesLossType = !this.selectedLossType || claim.lossType === this.selectedLossType;

      return matchesSearch && matchesStatus && matchesLossType;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedLossType = '';
    this.filteredClaims = [...this.claims];
  }

  getActiveFilterCount(): number {
    let count = 0;
    if (this.selectedStatus) count++;
    if (this.selectedLossType) count++;
    if (this.searchTerm) count++;
    return count;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'New': return 'info';
      case 'In Review': return 'warn';
      case 'Referred': return 'danger';
      case 'Resolved': return 'success';
      default: return 'secondary';
    }
  }

  getLossTypeIcon(lossType: string): string {
    switch (lossType) {
      case 'Accident': return 'pi pi-car';
      case 'Theft': return 'pi pi-lock';
      case 'Water Damage': return 'pi pi-cloud';
      case 'Fire': return 'pi pi-bolt';
      case 'Storm': return 'pi pi-sun';
      default: return 'pi pi-exclamation-circle';
    }
  }

  getPolicyNumber(policyId: string): string {
    const policy = this.policies.find(p => p.id === policyId);
    return policy?.policyNumber || 'N/A';
  }

  getPolicyProduct(policyId: string): string {
    const policy = this.policies.find(p => p.id === policyId);
    return policy?.product || 'N/A';
  }

  getCustomerName(policyId: string): string {
    const policy = this.policies.find(p => p.id === policyId);
    return policy?.customer.name || 'N/A';
  }

  getHandlerName(handlerId: string | null): string {
    if (!handlerId) return 'Unassigned';
    const handler = this.handlers.find(h => h.id === handlerId);
    return handler?.name || 'Unknown';
  }

  getHandlerInitials(handlerId: string | null): string {
    const name = this.getHandlerName(handlerId);
    if (name === 'Unassigned') return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(value);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDaysSinceLoss(lossDateTime: string): number {
    const loss = new Date(lossDateTime);
    const today = new Date();
    const diffTime = today.getTime() - loss.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getRiskFlagLabel(code: string): string {
    const flag = this.fnolDataService.getRiskFlagByCode(code);
    return flag?.label || code;
  }

  getRecommendationSeverity(recommendation: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (recommendation) {
      case 'STP Eligible': return 'success';
      case 'Request Documents': return 'info';
      case 'Refer to SIU': return 'danger';
      case 'Refer to Underwriting': return 'warn';
      default: return 'info';
    }
  }

  openClaimDetail(claim: Claim): void {
    this.selectedClaimId = claim.id;
    this.isDetailDrawerOpen = true;
  }

  closeClaimDetail(): void {
    this.isDetailDrawerOpen = false;
    this.selectedClaimId = null;
  }
}
