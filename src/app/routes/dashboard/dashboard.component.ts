import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { Subscription } from 'rxjs';
import { SettingsService } from '@core';
import { DashboardService } from './dashboard.service';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { MeterStatsCardComponent } from './meter-stats-card/meter-stats-card.component';
import { DashboardTableComponent } from './dashboard-table/dashboard-table.component';
type RetiredMeterKeys = 'received' | 'notReceived';
type MeterKeys = 'onCustomer' | 'onAgent' | 'inStock';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
  standalone: true,
  imports: [
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
  meters: any;
  retiredMeters: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const meterStructure = {
      stats: [
        { key: 'onCustomer' as MeterKeys, label: 'On Customer', color: '#A84E4E' },
        { key: 'onAgent' as MeterKeys, label: 'On Agent', color: '#C7A6A6' },
        { key: 'inStock' as MeterKeys, label: 'In Stock', color: '#6C1414' },
      ],
    };

    const dynamicMetersData = this.dashboardService.getDynamicMetersData();
    this.meters = {
      ...meterStructure,
      total: dynamicMetersData.total,
      values: dynamicMetersData.values as Record<MeterKeys, number>,
      chartId: 'metersChart',
      chartOptions: {
        chart: {
          type: 'pie',
          height: 180,
          width: 150,
        },
        labels: meterStructure.stats.map(stat => stat.label),
        series: meterStructure.stats.map(stat => dynamicMetersData.values[stat.key]),
        colors: meterStructure.stats.map(stat => stat.color),
        legend: {
          show: false,
        },
        stroke: {
          width: 0,
        },
      },
    };

    const retiredMeterStructure = {
      stats: [
        { key: 'received' as RetiredMeterKeys, label: 'Received', color: '#303f9f' },
        { key: 'notReceived' as RetiredMeterKeys, label: 'Not Received', color: '#7986cb' },
      ],
    };

    const dynamicRetiredMetersData = this.dashboardService.getDynamicRetiredMetersData();
    this.retiredMeters = {
      ...retiredMeterStructure,
      total: dynamicRetiredMetersData.total,
      values: dynamicRetiredMetersData.values as Record<RetiredMeterKeys, number>,
      chartId: 'retiredMetersChart',
      chartOptions: {
        chart: {
          type: 'pie',
          height: 180,
          width: 150,
        },
        labels: retiredMeterStructure.stats.map(stat => stat.label),
        series: retiredMeterStructure.stats.map(stat => dynamicRetiredMetersData.values[stat.key]),
        colors: retiredMeterStructure.stats.map(stat => stat.color),
        legend: {
          show: false,
        },
        stroke: {
          width: 0,
        },
      },
    };
  }
}
