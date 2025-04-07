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

@Component({
  selector: 'app-audits',
  standalone: true,
  imports: [
    AdaptiveTableComponent,
    FilterComponent,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss'],
  providers: [DatePipe],
})
export class AuditsComponent {
  filters: any = {};
  endpoint: EndPoint = EndPoint.GET_AUDITS;
  httpVerb: HttpVerb = HttpVerb.GET;

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

    if (startDateValid && endDateValid) {
      const formattedStartDate = this.datePipe.transform(
        filterValues.startDate,
        'yyyy-MM-ddTHH:mm:ss'
      );
      const formattedEndDate = this.datePipe.transform(filterValues.endDate, 'yyyy-MM-ddTHH:mm:ss');

      this.filters = {
        ...filterValues,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
    } else {
      this.filters = filterValues;
    }
  }
}
