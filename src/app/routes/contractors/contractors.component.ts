import { Component, OnInit } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { ApiService } from '@shared/services/api.service';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { FilterComponent } from '../../shared/components/filter/filter.component';

@Component({
  selector: 'app-contractors',
  standalone: true,
  imports: [AdaptiveTableComponent, FilterComponent],
  templateUrl: './contractors.component.html',
  styleUrl: './contractors.component.scss',
})
export class ContractorsComponent implements OnInit {
  filters: any = {};
  columns: MtxGridColumn[] = [
    { header: 'Code', field: 'code', sortable: true },
    { header: 'Name', field: 'name', sortable: true },
    { header: 'Office Address', field: 'officeAddress' },
    { header: 'Post Address', field: 'postAddress' },
    { header: 'Contact Person', field: 'contactPerson' },
    { header: 'Phone', field: 'phone' },
    { header: 'District', field: 'district', sortable: true },
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
    {
      formControlName: 'search',
      label: 'Search',
      type: 'text',
    },
  ];
  endpoint: EndPoint = EndPoint.MOCK_CONTRACTORS;
  httpVerb: HttpVerb = HttpVerb.GET;

  constructor() {}

  ngOnInit(): void {}

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
}
