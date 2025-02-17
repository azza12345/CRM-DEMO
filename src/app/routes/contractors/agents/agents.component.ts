import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn, MtxGridRowClassFormatter } from '@ng-matero/extensions/grid';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Agent } from '@shared/interfaces/agent.model';
import { of, Subscription, switchMap, takeUntil, takeWhile } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdaptiveDialogComponent } from '@shared/components/adaptive-dialog/adaptive-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HelperService } from '@shared/services/helper.service';
import { ApiService } from '@shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BaseResponse } from '@shared/interfaces/base-response';
import { AgentDetailsDialogComponent } from './agent-details-dialog/agent-details-dialog.component';
import { Contractor } from '@shared/interfaces/contractor.model';

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
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  contractorId!: string;
  filters: any = {};
  alive = false;
  viewDetailsSub!: Subscription;
  contractorsSub!: Subscription;
  contractorName?: string;

  rowClassFormatter: MtxGridRowClassFormatter = {
    'disabled-state': (data, index) => data.state === 'disabled',
  };
  columns: MtxGridColumn<Agent>[] = [
    { header: 'Code', field: 'code', sortable: true },
    { header: 'AMC Username', field: 'userName', sortable: true },
    { header: 'Name', field: 'name', sortable: true },
    { header: 'Email', field: 'email', sortable: true },
    { header: 'Ghana Card', field: 'ghanaCard' },
    { header: 'Mobile', field: 'mobile' },
    {
      header: 'State',
      field: 'isActive',
      class: data => {
        return data?.isActive === true ? 'text-success' : '';
      },
      sortable: true,
      formatter: (rowData: Agent) => (rowData.isActive ? ' Enabled' : 'Disabled'),
    },
    { header: 'Actions', field: 'actions' as keyof Agent, width: '170px' },
  ];
  filterControls: FilterControl[] = [
    {
      formControlName: 'Name',
      label: 'Search By Name',
      type: 'text',
      optionLabel: 'name',
      optionVal: 'Name',
    },
  ];
  httpVerb: HttpVerb = HttpVerb.GET;

  constructor() {}
  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }

  private routeSub!: Subscription;

  endpoint!: EndPoint;
  url!: string;

  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.contractorId = params.get('contractorId')!;
      if (this.contractorId) {
        const url = HelperService.formatEndpoint(EndPoint.GET_AGENTS_BY_CONTRACTOR_ID, {
          contractorId: this.contractorId,
        });
        this.endpoint = url as EndPoint;
        this.fetchContractorDetails();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.viewDetailsSub) {
      this.viewDetailsSub.unsubscribe();
    }
  }

  // openViewDetailsDialog(id: number): void {
  //   this.viewDetailsSub = this.apiService
  //     .triggerApiRequest<BaseResponse<Agent>>(EndPoint.GET_AGENT_BY_ID, HttpVerb.GET, { id })
  //     .pipe(
  //       switchMap(response => {
  //         const agent: Agent = response.data;
  //         return of(agent);
  //       })
  //     )
  //     .subscribe({
  //       next: agent => {
  //         this.dialog.open<AgentDetailsDialogComponent>(AgentDetailsDialogComponent, {
  //           width: '744px',
  //           data: {
  //             title: 'Agent Details',
  //             agent,
  //           },
  //         });
  //       },
  //     });
  // }
  toggleAgentState(agent: Agent): void {
    console.log('agent activity:', agent.isActive);

    const dialogRef = this.dialog.open<AdaptiveDialogComponent>(AdaptiveDialogComponent, {
      width: '400px',
      data: {
        title: agent.isActive ? 'Disable Agent' : 'Enable Agent',
        message: `Are you sure you want to ${agent.isActive ? 'disable' : 'enable'} ${agent.name}?`,
        mode: 'confirmation',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed?: boolean) => {
      if (confirmed === true) {
        // Update agent status
        const url = HelperService.formatEndpoint(EndPoint.UPDATE_AGENT_STATUS, {
          agentId: agent.id,
        });

        (this.routeSub = this.apiService
          .triggerApiRequest(url as EndPoint, HttpVerb.PUT)
          .subscribe({
            next: () => {
              this.cdr.detectChanges();
              this.filters = { ...this.filters };
              this.toastr.success('Agent updated successfully');
            },
            error: () => {
              this.toastr.error('Failed to update agent status');
            },
          })),
          (agent.state = agent.isActive ? 'disabled' : 'enabled');
      }
    });
  }

  fetchContractorDetails(): void {
    this.contractorsSub = this.apiService
      .triggerApiRequest<
        BaseResponse<Contractor>
      >(EndPoint.GET_CONTRACTOR_BY_ID, HttpVerb.GET, { id: this.contractorId })
      .subscribe({
        next: res => {
          this.contractorName = res.data.name;
        },
      });
  }
}
