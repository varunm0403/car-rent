// src/app/shared/components/car-catalog/car-catalog.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Car } from '../../../core/auth/models/car';
import { CarService, CarFilters } from '../../../core/auth/services/car.service';
import { CarCardComponent } from '../car-cards/car-cards.component';

@Component({
  selector: 'app-car-catalog',
  templateUrl: './car-catalog.component.html',
  styleUrls: ['./car-catalog.component.css'],
  standalone: true,
  imports: [CommonModule, CarCardComponent],
  styles: [`
    :host {
      display: block;
      width: 100%;
      padding: 0;
      margin: 0;
    }
    
    .grid {
      padding: 0;
      margin: 0;
    }
  `]
})
export class CarCatalogComponent implements OnInit, OnDestroy {
  featuredCars: Car[] = [];
  allCars: Car[] = [];
  filteredCars: Car[] = [];
  showAllCars = true;
  currentFilters: CarFilters = {};
  private subscriptions: Subscription[] = [];
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 1;
  pages: number[] = [];

  constructor(private carService: CarService) { }

  ngOnInit(): void {
    // Load featured cars (limited number)
    const featuredSub = this.carService.getFeaturedCars(4).subscribe(cars => {
      this.featuredCars = cars;
    });
    this.subscriptions.push(featuredSub);
    
    
    // Load all cars
    const allCarsSub = this.carService.getCars().subscribe(cars => {
      this.allCars = cars;
      this.calculatePagination();
    });
    this.subscriptions.push(allCarsSub);
    
    // Subscribe to filtered cars
    const filteredSub = this.carService.getFilteredCars().subscribe(cars => {
      this.filteredCars = cars;
      this.calculatePagination();
    });
    this.subscriptions.push(filteredSub);
    
    // Subscribe to filter changes
    const filtersSub = this.carService.filters$.subscribe(filters => {
      this.currentFilters = filters;
      this.currentPage = 1;
    });
    this.subscriptions.push(filtersSub);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // toggleShowAllCars(): void {
  //   this.showAllCars = !this.showAllCars;
  //   if (this.showAllCars) {
  //     this.currentPage = 1;
  //     this.calculatePagination();
  //   }
  // }

  calculatePagination(): void {
    const totalItems = this.hasActiveFilters() ? this.filteredCars.length : this.allCars.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get paginatedCars(): Car[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const cars = this.hasActiveFilters() ? this.filteredCars : (this.showAllCars ? this.allCars : this.featuredCars);
    return cars.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  // Helper method to check if any filters are active - changed from getter to method
  hasActiveFilters(): boolean {
    if (!this.currentFilters) return false;
    
    // Check if there are any active filters
    const hasCarType = this.currentFilters.carType && this.currentFilters.carType !== 'Passenger car';
    const hasGearbox = !!this.currentFilters.gearbox;
    const hasEngineType = !!this.currentFilters.engineType;
    const hasPickupLocation = !!this.currentFilters.pickupLocation && this.currentFilters.pickupLocation !== '';
    const hasDropoffLocation = !!this.currentFilters.dropoffLocation && this.currentFilters.dropoffLocation !== '';
    
    return Object.keys(this.currentFilters).length > 0 && 
           (hasCarType || hasGearbox || hasEngineType || hasPickupLocation || hasDropoffLocation);
  }
}