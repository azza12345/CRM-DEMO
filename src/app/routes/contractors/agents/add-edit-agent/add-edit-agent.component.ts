import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '@shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { EndPoint, HttpVerb } from '@shared/enums';
import { AsyncPipe } from '@angular/common';
import { map, Observable, Subscription } from 'rxjs';
import { District } from '@shared/interfaces/district.model';
import { BaseResponse } from '@shared/interfaces/base-response';

@Component({
  selector: 'app-add-edit-agent',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    AsyncPipe,
  ],
  templateUrl: './add-edit-agent.component.html',
  styleUrl: './add-edit-agent.component.scss',
})
export class AddEditAgentComponent implements OnInit, OnDestroy {
  agentForm!: FormGroup;
  isEditMode = false;
  private apiService = inject(ApiService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  agentId: string | null = null;
  imagePreview: string = 'assets/images/avatar.png';
  availableDistricts$!: Observable<District[]>;
  private routeSub!: Subscription;
  private agentSub!: Subscription;
  private formSub!: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.agentId = params.get('id');
      this.isEditMode = !!this.agentId;
      this.initializeForm();
      if (this.isEditMode) {
        this.loadAgentData(this.agentId!);
      }
    });

    this.availableDistricts$ = this.apiService
      .triggerApiRequest<BaseResponse<District[]>>(EndPoint.DISTRICTS, HttpVerb.GET)
      .pipe(map(response => response.data));
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.agentSub) {
      this.agentSub.unsubscribe();
    }
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.agentForm = this.fb.group({
      image: [null],
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      ghanaCard: ['', [Validators.required]],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      status: [null],
      selectedDistricts: [[]],
    });

    if (this.isEditMode) {
      this.agentForm.addControl(
        'code',
        this.fb.control({ value: '', disabled: true }, Validators.required)
      );
    }
  }

  //FIXME: Will be changed based on api response
  private loadAgentData(id: string): void {
    // this.agentSub= this.apiService
    //   .triggerApiRequest(EndPoint.GET_Agent_BY_ID, HttpVerb.GET, { id })
    //   .subscribe({
    //     next: agent => {
    //       // this.agentForm.patchValue(agent);
    //     },
    //   });
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.agentForm.get('image')?.setValue(file, { emitEvent: false });
    }
  }

  onSubmit(): void {
    if (this.agentForm.invalid) return;

    const formData = this.agentForm.value;

    if (this.isEditMode) {
      this.formSub = this.apiService
        .triggerApiRequest(EndPoint.UPDATE_AGENT, HttpVerb.PUT, null, formData)
        .subscribe({
          next: () => {
            this.toastr.success('Agent updated successfully');
            this.router.navigate(['/agents']);
          },
        });
    } else {
      this.formSub = this.apiService
        .triggerApiRequest(EndPoint.ADD_AGENT, HttpVerb.POST, null, formData)
        .subscribe({
          next: () => {
            this.toastr.success('Agent added successfully');
            this.router.navigate(['/agents']);
          },
        });
    }
  }
}
