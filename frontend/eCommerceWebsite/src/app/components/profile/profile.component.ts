import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Customer {
  id: number;
  name: string;
  email: string;
  username: string;
  age: number;
  sex: string;
  dob: string;
  mobile: string;
  address: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  customer: Customer | null = null;
  isEditing: boolean = false;
  isSaving: boolean = false;
  messageBox: { type: 'success' | 'error', message: string } | null = null;

  constructor(
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const customerData = localStorage.getItem('customer');
      if (customerData) {
        this.customer = JSON.parse(customerData);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  startEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.messageBox = null;
  }

  saveProfile(): void {
    if (!this.customer) return;

    this.isSaving = true;
    // Simulate API call
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('customer', JSON.stringify(this.customer));
      }
      this.isSaving = false;
      this.isEditing = false;
      this.messageBox = {
        type: 'success',
        message: 'Profile updated successfully!'
      };
      setTimeout(() => {
        this.messageBox = null;
      }, 3000);
    }, 1000);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('customer');
    }
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
