import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
  NonNullableFormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/auth/services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  providers: [UserService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    //role: FormControl<string>;
  }>;

  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: NonNullableFormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        firstName: this.fb.control('', { validators: [Validators.required, this.noWhitespaceValidator(),this.noSpecialCharsValidator()], updateOn: 'change' }),
        lastName: this.fb.control('', { validators: [Validators.required, this.noWhitespaceValidator(),this.noSpecialCharsValidator()], updateOn: 'change' }),
        email: this.fb.control('', { validators: [Validators.required, Validators.email, this.noWhitespaceValidator()], updateOn: 'change' }),
        password: this.fb.control('', { validators: [Validators.required, this.passwordValidator(), this.noWhitespaceValidator()], updateOn: 'change' }),
        confirmPassword: this.fb.control('', { validators: [Validators.required, this.noWhitespaceValidator()], updateOn: 'change' }),
        //role: this.fb.control('user'),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  togglePasswordVisibility(type: 'password' | 'confirm') {
    if (type === 'password') {
      this.showPassword = !this.showPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Allow special characters now ✅
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const pattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_#]{8,}$/;
      return control.value && !pattern.test(control.value)
        ? { invalidPassword: true }
        : null;
    };
  }

  // Prevent blank spaces only
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.trim() === '') {
        return { whitespace: true };
      }
      return null;
    };
  }

  noSpecialCharsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = /^[A-Za-z\s]*$/.test(control.value); // Only letters and spaces
      return control.value && !valid ? { specialChars: true } : null;
    };
  }  

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  };

  goTologin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.registerForm.updateValueAndValidity();
      return;
    }
  
    const newUser = {
      //id: crypto.randomUUID(),
      email:this.registerForm.getRawValue().email,
      firstName:this.registerForm.getRawValue().firstName,
      lastName:this.registerForm.getRawValue().lastName,
      password:this.registerForm.getRawValue().password
    };
  
    // 1. Check if email already exists
    this.userService.registerUser(newUser).subscribe(() => {
      console.log(newUser);
      
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.router.navigate(['/login']);
    });
  }
  

  get formControls() {
    return this.registerForm.controls;
  }
}
