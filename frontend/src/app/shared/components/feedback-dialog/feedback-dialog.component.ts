import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.css'],
  imports: [FormsModule, CommonModule]
})
export class FeedbackDialogComponent {
  rating: number = 0;
  feedback: string = '';
 
  @Output() submit = new EventEmitter<{ rating: number, feedback: string }>();
  @Output() cancel = new EventEmitter<void>();
 
  submitFeedback() {
    this.submit.emit({ rating: this.rating, feedback: this.feedback });
  }
 
  cancelDialog() {
    this.cancel.emit();
  }
}