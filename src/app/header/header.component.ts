import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { GlobalSearchComponent } from '../global-search/global-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuModule, ButtonModule, TooltipModule, GlobalSearchComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userName = 'John Smith';
  userRole = 'Claims Manager';
  userInitials = 'JS';

  menuItems: MenuItem[] = [
    { label: 'My Profile', icon: 'pi pi-user' },
    { label: 'Settings', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out' }
  ];

  @Output() chatbotClick = new EventEmitter<void>();
  @Output() claimSelect = new EventEmitter<string>();
  @Output() policySelect = new EventEmitter<string>();
  @Output() handlerSelect = new EventEmitter<string>();

  openChatbot(): void {
    this.chatbotClick.emit();
  }

  onClaimSelect(claimId: string): void {
    this.claimSelect.emit(claimId);
  }

  onPolicySelect(policyId: string): void {
    this.policySelect.emit(policyId);
  }

  onHandlerSelect(handlerId: string): void {
    this.handlerSelect.emit(handlerId);
  }
}
