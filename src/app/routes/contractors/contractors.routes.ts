import { Routes } from '@angular/router';
import { ContractorsComponent } from './contractors.component';

export const routes: Routes = [
  { path: '', component: ContractorsComponent },

  {
    path: ':contractorId/agents',
    loadComponent: () => import('./agents/agents.component').then(m => m.AgentsComponent),
  },
];
