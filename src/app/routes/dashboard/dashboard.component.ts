import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MtxProgressModule } from '@ng-matero/extensions/progress';
import { DashboardService } from './dashboard.service';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { MeterStatsCardComponent } from './meter-stats-card/meter-stats-card.component';
import { DashboardTableComponent } from './dashboard-table/dashboard-table.component';
import { CommonModule } from '@angular/common';
import { LookupService } from '@shared/services/lookup.service';
type RetiredMeterKeys = 'received' | 'notReceived';
type MeterKeys = 'onCustomer' | 'onAgent' | 'onStock';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatTabsModule,
    MtxProgressModule,
    DashboardHeaderComponent,
    MeterStatsCardComponent,
    DashboardTableComponent,
  ],
})
export class DashboardComponent implements OnInit {
  meters: any = {
    total: 0,
    stats: [],
    values: {},
    chartId: 'metersChart',
    chartOptions: {},
  };

  retiredMeters: any = {
    total: 0,
    stats: [],
    values: {},
    chartId: 'retiredMetersChart',
    chartOptions: {},
  };

  selectDistrict: number = 0;

  isloadingMaterial: boolean = false;
  isloadingMeters: boolean = false;
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {}

  getMeterStatusStatistics() {
    const meterStructure = {
      stats: [
        { key: 'onCustomer' as MeterKeys, label: 'On Customer', color: '#A84E4E' },
        { key: 'onAgent' as MeterKeys, label: 'On Agent', color: '#C7A6A6' },
        { key: 'onStock' as MeterKeys, label: 'On Stock', color: '#6C1414' },
      ],
    };

    this.dashboardService.getMeterStatusStatistics(this.selectDistrict).subscribe(
      response => {
        const dynamicMetersData = response.data;

        if (dynamicMetersData) this.isloadingMeters = true;
        this.meters = {
          ...meterStructure,
          total:
            dynamicMetersData?.onStock + dynamicMetersData?.onAgent + dynamicMetersData?.onCustomer,
          values: {
            onCustomer: dynamicMetersData?.onCustomer,
            onAgent: dynamicMetersData?.onAgent,
            onStock: dynamicMetersData?.onStock,
          } as Record<MeterKeys, number>,
          chartId: 'metersChart',
          chartOptions: {
            chart: {
              type: 'pie',
              height: 180,
              width: 150,
            },
            labels: meterStructure.stats.map(stat => stat.label),
            series: meterStructure.stats.map(
              stat =>
                ({
                  onStock: dynamicMetersData.onStock,
                  onAgent: dynamicMetersData.onAgent,
                  onCustomer: dynamicMetersData.onCustomer,
                })[stat.key]
            ),
            colors: meterStructure.stats.map(stat => stat.color),
            legend: {
              show: false,
            },
            stroke: {
              width: 0,
            },
          },
        };
      },
      err => {}
    );
  }

  getRetiredMeterStatistics() {
    const retiredMeterStructure = {
      stats: [
        { key: 'received' as RetiredMeterKeys, label: 'Received', color: '#303f9f' },
        { key: 'notReceived' as RetiredMeterKeys, label: 'Not Received', color: '#7986cb' },
      ],
    };

    this.dashboardService.getRetiredMeterStatistics(this.selectDistrict).subscribe(
      response => {
        const dynamicRetiredMetersData = response.data;

        if (dynamicRetiredMetersData) this.isloadingMaterial = true;

        this.retiredMeters = {
          ...retiredMeterStructure,
          total: dynamicRetiredMetersData.totalCount,
          values: {
            received: dynamicRetiredMetersData.receivedCount,
            notReceived: dynamicRetiredMetersData.notReceivedCount,
          } as Record<RetiredMeterKeys, number>,
          chartId: 'retiredMetersChart',
          chartOptions: {
            chart: {
              type: 'pie',
              height: 180,
              width: 150,
            },
            labels: retiredMeterStructure.stats.map(stat => stat.label),
            series: retiredMeterStructure.stats.map(
              stat =>
                ({
                  received: dynamicRetiredMetersData.receivedCount,
                  notReceived: dynamicRetiredMetersData.notReceivedCount,
                })[stat.key]
            ),
            colors: retiredMeterStructure.stats.map(stat => stat.color),
            legend: {
              show: false,
            },
            stroke: {
              width: 0,
            },
          },
        };
      },
      err => {}
    );
  }

  handleFilterChange(filterValues: any): void {
    console.log('Filter values received in parent:', filterValues);

    this.selectDistrict = filterValues.district;

    this.getMeterStatusStatistics();

    this.getRetiredMeterStatistics();
  }
}
