import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
// import { CarCardComponent } from './components/car-cards/car-cards.component';
// import { CarCatalogComponent } from './components/car-catalog/car-catalog.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class SharedModule { }