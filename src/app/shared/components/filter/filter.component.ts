import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpVerb } from '@shared/enums';
import { FilterControl } from '@shared/interfaces/filter-control.model';
import { ApiService } from '@shared/services/api.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class FilterComponent implements OnInit {
  @Input() controls: FilterControl[] = [];
  @Input() resetBtn: boolean = false;
  @Input() isPrimary: boolean = true;
  @Output() filterChanged: EventEmitter<any> = new EventEmitter<any>();

  filterForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.fetchDynamicOptions();
  }
  fetchDynamicOptions(): void {
    this.controls.forEach(control => {
      if (control.apiEndpoint) {
        this.apiService.triggerApiRequest(control.apiEndpoint, HttpVerb.GET).subscribe({
          next: (response: any) => {
            if (typeof response[0] === 'string' && Array.isArray(response)) {
              control.options = response.map(item => ({
                value: item,
                label: item,
              }));
            } else if (response?.data && Array.isArray(response.data)) {
              control.options = response.data.map((item: any) => ({
                value: item.id,
                label: item.name,
              }));
            }
            if (control.isFirstValueDynamic) {
              if (control.options && control.options.length > 0) {
                const initialValue = control.options[0].value;
                this.filterForm.get(control.formControlName)?.setValue(initialValue);
                this.filterChanged.emit(this.filterForm.value);
              }
            }
          },
          error: () => {
            console.error(`Error fetching dynamnic options form control ...`);
          },
        });
      }
    });
  }

  buildForm() {
    const formGroup: { [key: string]: any } = {};

    this.controls.forEach(control => {
      formGroup[control.formControlName] = [control.initialValue || '', control.validators || []];
    });

    this.filterForm = this.fb.group(formGroup);
  }

  onSubmit() {
    if (this.filterForm.valid) {
      this.filterChanged.emit(this.filterForm.value);
    }
  }

  resetForm() {
    this.filterForm.reset();
  }
}
