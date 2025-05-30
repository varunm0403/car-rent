import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FaqResponse {
  success: boolean;
  message: string;
  data: {
    content: FaqItem[];
  };
}

export interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean; // Optional flag for toggling visibility
}

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = 'http://localhost:3002/api/v1/faqs';

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<FaqItem[]> {
    return this.http.get<FaqResponse>(this.apiUrl).pipe(
      map(response => response.data.content)
    );
  }
}