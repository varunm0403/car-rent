import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient , HttpHeaders } from '@angular/common/http';

export interface BookingDetails {
  car: {
    model: string;
    rating: number;
    location: string;
    availability: string;
    pricePerDay: number;
    features: string[];
    images : string[];
    mainPhoto: string;
    sidePhotos: string[];
    startMileage?: number; // Optional field for start mileage
    endMileage?: number; // Optional field for end mileage
  };
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date;
  dropoffTime: string;
  totalPrice?: number;
  status?: string; // Add status field
  orderId?: string; // Add orderId field if needed
  date?: string;
  bookingNumber?: number;
  clientName?: string; // Client name or ID
  madeBy?: string;
  period?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private baseUrl = 'http://localhost:3000'; // Update with your backend URL
  private bookingsApiUrl = `${this.baseUrl}/bookings`;

  // Single booking details (for current booking flow)
  private bookingDetailsSubject = new BehaviorSubject<BookingDetails | null>(null);
  bookingDetails$ = this.bookingDetailsSubject.asObservable();

  // Multiple bookings management (used for My Bookings page)
  private bookingsSubject = new BehaviorSubject<BookingDetails[]>([]);
  bookings$ = this.bookingsSubject.asObservable();
  private editingBookingSource = new BehaviorSubject<BookingDetails | null>(null);
  currentEditingBooking$ = this.editingBookingSource.asObservable();

  constructor(private http: HttpClient) {}

  // Create a new booking
  createBooking(bookingData: any): Observable<any> {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const token = user.idToken;
      console.log('Token retrieved from currentUser:', token); // Debugging statement

      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        console.log('Headers:', headers); // Debugging statement

        return this.http.post<any>(this.bookingsApiUrl, bookingData, { headers });
      } else {
        console.warn('Token not found in currentUser'); // Debugging statement
      }
    } else {
      console.warn('No currentUser found in local storage'); // Debugging statement
    }

    // If no token or currentUser found, make the request without the token
    return this.http.post<any>(this.bookingsApiUrl, bookingData);
  }

  // Get all bookings for the current user
  getBookings(): Observable<any> {
    return this.http.get<any>(this.bookingsApiUrl);
  }

  // Update a booking
  updateBooking(bookingId: string, bookingData: any): Observable<any> {
    return this.http.put<any>(`${this.bookingsApiUrl}/${bookingId}`, bookingData);
  }

  // Delete a booking
  deleteBooking(bookingId: string): Observable<any> {
    return this.http.delete<any>(`${this.bookingsApiUrl}/${bookingId}`);
  }

  // Get a booking by ID
  getBookingById(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.bookingsApiUrl}/${bookingId}`);
  }

   getBookingsByUserId(userId: string): Observable<any> {
  const url = `${this.baseUrl}/bookings/user/${userId}`;
  console.log('API URL:', url);

  const storedUser = localStorage.getItem('currentUser');
  
  if (storedUser) {
    const user = JSON.parse(storedUser);
    const token = user.idToken;
    console.log('Token retrieved from currentUser:', token);

    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log('Headers:', headers);

      return this.http.get<any>(url, { headers });
    } else {
      console.warn('Token not found in currentUser');
    }
  } else {
    console.warn('No currentUser found in local storage');
  }

  // If no token or currentUser found, make the request without the token
  return this.http.get<any>(url);
}

  setBookingDetails(data: BookingDetails): void {
    this.bookingDetailsSubject.next(data);
    console.log('Booking details set (via subject):', data);
  }

  getBookingDetails(): Observable<BookingDetails | null> {
    console.log("Getting booking details...");
    return this.bookingDetails$;
  }

  getCurrentBookingDetails(): BookingDetails | null {
    return this.bookingDetailsSubject.value;
  }

  addBooking(booking: BookingDetails): void {
    const currentBookings = this.bookingsSubject.getValue();

    // Check if booking with this orderId already exists
    const existingIndex = currentBookings.findIndex(b => b.orderId === booking.orderId);

    if (existingIndex !== -1) {
      // Replace existing booking
      currentBookings[existingIndex] = booking;
    } else {
      // Add new booking
      currentBookings.push(booking);
    }

    this.bookingsSubject.next([...currentBookings]);
  }


  clearBookings(): void {
    this.bookingsSubject.next([]);
    console.log('All bookings cleared.');
  }

  setEditingBooking(booking: BookingDetails) {
    console.log("here");
    this.editingBookingSource.next(booking);
  }

  clearEditingBooking() {
    this.editingBookingSource.next(null);
  }

  // updateBooking(updatedBooking: BookingDetails): void {
  //   const currentBookings = this.bookingsSubject.getValue();
  //   const index = currentBookings.findIndex(b => b.orderId === updatedBooking.orderId); // Find the booking by orderId

  //   if (index !== -1) {
  //     // Remove the old booking and add the updated one
  //     currentBookings.splice(index, 1, updatedBooking); // Replace the old booking with the updated one
  //     this.bookingsSubject.next([...currentBookings]); // Emit the updated list
  //   } else {
  //     console.error('Booking not found for update!');
  //   }
  // }

  // Optional: Remove a booking by orderId
  removeBooking(orderId: string): void {
    const currentBookings = this.bookingsSubject.getValue();
    const updatedBookings = currentBookings.filter(booking => booking.orderId !== orderId);
    this.bookingsSubject.next(updatedBookings); // Emit the updated list
  }
}