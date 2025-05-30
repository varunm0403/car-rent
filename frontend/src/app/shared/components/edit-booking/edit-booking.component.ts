// edit-booking.component.ts
import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../core/auth/services/booking.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ViewCalenderComponent } from '../view-calender/view-calender.component';
import { UserService } from '../../../core/auth/services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    ConfirmationDialogComponent, 
    ViewCalenderComponent,
    FormsModule
  ]
})
export class EditBookingComponent implements OnInit {
  car: any;
  pickupLocation: string = '';
  dropoffLocation: string = '';
  pickupDate: Date = new Date();
  pickupTime: string = '';
  dropoffDate: Date = new Date();
  dropoffTime: string = '';
  calendarVisible: boolean = false;
  existingBookingId: string | null = null;
  userRole: string = 'user';
  clientName: string = '';
  clients: string[] = ['Anastasiya Dobrota', 'John Smith', 'Maria Ivanova'];
  showSuccessAlert = false;
  startMileage: number | null = null;
  endMileage: number | null = null;
  constructor(
    private bookingService: BookingService,
    private router: Router,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.userRole = this.userService.getUserRole() ?? 'user';
    
    // Get the booking being edited
    this.bookingService.currentEditingBooking$.subscribe(booking => {
      if (booking) {
        this.car = booking.car;
        this.pickupLocation = booking.pickupLocation;
        this.dropoffLocation = booking.dropoffLocation;
        this.pickupDate = new Date(booking.pickupDate);
        this.pickupTime = booking.pickupTime;
        this.dropoffDate = new Date(booking.dropoffDate);
        this.dropoffTime = booking.dropoffTime;
        this.existingBookingId = booking.orderId ?? null;
        this.clientName = booking.clientName || '';
        if (this.car) {
          this.startMileage = this.car.startMileage || null;
          this.endMileage = this.car.endMileage || null;
        }
      }
    });
  }
  

// Add these methods
saveStartMileage() {
  if (this.startMileage !== null) {
    // Here you would typically save to your backend
    console.log('Start mileage saved:', this.startMileage);
    // You might want to add this to your booking object
    if (this.car) {
      this.car.startMileage = this.startMileage;
    }
  }
}

saveEndMileage() {
  if (this.endMileage !== null) {
    // Here you would typically save to your backend
    console.log('End mileage saved:', this.endMileage);
    // You might want to add this to your booking object
    if (this.car) {
      this.car.endMileage = this.endMileage;
    }
  }
}

  // All other methods can be copied from CarBookingComponent
  getTotalDays(): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(this.dropoffDate.getTime() - this.pickupDate.getTime());
    return Math.ceil(diffTime / oneDay) || 1;
  }
  

  confirmBooking() {
    const booking = {
      car: {...this.car,
        startMileage: this.startMileage,
        endMileage: this.endMileage,
      },
      pickupLocation: this.pickupLocation,
      dropoffLocation: this.dropoffLocation,
      pickupDate: this.pickupDate,
      pickupTime: this.pickupTime,
      dropoffDate: this.dropoffDate,
      dropoffTime: this.dropoffTime,
      status: 'Reserved',
      clientName: this.clientName,
      orderId: this.existingBookingId || '#' + Math.floor(1000 + Math.random() * 9000),
      pickupDateTime: new Date(`${this.pickupDate.toDateString()} ${this.pickupTime}`).getTime(),
      dropoffDateTime: new Date(`${this.dropoffDate.toDateString()} ${this.dropoffTime}`).getTime()
    };
    console.log('Booking:', booking);
    if (booking.orderId) {
    this.bookingService.updateBooking(booking.orderId, booking).subscribe(
      (response) => {
        console.log('Booking updated successfully:', response);
        this.showSuccessAlert = true;
      },
      (error) => {
        console.error('Error updating booking:', error);
        // Handle error scenario
      }
    );
  } else {
    console.error('Booking ID not found for update!');
  }
  }

  onSuccessAlertClose() {
    this.showSuccessAlert = false;
    if (this.userRole === 'user') {
      this.router.navigate(['/my-bookings']);
    } else if (this.userRole === 'Support') {
      this.router.navigate(['/support-dashboard']);
    }
  }

  getTotalCost(): number {
    const days = this.getTotalDays();
    return this.car?.pricePerDay ? this.car.pricePerDay * days : 0;
  }

  showCalendar(type: 'pickup' | 'dropoff') {
    this.calendarVisible = true;
  }

  onDateRangeSelected(dateRange: {start: Date; end: Date; pickupTime: string; dropoffTime: string}) {
    this.pickupDate = dateRange.start;
    this.dropoffDate = dateRange.end;
    this.pickupTime = dateRange.pickupTime;
    this.dropoffTime = dateRange.dropoffTime;
    this.calendarVisible = false;
  }

  closeCalendar() {
    this.calendarVisible = false;
  }
  get isSupport(): boolean {
    return this.userService.getUserRole() === 'Support';
  }
}