import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { LookupService } from '@shared/services/lookup.service';

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
    },
  ];

  @Output() filterChanged = new EventEmitter<number>();

  constructor(private lookupService: LookupService) {}

  ngOnInit(): void {
    this.lookupService.getDistricts().subscribe(
      response => {
        this.filterControls[0].options = [];
        this.filterControls[0].initialValue = response.data[0]?.id?.toString();
        response.data.forEach(district =>
          this.filterControls[0].options?.push({ label: district.name, value: district.id })
        );

        console.log(this.filterControls[0]);
      },
      err => {}
    );
  }

  onFilterChanged(filterValues: any): void {
    const selectedDistrict = filterValues.district;
    console.log(`Selected District is .... : ${selectedDistrict}`);

    this.filterChanged.emit(filterValues); // Emit the event with data
  }
}
