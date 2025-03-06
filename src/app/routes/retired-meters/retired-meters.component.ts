import { Component } from '@angular/core';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { RetiredMeter } from '@shared/interfaces/retired-meter.model';

@Component({
  selector: 'app-retired-meters',
  standalone: true,
  imports: [FilterComponent, AdaptiveTableComponent],
  templateUrl: './retired-meters.component.html',
  styleUrl: './retired-meters.component.scss',
})
export class RetiredMetersComponent {
  filters: any = {};
  columns: MtxGridColumn<RetiredMeter>[] = [
    { header: 'Meter Serial', field: 'meterSerial', sortable: true },
    { header: 'Status', field: 'status', sortable: true },
    { header: 'Meter model', field: 'meterModel', sortable: true },
    { header: 'Meter type', field: 'meterType', sortable: true },
    { header: 'Meter make', field: 'meterMake', sortable: true },
    { header: 'Retired By', field: 'agentName', sortable: true },
    // { header: 'Is Received', field: 'isReceived', sortable: true },
    // { header: 'old Meter Serial', field: 'oldMeterSerial', sortable: true },
  ];
  filterControls: FilterControl[] = [
    {
      formControlName: 'districtID',
      label: 'District',
      type: 'select',
      apiEndpoint: EndPoint.DISTRICTS_LIST,
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
  endpoint: EndPoint = EndPoint.RETIRED_METERS;
  httpVerb: HttpVerb = HttpVerb.GET;

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
}
