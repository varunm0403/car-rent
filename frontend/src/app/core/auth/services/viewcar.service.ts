import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewcarService {
  private baseUrl = 'http://localhost:3002/api/v1/cars';

  constructor(private http: HttpClient) {}

  // Get all cars from API
  getCars(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Get car by ID from API
  getCarById(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<any>(url);
  }
}
