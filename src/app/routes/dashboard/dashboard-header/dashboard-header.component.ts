import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { FilterControl } from '@shared/interfaces/filter-control.model';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [DatePipe, FilterComponent],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
})
export class DashboardHeaderComponent {
  currentDate = new Date();
  filterControls: FilterControl[] = [
    {
      formControlName: 'district',
      label: 'District',
      type: 'select',
      options: [
        { value: 'District 1', label: 'District 1' },
        { value: 'District 2', label: 'District 2' },
        { value: 'District 3', label: 'District 3' },
      ],
      initialValue: 'District 1',
    },
  ];

  onFilterChanged(filterValues: any): void {
    const selectedDistrict = filterValues.district;
    console.log(`Selected District is .... : ${selectedDistrict}`);
  }
}
