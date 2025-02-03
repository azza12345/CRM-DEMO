import { Component } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Agent } from '@shared/interfaces/agent.model';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [FilterComponent, AdaptiveTableComponent, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent {
  filters: any = {};
  columns: MtxGridColumn<Agent>[] = [
    { header: 'Code', field: 'code', sortable: true },
    { header: 'AMC Username', field: 'amcUsername', sortable: true },
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email' },
    { header: 'Ghana Card', field: 'ghanaCard' },
    { header: 'Phone', field: 'phone' },
  ];
  filterControls: FilterControl[] = [
    {
      formControlName: 'search',
      label: 'Search',
      type: 'text',
    },
  ];
  //FIXME: gonna be changed when API is Ready
  endpoint: EndPoint = EndPoint.MOCK_AGENTS;
  httpVerb: HttpVerb = HttpVerb.GET;

  constructor() {}

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
}
