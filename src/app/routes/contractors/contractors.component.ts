import { Component, inject } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { Contractor } from '@shared/interfaces/contractor.model';

@Component({
  selector: 'app-contractors',
  standalone: true,
  imports: [
    AdaptiveTableComponent,
    FilterComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './contractors.component.html',
  styleUrl: './contractors.component.scss',
})
export class ContractorsComponent {
  private router = inject(Router);
  filters: any = {};
  columns: MtxGridColumn[] = [
    { header: 'Code', field: 'code', sortable: true },
    { header: 'Name', field: 'name', sortable: true },
    //{ header: 'NationalId', field: 'nationalID', sortable: true },
    { header: 'Office Address', field: 'officeAddress' },
    { header: 'Ghana Post Address', field: 'postalAddress' },
    { header: 'Contact Person', field: 'contactPersonName' },
    { header: 'Phone', field: 'phone' },
    {
      header: 'Actions',
      field: 'action',
      width: '150px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'View',
          icon: 'visibility',
          tooltip: 'Show Agents',
          click: (rowData: Contractor) => this.viewAgents(rowData.id!),
        },
        {
          type: 'icon',
          text: 'Edit',
          icon: 'edit',
          tooltip: 'Edit Contractor',
          click: (rowData: Contractor) => this.editContractor(rowData.id!),
        },
      ],
    },

    //{ header: 'District', field: 'district', sortable: true },
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
      formControlName: 'Name',
      label: 'Search By Name',
      type: 'text',
      optionLabel: 'name',
      optionVal: 'Name',
    },
  ];
  endpoint: EndPoint = EndPoint.GET_Contractors_BY_DISTRICT_ID;
  httpVerb: HttpVerb = HttpVerb.GET;

  constructor() {}

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }

  viewAgents(contractorId: number): void {
    this.router.navigate([`contractors/${contractorId}/agents`]);
  }
  editContractor(contractorId: number): void {
    this.router.navigate([`contractors/edit/${contractorId}`]);
  }
}
