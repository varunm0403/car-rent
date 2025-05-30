import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<SuccessDialogComponent>) {}

  ngOnInit(): void {
    // Auto-close after 3 seconds
    setTimeout(() => {
      this.close();
    }, 4000);
  }

  close() {
    this.dialogRef.close();
  }
}
