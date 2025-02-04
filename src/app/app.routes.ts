import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { Error403Component } from './routes/sessions/403.component';
import { Error404Component } from './routes/sessions/404.component';
import { Error500Component } from './routes/sessions/500.component';
import { LoginComponent } from './routes/sessions/login/login.component';
import { RegisterComponent } from './routes/sessions/register/register.component';
export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'contractors',
        loadComponent: () =>
          import('./routes/contractors/contractors.component').then(c => c.ContractorsComponent),
      },
      {
        path: 'profile',
        loadChildren: () => import('./routes/profile/profile.routes').then(c => c.routes),
      },
      {
        path: 'retired-meters',
        loadComponent: () =>
          import('./routes/retired-meters/retired-meters.component').then(
            c => c.RetiredMetersComponent
          ),
      },
      {
        path: 'installation',
        loadComponent: () =>
          import('./routes/installations/installations.component').then(
            c => c.InstallationsComponent
          ),
      },
      {
        path: 'meter-operations',
        loadComponent: () =>
          import('./routes/meter-operations/meter-operations.component').then(
            c => c.MeterOperationsComponent
          ),
      },
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
