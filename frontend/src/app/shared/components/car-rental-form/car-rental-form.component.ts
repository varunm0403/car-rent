// src/app/shared/components/car-rental-form/car-rental-form.component.ts

import { Component, ViewChild, ElementRef, NgZone, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../components/calendar/calendar.component';
import { CarService } from '../../../core/auth/services/car.service';

@Component({
  selector: 'car-rental-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './car-rental-form.component.html',
  styleUrls: ['./car-rental-form.component.css']
})
export class CarRentalFormComponent {
  @Input() context: 'home' | 'cars' = 'cars';
  @Output() filterApplied = new EventEmitter<any>();
  @ViewChild('sliderTrack') sliderTrack!: ElementRef;
  
  // Form model
  filter = {
    pickupLocation: '',
    dropoffLocation: '',
    category: 'All',
    gearbox: 'All',
    engineType: 'All',
    onlyAvailable: true,
    priceRange: [0, 600] // Adjust based on your price range
  };

  // Price range slider values
  priceRange = [0, 600];
  minPrice = 0;
  maxPrice = 600;
  isDragging: number | null = null; // 0 for left handle, 1 for right handle
  
  // Existing properties
  carCategories = ['Passenger car', 'SUV', 'Luxury', 'Van'];
  gearboxOptions = ['Automatic', 'Manual'];
  engineTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  availableLocations = ['New York', 'Los Angeles', 'Chicago', 'Kyiv'];


  today = new Date();
  pickupDate: Date = new Date();
  dropoffDate: Date = new Date();
  pickupTime: string = '07:00 AM';
  dropoffTime: string = '10:30 AM';
  showCalendar = false;
  
  // Selected values (adding these to track selections)
  selectedCategory: string = 'Passenger car';
  selectedGearbox: string = 'Automatic';
  selectedEngineType: string = 'Gasoline';
  pickupLocation: string = '';
  dropoffLocation: string = '';
  
  constructor(
    private ngZone: NgZone,
    private carService: CarService  // Inject the car service
  ) {
    // Set default dates
    this.dropoffDate.setDate(this.pickupDate.getDate() + 5); // Default rental period: 5 days
  }
  
  // Price Range Slider Methods
  getHandlePosition(index: number): string {
    const percentage = ((this.priceRange[index] - this.minPrice) / (this.maxPrice - this.minPrice)) * 100;
    return `${percentage}%`;
  }

  getTrackWidth(): string {
    const leftPos = ((this.priceRange[0] - this.minPrice) / (this.maxPrice - this.minPrice)) * 100;
    const rightPos = ((this.priceRange[1] - this.minPrice) / (this.maxPrice - this.minPrice)) * 100;
    return `${rightPos - leftPos}%`;
  }

  getTrackLeft(): string {
    return this.getHandlePosition(0);
  }

  // Mouse events
  startDrag(event: MouseEvent, handleIndex: number): void {
    event.preventDefault();
    this.isDragging = handleIndex;
    
    // Run outside Angular zone for better performance during drag
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.onMouseDrag);
      document.addEventListener('mouseup', this.stopDrag);
    });
  }

  onMouseDrag = (event: MouseEvent): void => {
    if (this.isDragging === null) return;
    this.updateHandlePosition(event.clientX);
  }

  // Touch events for mobile support
  startDragTouch(event: TouchEvent, handleIndex: number): void {
    event.preventDefault();
    this.isDragging = handleIndex;
    
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('touchmove', this.onTouchDrag, { passive: false });
      document.addEventListener('touchend', this.stopDrag);
      document.addEventListener('touchcancel', this.stopDrag);
    });
  }

  onTouchDrag = (event: TouchEvent): void => {
    if (this.isDragging === null || !event.touches[0]) return;
    event.preventDefault(); // Prevent scrolling while dragging
    this.updateHandlePosition(event.touches[0].clientX);
  }

  // Common function to update handle position
  updateHandlePosition(clientX: number): void {
    if (!this.sliderTrack) return;
    
    const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
    const sliderWidth = rect.width;
    const offsetX = clientX - rect.left;
    
    // Calculate percentage and new value
    const percentage = Math.min(Math.max(0, offsetX / sliderWidth), 1);
    const newValue = Math.round(this.minPrice + percentage * (this.maxPrice - this.minPrice));
    
    // Update the appropriate handle position
    const oldValue = [...this.priceRange];
    
    // Run inside Angular zone to update the UI
    this.ngZone.run(() => {
      if (this.isDragging === 0) {
        // Left handle - can't go beyond right handle
        this.priceRange[0] = Math.min(newValue, this.priceRange[1] - 10);
      } else {
        // Right handle - can't go below left handle
        this.priceRange[1] = Math.max(newValue, this.priceRange[0] + 10);
      }
      
      // Update filters when price range changes
      this.updateFilters();
    });
  }

  stopDrag = (): void => {
    this.ngZone.run(() => {
      this.isDragging = null;
      
      // Ensure filters are updated when dragging stops
      this.updateFilters();
    });
    
    document.removeEventListener('mousemove', this.onMouseDrag);
    document.removeEventListener('touchmove', this.onTouchDrag);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('touchend', this.stopDrag);
    document.removeEventListener('touchcancel', this.stopDrag);
  }
  
  // Existing methods
  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }
  
  onDateRangeSelected(event: {start: Date, end: Date, pickupTime: string, dropoffTime: string}): void {
    this.pickupDate = event.start;
    this.dropoffDate = event.end;
    this.pickupTime = event.pickupTime;
    this.dropoffTime = event.dropoffTime;
    this.showCalendar = false;
    
    // Update filters when dates change
    this.updateFilters();
  }
  
  formatDateWithTime(date: Date, time: string): string {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return `${date.toLocaleDateString('en-US', options)}, ${time}`;
  }
  
  // New methods for filter handling
  updateFilters(): void {
    this.carService.updateFilters({
      carType: this.selectedCategory,
      gearbox: this.selectedGearbox,
      engineType: this.selectedEngineType,
      priceRange: this.priceRange as [number, number],
      pickupDate: this.pickupDate,
      dropoffDate: this.dropoffDate,
      pickupLocation: this.pickupLocation,
      dropoffLocation: this.dropoffLocation
    });
  }
  
  // Add event handlers for select changes
  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory = select.value;
    this.updateFilters();
  }
  
  onGearboxChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedGearbox = select.value;
    this.updateFilters();
  }
  
  onEngineTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedEngineType = select.value;
    this.updateFilters();
  }
  
  onLocationChange(event: Event, isPickup: boolean): void {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;
    
    console.log(`Location changed: ${isPickup ? 'Pickup' : 'Dropoff'} = ${selectedValue}`); // Debug log
    
    if (isPickup) {
      this.pickupLocation = selectedValue;
      
      // Optionally, set dropoff to same location if it's not set
      if (!this.dropoffLocation || this.dropoffLocation === '') {
        this.dropoffLocation = selectedValue;
      }
    } else {
      this.dropoffLocation = selectedValue;
    }
    
    this.updateFilters();
  }
  
  // Find car button click handler
  findCars(): void {
    this.updateFilters();
  }
  
  clearFilters(): void {
    // Reset to default dates
    this.pickupDate = new Date();
    this.dropoffDate = new Date();
    this.dropoffDate.setDate(this.pickupDate.getDate() + 5);
    this.pickupTime = '07:00 AM';
    this.dropoffTime = '10:30 AM';
    
    // Reset price range
    this.priceRange = [52, 400];
    
    // Reset other filters
    this.selectedCategory = 'Passenger car';
    this.selectedGearbox = 'Automatic';
    this.selectedEngineType = 'Gasoline';
    this.pickupLocation = '';
    this.dropoffLocation = '';
    
    // Reset filters in service
    this.carService.resetFilters();
  }
}