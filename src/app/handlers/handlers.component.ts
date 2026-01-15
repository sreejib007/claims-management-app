import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { BadgeModule } from 'primeng/badge';
import { FnolDataService } from '../services/fnol-data.service';
import { Handler } from '../models/fnol-data.model';
import { HandlerDetailComponent } from '../handler-detail/handler-detail.component';
import { ClaimDetailComponent } from '../claim-detail/claim-detail.component';

@Component({
  selector: 'app-handlers',
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
    BadgeModule,
    HandlerDetailComponent,
    ClaimDetailComponent
  ],
  templateUrl: './handlers.component.html',
  styleUrl: './handlers.component.css'
})
export class HandlersComponent implements OnInit {
  @Output() newClaimClick = new EventEmitter<void>();

  handlers: Handler[] = [];
  filteredHandlers: Handler[] = [];
  searchTerm: string = '';
  viewMode: string = 'table';
  handlerWorkload: Record<string, number> = {};

  // Handler Detail Drawer
  isDetailDrawerOpen = false;
  selectedHandlerId: string | null = null;

  // Claim Detail Drawer
  isClaimDetailOpen = false;
  selectedClaimId: string | null = null;

  viewOptions = [
    { label: 'Table', value: 'table', icon: 'pi pi-list' },
    { label: 'Cards', value: 'cards', icon: 'pi pi-th-large' }
  ];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnInit(): void {
    this.handlers = this.fnolDataService.getHandlers();
    this.filteredHandlers = [...this.handlers];
    this.handlerWorkload = this.fnolDataService.getHandlerWorkload();
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredHandlers = [...this.handlers];
      return;
    }
    this.filteredHandlers = this.handlers.filter(h =>
      h.name.toLowerCase().includes(term) ||
      h.team.toLowerCase().includes(term) ||
      h.id.toLowerCase().includes(term)
    );
  }

  getTeamSeverity(team: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (team) {
      case 'FNOL': return 'info';
      case 'Triage': return 'warn';
      case 'SIU': return 'danger';
      default: return 'secondary';
    }
  }

  getTeamIcon(team: string): string {
    switch (team) {
      case 'FNOL': return 'pi pi-phone';
      case 'Triage': return 'pi pi-filter';
      case 'SIU': return 'pi pi-search';
      default: return 'pi pi-users';
    }
  }

  getHandlerInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getWorkloadCount(handlerName: string): number {
    return this.handlerWorkload[handlerName] || 0;
  }

  getWorkloadSeverity(count: number): 'success' | 'info' | 'warn' | 'danger' {
    if (count === 0) return 'success';
    if (count <= 2) return 'info';
    if (count <= 4) return 'warn';
    return 'danger';
  }

  openHandlerDetail(handler: Handler): void {
    this.selectedHandlerId = handler.id;
    this.isDetailDrawerOpen = true;
  }

  closeHandlerDetail(): void {
    this.isDetailDrawerOpen = false;
    this.selectedHandlerId = null;
  }

  onClaimClickFromHandler(claimId: string): void {
    this.selectedClaimId = claimId;
    this.isClaimDetailOpen = true;
  }

  closeClaimDetail(): void {
    this.isClaimDetailOpen = false;
    this.selectedClaimId = null;
  }
}
