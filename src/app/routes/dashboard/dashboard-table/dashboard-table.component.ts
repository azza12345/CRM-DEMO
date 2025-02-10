import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { AgentOperationData } from '@shared/interfaces/dashboard';
import { EndPoint } from '@shared/enums';
import { DashboardService } from '../dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, FilterComponent, MatPaginatorModule],
  templateUrl: './dashboard-table.component.html',
  styleUrl: './dashboard-table.component.scss',
})
export class DashboardTableComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<AgentOperationData>();
  displayedColumns: string[] = [
    'agentName',
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
      // initialValue: 'Contractor1',
      // isFirstValueDynamic: true,
    },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getAgentsOperations().subscribe(
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
    const agentId = filterValue.agent || '';
    this.dashboardService.getAgentsOperations(agentId).subscribe(
      response => {
        this.dataSource.data = response.data;
      },
      err => {}
    );
  }
}
