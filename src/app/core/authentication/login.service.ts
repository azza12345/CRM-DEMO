import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { admin, Menu } from '@core';
import { Token } from './interface';
import { of } from 'rxjs';
import { environment } from '@env/environment';
import { EncodingService } from '@shared/services/encoding.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    protected http: HttpClient,
    private _encodingService: EncodingService
  ) {}

  login(userName: string, password: string) {
    // password = this._encodingService.encryptPassword(password) as string;

    return this.http
      .post<Token>(`${environment.ApiUrl}/dashboard/login`, {
        userName,
        password,
      })
      .pipe(map((response: any) => response.data.accessToken));
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    //TODO
    // gonna be fixed when api is ready
    // return this.http.post<any>('/auth/logout', {});
    return of(true);
  }

  me() {
    return of(admin);
  }

  menu() {
    return this.http
      .get<{ menu: Menu[] }>('assets/data/menu.json?_t=' + Date.now())
      .pipe(map(res => res.menu));
  }
}
