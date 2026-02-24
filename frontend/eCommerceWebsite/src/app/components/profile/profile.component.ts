import { firstValueFrom } from 'rxjs';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
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
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

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
	}

	cancelEdit(): void {
		this.isEditing = false;
		this.messageBox = null;
		this.loadCustomerProfile();
	}

	async saveProfile(): Promise<void> {
		if (!this.customer) return;
		this.isSaving = true;
		this.messageBox = null;
		try {
			const response: any = await firstValueFrom(this.customerService.updateCustomer(this.customer.id, this.customer));
			const updatedCustomer = response.customer || response; // Handle both { customer: ... } and direct customer response
			if (isPlatformBrowser(this.platformId)) {
				localStorage.setItem('customer', JSON.stringify(updatedCustomer));
			}
			this.customer = updatedCustomer;
			this.isEditing = false;
			this.showMessage('success', 'Profile updated successfully!');
		} catch (err: any) {
			console.error('Error updating profile:', err);
			this.showMessage('error', err.error?.message || 'Failed to update profile. Please try again.');
		} finally {
			this.isSaving = false;
		}
	}

	private showMessage(
		type: 'success' | 'error',
		message: string,
		duration = 3000
	): void {
		this.messageBox = { type, message };

		setTimeout(() => {
			this.messageBox = null;
		}, duration);
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

	refreshProfile(): void {
		this.loadCustomerProfile();
	}
}
