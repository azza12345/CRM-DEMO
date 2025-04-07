import { Component, inject } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { AdaptiveTableComponent } from '@shared/components/adaptive-table/adaptive-table.component';
import { FilterComponent } from '@shared/components/filter/filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  styleUrl: './audits.component.scss',
})
export class AuditsComponent {
  filters: any = {};
  endpoint: EndPoint = EndPoint.GET_AUDITS;
  httpVerb: HttpVerb = HttpVerb.GET;

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
    { header: 'Aduit Type', field: 'auditType' },
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
  ];

  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
}
