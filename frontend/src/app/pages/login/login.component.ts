import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/auth/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../shared/components/success-dialog/success-dialog.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
 
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
 
  goToRegister() {
    this.router.navigate(['/register']);
  }
 
  onLogin() {
    const { email, password } = this.loginForm.value;
 
    // Validate form
    if (this.loginForm.invalid) {
      return; // Optional: display form validation error messages
    }
 
    this.userService.loginUser({ email, password }).subscribe({
      next: (response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
 
        const dialogRef = this.dialog.open(SuccessDialogComponent, {
          width: '400px',
          disableClose: true,
          panelClass: 'custom-success-dialog'
        });
 
        dialogRef.afterClosed().subscribe(() => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else if (response.role === 'Support') {
            this.router.navigate(['/support-dashboard']);
          } else if (response.role === 'Admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        });
      },
      error: (err) => {
        this.loginError = 'Invalid username or password. Please try again.';
        console.error('Login failed:', err);
      }
    });
  }
 
  // Add a getter for the email and password controls to easily check validity
  get email() {
    return this.loginForm.get('email');
  }
 
  get password() {
    return this.loginForm.get('password');
  }
}