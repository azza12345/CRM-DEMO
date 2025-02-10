import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { EndPoint } from '@shared/enums';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [DatePipe, FilterComponent],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
  @Output() districtChanged = new EventEmitter<number>();
  currentDate = new Date();
  filterControls: FilterControl[] = [
    {
      formControlName: 'district',
      label: 'District',
      type: 'select',
      apiEndpoint: EndPoint.DISTRICTS,
      /*isFirstValueDynamic: true,*/
    },
  ];

  onFilterChanged(filterValues: any): void {
    const selectedDistrict = filterValues.district;
    this.districtChanged.emit(selectedDistrict);
  }
}
