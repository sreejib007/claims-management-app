import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { FnolDataService } from '../services/fnol-data.service';
import { Policy, Claim, Handler } from '../models/fnol-data.model';
import { Chart, registerables } from 'chart.js';
import { MetricCardComponent, IconBoxComponent } from '../shared/components';

Chart.register(...registerables);

export interface MetricData {
  title: string;
  value: number | string;
  icon: string;
  iconBg: 'primary' | 'warning' | 'danger' | 'info' | 'success';
  trend?: string;
  trendUp?: boolean;
}

@Component({
  selector: 'app-dashbord',
  standalone: true,
  imports: [CommonModule, CardModule, MetricCardComponent, IconBoxComponent],
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit, AfterViewInit {
  @ViewChild('claimsDonutChart') claimsDonutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('workloadChart') workloadChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lossTypeChart') lossTypeChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('impactChart') impactChartRef!: ElementRef<HTMLCanvasElement>;

  @Output() newClaimClick = new EventEmitter<void>();

  metrics: MetricData[] = [];
  claimsChart: Chart | null = null;
  handlerWorkloadChart: Chart | null = null;
  lossTypeChart: Chart | null = null;
  impactChart: Chart | null = null;

  // Chart data
  newClaimsCount = 0;
  openClaimsCount = 0;
  handlerWorkload: { name: string; count: number }[] = [];
  claimsByLossType: { type: string; count: number }[] = [];
  impactByLossType: { type: string; amount: number }[] = [];

  private policies: Policy[] = [];
  private claims: Claim[] = [];
  private handlers: Handler[] = [];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnInit(): void {
    this.loadData();
    this.buildMetrics();
    this.calculateChartData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initClaimsDonutChart();
      this.initWorkloadChart();
      this.initLossTypeChart();
      this.initImpactChart();
    }, 0);
  }

  private loadData(): void {
    this.policies = this.fnolDataService.getPolicies();
    this.claims = this.fnolDataService.getClaims();
    this.handlers = this.fnolDataService.getHandlers();
  }

  private buildMetrics(): void {
    const activePolicies = this.policies.filter(p => p.status === 'Active').length;
    const totalPolicies = this.policies.length;
    const activeClaims = this.claims.filter(c => c.status !== 'Resolved').length;
    const newClaims = this.claims.filter(c => c.status === 'New').length;
    const totalImpact = this.claims.reduce((sum, c) => sum + c.estimatedImpactGBP, 0);
    const avgImpact = this.claims.length > 0 ? Math.round(totalImpact / this.claims.length) : 0;
    const pendingDocs = this.claims.reduce((count, c) =>
      count + c.documents.filter(d => !d.received).length, 0);
    const activeHandlers = this.handlers.length;

    this.newClaimsCount = newClaims;
    this.openClaimsCount = activeClaims - newClaims; // Open but not new (In Review, Referred)

    this.metrics = [
      {
        title: 'Active Policies',
        value: activePolicies,
        icon: 'pi pi-shield',
        iconBg: 'primary',
        trend: `${totalPolicies} total`,
        trendUp: true
      },
      {
        title: 'Open Claims',
        value: activeClaims,
        icon: 'pi pi-copy',
        iconBg: 'warning',
        trend: `${newClaims} new`,
        trendUp: false
      },
      {
        title: 'Total Exposure',
        value: `£${totalImpact.toLocaleString()}`,
        icon: 'pi pi-credit-card',
        iconBg: 'danger',
        trend: `Avg £${avgImpact.toLocaleString()}`,
        trendUp: false
      },
      {
        title: 'Pending Documents',
        value: pendingDocs,
        icon: 'pi pi-clock',
        iconBg: 'info',
        trend: 'Awaiting',
        trendUp: false
      },
      {
        title: 'Active Handlers',
        value: activeHandlers,
        icon: 'pi pi-users',
        iconBg: 'success',
        trend: 'Available',
        trendUp: true
      }
    ];
  }

  private calculateChartData(): void {
    const newClaims = this.claims.filter(c => c.status === 'New').length;
    const inReviewClaims = this.claims.filter(c => c.status === 'In Review').length;
    const referredClaims = this.claims.filter(c => c.status === 'Referred').length;

    this.newClaimsCount = newClaims;
    this.openClaimsCount = inReviewClaims + referredClaims;

    // Calculate handler workload
    this.handlerWorkload = this.handlers.map(handler => ({
      name: handler.name,
      count: this.claims.filter(c => c.assignedTo === handler.id).length
    }));

    // Calculate claims by loss type
    const lossTypes = ['Accident', 'Theft', 'Water Damage', 'Fire', 'Storm'];
    this.claimsByLossType = lossTypes.map(type => ({
      type,
      count: this.claims.filter(c => c.lossType === type).length
    })).filter(item => item.count > 0);

    // Calculate financial impact by loss type
    this.impactByLossType = lossTypes.map(type => ({
      type,
      amount: this.claims.filter(c => c.lossType === type).reduce((sum, c) => sum + c.estimatedImpactGBP, 0)
    })).filter(item => item.amount > 0);
  }

  private initWorkloadChart(): void {
    if (!this.workloadChartRef) return;

    const ctx = this.workloadChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.handlerWorkloadChart) {
      this.handlerWorkloadChart.destroy();
    }

    const labels = this.handlerWorkload.map(h => h.name);
    const data = this.handlerWorkload.map(h => h.count);

    this.handlerWorkloadChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Claims',
          data: data,
          backgroundColor: [
            '#c4b5fd', // Purple
            '#93c5fd', // Blue
            '#86efac', // Green
            '#fde68a'  // Yellow
          ],
          borderColor: [
            '#a78bfa',
            '#60a5fa',
            '#4ade80',
            '#fcd34d'
          ],
          borderWidth: 1,
          borderRadius: 6,
          barThickness: 20
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: {
              size: 12,
              family: 'Inter, sans-serif'
            },
            bodyFont: {
              size: 11,
              family: 'Inter, sans-serif'
            },
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
              font: {
                size: 11,
                family: 'Inter, sans-serif'
              },
              color: '#64748b'
            },
            grid: {
              color: '#e2e8f0'
            }
          },
          y: {
            ticks: {
              font: {
                size: 11,
                family: 'Inter, sans-serif'
              },
              color: '#475569'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  onNewClaimClick(): void {
    this.newClaimClick.emit();
  }

  private initLossTypeChart(): void {
    if (!this.lossTypeChartRef) return;

    const ctx = this.lossTypeChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.lossTypeChart) {
      this.lossTypeChart.destroy();
    }

    const labels = this.claimsByLossType.map(item => item.type);
    const data = this.claimsByLossType.map(item => item.count);
    const colors = ['#f87171', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'];
    const borderColors = ['#ef4444', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

    this.lossTypeChart = new Chart(ctx, {
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
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, family: 'Inter, sans-serif' },
            bodyFont: { size: 11, family: 'Inter, sans-serif' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` ${context.raw} claims`
            }
          }
        }
      }
    });
  }

  private initImpactChart(): void {
    if (!this.impactChartRef) return;

    const ctx = this.impactChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.impactChart) {
      this.impactChart.destroy();
    }

    const labels = this.impactByLossType.map(item => item.type);
    const data = this.impactByLossType.map(item => item.amount);
    const colors = ['#f87171', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'];

    this.impactChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Impact (£)',
          data: data,
          backgroundColor: colors.slice(0, data.length),
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, family: 'Inter, sans-serif' },
            bodyFont: { size: 11, family: 'Inter, sans-serif' },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` £${(context.raw as number).toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              font: { size: 10, family: 'Inter, sans-serif' },
              color: '#64748b'
            },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 10, family: 'Inter, sans-serif' },
              color: '#64748b',
              callback: (value) => '£' + (value as number).toLocaleString()
            },
            grid: { color: '#e2e8f0' }
          }
        }
      }
    });
  }

  private initClaimsDonutChart(): void {
    if (!this.claimsDonutChartRef) return;

    const ctx = this.claimsDonutChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.claimsChart) {
      this.claimsChart.destroy();
    }

    this.claimsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['New Claims', 'Open Claims'],
        datasets: [{
          data: [this.newClaimsCount, this.openClaimsCount],
          backgroundColor: [
            '#7dd3fc', // Light sky blue for New
            '#fde68a'  // Light yellow for Open/In Review
          ],
          borderColor: [
            '#0ea5e9',
            '#f59e0b'
          ],
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: {
              size: 13,
              family: 'Inter, sans-serif'
            },
            bodyFont: {
              size: 12,
              family: 'Inter, sans-serif'
            },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const total = this.newClaimsCount + this.openClaimsCount;
                const percentage = total > 0 ? Math.round((context.raw as number / total) * 100) : 0;
                return ` ${context.raw} claims (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
}
