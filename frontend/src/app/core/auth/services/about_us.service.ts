import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AboutUsInfo {
  title: string;
  numericValue: string;
  description: string;
}

interface AboutUsResponse {
  success: boolean;
  message: string;
  data: {
    content: AboutUsInfo[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {
  private baseUrl = 'http://localhost:3002/api/v1/about-us';

  constructor(private http: HttpClient) { }

  getAboutUsInfo(): Observable<AboutUsInfo[]> {
    return this.http.get<AboutUsResponse>(this.baseUrl).pipe(
      map(response => response.data.content)
    );
  }
}