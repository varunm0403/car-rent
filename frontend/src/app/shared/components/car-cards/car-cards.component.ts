// src/app/shared/components/car-card/car-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../../core/auth/models/car';
import { ViewCardComponent } from '../view-card/view-card.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-car-card',
  templateUrl: './car-cards.component.html',
  styleUrls: ['./car-cards.component.css'],
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 332px;
    }
  `]
})
export class CarCardComponent {
  @Input() car!: Car;
  constructor(private dialog: MatDialog, private router: Router) {}

  openViewCard(): void {
    this.dialog.open(ViewCardComponent, {
      width: '100%',
      height: '70%',
      maxWidth: '1200px',
      data: { id: this.car.id },
      panelClass: 'custom-dialog-container'
    });
  }

  bookCar(id: string) {
    this.router.navigate(['/book-car', id]);
  }
}