import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static confirmPassword(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const confirmPassword = control.value;
      const passwordControl = control.parent?.get(passwordControlName);

      if (!passwordControl) {
        return null;
      }
      const password = passwordControl.value;
      return password !== confirmPassword ? { confirmPassword: true } : null;
    };
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;

      if (!password) {
        return null;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      return passwordRegex.test(password) ? null : { weakPassword: true };
    };
  }
}
