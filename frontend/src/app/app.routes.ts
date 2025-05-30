import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CarPageComponent } from './pages/car-page/car-page.component';
import { CarBookingComponent } from './shared/components/car-booking/car-booking.component';
import { MyBookingsComponent } from './shared/components/my-bookings/my-bookings.component';
import { AuthGuard } from './core/auth/guard/auth.guard';
import { SupportDashboardComponent } from './dashboard/support-dashboard/support-dashboard.component';
import { EditBookingComponent } from './shared/components/edit-booking/edit-booking.component';
import { UserProfileComponent } from './shared/components/user-profile/user-profile.component';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import { DocumentsComponent } from './shared/components/user-documents/user-documents.component';
import { AdminDashComponent } from './dashboard/admin-dash/admin-dash.component';

export const routes: Routes = [
  // Public routes - accessible to everyone
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cars', component: CarPageComponent }, // Page that lists cars
  { path: '', component: HomeComponent }, // Landing page
  
  // Client-specific routes
  { 
    path: 'book-car', 
    component: CarBookingComponent,
    canActivate: [AuthGuard],
    data: { role: 'Client' }
  },
  { 
    path: 'my-bookings', 
    component: MyBookingsComponent,
    canActivate: [AuthGuard],
    data: { role: 'Client' }
  },
  
  // User profile routes - accessible to all logged-in users
  { path: 'user-profile', redirectTo: 'user-profile/info', pathMatch: 'full' },
  { 
    path: 'user-profile/info', 
    component: UserProfileComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'user-profile/change-password', 
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'user-profile/documents', 
    component: DocumentsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'user-profile/reviews', 
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  
  // Support dashboard - only for support staff
  { 
    path: 'support-dashboard',
    component: SupportDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'Support' }
  },
  
  // Admin dashboard - only for admins
  { 
    path: 'admin-dashboard', 
    component: AdminDashComponent,
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  
  // Edit booking - accessible to Support and Admin roles
  { 
    path: 'edit-booking', 
    component: EditBookingComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Support', 'Admin'] } // Note: This requires a small modification to the AuthGuard
  },
  
  // Wildcard route redirects to home
  { path: '**', redirectTo: '' }
];