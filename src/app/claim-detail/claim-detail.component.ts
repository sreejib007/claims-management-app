import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { DetailDrawerComponent } from '../shared/components/detail-drawer/detail-drawer.component';
import { AvatarComponent, StatusBadgeComponent, TypeBadgeComponent, IconBoxComponent } from '../shared/components';
import { Claim, Policy, Handler, ClaimNote } from '../models/fnol-data.model';
import { FnolDataService } from '../services/fnol-data.service';

interface TimelineEvent {
  status: string;
  date: string;
  description: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TagModule,
    TabsModule,
    TimelineModule,
    TooltipModule,
    SelectModule,
    TextareaModule,
    InputTextModule,
    MessageModule,
    DetailDrawerComponent,
    AvatarComponent,
    StatusBadgeComponent,
    TypeBadgeComponent,
    IconBoxComponent
  ],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.css'
})
export class ClaimDetailComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() claimId: string | null = null;
  @Output() isOpenChange = new EventEmitter<boolean>();

  claim: Claim | null = null;
  policy: Policy | null = null;
  handler: Handler | null = null;
  handlers: Handler[] = [];
  timeline: TimelineEvent[] = [];

  // Editable fields
  selectedStatus: string = '';
  selectedHandlerId: string | null = null;
  newNoteText: string = '';

  // Reference data
  statusOptions = [
    { label: 'New', value: 'New' },
    { label: 'In Review', value: 'In Review' },
    { label: 'Referred', value: 'Referred' },
    { label: 'Resolved', value: 'Resolved' }
  ];

  handlerOptions: { label: string; value: string | null }[] = [];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['claimId'] && this.claimId) {
      this.loadClaimDetails();
    }
  }

  private loadClaimDetails(): void {
    if (!this.claimId) return;

    const claims = this.fnolDataService.getClaims();
    this.claim = claims.find(c => c.id === this.claimId) || null;

    // Load handlers for dropdown
    this.handlers = this.fnolDataService.getHandlers();
    this.handlerOptions = [
      { label: 'Unassigned', value: null },
      ...this.handlers.map(h => ({ label: h.name, value: h.id }))
    ];

    if (this.claim) {
      const policies = this.fnolDataService.getPolicies();
      this.policy = policies.find(p => p.id === this.claim!.policyId) || null;

      // Set editable fields
      this.selectedStatus = this.claim.status;
      this.selectedHandlerId = this.claim.assignedTo;

      if (this.claim.assignedTo) {
        this.handler = this.handlers.find(h => h.id === this.claim!.assignedTo) || null;
      } else {
        this.handler = null;
      }

      this.buildTimeline();
    }
  }

  private buildTimeline(): void {
    if (!this.claim) return;

    this.timeline = [
      {
        status: 'Claim Created',
        date: this.claim.createdAt,
        description: `Claim ${this.claim.claimNumber} was submitted`,
        icon: 'pi pi-plus-circle',
        color: '#3b82f6'
      }
    ];

    if (this.claim.status === 'In Review' || this.claim.status === 'Referred' || this.claim.status === 'Resolved') {
      this.timeline.push({
        status: 'Under Review',
        date: this.addDays(this.claim.createdAt, 1),
        description: 'Claim is being reviewed by the claims team',
        icon: 'pi pi-search',
        color: '#f59e0b'
      });
    }

    if (this.claim.status === 'Referred') {
      this.timeline.push({
        status: 'Referred',
        date: this.addDays(this.claim.createdAt, 2),
        description: 'Claim referred for further investigation',
        icon: 'pi pi-exclamation-triangle',
        color: '#ef4444'
      });
    }

    if (this.claim.status === 'Resolved') {
      this.timeline.push({
        status: 'Resolved',
        date: this.addDays(this.claim.createdAt, 5),
        description: 'Claim has been resolved',
        icon: 'pi pi-check-circle',
        color: '#10b981'
      });
    }

    // Add notes to timeline
    this.claim.notes.forEach(note => {
      this.timeline.push({
        status: 'Note Added',
        date: note.createdAt,
        description: note.text,
        icon: 'pi pi-comment',
        color: '#6366f1'
      });
    });

    // Sort by date
    this.timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private addDays(dateStr: string, days: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString();
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

  formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    }).format(value);
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

  getRiskFlagLabel(code: string): string {
    const flag = this.fnolDataService.getRiskFlagByCode(code);
    return flag?.label || code;
  }

  getDaysRemaining(): number {
    if (!this.policy) return 0;
    const endDate = new Date(this.policy.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDocumentIcon(docName: string): string {
    if (docName.toLowerCase().includes('photo')) return 'pi pi-image';
    if (docName.toLowerCase().includes('report')) return 'pi pi-file-pdf';
    if (docName.toLowerCase().includes('statement')) return 'pi pi-file';
    return 'pi pi-paperclip';
  }

  getHandlerInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getNoteAuthorName(authorId: string): string {
    const handler = this.handlers.find(h => h.id === authorId);
    return handler?.name || 'System';
  }

  // Update claim status
  onStatusChange(): void {
    if (this.claim && this.selectedStatus !== this.claim.status) {
      this.fnolDataService.updateClaim(this.claim.id, { status: this.selectedStatus });
      this.claim.status = this.selectedStatus;
      this.buildTimeline();
    }
  }

  // Update handler assignment
  onHandlerChange(): void {
    if (this.claim) {
      this.fnolDataService.updateClaim(this.claim.id, { assignedTo: this.selectedHandlerId });
      this.claim.assignedTo = this.selectedHandlerId;
      if (this.selectedHandlerId) {
        this.handler = this.handlers.find(h => h.id === this.selectedHandlerId) || null;
      } else {
        this.handler = null;
      }
    }
  }

  // Add a new note
  addNote(): void {
    if (!this.claim || !this.newNoteText.trim()) return;

    const newNote: ClaimNote = {
      noteId: 'n' + Date.now(),
      authorId: 'u1', // Default to first handler (simulated current user)
      createdAt: new Date().toISOString(),
      text: this.newNoteText.trim()
    };

    this.fnolDataService.addClaimNote(this.claim.id, newNote);
    this.claim.notes.push(newNote);
    this.newNoteText = '';
    this.buildTimeline();
  }

  // Mark document as received
  toggleDocumentReceived(docId: string): void {
    if (!this.claim) return;

    const doc = this.claim.documents.find(d => d.docId === docId);
    if (doc) {
      doc.received = !doc.received;
      this.fnolDataService.updateClaimDocument(this.claim.id, docId, { received: doc.received });
    }
  }

  // Get risk flag severity
  getRiskFlagSeverity(code: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (code) {
      case 'HIGH_IMPACT':
      case 'LAPSED_POLICY':
      case 'PRIOR_THEFT':
        return 'danger';
      case 'RECENT_LOSS':
      case 'NEW_POLICY':
        return 'warn';
      case 'OOH_TIME':
        return 'info';
      default:
        return 'secondary';
    }
  }

  // Check if policy is not active
  isPolicyInactive(): boolean {
    return this.policy?.status !== 'Active';
  }

  // Get received document count
  getReceivedDocCount(): number {
    return this.claim?.documents.filter(d => d.received).length || 0;
  }

  // Get total document count
  getTotalDocCount(): number {
    return this.claim?.documents.length || 0;
  }
}
