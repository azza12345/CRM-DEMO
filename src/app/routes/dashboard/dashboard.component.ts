import { Component, inject, OnInit } from '@angular/core';
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
import { ApiService } from '@shared/services/api.service';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';
import { EndPoint, HttpVerb } from '@shared/enums';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe,
  ],
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  meters$!: Observable<{
    stats: { key: keyof MeterStatusDto; label: string; color: string }[];
    total: number;
    values: MeterStatusDto;
    chartId: string;
    chartOptions: any;
  }>;

  retiredMeters$!: Observable<{
    stats: { key: keyof RetiredMeterStatusDto; label: string; color: string }[];
    total: number;
    values: Omit<RetiredMeterStatusDto, 'totalCount'>;
    chartId: string;
    chartOptions: any;
  }>;

  private districtSubject = new BehaviorSubject<number>(1);

  ngOnInit(): void {
    this.fetchData();
  }

  onDistrictChanged(districtId: number): void {
    this.districtSubject.next(districtId);
  }

  private fetchData(): void {
    this.meters$ = this.districtSubject.pipe(
      switchMap(districtId =>
        this.apiService
          .triggerApiRequest<
            BaseResponse<MeterStatusDto>
          >(`${EndPoint.METERS_STATISTICS}/${districtId}` as EndPoint, HttpVerb.GET, { districtId })
          .pipe(
            map(response => {
              const meterStructure = {
                stats: [
                  { key: 'onCustomer' as const, label: 'On Customer', color: '#A84E4E' },
                  { key: 'onAgent' as const, label: 'On Agent', color: '#C7A6A6' },
                  { key: 'onStock' as const, label: 'In Stock', color: '#6C1414' },
                ],
              };

              return {
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
            })
          )
      )
    );

    this.retiredMeters$ = this.districtSubject.pipe(
      switchMap(districtId =>
        this.apiService
          .triggerApiRequest<
            BaseResponse<RetiredMeterStatusDto>
          >(`${EndPoint.RETIRED_METER_STATISTICS}/${districtId}` as EndPoint, HttpVerb.GET, { districtId })
          .pipe(
            map(response => {
              const retiredMeterStructure = {
                stats: [
                  { key: 'receivedCount' as const, label: 'Received', color: '#303f9f' },
                  { key: 'notReceivedCount' as const, label: 'Not Received', color: '#7986cb' },
                ],
              };

              return {
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
            })
          )
      )
    );
  }
}
