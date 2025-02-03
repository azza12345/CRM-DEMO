import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdaptiveDialogComponent } from '@shared/components/adaptive-dialog/adaptive-dialog.component';
import { ApiService } from '@shared/services/api.service';
import { Subscription } from 'rxjs';
import { BaseResponse } from '@shared/interfaces/base-response';
import { Contractor } from '@shared/interfaces/contractor.model';
import { Installment } from '@shared/interfaces/installment.model';

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
          click: () => alert('Not Implemented yet ..'),
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
    const dialogRef = this.dialog.open(AdaptiveDialogComponent, {
      width: '400px',
      data: {
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

  // TODO
  assignToContractor(rowData: any, contractorId: number): void {}
}
