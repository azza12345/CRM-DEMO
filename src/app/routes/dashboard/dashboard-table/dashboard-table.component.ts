import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { EndPoint } from '@shared/enums';
import { DashboardService } from '../dashboard.service';
import { CommonModule } from '@angular/common';
import { ContractorOperationData } from '@shared/interfaces/dashboard';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, FilterComponent, MatPaginatorModule],
  templateUrl: './dashboard-table.component.html',
  styleUrl: './dashboard-table.component.scss',
})
export class DashboardTableComponent implements OnInit, OnChanges, AfterViewInit {
  dataSource = new MatTableDataSource<ContractorOperationData>();
  displayedColumns: string[] = [
    'contractorName',
    'onAssignCount',
    'onAgentCount',
    'onCustomerCount',
    'totalCustomerReplacement',
    'totalRetireReceived',
    'totalRetireNotReceived',
  ];

  filterControls: FilterControl[] = [
    {
      formControlName: 'agent',
      label: 'Agent',
      type: 'select',
      apiEndpoint: EndPoint.AGENTS_LIST,
      optionLabel: 'name',
      optionVal: 'id',
    },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() districtId: number = 0;

  constructor(private dashboardService: DashboardService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.districtId) {
      this.applyFilter(changes.districtId.currentValue);
    }
  }

  ngOnInit(): void {
    this.dashboardService.getContractorsOperations().subscribe(
      response => {
        this.dataSource.data = response.data;
      },
      err => {}
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: any): void {
    // const agentId = filterValue.agent || '';
    this.dashboardService.getContractorsOperations(filterValue).subscribe(
      response => {
        this.dataSource.data = response.data;
      },
      err => {}
    );
  }
}
