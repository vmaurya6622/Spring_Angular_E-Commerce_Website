import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';

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
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef, // this helps to detect changes after async operations and show them live on screen.
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadCustomerProfile();
  }

  private loadCustomerProfile(): void {
    if (isPlatformBrowser(this.platformId)) {
      let customerData = localStorage.getItem('customer');
      // Fallback to sessionStorage if not in localStorage
      if (!customerData) {
        customerData = sessionStorage.getItem('customer');
        if (customerData) {
          console.log('Found customer in sessionStorage, saving to localStorage');
          localStorage.setItem('customer', customerData);
        }
      }
      
      if (customerData) {
        try {
          this.customer = JSON.parse(customerData);
          console.log('Customer loaded:', this.customer);
          this.cdr.detectChanges();
        } catch (e) {
          console.error('Error parsing customer data:', e);
          this.customer = null;
        }
      } else {
        console.warn('No customer data in localStorage or sessionStorage');
        this.customer = null;
      }
    }
  }

  startEdit(): void {
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.messageBox = null;
    // Reload from localStorage to discard changes
    this.loadCustomerProfile();
  }

  saveProfile(): void {
    if (!this.customer) return; // Should never happen, but just to be safe

    this.isSaving = true;
    this.cdr.detectChanges();

    // Send update request to backend
    this.customerService.updateCustomer(this.customer.id, this.customer).subscribe({
      next: (response: any) => {
        const updatedCustomer = response.customer || response;
        
        // Update localStorage with new data from server
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('customer', JSON.stringify(updatedCustomer));
        }
        
        this.customer = updatedCustomer;
        this.isSaving = false;
        this.isEditing = false;
        this.messageBox = {
          type: 'success',
          message: 'Profile updated successfully!'
        };
        this.cdr.detectChanges();
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.messageBox = null;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.isSaving = false;
        this.messageBox = {
          type: 'error',
          message: err.error?.message || 'Failed to update profile. Please try again.'
        };
        this.cdr.detectChanges();
      }
    });
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

  refershProfile(): void {
    // Refresh customer data from localStorage
    this.loadCustomerProfile();
  }
}
