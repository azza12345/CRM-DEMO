import { Component, OnInit, OnDestroy, inject } from '@angular/core';
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
import { InstalledMeter } from '@shared/interfaces/Installed-meter.model';
import { MeterDetailsDialogComponent } from './meter-details-dialog/meter-details-dialog.component';
import { BaseMeter } from '@shared/interfaces/meter-info.model';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '@shared/services/helper.service';

@Component({
  selector: 'app-installations',
  standalone: true,
  imports: [FilterComponent, AdaptiveTableComponent, MatDialogModule],
  templateUrl: './installations.component.html',
  styleUrl: './installations.component.scss',
})
export class InstallationsComponent implements OnInit, OnDestroy {
  filters: any = {};
  sortField: string = 'meterSerial';
  sortDirection: 'asc' | 'desc' = 'asc';
  columns: MtxGridColumn<InstalledMeter>[] = [
    { header: 'Meter Serial', field: 'meterSerial', sortable: true },
    { header: 'Status', field: 'status' },
    { header: 'Meter model', field: 'meterModel' },
    { header: 'Meter type', field: 'meterType' },
    { header: 'Meter make', field: 'meterMake' },
    { header: 'Installation Date', field: 'installationDate', sortable: true },
    { header: 'Assigned To', field: 'contractorName' },
    {
      header: 'Actions',
      field: 'action' as keyof InstalledMeter,
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
          click: (rowData: InstalledMeter) =>
            this.openViewDetailsDialog(rowData.meterId, rowData.status),
        },
        {
          type: 'icon',
          text: 'Assign to a Contractor',
          icon: 'person_add',
          tooltip: 'Assign to a Contractor',
          click: (rowData: InstalledMeter) => this.openAssignDialog(rowData),
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
      optionLabel: 'meterSerial',
      optionVal: 'MeterSerial',
    },
  ];
  endpoint: EndPoint = EndPoint.INSTALLED_METERS;
  httpVerb: HttpVerb = HttpVerb.GET;
  contractors: Contractor[] = [];
  private contractorsSubscription!: Subscription;
  private meterDetailsSub!: Subscription;

  private toastr = inject(ToastrService);

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.contractorsSubscription) {
      this.contractorsSubscription.unsubscribe();
    }
    if (this.meterDetailsSub) {
      this.meterDetailsSub.unsubscribe();
    }
  }

  private async loadContractors(meterDistrictId: number): Promise<void> {
    try {
      const response = await this.apiService
        .triggerApiRequest<
          BaseResponse<Contractor[]>
        >(EndPoint.GET_Contractors_BY_DISTRICT_ID, HttpVerb.GET, { districtId: meterDistrictId })
        .toPromise(); // Convert Observable to Promise

      this.contractors = (response as BaseResponse<Contractor[]>).data;
    } catch (error) {
      console.error('Failed to load contractors:', error);
    }
  }

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }

  async openAssignDialog(rowData: InstalledMeter): Promise<void> {
    await this.loadContractors(rowData.meterDistrictId); // Ensure contractors are loaded before opening the dialog

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
  openViewDetailsDialog(meterId: number, meterStatus: string): void {
    const url = HelperService.formatEndpoint(EndPoint.INSTALLED_METERS_DETAILS, {
      meterId,
    }) as EndPoint;

    this.apiService
      .triggerApiRequest<BaseResponse<{ oldMeter: BaseMeter; newMeter: BaseMeter }>>(
        url,
        HttpVerb.GET,
        { meterId }
      )
      .pipe(
        switchMap(response => {
          console.log(response);
          if (!response?.data) {
            throw new Error('Response data is null or undefined.');
          }

          const { oldMeter, newMeter } = response.data;
          return of({ oldMeter, newMeter });
        })
      )
      .subscribe({
        next: ({ oldMeter, newMeter }) => {
          const showTabs = !!oldMeter.meterId;
          this.dialog.open<MeterDetailsDialogComponent>(MeterDetailsDialogComponent, {
            width: '744px',
            data: {
              title: 'Meter Information',
              showTabs,
              oldMeter,
              newMeter,
              meterStatus,
            },
          });
        },
      });
  }

  assignToContractor(meter: InstalledMeter, contractorId: number): void {
    const assignMeterToContractorRequest = { contractorId, meterId: meter.meterId };

    const response = this.apiService
      .triggerApiRequest<
        BaseResponse<boolean>
      >(EndPoint.ASSIGN_METER_TO_AGENT, HttpVerb.POST, null, assignMeterToContractorRequest)
      .subscribe({
        next: () => {
          this.filters = { ...this.filters };
          this.toastr.success('meter assigned to contractor successfully');
        },
        error: () => {},
      });
  }
}
