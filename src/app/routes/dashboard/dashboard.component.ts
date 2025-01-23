import { Component, OnInit } from '@angular/core';
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
import { MeterStatusDto, RetiredMeterStatusDto } from '@shared/interfaces/dashboard';
import { BaseResponse } from '@shared/interfaces/base-response';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
  meters!: {
    stats: { key: keyof MeterStatusDto; label: string; color: string }[];
    total: number;
    values?: MeterStatusDto;
    chartId: string;
    chartOptions: any;
  };

  retiredMeters!: {
    stats: { key: keyof RetiredMeterStatusDto; label: string; color: string }[];
    total: number;
    values: Omit<RetiredMeterStatusDto, 'totalCount'>;
    chartId: string;
    chartOptions: any;
  };
  selectedDistrict: number = 1;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fetchData(this.selectedDistrict);
  }

  onDistrictChanged(districtId: number): void {
    this.selectedDistrict = districtId;
    this.fetchData(districtId);
  }

  private fetchData(districtId: number): void {
    this.dashboardService
      .getMetersData(districtId)
      .subscribe((response: BaseResponse<MeterStatusDto>) => {
        const meterStructure = {
          stats: [
            { key: 'onCustomer' as const, label: 'On Customer', color: '#A84E4E' },
            { key: 'onAgent' as const, label: 'On Agent', color: '#C7A6A6' },
            { key: 'onStock' as const, label: 'In Stock', color: '#6C1414' },
          ],
        };

        this.meters = {
          ...meterStructure,
          total: Object.values(response.data).reduce((sum, value) => sum + value, 0),
          values: response.data,
          chartId: 'metersChart',
          chartOptions: {
            chart: {
              type: 'pie',
              height: 180,
              width: 150,
            },
            labels: meterStructure.stats.map(stat => stat.label),
            series: meterStructure.stats.map(stat => response.data[stat.key] || 0),
            colors: meterStructure.stats.map(stat => stat.color),
            legend: {
              show: false,
            },
            stroke: {
              width: 0,
            },
          },
        };
      });

    this.dashboardService
      .getRetiredMetersData(districtId)
      .subscribe((response: BaseResponse<RetiredMeterStatusDto>) => {
        const retiredMeterStructure = {
          stats: [
            { key: 'receivedCount' as const, label: 'Received', color: '#303f9f' },
            { key: 'notReceivedCount' as const, label: 'Not Received', color: '#7986cb' },
          ],
        };

        this.retiredMeters = {
          ...retiredMeterStructure,
          total: response.data.totalCount,
          values: {
            receivedCount: response.data.receivedCount,
            notReceivedCount: response.data.notReceivedCount,
          },
          chartId: 'retiredMetersChart',
          chartOptions: {
            chart: {
              type: 'pie',
              height: 180,
              width: 150,
            },
            labels: retiredMeterStructure.stats.map(stat => stat.label),
            series: retiredMeterStructure.stats.map(stat => response.data[stat.key] || 0),
            colors: retiredMeterStructure.stats.map(stat => stat.color),
            legend: {
              show: false,
            },
            stroke: {
              width: 0,
            },
          },
        };
      });
  }
}
