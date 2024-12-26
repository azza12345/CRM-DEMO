import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { FilterComponent } from '../../../shared/components/filter/filter.component';

export interface ContractorData {
  contractorName: string;
  installation: {
    assign: number;
    onAgent: number;
    onCustomer: number;
  };
  replacement: {
    total: number;
    received: number;
    notReceived: number;
  };
}

const MOCK_DATA: ContractorData[] = [
  {
    contractorName: 'Contractor1',
    installation: { assign: 25, onAgent: 25, onCustomer: 25 },
    replacement: { total: 25, received: 25, notReceived: 25 },
  },
  {
    contractorName: 'Contractor2',
    installation: { assign: 26, onAgent: 26, onCustomer: 26 },
    replacement: { total: 26, received: 26, notReceived: 26 },
  },
  {
    contractorName: 'Contractor3',
    installation: { assign: 29, onAgent: 29, onCustomer: 29 },
    replacement: { total: 29, received: 29, notReceived: 29 },
  },
  {
    contractorName: 'Contractor4',
    installation: { assign: 54, onAgent: 54, onCustomer: 54 },
    replacement: { total: 54, received: 54, notReceived: 54 },
  },
  {
    contractorName: 'Contractor5',
    installation: { assign: 98, onAgent: 98, onCustomer: 98 },
    replacement: { total: 98, received: 98, notReceived: 98 },
  },
];

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [MatTableModule, FilterComponent, MatPaginatorModule],
  templateUrl: './dashboard-table.component.html',
  styleUrl: './dashboard-table.component.scss',
})
export class DashboardTableComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<ContractorData>(MOCK_DATA);
  displayedColumns: string[] = [
    'contractorName',
    'assign',
    'onAgent',
    'onCustomer',
    'total',
    'received',
    'notReceived',
  ];

  filterControls: FilterControl[] = [
    {
      formControlName: 'contractor',
      label: 'Contractor',
      type: 'select',
      options: MOCK_DATA.map(item => ({
        value: item.contractorName,
        label: item.contractorName,
      })),
      initialValue: 'Contractor1',
    },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: any) {
    const filteredData = MOCK_DATA.filter(item => item.contractorName === filterValue.contractor);
    this.dataSource.data = filteredData.length ? filteredData : MOCK_DATA;
  }
}
