import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
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
export class HandlersComponent implements OnInit, AfterViewInit {
  @Output() newClaimClick = new EventEmitter<void>();
  @ViewChild('workloadChart') workloadChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('teamChart') teamChartRef!: ElementRef<HTMLCanvasElement>;

  handlers: Handler[] = [];
  workloadChart: Chart | null = null;
  teamChart: Chart | null = null;
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initWorkloadChart();
      this.initTeamChart();
    }, 0);
  }

  private initWorkloadChart(): void {
    if (!this.workloadChartRef) return;

    const ctx = this.workloadChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.workloadChart) {
      this.workloadChart.destroy();
    }

    const labels = Object.keys(this.handlerWorkload);
    const data = Object.values(this.handlerWorkload);
    const colors = ['#6366f1', '#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];

    this.workloadChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Active Claims',
          data: data,
          backgroundColor: colors.slice(0, data.length),
          borderRadius: 6,
          barThickness: 28
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, family: 'Inter, sans-serif' },
            bodyFont: { size: 11, family: 'Inter, sans-serif' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` ${context.raw} claims assigned`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: { size: 11, family: 'Inter, sans-serif' },
              color: '#64748b'
            },
            grid: { color: '#e2e8f0' }
          },
          y: {
            ticks: {
              font: { size: 11, family: 'Inter, sans-serif' },
              color: '#475569'
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  private initTeamChart(): void {
    if (!this.teamChartRef) return;

    const ctx = this.teamChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.teamChart) {
      this.teamChart.destroy();
    }

    const teamCounts: Record<string, number> = {};
    this.handlers.forEach(h => {
      teamCounts[h.team] = (teamCounts[h.team] || 0) + 1;
    });

    const labels = Object.keys(teamCounts);
    const data = Object.values(teamCounts);
    const colors = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'];
    const borderColors = ['#2563eb', '#d97706', '#dc2626', '#059669'];

    this.teamChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, data.length),
          borderColor: borderColors.slice(0, data.length),
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: { size: 11, family: 'Inter, sans-serif' }
            }
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, family: 'Inter, sans-serif' },
            bodyFont: { size: 11, family: 'Inter, sans-serif' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` ${context.raw} handlers`
            }
          }
        }
      }
    });
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
