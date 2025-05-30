// src/app/change-password/change-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileSidebarComponent } from '../profile-sidebar/profile-sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProfileSidebarComponent,  RouterModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  successMessage = '';
  
  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  changePassword() {
    if (this.passwordForm.valid) {
      // Here you would typically call an API to change the password
      // For now, we'll just simulate success
      
      console.log('Password change requested:', {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      });
      
      // Show success message
      this.successMessage = 'Your password has been successfully changed.';
      
      // Clear form
      this.passwordForm.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 5000);
    }
  }
}