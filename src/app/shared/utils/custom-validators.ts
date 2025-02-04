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
      passwordControl.valueChanges.subscribe(() => {
        control.updateValueAndValidity({ onlySelf: true });
      });
      return password !== confirmPassword ? { confirmPassword: true } : null;
    };
  }
}
