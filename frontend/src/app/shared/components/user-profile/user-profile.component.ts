import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileSidebarComponent } from '../profile-sidebar/profile-sidebar.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule,  ProfileSidebarComponent ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user = {
    name: 'Anastasia',
    surname: 'Dobrota',
    email: 'dobrota@gmail.com',
    phone: '+380 11 111 11 11',
    country: 'Ukraine',
    city: 'Kyiv',
    postalCode: '04210',
    street: 'Velyka Vasylkivska'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Update user object with data from localStorage if available
      this.user = {
        name: userData.firstName || this.user.name,
        surname: userData.lastName || this.user.surname,
        email: userData.email || this.user.email,
        phone: userData.phone || this.user.phone,
        country: userData.country || this.user.country,
        city: userData.city || this.user.city,
        postalCode: userData.postalCode || this.user.postalCode,
        street: userData.street || this.user.street
      };
    }

    // Initialize form with user data
    this.profileForm = this.fb.group({
      name: [this.user.name],
      surname: [this.user.surname],
      phone: [this.user.phone],
      country: [this.user.country],
      city: [this.user.city],
      postalCode: [this.user.postalCode],
      street: [this.user.street]
    });
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      console.log('Form submitted:', this.profileForm.value);
      
      // Get current user data from localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Update user data with form values
        const updatedUser = {
          ...userData,
          firstName: this.profileForm.value.name,
          lastName: this.profileForm.value.surname,
          phone: this.profileForm.value.phone,
          country: this.profileForm.value.country,
          city: this.profileForm.value.city,
          postalCode: this.profileForm.value.postalCode,
          street: this.profileForm.value.street
        };
        
        // Save updated user data back to localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update the component's user object
        this.user = {
          name: updatedUser.firstName,
          surname: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          country: updatedUser.country,
          city: updatedUser.city,
          postalCode: updatedUser.postalCode,
          street: updatedUser.street
        };
        
        // Provide feedback to the user
        alert('Profile updated successfully!');
      }
    }
  }
}