import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Car } from '../models/car';

export interface CarFilters {
  carType?: string;
  gearbox?: string;
  engineType?: string;
  priceRange?: [number, number];
  pickupDate?: Date;
  dropoffDate?: Date;
  pickupLocation?: string;
  dropoffLocation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private readonly carsApiUrl = 'http://localhost:3002/api/v1/cars';
  private readonly popularCarsApiUrl = 'http://localhost:3002/api/v1/cars/popular';
  private carsCache$: Observable<Car[]>;
  private filtersSubject = new BehaviorSubject<CarFilters>({
    priceRange: [52, 400]
  });

  filters$ = this.filtersSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cache the cars data to avoid multiple HTTP requests
    this.carsCache$ = this.http.get<{ data: { content: Car[] } }>(this.carsApiUrl).pipe(
      map(res => res.data.content),
      shareReplay(1)
    );
  }

  getCars(): Observable<Car[]> {
    return this.carsCache$;
  }

  getFeaturedCars(limit: number = 4): Observable<Car[]> {
    return this.http.get<{ data: { content: Car[] } }>(this.popularCarsApiUrl).pipe(
      map(res => res.data.content.slice(0, limit))
    );
  }

  // New method to get filtered cars
  getFilteredCars(): Observable<Car[]> {
    return combineLatest([
      this.getCars(),
      this.filters$
    ]).pipe(
      map(([cars, filters]) => this.applyFilters(cars, filters))
    );
  }

  // Update filters
  updateFilters(filters: Partial<CarFilters>): void {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...filters
    });
  }

  // Reset filters
  resetFilters(): void {
    this.filtersSubject.next({
      priceRange: [52, 400]
    });
  }

  // Apply filters to cars
  private applyFilters(cars: Car[], filters: CarFilters): Car[] {
    return cars.filter(car => {
      if (filters.pickupLocation && filters.pickupLocation !== '' &&
        !car.location.includes(filters.pickupLocation)) {
        return false;
      }

      if (filters.priceRange) {
        const price = Number(car.pricePerDay);
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false;
        }
      }

      return true;
    });
  }
}