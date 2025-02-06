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
import { InstalledMeterInfo, OldMeterInfo } from '@shared/interfaces/meter-info.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MeterDetailsDialogComponent } from './meter-details-dialog/meter-details-dialog.component';

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
          click: (rowData: Installment) => this.openViewDetailsDialog(1),
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
    this.meterDetailsSub = this.apiService
      .triggerApiRequest<{
        status: string;
        oldMeter: OldMeterInfo | null;
        newMeter: InstalledMeterInfo;
      }>(EndPoint.INSTALLED_METERS_DETAILS, HttpVerb.GET, { id: meterId })
      .pipe(
        switchMap(response => {
          //mock puproses
          if (!response.newMeter) {
            return of(this.getMockMeterData(meterId)).pipe(delay(500));
          }
          return of(response);
        })
      )
      .subscribe({
        next: response => {
          const showTabs = response.status === 'old' && response.oldMeter !== null;

          this.dialog.open<MeterDetailsDialogComponent>(MeterDetailsDialogComponent, {
            width: '744px',
            data: {
              title: 'Meter Information',
              showTabs,
              oldMeter: response.oldMeter,
              newMeter: response.newMeter,
            },
          });
        },
      });
  }

  private getMockMeterData(meterId: number) {
    return {
      // mock data from ai
      status: 'old',
      oldMeter: {
        meterSerial: `OM-${meterId}`,
        finalReading: 12345.67,
        replacementReason: 'Faulty display',
        manufactureYear: 2015,
        finalBalance: 50.75,
        meterDisplay: 'LCD',
        meterType: '3.5 Inch Meter Type 1',
        meterMake: 'Sewedy Meters',
        meterImage: 'assets/mock/old-meter.png',
        items: [
          { name: 'Cable', quantity: 15 },
          { name: 'Key Switch', quantity: 10 },
        ],
      },
      newMeter: {
        installationType: 'Replace Meter',
        installationDate: '24-12-2024',
        meterModel: '11516sasdsA',
        location: 'Accra, Ghana',
        meterType: '3.5 Inch Meter Type 2',
        meterMake: 'Sewedy Meters',
        meterImage: 'assets/mock/new-meter.jpg',
        items: [
          { name: 'Screw', quantity: 20 },
          { name: 'Hard Cable', quantity: 12 },
        ],
      },
    };
  }

  // TODO
  assignToContractor(rowData: any, contractorId: number): void {}
}
