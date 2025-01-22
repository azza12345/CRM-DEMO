import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { LookupService } from '@shared/services/lookup.service';
import { EndPoint } from '@shared/enums';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [DatePipe, FilterComponent],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent implements OnInit {
  currentDate = new Date();
  filterControls: FilterControl[] = [
    {
      formControlName: 'district',
      label: 'District',
      type: 'select',
      options: [],
      apiEndpoint: EndPoint.DISTRICTS_LIST,
      isFirstValueDynamic: true,
    },
  ];

  @Output() filterChanged = new EventEmitter<number>();

  constructor(private lookupService: LookupService) {}

  ngOnInit(): void {}

  onFilterChanged(filterValues: any): void {
    const selectedDistrict = filterValues.district;
    console.log(`Selected District is .... : ${selectedDistrict}`);

    this.filterChanged.emit(filterValues); // Emit the event with data
  }
}
