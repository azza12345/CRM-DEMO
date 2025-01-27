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
export class AgentsComponent implements OnInit {
  filters: any = {};
  columns: MtxGridColumn[] = [
    // { header: 'Code', field: 'code', sortable: true },
    { header: 'Name', field: 'fullName', sortable: true },
    { header: 'NationalId', field: 'nationalID', sortable: true },
    { header: 'Office Address', field: 'officeAddress' },
    { header: 'Ghana Post Address', field: 'postalAddress' },
    { header: 'Contact Person', field: 'email' },
    { header: 'Phone', field: 'mobile' },
    //{ header: 'District', field: 'district', sortable: true },
  ];
  filterControls: FilterControl[] = [
    {
      formControlName: 'district',
      label: 'District',
      type: 'select',
      apiEndpoint: EndPoint.DISTRICTS_LIST,
      optionLabel: 'name',
      optionVal: 'id',
    },
    {
      formControlName: 'search',
      label: 'Search',
      type: 'text',
    },
  ];
  endpoint: EndPoint = EndPoint.GET_AGENTS_BY_DISTRICT_ID;
  httpVerb: HttpVerb = HttpVerb.GET;

  constructor() {}

  ngOnInit(): void {}

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
}
