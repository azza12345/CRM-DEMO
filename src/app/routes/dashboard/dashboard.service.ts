import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { MeterStatusDto, RetiredMeterStatusDto } from '@shared/interfaces/dashboard';
import { BaseResponse } from '@shared/interfaces/base-response';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const MESSAGES = [
  {
    img: 'assets/images/heros/1.jpg',
    subject: 'Hydrogen',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/2.jpg',
    subject: 'Helium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/3.jpg',
    subject: 'Lithium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/4.jpg',
    subject: 'Beryllium',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
  {
    img: 'assets/images/heros/6.jpg',
    subject: 'Boron',
    content: `Cras sit amet nibh libero, in gravida nulla.
     Nulla vel metus scelerisque ante sollicitudin commodo.`,
  },
];

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}
  getDynamicMetersData() {
    return {
      total: 1516545987,
      values: {
        onCustomer: 1000549987,
        onAgent: 400000126,
        onStock: 100156156,
      },
    };
  }

  getMeterStatusStatistics(districtID: number): Observable<BaseResponse<MeterStatusDto>> {
    return this.http.get<BaseResponse<MeterStatusDto>>(
      `${environment.ApiUrl}/meters/statistics/district/${districtID}`
    );
  }

  getDynamicRetiredMetersData() {
    return {
      total: 350545987,
      values: {
        received: 200206156,
        notReceived: 150215151,
      },
    };
  }

  getRetiredMeterStatistics(districtID: number): Observable<BaseResponse<RetiredMeterStatusDto>> {
    return this.http.get<BaseResponse<RetiredMeterStatusDto>>(
      `${environment.ApiUrl}/meters/retired/status/district/${districtID}`
    );
  }
}
