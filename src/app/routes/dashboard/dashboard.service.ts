import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPoint, HttpVerb } from '@shared/enums';
import { ApiService } from '@shared/services/api.service';
import { BaseResponse } from '@shared/interfaces/base-response';
import {
  ContractorOperationData,
  MeterStatusDto,
  RetiredMeterStatusDto,
} from '@shared/interfaces/dashboard';
import { environment } from '@env/environment';

@Injectable()
export class DashboardService {
  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  getContractorsOperations(
    districtId: string = '0'
  ): Observable<BaseResponse<ContractorOperationData[]>> {
    const url = districtId
      ? `${environment.ApiUrl}/contractors/operations/statistics/?districtId=${districtId}`
      : `${environment.ApiUrl}/contractors/operations/statistics/`;

    return this.http.get<BaseResponse<ContractorOperationData[]>>(url);
  }
}
