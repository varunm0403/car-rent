// src/app/shared/components/popular-cars/popular-cars.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Car } from '../../../core/auth/models/car';
import { CarFilters, CarService } from '../../../core/auth/services/car.service';
import { CarCardComponent } from '../car-cards/car-cards.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popular-cars',
  standalone: true,
  imports: [CommonModule, CarCardComponent, RouterModule],
  templateUrl: './popular-cars.component.html',
  styleUrls: ['./popular-cars.component.css'],
  styles:[`
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
export class PopularCarsComponent implements OnInit, OnDestroy {
   featuredCars: Car[] = [];
    allCars: Car[] = [];
    filteredCars: Car[] = [];
    showAllCars = false;
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
  
    toggleShowAllCars(): void {
      this.showAllCars = !this.showAllCars;
      if (this.showAllCars) {
        this.currentPage = 1;
        this.calculatePagination();
      }
    }
  
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
