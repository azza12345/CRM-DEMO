import { Component } from '@angular/core';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';

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
    { header: 'Retired By', field: 'retiredBy', sortable: true },
    { header: 'old Meter Serial', field: 'oldMeterSerial', sortable: true },
  ];
  filterControls: FilterControl[] = [
    {
      formControlName: 'district',
      label: 'District',
      type: 'select',
      options: [
        { value: 'District 1', label: 'District 1' },
        { value: 'District 2', label: 'District 2' },
      ],
    },
  ];
  endpoint: EndPoint = EndPoint.MOCK_RETIRED_METERS;
  httpVerb: HttpVerb = HttpVerb.GET;

  constructor() {}

  ngOnInit(): void {}

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
}
