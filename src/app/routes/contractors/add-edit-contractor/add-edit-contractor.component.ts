import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EndPoint, HttpVerb } from '@shared/enums';
import { ApiService } from '@shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-contractor',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],

  templateUrl: './add-edit-contractor.component.html',
  styleUrl: './add-edit-contractor.component.scss',
})
export class AddEditContractorComponent implements OnInit {
  contractorForm!: FormGroup;
  isEditMode = false;
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  contractorId: string | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contractorId = params.get('id');
      this.isEditMode = !!this.contractorId;
      this.initializeForm();
      if (this.isEditMode) {
        this.loadContractorData(this.contractorId!);
      }
    });
  }

  private initializeForm(): void {
    this.contractorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      contactPersonName: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', Validators.required],
      ghanaPostAddress: ['', Validators.maxLength(50)],
      officeAddress: ['', Validators.maxLength(250)],
    });
    if (this.isEditMode) {
      this.contractorForm.addControl('code', this.fb.control('', Validators.required));
    }
  }

  //FIXME: Will be changed based on api response
  private loadContractorData(id: string): void {
    // this.apiService
    //   .triggerApiRequest(EndPoint.GET_CONTRACTOR_BY_ID, HttpVerb.GET, { id })
    //   .subscribe({
    //     next: contractor => {
    //       // this.contractorForm.patchValue(contractor);
    //     },
    //     error: () => {
    //       this.toastr.error('Failed to load contractor data');
    //     },
    //   });
  }

  onSubmit(): void {
    if (this.contractorForm.invalid) return;

    const formData = this.contractorForm.value;

    if (this.isEditMode) {
      this.apiService
        .triggerApiRequest(EndPoint.UPDATE_CONTRACTOR, HttpVerb.PUT, null, formData)
        .subscribe({
          next: () => {
            this.toastr.success('Contractor updated successfully');
            this.router.navigate(['/contractors']);
          },
        });
    } else {
      this.apiService
        .triggerApiRequest(EndPoint.ADD_CONTRACTOR, HttpVerb.POST, null, formData)
        .subscribe({
          next: () => {
            this.toastr.success('Contractor added successfully');
            this.router.navigate(['/contractors']);
          },
        });
    }
  }
}
