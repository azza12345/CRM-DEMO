import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
import { MatInputModule } from '@angular/material/input';
import { environment } from '@env/environment';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ListActionsComponent } from '../../shared/components/list-actions/list-actions.component';
import { MatMenuModule } from '@angular/material/menu';
import { getFileExtension, getMimeType } from '@shared/utils/file-utils';

@Component({
  selector: 'app-contractors',
  standalone: true,
  templateUrl: './contractors.component.html',
  styleUrls: ['./contractors.component.scss'],
  imports: [
    FormsModule,
    AdaptiveTableComponent,
    FilterComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    PageHeaderComponent,
    ListActionsComponent,
    MatMenuModule,
  ],
})
export class ContractorsComponent {
  filterVisible = false;
  toggleFilter() {
    this.filterVisible = !this.filterVisible;
  }
  private router = inject(Router);
  //TODO
  // not recommended to inject the httpClient inside the component
  private http = inject(HttpClient);

  filters: any = {};
  selectedFormat: string | null = null;

  endpoint: EndPoint = EndPoint.GET_Contractors_BY_DISTRICT_ID;
  httpVerb: HttpVerb = HttpVerb.GET;

  // TODO
  // preferred using of enum or method in a utility class of function
  // to avoid duplication (DRY Principle)
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

    const apiUrl = `${environment.ApiUrl}/${EndPoint.EXPORT_CONTRACTORS}?fileType=${fileType}&name=${encodeURIComponent(name)}&districtId=${districtId}`;
    //TODO
    /*
    1- not recommended to use the httpClient inside the component
    2- use generic api service instead.
    3- use take until destroyed
    */
    this.http
      .get(apiUrl, {
        responseType: 'blob',
        observe: 'response',
      })
      .subscribe({
        next: response => {
          const contentDisposition = response.headers.get('content-disposition');
          const extension = getFileExtension(fileType);
          let filename = `contractors_${new Date().toISOString().slice(0, 10)}.${extension}`;

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
            }
          }

          const blob = new Blob([response.body!], {
            type: response.headers.get('content-type') || getMimeType(fileType),
          });

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();

          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
        },
        error: err => {
          console.error('Export failed:', err);
        },
      });
  }

  selectExportFormat(format: string): void {
    this.selectedFormat = format;
    this.exportContractors();
  }
}
