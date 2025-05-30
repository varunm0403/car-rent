// src/app/core/services/user.service.ts
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Injectable, Inject} from '@angular/core';


@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:3001'; // Update with your backend URL
  private authApiUrl = `${this.baseUrl}/auth`;
  private usersApiUrl = `${this.baseUrl}/users`;
  private adminApiUrl = `${this.baseUrl}/admin`;

  constructor(@Inject(PLATFORM_ID) private platformId: Object , private http: HttpClient) {}

  // For registration
  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/sign-up`, userData);
  }

  // For login
  loginUser(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.authApiUrl}/sign-in`, credentials);
  }

  // Get user profile
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.usersApiUrl}/profile`);
  }

  // Update personal information
  updatePersonalInfo(userData: any): Observable<any> {
    return this.http.put<any>(`${this.usersApiUrl}/profile`, userData);
  }

  // Change password
  changePassword(passwordData: any): Observable<any> {
    return this.http.put<any>(`${this.usersApiUrl}/password`, passwordData);
  }

  // Get all users (admin only)
  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.adminApiUrl}/users`);
  }

  // Get all clients (admin only)
  getClients(): Observable<any> {
    return this.http.get<any>(`${this.adminApiUrl}/clients`);
  }

  // Get all support agents (admin only)
  getSupportAgents(): Observable<any> {
    return this.http.get<any>(`${this.adminApiUrl}/agents`);
  }

  // Update user role (admin only)
  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put<any>(`${this.adminApiUrl}/users/${userId}/role`, { role });
  }


  // Get user role
  getUserRole(): string | null {
    return this.getCurrentUser()?.role || 'user';
  }

  // Get user ID
  getCurrentUser(): any {
  if (isPlatformBrowser(this.platformId)) {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      return currentUser;
    } else {
      console.log('currentUser not found in local storage');
    }
  }
  return {};
}
  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.getCurrentUser();
      return user.userId || null;
    }
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}