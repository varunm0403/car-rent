// confirmation-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed top-5 left-1/2 transform -translate-x-1/2 text-green-800 bg-gray-100 rounded-lg p-6 max-w-md w-full z-50 shadow-lg">
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <p class="text-green-800 mb-4">{{ message }}</p>
    
    <div class="flex justify-end" *ngIf="isAlert">
      <button 
        (click)="onConfirm()"
        class="px-4 py-2 bg-white text-green-800 font-semibold rounded-md hover:bg-gray-100 transition"
      >
        OK
      </button>
    </div>

    <div class="flex justify-end gap-3" *ngIf="!isAlert">
      <button 
        (click)="onCancel()"
        class="px-4 py-2 border border-white text-white rounded-md hover:bg-green-600 hover:border-white"
      >
        {{ cancelText }}
      </button>
      <button 
        (click)="onConfirm()"
        class="px-4 py-2 bg-white text-green-600 font-semibold rounded-md hover:bg-gray-100"
      >
        {{ confirmText }}
      </button>
    </div>
  </div>
`,

  styles: []
})
export class ConfirmationDialogComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to perform this action?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() isAlert: boolean = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}