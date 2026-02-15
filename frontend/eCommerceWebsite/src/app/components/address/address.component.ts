import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Customer {
  id: number;
  name: string;
  email: string;
  address: string;
}

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  customer: Customer | null = null;
  newAddress: string = '';
  isAdding: boolean = false;
  isSaving: boolean = false;
  addresses: string[] = [];
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
        // Initialize addresses from customer data
        if (this.customer?.address) {
          this.addresses = [this.customer.address];
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  startAddAddress(): void {
    this.isAdding = true;
    this.newAddress = '';
  }

  cancelAddAddress(): void {
    this.isAdding = false;
    this.newAddress = '';
  }

  addAddress(): void {
    if (!this.newAddress.trim()) {
      this.messageBox = { type: 'error', message: 'Please enter an address' };
      return;
    }

    this.isSaving = true;
    
    setTimeout(() => {
      this.addresses.push(this.newAddress);
      if (this.customer) {
        this.customer.address = this.newAddress;
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('customer', JSON.stringify(this.customer));
        }
      }
      this.isSaving = false;
      this.isAdding = false;
      this.messageBox = {
        type: 'success',
        message: 'Address added successfully!'
      };
      setTimeout(() => {
        this.messageBox = null;
      }, 3000);
    }, 1000);
  }

  deleteAddress(index: number): void {
    this.addresses.splice(index, 1);
    this.messageBox = {
      type: 'success',
      message: 'Address deleted successfully!'
    };
    setTimeout(() => {
      this.messageBox = null;
    }, 3000);
  }

  selectAddress(address: string): void {
    if (this.customer) {
      this.customer.address = address;
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('customer', JSON.stringify(this.customer));
      }
      this.messageBox = {
        type: 'success',
        message: 'Address selected as default!'
      };
      setTimeout(() => {
        this.messageBox = null;
      }, 2000);
    }
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
