import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPoint, HttpVerb } from '@shared/enums';
import { ApiService } from '@shared/services/api.service';
import { BaseResponse } from '@shared/interfaces/base-response';
import {
  AgentOperationData,
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

  getAgentsOperations(agentId: string = ''): Observable<BaseResponse<AgentOperationData[]>> {
    return this.http.get<BaseResponse<AgentOperationData[]>>(
      `${environment.ApiUrl}/agents/operations/statistics/?agentId=${agentId}`
    );
  }
}
