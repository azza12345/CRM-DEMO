import { Routes } from '@angular/router';
import { ContractorsComponent } from './contractors.component';

export const routes: Routes = [
  { path: '', component: ContractorsComponent },
  {
    path: 'agents/:id',
    loadComponent: () => import('./agents/agents.component').then(c => c.AgentsComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-edit-contractor/add-edit-contractor.component').then(
        c => c.AddEditContractorComponent
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./add-edit-contractor/add-edit-contractor.component').then(
        c => c.AddEditContractorComponent
      ),
  },
];
