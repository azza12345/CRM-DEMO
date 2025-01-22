import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPoint, HttpVerb } from '@shared/enums';
import { ApiService } from '@shared/services/api.service';
import { MeterStatResponse } from '@shared/interfaces/MeterStatsResponse.model';
import { RetiredMeterStatResponse } from '@shared/interfaces/RetiredMeterStatsResponse.model';

@Injectable()
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getMetersData(districtId: number): Observable<MeterStatResponse> {
    const endpoint = `${EndPoint.METERS_STATISTICS}/${districtId}` as EndPoint;
    return this.apiService.triggerApiRequest<MeterStatResponse>(endpoint, HttpVerb.GET);
  }

  getRetiredMetersData(districtId: number): Observable<RetiredMeterStatResponse> {
    const endpoint = `${EndPoint.RETIRED_METER_STATISTICS}/${districtId}` as EndPoint;
    return this.apiService.triggerApiRequest<RetiredMeterStatResponse>(endpoint, HttpVerb.GET);
  }
}
