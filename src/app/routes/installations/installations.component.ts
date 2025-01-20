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
    { header: 'Assigned To', field: 'agentId', sortable: true },
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
      options: [
        { value: '1', label: 'District 1' },
        { value: '2', label: 'District 2' },
      ],
    },
    {
      formControlName: 'search',
      label: 'Search',
      type: 'text',
    },
  ];
  endpoint: EndPoint = EndPoint.INSTALLATIONS;
  httpVerb: HttpVerb = HttpVerb.GET;
  contractors: any[] = [];

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadContractors();
  }

  loadContractors(): void {
    this.apiService.triggerApiRequest<any[]>(EndPoint.CONTRACTORS, HttpVerb.GET).subscribe({
      next: data => {
        this.contractors = data;
      },
      error: err => {
        console.error('Failed to load contractors:', err);
      },
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
            options: this.contractors,
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

  assignToContractor(rowData: any, contractorId: number): void {
    console.log(`Assigning contractor ${contractorId} to row ${JSON.stringify(rowData)}`);
  }
}
