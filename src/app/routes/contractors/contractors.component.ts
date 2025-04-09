import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { Contractor } from '@shared/interfaces/contractor.model';
import { AdaptiveTableComponent } from '@shared/components/adaptive-table/adaptive-table.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-contractors',
  standalone: true,
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.scss'],
  imports: [
    RouterLink,
    FormsModule,
    AdaptiveTableComponent,
    FilterComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
})
export class ContractorsComponent {
  private router = inject(Router);
  private http = inject(HttpClient);

  filters: any = {};
  selectedFormat: string | null = null;

  endpoint: EndPoint = EndPoint.GET_Contractors_BY_DISTRICT_ID;
  httpVerb: HttpVerb = HttpVerb.GET;

  fileFormats = [
    { label: 'Excel', value: 'excel' },
    { label: 'CSV', value: 'csv' },
    { label: 'PDF', value: 'pdf' },
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
    },
  ];

  columns: MtxGridColumn[] = [
    { header: 'Code', field: 'code', sortable: true },
    { header: 'Name', field: 'name', sortable: true },
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
          icon: 'visibility',
          tooltip: 'Show Agents',
          click: (row: Contractor) => this.viewAgents(row.id!),
        },
        {
          type: 'icon',
          icon: 'edit',
          tooltip: 'Edit Contractor',
          click: (row: Contractor) => this.editContractor(row.id!),
        },
      ],
    },
  ];

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }

  viewAgents(contractorId: number): void {
    this.router.navigate([`contractors/${contractorId}/agents`]);
  }

  editContractor(contractorId: number): void {
    this.router.navigate([`contractors/edit/${contractorId}`]);
  }

  exportContractors(): void {
    if (!this.selectedFormat) return;

    const name = this.filters?.Name ?? '';
    const districtId = this.filters?.districtID ?? '';
    const fileType = this.selectedFormat;

    const params = new HttpParams()
      .set('name', name)
      .set('districtId', districtId)
      .set('fileType', fileType);

    this.http
      .get('api/contractors/export', {
        params,
        responseType: 'blob',
      })
      .subscribe((response: Blob) => {
        const blob = new Blob([response]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contractors.${fileType}`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
