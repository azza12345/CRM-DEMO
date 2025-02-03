import { Routes } from '@angular/router';
import { ContractorsComponent } from './contractors.component';

export const routes: Routes = [
  { path: '', component: ContractorsComponent },
  {
    path: 'agents/:id',
    loadComponent: () => import('./agents/agents.component').then(c => c.AgentsComponent),
  },
];
