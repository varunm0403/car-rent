// src/app/pages/car-rental-page/car-rental-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRentalFormComponent } from '../../shared/components/car-rental-form/car-rental-form.component';
import { CarCatalogComponent } from '../../shared/components/car-catalog/car-catalog.component';

@Component({
  selector: 'app-car-rental-page',
  templateUrl: './car-rental-page.component.html',
  styleUrls: ['./car-rental-page.component.css'],
  standalone: true,
  imports: [CommonModule, CarRentalFormComponent, CarCatalogComponent]
})
export class CarRentalPageComponent {}