import { Component } from '@angular/core';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-retired-meters',
  standalone: true,
  imports: [FilterComponent, AdaptiveTableComponent],
  templateUrl: './retired-meters.component.html',
  styleUrl: './retired-meters.component.scss',
})
export class RetiredMetersComponent {
  filters: any = {};
  columns: MtxGridColumn[] = [
    { header: 'Meter Serial', field: 'meterSerial', sortable: true },
    { header: 'Status', field: 'status', sortable: true },
    { header: 'Retired By', field: 'agentName', sortable: true },
    { header: 'Is Received', field: 'isReceived', sortable: true },
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
}
