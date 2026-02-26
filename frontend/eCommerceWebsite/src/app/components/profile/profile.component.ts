import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {  catchError, of ,tap} from 'rxjs';
import { CommonFooterComponent } from '../Common/CommonFooter/CommonFooter';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule,CommonFooterComponent],
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	customer$ = new BehaviorSubject<Customer | null>(null);
	isEditing$ = new BehaviorSubject<boolean>(false);
	isSaving$ = new BehaviorSubject<boolean>(false);
	messageBox$ = new BehaviorSubject<{ type: 'success' | 'error', message: string } | null>(null);

	constructor(
		public router: Router,
		private customerService: CustomerService,
		@Inject(PLATFORM_ID) private platformId: Object
	) { }

	ngOnInit(): void {
		this.loadCustomerProfile();
	}

	private loadCustomerProfile(): void {
		if (!isPlatformBrowser(this.platformId)) return;
		let customerData = localStorage.getItem('customer') || sessionStorage.getItem('customer');
		if (customerData) {
			try {
				this.customer$.next(JSON.parse(customerData));

			} catch {
				this.customer$.next(null);
			}
		} else {
			this.customer$.next(null);
		}
	}

	startEdit(): void {
		this.isEditing$.next(true);
	}

	cancelEdit(): void {
		this.isEditing$.next(false);
		this.messageBox$.next(null);
		this.loadCustomerProfile();
	}

	saveProfile():void{
		const customer = this.customer$.value;
		if(!customer)return;
		this.isSaving$.next(true);
		this.messageBox$.next(null);
		this.customerService.updateCustomer(customer.id, customer).pipe(
			tap((response:any)=>{
				const updatedCustomer = response?.data ?? response?.customer ?? response;
				if(isPlatformBrowser(this.platformId)) {
					localStorage.setItem('customer',JSON.stringify(updatedCustomer));
				}
				this.customer$.next(updatedCustomer);
				this.isEditing$.next(false);
				this.showMessage('success','Profile updated successfully!');
			}),
			catchError((err)=>{
				this.showMessage(
					'error',err.error?.message || 'Failed to update the profile. Please try again.'
				);
				return of(null);
			}),tap(() => this.isSaving$.next(false))).subscribe();
	}
	
	private showMessage(
		type: 'success' | 'error',
		message: string,
		duration = 1000
	): void {
		this.messageBox$.next({ type, message });

		setTimeout(() => {
			this.messageBox$.next(null);
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
