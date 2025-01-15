import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DialogData } from '@shared/interfaces/dialog-data.model';

@Component({
  selector: 'app-adaptive-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './adaptive-dialog.component.html',
  styleUrl: './adaptive-dialog.component.scss',
})
export class AdaptiveDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AdaptiveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
    this.initForm();
  }

  private initForm(): void {
    this.data.fields.forEach(field => {
      this.form.addControl(field.formControlName, this.fb.control(null, Validators.required));
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
