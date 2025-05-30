import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewcarService } from '../../../core/auth/services/viewcar.service';
import { CommonModule } from '@angular/common';
import { ViewCalenderComponent } from '../view-calender/view-calender.component';
import { BookingService } from '../../../core/auth/services/booking.service';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginPromptDialogComponent } from '../login-prompt-dialog/login-prompt-dialog.component'; // adjust the path

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css'],
  imports: [CommonModule, ViewCalenderComponent],
})
export class ViewCardComponent implements OnInit {
  car: any;
  loading = true;
  error = false;
  @Output() onBook = new EventEmitter<void>();
  // Static side photos (fallback if not in JSON)
  sidePhotos = [
    '/assets/images/Rectangle 39.png',
    '/assets/images/Rectangle 40.png',
    '/assets/images/Rectangle 41.png',
    '/assets/images/Rectangle 42.png',
    '/assets/images/Rectangle 43.png',
  ];

  // Static reviews data
  staticReviews = [
    {
      name: 'Alex Johnson',
      profile: '/assets/images/profile1.png',
      ratingImage: '/assets/images/stars.png',
      comment: 'Great car! Very comfortable and powerful.',
      date: '2023-10-15',
      rating:'5',
    },
    {
      name: 'Maria Garcia',
      profile: '/assets/images/profile1.png',
      ratingImage: '/assets/images/stars.png',
      comment: 'Excellent service and the car was in perfect condition.',
      date: '2023-09-22',
      rating:'4',
    },
    {
      name: 'James Wilson',
      profile: '/assets/images/profile1.png',
      ratingImage: '/assets/images/stars.png',
      comment: 'Will definitely rent this car again. Smooth ride!',
      date: '2023-08-10',
      rating:'3',
    },
  ];

  // Calendar related properties
  showCalendar = false;
  calendarType: 'pickup' | 'dropoff' = 'pickup';
  pickupDate: Date = new Date();
  dropoffDate: Date = new Date(new Date().setDate(new Date().getDate() + 1));
  pickupTime = '10:00';
  dropoffTime = '10:00';
  
  // Reviews pagination
  currentPage = 1;
  itemsPerPage = 2;
  totalPages = Math.ceil(this.staticReviews.length / this.itemsPerPage);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { id: string },
    private carService: ViewcarService,
    private router: Router,
    private bookingService: BookingService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewCardComponent>
  ) {}


  ngOnInit(): void {
    this.getCarDetails();
  }


  getCarDetails(): void {
    this.carService.getCarById(this.data.id).subscribe(
      (response) => {
        this.car = response.data;
        console.log(this.car);
      },
      (error) => {
        console.error('Error retrieving car details:', error);
      }
    );
  }

  // Calendar methods
  openCalendar(type: 'pickup' | 'dropoff'): void {
    this.calendarType = type;
    this.showCalendar = true;
  }

  closeCalendar(): void {
    this.showCalendar = false;
  }

  onDateSelected(event: {
    start: Date;
    end: Date;
    pickupTime: string;
    dropoffTime: string;
  }): void {
    this.pickupDate = event.start;
    this.pickupTime = event.pickupTime;
    this.dropoffDate = event.end;
    this.dropoffTime = event.dropoffTime;
    this.closeCalendar();
  }
  

  formatDateWithTime(date: Date, time: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return `${date.toLocaleDateString('en-US', options)}, ${time}`;
  }

  // Review pagination methods
  get paginatedReviews(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.staticReviews.slice(start, end);
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    
    switch (value) {
      case 'newest':
        this.staticReviews.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'ratingLowHigh':
        this.staticReviews.sort((a, b) => 
          this.getRatingValue(a.rating) - this.getRatingValue(b.rating));
        break;
      case 'ratingHighLow':
        this.staticReviews.sort((a, b) => 
          this.getRatingValue(b.rating) - this.getRatingValue(a.rating));
        break;
    }
  }

  private getRatingValue(rating: string): number {
    return parseFloat(rating) || 0;
  }

  bookCar() {
  const storedUser = localStorage.getItem('currentUser');
  if (!storedUser) {
    const dialogRef = this.dialog.open(LoginPromptDialogComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'login') {
        this.dialogRef.close();
        this.onBook.emit(); // Close the view-card when navigating to login
        this.router.navigate(['/login']);
      }
    });
    return;
  }

  this.dialogRef.close();

  const bookingData = {
    car: this.car,
    pickupLocation: this.car.location,
    dropoffLocation: this.car.location,
    pickupDate: this.pickupDate,
    pickupTime: this.pickupTime,
    dropoffDate: this.dropoffDate,
    dropoffTime: this.dropoffTime
  };

  this.bookingService.setBookingDetails(bookingData);
  console.log('Navigating to /book-car');
  this.router.navigate(['/book-car']);
  this.onBook.emit(); // Close the view-card after successful booking
}

  closeView() {
    this.dialogRef.close();
  }

  
}