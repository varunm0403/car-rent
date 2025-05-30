import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/auth/services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['registerUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule, 
        CommonModule,
        HttpClientTestingModule,
        RegisterComponent
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  // Basic Component Tests
  describe('Basic Component Tests', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the register form with empty fields', () => {
      expect(component.registerForm.get('firstName')?.value).toBe('');
      expect(component.registerForm.get('lastName')?.value).toBe('');
      expect(component.registerForm.get('email')?.value).toBe('');
      expect(component.registerForm.get('password')?.value).toBe('');
      expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    });

    it('should navigate to login page when goTologin is called', () => {
      component.goTologin();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  // Form Validation Tests
  describe('Form Validation Tests', () => {
    it('should have form controls marked as required', () => {
      const firstNameControl = component.registerForm.get('firstName');
      const lastNameControl = component.registerForm.get('lastName');
      const emailControl = component.registerForm.get('email');
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl = component.registerForm.get('confirmPassword');
      
      firstNameControl?.setValue('');
      lastNameControl?.setValue('');
      emailControl?.setValue('');
      passwordControl?.setValue('');
      confirmPasswordControl?.setValue('');
      
      expect(firstNameControl?.valid).toBeFalsy();
      expect(lastNameControl?.valid).toBeFalsy();
      expect(emailControl?.valid).toBeFalsy();
      expect(passwordControl?.valid).toBeFalsy();
      expect(confirmPasswordControl?.valid).toBeFalsy();
      
      expect(firstNameControl?.errors?.['required']).toBeTruthy();
      expect(lastNameControl?.errors?.['required']).toBeTruthy();
      expect(emailControl?.errors?.['required']).toBeTruthy();
      expect(passwordControl?.errors?.['required']).toBeTruthy();
      expect(confirmPasswordControl?.errors?.['required']).toBeTruthy();
    });

    it('should validate email format', () => {
      const emailControl = component.registerForm.get('email');
      
      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
      expect(emailControl?.errors?.['email']).toBeTruthy();
      
      emailControl?.setValue('valid@email.com');
      expect(emailControl?.valid).toBeTruthy();
    });

    it('should validate password requirements', () => {
      const passwordControl = component.registerForm.get('password');
      
      // Too short
      passwordControl?.setValue('Abc123');
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['invalidPassword']).toBeTruthy();
      
      // No uppercase
      passwordControl?.setValue('abcdef123');
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['invalidPassword']).toBeTruthy();
      
      // No number
      passwordControl?.setValue('Abcdefghi');
      expect(passwordControl?.valid).toBeFalsy();
      expect(passwordControl?.errors?.['invalidPassword']).toBeTruthy();
      
      // Valid password
      passwordControl?.setValue('Abcdef123');
      expect(passwordControl?.valid).toBeTruthy();
    });

    it('should validate password match', () => {
      const passwordControl = component.registerForm.get('password');
      const confirmPasswordControl = component.registerForm.get('confirmPassword');
      
      passwordControl?.setValue('Abcdef123');
      confirmPasswordControl?.setValue('DifferentPass123');
      
      expect(component.registerForm.hasError('mismatch')).toBeTruthy();
      
      confirmPasswordControl?.setValue('Abcdef123');
      expect(component.registerForm.hasError('mismatch')).toBeFalsy();
    });

    it('should validate no whitespace only inputs', () => {
      const firstNameControl = component.registerForm.get('firstName');
      
      firstNameControl?.setValue('   ');
      expect(firstNameControl?.valid).toBeFalsy();
      expect(firstNameControl?.errors?.['whitespace']).toBeTruthy();
      
      firstNameControl?.setValue('John');
      expect(firstNameControl?.valid).toBeTruthy();
    });

    it('should validate no special characters in name fields', () => {
      const firstNameControl = component.registerForm.get('firstName');
      const lastNameControl = component.registerForm.get('lastName');
      
      firstNameControl?.setValue('John@123');
      expect(firstNameControl?.valid).toBeFalsy();
      expect(firstNameControl?.errors?.['specialChars']).toBeTruthy();
      
      lastNameControl?.setValue('Doe#456');
      expect(lastNameControl?.valid).toBeFalsy();
      expect(lastNameControl?.errors?.['specialChars']).toBeTruthy();
      
      firstNameControl?.setValue('John');
      lastNameControl?.setValue('Doe');
      expect(firstNameControl?.valid).toBeTruthy();
      expect(lastNameControl?.valid).toBeTruthy();
    });
  });

  // Form Submission Tests
  describe('Form Submission Tests', () => {
    it('should not submit form if invalid', () => {
      // Set invalid form state
      component.registerForm.setValue({
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different'
      });
      
      component.onRegister();
      
      expect(userService.registerUser).not.toHaveBeenCalled();
    });
  });

  // UI Interaction Tests
  describe('UI Interaction Tests', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBeFalse();
      component.togglePasswordVisibility('password');
      expect(component.showPassword).toBeTrue();
      component.togglePasswordVisibility('password');
      expect(component.showPassword).toBeFalse();
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword).toBeFalse();
      component.togglePasswordVisibility('confirm');
      expect(component.showConfirmPassword).toBeTrue();
      component.togglePasswordVisibility('confirm');
      expect(component.showConfirmPassword).toBeFalse();
    });

    it('should display form controls and buttons', () => {
      const compiled = fixture.nativeElement;
      
      expect(compiled.querySelector('h1')?.textContent).toContain('Create an account');
      expect(compiled.querySelector('input#firstName')).toBeTruthy();
      expect(compiled.querySelector('input#lastName')).toBeTruthy();
      expect(compiled.querySelector('input#email')).toBeTruthy();
      expect(compiled.querySelector('input#password')).toBeTruthy();
      expect(compiled.querySelector('input#confirmPassword')).toBeTruthy();
      expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
    });

    it('should disable register button when form is invalid', () => {
      // Form starts as invalid
      const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(submitButton.disabled).toBeTrue();
      
      // Make form valid
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'valid@email.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });
      fixture.detectChanges();
      
      expect(submitButton.disabled).toBeFalse();
    });
  });

  // Error Display Tests
  describe('Error Display Tests', () => {
    it('should display password mismatch error', () => {
      // Set up the form with mismatched passwords
      component.registerForm.setValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Different123'
      });
      
      // Mark controls as touched to trigger validation display
      component.registerForm.get('password')?.markAsTouched();
      component.registerForm.get('confirmPassword')?.markAsTouched();
      
      // Force validation
      component.registerForm.updateValueAndValidity();
      fixture.detectChanges();
      
      // Check for mismatch validation error on the form itself
      expect(component.registerForm.hasError('mismatch')).toBeTrue();
      
      // Find the error message element - adjust selector based on your HTML
      const errorElements = fixture.debugElement.queryAll(By.css('.error-msg small'));
      const mismatchError = errorElements.find(el => 
        el.nativeElement.textContent.includes('Password and Confirm Password do not match')
      );
      
      expect(mismatchError).toBeTruthy();
    });
  });

  // Special Cases
  describe('Special Cases', () => {
    it('should handle special characters in password', () => {
      const passwordControl = component.registerForm.get('password');
      
      passwordControl?.setValue('Password@123');
      expect(passwordControl?.valid).toBeTrue();
    });
  });
});