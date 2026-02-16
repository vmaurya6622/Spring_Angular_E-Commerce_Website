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
  addresses?: string[];
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
        this.initializeAddresses();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  private initializeAddresses(): void {
    if (!this.customer) {
      return;
    }
    if (Array.isArray(this.customer.addresses) && this.customer.addresses.length > 0) {
      this.addresses = [...this.customer.addresses];
      if (!this.customer.address || !this.addresses.includes(this.customer.address)) {
        this.customer.address = this.addresses[0];
      }
    } else if (this.customer.address) {
      this.addresses = [this.customer.address];
    } else {
      this.addresses = [];
    }
    this.persistCustomer();
  }

  private persistCustomer(): void {
    if (!this.customer) {
      return;
    }
    this.customer.addresses = [...this.addresses];
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('customer', JSON.stringify(this.customer));
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
    const trimmedAddress = this.newAddress.trim();
    if (!trimmedAddress) {
      this.messageBox = { type: 'error', message: 'Please enter an address' };
      return;
    }

    this.isSaving = true;
    
    setTimeout(() => {
      this.addresses.push(trimmedAddress);
      if (this.customer && !this.customer.address) {
        this.customer.address = trimmedAddress;
      }
      this.persistCustomer();
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
    if (this.addresses.length <= 1) {
      this.messageBox = {
        type: 'error',
        message: 'At least one address is required'
      };
      setTimeout(() => {
        this.messageBox = null;
      }, 3000);
      return;
    }
    const removedAddress = this.addresses[index];
    this.addresses.splice(index, 1);
    if (this.customer?.address === removedAddress) {
      this.customer.address = this.addresses[0] ?? '';
    }
    this.persistCustomer();
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
      this.persistCustomer();
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
