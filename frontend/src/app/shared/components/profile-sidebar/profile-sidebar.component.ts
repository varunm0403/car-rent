// src/app/shared/profile-sidebar/profile-sidebar.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-sidebar.component.html',
  styleUrl: './profile-sidebar.component.css'
  
})
export class ProfileSidebarComponent {}