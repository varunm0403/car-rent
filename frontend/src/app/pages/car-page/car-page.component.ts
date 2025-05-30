import { Component } from '@angular/core';
import { CarCatalogComponent } from "../../shared/components/car-catalog/car-catalog.component";
import { CarRentalFormComponent } from "../../shared/components/car-rental-form/car-rental-form.component";

@Component({
  selector: 'app-car-page',
  imports: [CarCatalogComponent, CarRentalFormComponent],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.css'
})
export class CarPageComponent {

}
