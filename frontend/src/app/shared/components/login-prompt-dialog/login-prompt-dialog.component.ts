import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login-prompt-dialog',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Login Required</h2>
    <mat-dialog-content>
      <p>You need to be logged in to book a car.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" (click)="onLogin()">Login</button>
    </mat-dialog-actions>
  `,
})
export class LoginPromptDialogComponent {
  constructor(private dialogRef: MatDialogRef<LoginPromptDialogComponent>) {}

  onLogin() {
    this.dialogRef.close('login');
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }
}
