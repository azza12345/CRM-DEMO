import { Component } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { AdaptiveTableComponent } from '@shared/components/adaptive-table/adaptive-table.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { ApiService } from '@shared/services/api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '@env/environment';

@Component({
  selector: 'app-audits',
  standalone: true,
  imports: [
    AdaptiveTableComponent,
    FilterComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss'],
  providers: [DatePipe],
})
export class AuditsComponent {
  filters: any = {};
  endpoint: EndPoint = EndPoint.GET_AUDITS;
  httpVerb: HttpVerb = HttpVerb.GET;

  exportFormats = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'excel' },
    { label: 'CSV', value: 'csv' },
  ];

  selectedExportFormat: string | null = null;

  constructor(
    private datePipe: DatePipe,
    private apiService: ApiService
  ) {}

  columns: MtxGridColumn[] = [
    { header: 'Description', field: 'description' },
    { header: 'Table Name', field: 'tableName' },
    { header: 'Field', field: 'field' },
    { header: 'Old Value', field: 'oldValue' },
    { header: 'New Value', field: 'newValue' },
    { header: 'Operation', field: 'operation' },
    { header: 'IP Address', field: 'ipAddress' },
    { header: 'Record Id', field: 'recordId' },
    { header: 'UserId', field: 'userId' },
    { header: 'User', field: 'user' },
    { header: 'Audit Type', field: 'auditType' },
    { header: 'Device Id', field: 'deviceId' },
    { header: 'Machine Name', field: 'machineName' },
    { header: 'Creation Date', field: 'creationDate' },
  ];

  filterControls: FilterControl[] = [
    {
      formControlName: 'startDate',
      label: 'Start Date',
      type: 'date',
    },
    {
      formControlName: 'endDate',
      label: 'End Date',
      type: 'date',
    },
    {
      formControlName: 'userSearch',
      label: 'User',
      type: 'autocomplete',
      isFirstValueDynamic: true,
      apiEndpoint: EndPoint.Get_USERS,
    },
  ];

  onFilterChanged(filterValues: any): void {
    const startDateValid =
      filterValues.startDate && !isNaN(new Date(filterValues.startDate).getTime());
    const endDateValid = filterValues.endDate && !isNaN(new Date(filterValues.endDate).getTime());

    const transformedFilters: any = { ...filterValues };

    if (transformedFilters.userSearch) {
      transformedFilters.userId = transformedFilters.userSearch;
      delete transformedFilters.userSearch;
    }

    if (startDateValid && endDateValid) {
      transformedFilters.startDate = this.datePipe.transform(
        filterValues.startDate,
        'yyyy-MM-ddTHH:mm:ss'
      );
      transformedFilters.endDate = this.datePipe.transform(
        filterValues.endDate,
        'yyyy-MM-ddTHH:mm:ss'
      );
    }

    this.filters = transformedFilters;
  }

  exportData(): void {
    if (this.selectedExportFormat) {
      this.export(this.selectedExportFormat);
    }
  }

  export(format: string): void {
    const queryParams = new URLSearchParams({
      ...this.filters,
      export: format,
    });

    const url = `${environment.ApiUrl}/${EndPoint.GET_AUDITS}?${queryParams.toString()}`;
    window.open(url, '_blank');
  }
}
