import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/auth/services/booking.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ViewCalenderComponent } from '../view-calender/view-calender.component';
import { UserService } from '../../../core/auth/services/user.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-car-booking',
  templateUrl: './car-booking.component.html',
  styleUrls: ['./car-booking.component.css'],
  standalone: true,
  imports: [CommonModule, ConfirmationDialogComponent, ViewCalenderComponent,FormsModule]
})
export class CarBookingComponent implements OnInit {

  car: any;
  pickupLocation: string = '';
  dropoffLocation: string = '';
  pickupDate: Date = new Date();
  pickupTime: string = '';
  dropoffDate: Date = new Date();
  dropoffTime: string = '';
  calendarVisible: boolean = false; // Track if calendar is visible for picking dates
  existingBookingId: string | null = null;  // Track if this booking is an existing one
  userRole: string = 'user';
  clientName: string = '';
  clients: string[] = ['Anastasiya Dobrota', 'John Smith', 'Maria Ivanova'];
  

  constructor(private bookingService: BookingService, private router: Router,public userService:UserService) {}

  ngOnInit(): void {
  this.userRole = this.userService.getUserRole() ?? 'user';
  this.bookingService.getBookingDetails().subscribe((state) => {
    console.log('Booking details from service (observable):', state);
    if (state) {
      this.car = state.car;
      this.pickupLocation = state.pickupLocation;
      this.dropoffLocation = state.dropoffLocation;
      this.pickupDate = new Date(state.pickupDate);
      this.pickupTime = state.pickupTime;
      this.dropoffDate = new Date(state.dropoffDate);
      this.dropoffTime = state.dropoffTime;
      this.existingBookingId = state.orderId ?? null;  // Set existing order ID if available
    } else {
      console.error('No state data found from service.');
    }
  });
}

  getTotalDays(): number {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day
    const diffTime = Math.abs(this.dropoffDate.getTime() - this.pickupDate.getTime());
    return Math.ceil(diffTime / oneDay) || 1; // ensure minimum 1 day
  }

  showSuccessAlert = false;

  confirmBooking() {
  console.log('Selected client:', this.clientName);
  const bookingData = {
    userId: this.userService.getUserId(),
    carId: this.car.id,
    pickupLocation: this.pickupLocation,
    dropoffLocation: this.dropoffLocation,
    pickupDate: this.pickupDate.toISOString(),
    dropoffDate: this.dropoffDate.toISOString(),
    // Include other necessary booking fields
  };

  this.bookingService.createBooking(bookingData).subscribe(
    (response) => {
      console.log('Booking created successfully:', response);
      this.showSuccessAlert = true;
      this.router.navigate(['/my-bookings']);
    },
    (error) => {
      console.error('Error creating booking:', error);
      // Handle error scenario
    }
  );
}

  onSuccessAlertClose() {
    this.showSuccessAlert = false;
    if(this.userRole === 'user') {
      this.router.navigate(['/my-bookings']);
    }
    else if(this.userRole === 'Support') {
      this.router.navigate(['/support-dashboard']);
    }
  }

  getTotalCost(): number {
    const days = this.getTotalDays();
    return this.car?.pricePerDay ? this.car.pricePerDay * days : 0;
  }

  // Show the calendar for selecting date
  showCalendar(type: 'pickup' | 'dropoff') {
    this.calendarVisible = true;
    if (type === 'pickup') {
      // You can add logic here if necessary for handling pickup date selection
    } else if (type === 'dropoff') {
      // You can add logic here if necessary for handling dropoff date selection
    }
  }

  // When user selects a date range from the calendar
  onDateRangeSelected(dateRange: {start: Date; end: Date; pickupTime: string; dropoffTime: string}) {
    this.pickupDate = dateRange.start;
    this.dropoffDate = dateRange.end;
    this.pickupTime = dateRange.pickupTime;
    this.dropoffTime = dateRange.dropoffTime;
    this.calendarVisible = false; // Hide the calendar after selection
  }

  // Close the calendar without making any changes
  closeCalendar() {
    this.calendarVisible = false;
  }
}
