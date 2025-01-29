import { Component, OnInit } from '@angular/core';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { AdaptiveTableComponent } from '../../shared/components/adaptive-table/adaptive-table.component';
import { EndPoint, HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdaptiveDialogComponent } from '@shared/components/adaptive-dialog/adaptive-dialog.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'app-installations',
  standalone: true,
  imports: [FilterComponent, AdaptiveTableComponent, MatDialogModule],
  templateUrl: './installations.component.html',
  styleUrl: './installations.component.scss',
})
export class InstallationsComponent implements OnInit {
  filters: any = {};
  columns: MtxGridColumn[] = [
    { header: 'Meter Serial', field: 'meterSerial', sortable: true },
    { header: 'Status', field: 'status', sortable: true },
    { header: 'Assigned To', field: 'agentName', sortable: true },
    {
      header: 'Actions',
      field: 'action',
      width: '180px',
      pinned: 'right',
      right: '0px',
      type: 'button',
      buttons: [
        {
          type: 'icon',
          text: 'View',
          icon: 'visibility',
          tooltip: 'View Details',
          click: () => alert('Not Implemented yet ..'),
        },
        {
          type: 'icon',
          text: 'Assign to a Contractor',
          icon: 'person_add',
          tooltip: 'Assign to a Contractor',
          click: rowData => this.openAssignDialog(rowData),
        },
      ],
    },
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
      formControlName: 'MeterSerial',
      label: 'MeterSerial',
      type: 'text',
      optionLabel: 'MeterSerial',
      optionVal: 'meterSerial',
    },
  ];
  endpoint: EndPoint = EndPoint.INSTALLATIONS;
  httpVerb: HttpVerb = HttpVerb.GET;
  agents: any[] = [];

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.apiService.triggerApiRequest<any[]>(EndPoint.AGENTS_LIST, HttpVerb.GET).subscribe({
      next: data => {
        this.agents = data;
      },
      error: err => {},
    });
  }
  onFilterChanged(filterValues: any): void {
    this.filters = filterValues;
  }
  openAssignDialog(rowData: any): void {
    const dialogRef = this.dialog.open(AdaptiveDialogComponent, {
      width: '400px',
      data: {
        title: 'Assign Contractor',
        fields: [
          {
            label: 'Contractor',
            formControlName: 'contractor',
            type: 'select',
            options: this.agents,
          },
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.assignToContractor(rowData, result.contractor);
      }
    });
  }

  assignToContractor(rowData: any, contractorId: number): void {}
}
