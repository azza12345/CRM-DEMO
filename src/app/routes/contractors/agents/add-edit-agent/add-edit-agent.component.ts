import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { environment } from '@env/environment';

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
  private routeSub!: Subscription;
  private agentSub!: Subscription;
  private formSub!: Subscription;
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.agentId = params.get('id');
      this.isEditMode = !!this.agentId;
      this.initializeForm();
      if (this.isEditMode) {
        this.loadAgentData(this.agentId!);
      }
    });
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
    });

    if (this.isEditMode) {
      this.agentForm.addControl(
        'code',
        this.fb.control({ value: '', disabled: true }, Validators.required)
      );
    }
  }

  //TODO: Will be changed based on api response
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
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Please upload an image file (JPEG, PNG, etc.)');
        this.resetImageSelection();
        return;
      }
      if (file.size > environment.maxImageSize) {
        this.toastr.error(
          `File size should not exceed ${environment.maxImageSize / 1024 / 1024} MB.`
        );
        this.resetImageSelection();
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.agentForm.get('image')?.setValue(file, { emitEvent: false });
    }
  }

  resetImageSelection(): void {
    this.imagePreview = 'assets/images/avatar.png';
    this.agentForm.get('image')?.setValue(null);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
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
