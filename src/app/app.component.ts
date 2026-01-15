import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { PoliciesComponent } from "./policies/policies.component";
import { HandlersComponent } from './handlers/handlers.component';
import { NewClaimWizardComponent } from './new-claim-wizard/new-claim-wizard.component';
import { DashbordComponent } from './dashbord/dashbord.component';
import { ClaimsComponent } from './claims/claims.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { AiChatbotComponent } from './ai-chatbot/ai-chatbot.component';
import { ClaimDetailComponent } from './claim-detail/claim-detail.component';
import { PolicyDetailComponent } from './policy-detail/policy-detail.component';
import { HandlerDetailComponent } from './handler-detail/handler-detail.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, FooterComponent, PoliciesComponent, HandlersComponent, NewClaimWizardComponent, DashbordComponent, ClaimsComponent, ButtonModule, TooltipModule, LoadingScreenComponent, AiChatbotComponent, ClaimDetailComponent, PolicyDetailComponent, HandlerDetailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'claims-management-app';
  isClaimWizardOpen = false;
  isLoading = true;
  isChatbotOpen = false;
  activeMenu = 'dashboard';

  // Global Search Detail Drawers
  isClaimDetailOpen = false;
  selectedClaimId: string | null = null;
  isPolicyDetailOpen = false;
  selectedPolicyId: string | null = null;
  isHandlerDetailOpen = false;
  selectedHandlerId: string | null = null;

  menuItems = [
    { id: 'dashboard', label: 'Claims Dashboard', icon: 'pi pi-th-large' },
    { id: 'claims', label: 'Claims', icon: 'pi pi-file' },
    { id: 'policies', label: 'Policies', icon: 'pi pi-folder' },
    { id: 'handlers', label: 'Handlers', icon: 'pi pi-users' },
    { id: 'newclaim', label: 'New Claim', icon: 'pi pi-plus-circle' }
  ];

  ngOnInit(): void {
    // Simulate initial data loading - replace with actual data loading logic
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  openClaimWizard(): void {
    this.isClaimWizardOpen = true;
  }

  onClaimCreated(claim: any): void {
    console.log('New claim created:', claim);
  }

  openChatbot(): void {
    this.isChatbotOpen = true;
  }

  selectMenu(menuId: string): void {
    if (menuId === 'newclaim') {
      this.openClaimWizard();
    } else {
      this.activeMenu = menuId;
    }
  }

  // Global Search Handlers
  onGlobalClaimSelect(claimId: string): void {
    this.selectedClaimId = claimId;
    this.isClaimDetailOpen = true;
  }

  onGlobalPolicySelect(policyId: string): void {
    this.selectedPolicyId = policyId;
    this.isPolicyDetailOpen = true;
  }

  onGlobalHandlerSelect(handlerId: string): void {
    this.selectedHandlerId = handlerId;
    this.isHandlerDetailOpen = true;
  }

  closeClaimDetail(): void {
    this.isClaimDetailOpen = false;
    this.selectedClaimId = null;
  }

  closePolicyDetail(): void {
    this.isPolicyDetailOpen = false;
    this.selectedPolicyId = null;
  }

  closeHandlerDetail(): void {
    this.isHandlerDetailOpen = false;
    this.selectedHandlerId = null;
  }
}
