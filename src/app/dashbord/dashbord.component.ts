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
  targetValue: number;
  icon: string;
  iconBg: 'primary' | 'warning' | 'danger' | 'info' | 'success';
  trend?: string;
  trendUp?: boolean;
  prefix?: string;
  suffix?: string;
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
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;

  @Output() newClaimClick = new EventEmitter<void>();

  metrics: MetricData[] = [];
  claimsChart: Chart | null = null;
  handlerWorkloadChart: Chart | null = null;
  lossTypeChart: Chart | null = null;
  impactChart: Chart | null = null;
  radarChart: Chart | null = null;

  // Chart data
  newClaimsCount = 0;
  openClaimsCount = 0;
  handlerWorkload: { name: string; count: number }[] = [];
  claimsByLossType: { type: string; count: number }[] = [];
  impactByLossType: { type: string; amount: number }[] = [];

  // Pipeline data
  claimsPipeline: { status: string; count: number; icon: string; color: string; percentage: number }[] = [];
  totalClaimsInPipeline = 0;

  private policies: Policy[] = [];
  private claims: Claim[] = [];
  private handlers: Handler[] = [];

  constructor(private fnolDataService: FnolDataService) {}

  ngOnInit(): void {
    this.loadData();
    this.buildMetrics();
    this.calculateChartData();
    this.animateMetrics();
    this.animatePipeline();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initClaimsDonutChart();
      this.initWorkloadChart();
      this.initLossTypeChart();
      this.initImpactChart();
      this.initRadarChart();
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
        value: 0,
        targetValue: activePolicies,
        icon: 'pi pi-shield',
        iconBg: 'primary',
        trend: `${totalPolicies} total`,
        trendUp: true
      },
      {
        title: 'Open Claims',
        value: 0,
        targetValue: activeClaims,
        icon: 'pi pi-copy',
        iconBg: 'warning',
        trend: `${newClaims} new`,
        trendUp: false
      },
      {
        title: 'Total Exposure',
        value: 0,
        targetValue: totalImpact,
        icon: 'pi pi-credit-card',
        iconBg: 'danger',
        trend: `Avg £${avgImpact.toLocaleString()}`,
        trendUp: false,
        prefix: '£'
      },
      {
        title: 'Pending Documents',
        value: 0,
        targetValue: pendingDocs,
        icon: 'pi pi-clock',
        iconBg: 'info',
        trend: 'Awaiting',
        trendUp: false
      },
      {
        title: 'Active Handlers',
        value: 0,
        targetValue: activeHandlers,
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
    const resolvedClaims = this.claims.filter(c => c.status === 'Resolved').length;

    this.newClaimsCount = newClaims;
    this.openClaimsCount = inReviewClaims + referredClaims;

    // Calculate pipeline data
    this.totalClaimsInPipeline = this.claims.length;
    this.claimsPipeline = [
      { status: 'New', count: newClaims, icon: 'pi pi-inbox', color: '#3b82f6', percentage: this.totalClaimsInPipeline > 0 ? (newClaims / this.totalClaimsInPipeline) * 100 : 0 },
      { status: 'In Review', count: inReviewClaims, icon: 'pi pi-search', color: '#f59e0b', percentage: this.totalClaimsInPipeline > 0 ? (inReviewClaims / this.totalClaimsInPipeline) * 100 : 0 },
      { status: 'Referred', count: referredClaims, icon: 'pi pi-exclamation-triangle', color: '#ef4444', percentage: this.totalClaimsInPipeline > 0 ? (referredClaims / this.totalClaimsInPipeline) * 100 : 0 },
      { status: 'Resolved', count: resolvedClaims, icon: 'pi pi-check-circle', color: '#10b981', percentage: this.totalClaimsInPipeline > 0 ? (resolvedClaims / this.totalClaimsInPipeline) * 100 : 0 }
    ];

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

  private animateMetrics(): void {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;

    this.metrics.forEach((metric, index) => {
      const target = metric.targetValue;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(current + increment, target);

        if (metric.prefix === '£') {
          metric.value = `£${Math.round(current).toLocaleString()}`;
        } else {
          metric.value = Math.round(current);
        }

        if (step >= steps) {
          clearInterval(timer);
          if (metric.prefix === '£') {
            metric.value = `£${target.toLocaleString()}`;
          } else {
            metric.value = target;
          }
        }
      }, interval + (index * 50));
    });
  }

  private animatePipeline(): void {
    const duration = 1200;
    const steps = 40;
    const interval = duration / steps;

    const targetCounts = this.claimsPipeline.map(s => s.count);
    const targetPercentages = this.claimsPipeline.map(s => s.percentage);

    this.claimsPipeline.forEach((stage, index) => {
      stage.count = 0;
      stage.percentage = 0;
    });

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      this.claimsPipeline.forEach((stage, index) => {
        stage.count = Math.round(targetCounts[index] * progress);
        stage.percentage = targetPercentages[index] * progress;
      });

      if (step >= steps) {
        clearInterval(timer);
        this.claimsPipeline.forEach((stage, index) => {
          stage.count = targetCounts[index];
          stage.percentage = targetPercentages[index];
        });
      }
    }, interval);
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
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1200,
          easing: 'easeOutQuart'
        },
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
        animation: {
          duration: 1500,
          easing: 'easeOutQuart',
          delay: (context) => context.dataIndex * 100
        },
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

  private initRadarChart(): void {
    if (!this.radarChartRef) return;

    const ctx = this.radarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.radarChart) {
      this.radarChart.destroy();
    }

    // Calculate metrics for radar chart
    const totalClaims = this.claims.length;
    const highRiskClaims = this.claims.filter(c => c.riskFlags.length >= 2).length;
    const docsReceived = this.claims.reduce((sum, c) => sum + c.documents.filter(d => d.received).length, 0);
    const totalDocs = this.claims.reduce((sum, c) => sum + c.documents.length, 0);
    const avgImpact = totalClaims > 0 ? this.claims.reduce((sum, c) => sum + c.estimatedImpactGBP, 0) / totalClaims : 0;
    const assignedClaims = this.claims.filter(c => c.assignedTo !== null).length;

    // Normalize values to 0-100 scale
    const metrics = [
      Math.min((assignedClaims / Math.max(totalClaims, 1)) * 100, 100), // Assignment Rate
      Math.min((docsReceived / Math.max(totalDocs, 1)) * 100, 100), // Doc Completion
      Math.min(100 - (highRiskClaims / Math.max(totalClaims, 1)) * 100, 100), // Risk Score (inverted)
      Math.min((avgImpact / 10000) * 100, 100), // Impact Level
      Math.min((this.handlers.length / 5) * 100, 100) // Handler Capacity
    ];

    this.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Assignment', 'Documents', 'Risk Score', 'Impact', 'Capacity'],
        datasets: [{
          label: 'Current Status',
          data: metrics,
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: '#6366f1',
          borderWidth: 2,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 11, family: 'Inter, sans-serif' },
            bodyFont: { size: 10, family: 'Inter, sans-serif' },
            padding: 8,
            cornerRadius: 6,
            callbacks: {
              label: (context) => ` ${Math.round(context.raw as number)}%`
            }
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 25,
              font: { size: 9 },
              color: '#94a3b8',
              backdropColor: 'transparent'
            },
            grid: { color: '#e2e8f0' },
            angleLines: { color: '#e2e8f0' },
            pointLabels: {
              font: { size: 10, family: 'Inter, sans-serif', weight: 500 },
              color: '#475569'
            }
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
