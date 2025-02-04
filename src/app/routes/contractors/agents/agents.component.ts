import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Agent } from '@shared/interfaces/agent.model';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [
    FilterComponent,
    AdaptiveTableComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatTooltipModule,
  ],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  contractorId!: string;
  filters: any = {};

  rowClassFormatter: MtxGridRowClassFormatter = {
    'disabled-state': (data, index) => data.state === 'disabled',
  };
  columns: MtxGridColumn<Agent>[] = [
    { header: 'Code', field: 'code', sortable: true },
    { header: 'AMC Username', field: 'amcUsername', sortable: true },
    { header: 'Name', field: 'name', sortable: true },
    { header: 'Email', field: 'email', sortable: true },
    { header: 'Ghana Card', field: 'ghanaCard' },
    { header: 'Phone', field: 'phone' },
    {
      header: 'State',
      field: 'state',
      class: data => {
        return data?.state === 'enabled' ? 'text-success' : '';
      },
      sortable: true,
      formatter: (rowData: Agent) => (rowData.state === 'enabled' ? ' Enabled' : 'Disabled'),
    },
    { header: 'Actions', field: 'actions' as keyof Agent },
  ];
  filterControls: FilterControl[] = [
    {
      formControlName: 'search',
      label: 'Search',
      type: 'text',
    },
  ];
  private routeSub!: Subscription;

  //FIXME: gonna be changed when API is Ready
  endpoint!: EndPoint;
  httpVerb: HttpVerb = HttpVerb.GET;

  constructor() {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.contractorId = params.get('id')!;
      if (this.contractorId) {
        //this sould be like this
        // this.endpoint = `${EndPoint.MOCK_AGENTS}/${this.contractorId}` as EndPoint;
        // but deleted for demo purposes
        this.endpoint = `${EndPoint.MOCK_AGENTS}` as EndPoint;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }

  viewDetails(agent: Agent): void {
    alert(`Viewing details for ${agent.name}`);
  }
  toggleAgentState(agent: Agent): void {
    if (agent.state === 'enabled') {
      if (confirm(`Are you sure you want to disable ${agent.name}?`)) {
        agent.state = 'disabled';
        alert(`${agent.name} has been disabled.`);
      }
    } else {
      if (confirm(`Are you sure you want to enable ${agent.name}?`)) {
        agent.state = 'enabled';
        alert(`${agent.name} has been enabled.`);
      }
    }
  }

  editAgent(agent: Agent): void {
    alert(`Editing ${agent.name}`);
  }
}
