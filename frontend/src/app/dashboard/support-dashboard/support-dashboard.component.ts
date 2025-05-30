import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';
import { BookingService, BookingDetails } from '../../core/auth/services/booking.service';
import { Router } from '@angular/router';
import { UserService } from '../../core/auth/services/user.service';
import { RouterModule } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';  // Import your dialog component

@Component({
  selector: 'app-support-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent, RouterModule, ConfirmationDialogComponent],  // Include dialog in imports
  templateUrl: './support-dashboard.component.html',
  styleUrl: './support-dashboard.component.css'
})
export class SupportDashboardComponent {
  showCalendar = false;
  dateRangeDisplay = '';
  bookings: BookingDetails[] = [];
  dropdownIndex: number | null = null;
  currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '.');
  filteredBookings: BookingDetails[] = [];

  filters = {
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    client: '',
    status: ''
  };

  showDialog = false;
  selectedBooking: BookingDetails | null = null;

  constructor(private bookingService: BookingService, private router: Router, private userService: UserService) {
    this.updateDateRangeDisplay();
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.bookings$.subscribe(bookings => {
      const enhancedBookings = bookings.map(booking => ({
        ...booking,
        status: this.determineBookingStatus(booking),
        pickupDateTime: new Date(`${booking.pickupDate.toDateString()} ${booking.pickupTime}`).getTime(),
        dropoffDateTime: new Date(`${booking.dropoffDate.toDateString()} ${booking.dropoffTime}`).getTime()
      }));
      this.bookings = enhancedBookings;
      this.filteredBookings = [...enhancedBookings]; // initialize filteredBookings
    });
  }

  determineBookingStatus(booking: any): string {
    const now = new Date().getTime();

    if (booking.status === 'Cancelled') return 'Cancelled';
    if (booking.status === 'Booking Finished') return 'Booking Finished';

    if (!booking.pickupDateTime || now < booking.pickupDateTime) {
      return 'Reserved';
    } else if (now >= booking.pickupDateTime && now < booking.dropoffDateTime) {
      return 'Service Started';
    } else {
      return 'Service Provided';
    }
  }

  onDateRangeSelected(range: { start: Date, end: Date, pickupTime: string, dropoffTime: string }) {
    this.filters.startDate = range.start;
    this.filters.endDate = range.end;
    this.updateDateRangeDisplay();
    this.showCalendar = false;
  }

  updateDateRangeDisplay() {
    if (this.filters.startDate && this.filters.endDate) {
      this.dateRangeDisplay = `${this.filters.startDate.toLocaleDateString()} - ${this.filters.endDate.toLocaleDateString()}`;
    }
  }

  applyFilters() {
    const { startDate, endDate, client, status } = this.filters;

    this.filteredBookings = this.bookings.filter(booking => {
      const bookingDate = new Date(booking.pickupDate);

      const matchesDate =
        bookingDate >= new Date(startDate.setHours(0, 0, 0, 0)) &&
        bookingDate <= new Date(endDate.setHours(23, 59, 59, 999));

      const matchesClient = client
        ? booking.clientName?.toLowerCase().includes(client.toLowerCase())
        : true;

      const matchesStatus = status ? booking.status === status : true;

      return matchesDate && matchesClient && matchesStatus;
    });
  }

  toggleDropdown(index: number) {
    this.dropdownIndex = this.dropdownIndex === index ? null : index;
  }
  editBooking(booking: BookingDetails): void {
    // Set the booking details in the service
    console.log('Router service:', this.router); // Should show the router object
    console.log('Current routes:', this.router.config);
    this.bookingService.setEditingBooking(booking);
    
    // Navigate to the booking form
    this.router.navigate(['/edit-booking']);
  }
  // Show cancellation dialog
  cancelBooking(booking: BookingDetails): void {
    this.selectedBooking = booking; // Debugging line
    this.showDialog = true;
    console.log('showDialog:', this.showDialog); // Debugging line
  }

  // Handle confirmation of cancellation
  onConfirmCancel() {
    if (this.selectedBooking) {
      this.selectedBooking.status = 'Cancelled';
      this.applyFilters();
      if (this.selectedBooking.orderId) {
      this.bookingService.updateBooking(this.selectedBooking.orderId, this.selectedBooking).subscribe(
        (response) => {
          console.log('Booking updated successfully:', response);
          // Handle success scenario
        },
        (error) => {
          console.error('Error updating booking:', error);
          // Handle error scenario
        }
      );
    } else {
      console.error('Booking ID not found for update!');
    }// Optional: update the service
    }
    this.showDialog = false; // Close the dialog after cancellation
  }

  // Handle cancellation of the dialog without any action
  onCancelDialog() {
    this.showDialog = false;
  }
  cancelTime(booking: BookingDetails): boolean {
    const currentTime = new Date().getTime();
    const pickupTime = booking?.pickupDate ? new Date(booking.pickupDate).getTime() : 0;
    const diffInHours = (pickupTime - currentTime) / (1000 * 60 * 60);
    return diffInHours < 12;
  }
  
  getDurationInDays(booking: BookingDetails): number {
    const pickup = new Date(booking.pickupDate);
    const dropoff = new Date(booking.dropoffDate);
    const diffInMs = dropoff.getTime() - pickup.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  }

  createNewBooking() {
    this.router.navigate(['/cars']);
  }
}
