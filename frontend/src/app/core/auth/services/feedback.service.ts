import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
 
interface FeedbackInfo{
  author:string,
  carImage:string,
  carModel:string,
  date:string,
  feedbackId:string,
  feedbackText:string,
  orderHistory:string,
  rating:number,
}
 
interface FeedbackInfoResponse{
  content:FeedbackInfo[];
  count : number;
}
 
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(private http: HttpClient) { }
  private baseUrl = 'https://srxgoioj5k.execute-api.ap-south-1.amazonaws.com/dev/feedbacks/recent'
  getFeedbackInfo(): Observable<FeedbackInfoResponse>{
    return this.http.get<FeedbackInfoResponse>(`${this.baseUrl}`).pipe(
          catchError(error => {
                  console.error('FAQ error:', error);
                  return throwError(() => error);
                })
          );
  }
}