import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdaptiveDialogComponent } from '@shared/components/adaptive-dialog/adaptive-dialog.component';
import { ApiService } from '@shared/services/api.service';
import { delay, of, Subscription, switchMap } from 'rxjs';
import { BaseResponse } from '@shared/interfaces/base-response';
import { Contractor } from '@shared/interfaces/contractor.model';
import { Installment } from '@shared/interfaces/installment.model';
import { MeterDetailsDialogComponent } from './meter-details-dialog/meter-details-dialog.component';
import { BaseMeter } from '@shared/interfaces/meter-info.model';

@Component({
  selector: 'app-installations',
  standalone: true,
  imports: [FilterComponent, AdaptiveTableComponent, MatDialogModule],
  templateUrl: './installations.component.html',
  styleUrl: './installations.component.scss',
})
export class InstallationsComponent implements OnInit, OnDestroy {
  filters: any = {};
  columns: MtxGridColumn<Installment>[] = [
    { header: 'Meter Serial', field: 'meterSerial', sortable: true },
    { header: 'Status', field: 'status', sortable: true },
    { header: 'Assigned To', field: 'agentName', sortable: true },
    {
      header: 'Actions',
      field: 'action' as keyof Installment,
      width: '180px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'View',
          icon: 'visibility',
          tooltip: 'View Details',
          //FIXME: gonna be changed based on API
          click: (rowData: Installment) => this.openViewDetailsDialog(rowData.meterId),
        },
        {
          type: 'icon',
          text: 'Assign to a Contractor',
          icon: 'person_add',
          tooltip: 'Assign to a Contractor',
          click: (rowData: Installment) => this.openAssignDialog(rowData),
        },
      ],
    },
  ];
  filterControls: FilterControl[] = [
    {
      formControlName: 'district',
      label: 'District',
      type: 'select',
      apiEndpoint: EndPoint.DISTRICTS_LIST,
      // isFirstValueDynamic: true,
      optionLabel: 'name',
      optionVal: 'id',
    },
    {
      formControlName: 'MeterSerial',
      label: 'MeterSerial',
      type: 'text',
      optionLabel: 'MeterSerial',
      optionVal: 'meterSerial',
    },
  ];
  endpoint: EndPoint = EndPoint.INSTALLATIONS;
  httpVerb: HttpVerb = HttpVerb.GET;
  contractors: Contractor[] = [];
  private contractorsSubscription!: Subscription;
  private meterDetailsSub!: Subscription;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadContractors();
  }

  ngOnDestroy(): void {
    if (this.contractorsSubscription) {
      this.contractorsSubscription.unsubscribe();
    }
    if (this.meterDetailsSub) {
      this.meterDetailsSub.unsubscribe();
    }
  }

  private loadContractors(): void {
    this.contractorsSubscription = this.apiService
      .triggerApiRequest<BaseResponse<Contractor[]>>(EndPoint.AGENTS_LIST, HttpVerb.GET)
      .subscribe({
        next: res => {
          this.contractors = res.data;
        },
      });
  }
  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
  openAssignDialog(rowData: any): void {
    const dialogRef = this.dialog.open<AdaptiveDialogComponent>(AdaptiveDialogComponent, {
      width: '400px',
      data: {
        mode: 'form',
        title: 'Assign Contractor',
        fields: [
          {
            label: 'Contractor',
            formControlName: 'contractor',
            type: 'select',
            options: this.contractors,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.assignToContractor(rowData, result.contractor);
      }
    });
  }

  //FIXME: gonna be changed based on API
  openViewDetailsDialog(meterId: number): void {
    this.apiService
      .triggerApiRequest<BaseResponse<{ oldMeter: BaseMeter; newMeter: BaseMeter }>>(
        EndPoint.INSTALLED_METERS_DETAILS,
        HttpVerb.GET,
        { meterId }
      )
      .pipe(
        switchMap(response => {
          const { oldMeter, newMeter } = response.data;
          return of({ oldMeter, newMeter });
        })
      )
      .subscribe({
        next: ({ oldMeter, newMeter }) => {
          const showTabs = !!oldMeter.id;

          this.dialog.open<MeterDetailsDialogComponent>(MeterDetailsDialogComponent, {
            width: '744px',
            data: {
              title: 'Meter Information',
              showTabs,
              oldMeter,
              newMeter,
            },
          });
        },
      });
  }

  // TODO
  assignToContractor(rowData: any, contractorId: number): void {}
}
