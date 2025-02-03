import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Agent } from '@shared/interfaces/agent.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [FilterComponent, AdaptiveTableComponent, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  contractorId!: string;
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
}
