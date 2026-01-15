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
import { FnolDataService } from '../services/fnol-data.service';
import { Policy, VehicleAsset, PropertyAsset } from '../models/fnol-data.model';
import { PolicyDetailComponent } from '../policy-detail/policy-detail.component';
import { ClaimDetailComponent } from '../claim-detail/claim-detail.component';

@Component({
  selector: 'app-policies',
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
    PolicyDetailComponent,
    ClaimDetailComponent
  ],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent implements OnInit {
  policies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  searchTerm: string = '';
  viewMode: string = 'table';

  // Policy Detail Drawer
  isDetailDrawerOpen = false;
  selectedPolicyId: string | null = null;

  // Claim Detail Drawer
  isClaimDetailOpen = false;
  selectedClaimId: string | null = null;

  viewOptions = [
    { label: 'Table', value: 'table', icon: 'pi pi-list' },
    { label: 'Cards', value: 'cards', icon: 'pi pi-th-large' }
  ];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnInit(): void {
    this.policies = this.fnolDataService.getPolicies();
    this.filteredPolicies = [...this.policies];
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPolicies = [...this.policies];
      return;
    }
    this.filteredPolicies = this.policies.filter(p =>
      p.policyNumber.toLowerCase().includes(term) ||
      p.customer.name.toLowerCase().includes(term) ||
      p.product.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Active': return 'success';
      case 'Lapsed': return 'danger';
      case 'Cancelled': return 'warn';
      default: return 'secondary';
    }
  }

  getProductIcon(product: string): string {
    return product === 'Motor' ? 'pi pi-car' : 'pi pi-home';
  }

  isMotorPolicy(policy: Policy): boolean {
    return policy.product === 'Motor';
  }

  getVehicleAsset(policy: Policy): VehicleAsset {
    return policy.asset as VehicleAsset;
  }

  getPropertyAsset(policy: Policy): PropertyAsset {
    return policy.asset as PropertyAsset;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(value);
  }

  getDaysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  openPolicyDetail(policy: Policy): void {
    this.selectedPolicyId = policy.id;
    this.isDetailDrawerOpen = true;
  }

  closePolicyDetail(): void {
    this.isDetailDrawerOpen = false;
    this.selectedPolicyId = null;
  }

  onClaimClickFromPolicy(claimId: string): void {
    this.selectedClaimId = claimId;
    this.isClaimDetailOpen = true;
  }

  closeClaimDetail(): void {
    this.isClaimDetailOpen = false;
    this.selectedClaimId = null;
  }
}
