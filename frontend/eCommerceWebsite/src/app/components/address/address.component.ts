import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

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
	newAddress: string = '';
	isAdding: boolean = false;
	isSaving: boolean = false;
	private customerSubject = new BehaviorSubject<Customer | null>(null);
	customer$: Observable<Customer | null> = this.customerSubject.asObservable().pipe(shareReplay(1));
	private addressesSubject = new BehaviorSubject<string[]>([]);
	addresses$: Observable<string[]> = this.addressesSubject.asObservable().pipe(shareReplay(1));
	messageBox: { type: 'success' | 'error', message: string } | null = null;

	constructor(
		public router: Router,
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

	ngOnInit(): void {
		if (!isPlatformBrowser(this.platformId)) return;
		const customerData = localStorage.getItem('customer');
		if (!customerData) {
			this.router.navigate(['/login']);
			return;
		}
		this.customerSubject.next(JSON.parse(customerData));
		this.initializeAddresses();
	}

	private initializeAddresses(): void {
		const customer = this.customerSubject.value;
		if (!customer) {
			return;
		}
		if (Array.isArray(customer.addresses) && customer.addresses.length > 0) {
			this.addressesSubject.next([...customer.addresses]);
			if (!customer.address || !this.addressesSubject.value.includes(customer.address)) {
				customer.address = this.addressesSubject.value[0];
			}
		} else if (customer.address) {
			this.addressesSubject.next([customer.address]);
		} else {
			this.addressesSubject.next([]);
		}
		this.customerSubject.next(customer);
		this.persistCustomer();
	}

	private persistCustomer(): void {
		const customer = this.customerSubject.value;
		if (!customer || !isPlatformBrowser(this.platformId)) return;

		customer.addresses = [...this.addressesSubject.value];
		this.customerSubject.next(customer);
		localStorage.setItem('customer', JSON.stringify(customer));
	}

	startAddAddress(): void {
		this.isAdding = true;
		this.newAddress = '';
	}

	cancelAddAddress(): void {
		this.isAdding = false;
		this.newAddress = '';
	}

	private showMessage(type: 'success' | 'error', message: string, duration = 3000): void {
		this.messageBox = { type, message };
		setTimeout(() => {
			this.messageBox = null;
		}, duration);
	}

	addAddress(): void {
		const trimmedAddress = this.newAddress.trim();
		if (!trimmedAddress) {
			this.showMessage('error', 'Please enter an address');
			return;
		}

		this.isSaving = true;

		setTimeout(() => {
			const addresses = [...this.addressesSubject.value, trimmedAddress];
			this.addressesSubject.next(addresses);
			const customer = this.customerSubject.value;
			if (customer && !customer.address) {
				customer.address = trimmedAddress;
				this.customerSubject.next(customer);
			}
			this.persistCustomer();
			this.isSaving = false;
			this.isAdding = false;
			this.showMessage('success', 'Address added successfully!');
		}, 1000);
	}

	deleteAddress(index: number): void {
		const currentAddresses = this.addressesSubject.value;
		if (currentAddresses.length <= 1) {
			this.showMessage('error', 'At least one address is required');
			return;
		}
		const removedAddress = currentAddresses[index];
		const updatedAddresses = [...currentAddresses];
		updatedAddresses.splice(index, 1);
		this.addressesSubject.next(updatedAddresses);
		const customer = this.customerSubject.value;
		if (customer?.address === removedAddress) {
			customer.address = updatedAddresses[0] ?? '';
			this.customerSubject.next(customer);
		}
		this.persistCustomer();
		this.showMessage('success', 'Address deleted successfully!');
	}

	selectAddress(address: string): void {
		const customer = this.customerSubject.value;
		if (customer) {
			customer.address = address;
			this.customerSubject.next(customer);
			this.persistCustomer();
			this.showMessage('success', 'Address selected as default!', 2000);
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
