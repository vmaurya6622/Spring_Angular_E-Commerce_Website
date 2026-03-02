import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService, Customer } from '../../services/customer.service';
import { BehaviorSubject, Observable, Subject, catchError, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { CommonFooterComponent } from '../Common/CommonFooter/CommonFooter';

@Component({
	selector: 'app-profile',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule,CommonFooterComponent],
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	private readonly customerSubject = new BehaviorSubject<Customer | null>(null);
	readonly customer$: Observable<Customer | null> = this.customerSubject.asObservable();
	private readonly isEditingSubject = new BehaviorSubject<boolean>(false);
	readonly isEditing$: Observable<boolean> = this.isEditingSubject.asObservable();
	private readonly isSavingSubject = new BehaviorSubject<boolean>(false);
	readonly isSaving$: Observable<boolean> = this.isSavingSubject.asObservable();
	private readonly messageBoxSubject = new BehaviorSubject<{ type: 'success' | 'error', message: string } | null>(null);
	readonly messageBox$: Observable<{ type: 'success' | 'error', message: string } | null> = this.messageBoxSubject.asObservable();
	private readonly saveProfileTrigger = new Subject<void>();
	readonly saveProfileEffect$ = this.saveProfileTrigger.pipe(
		switchMap(() => {
			const customer = this.customerSubject.value;
			if (!customer) {
				return of(null);
			}

			this.isSavingSubject.next(true);
			this.messageBoxSubject.next(null);

			return this.customerService.updateCustomer(customer.id, customer).pipe(
				tap((response: any) => {
					const updatedCustomer = response?.data ?? response?.customer ?? response;
					if (isPlatformBrowser(this.platformId)) {
						localStorage.setItem('customer', JSON.stringify(updatedCustomer));
					}
					this.customerSubject.next(updatedCustomer);
					this.isEditingSubject.next(false);
					this.showMessage('success', 'Profile updated successfully!');
				}),
				catchError((err: any) => {
					this.showMessage(
						'error', err.error?.message || 'Failed to update the profile. Please try again.'
					);
					return of(null);
				}),
				tap(() => this.isSavingSubject.next(false))
			);
		}),
		startWith(null),
		shareReplay(1)
	);

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
				this.customerSubject.next(JSON.parse(customerData));

			} catch {
				this.customerSubject.next(null);
			}
		} else {
			this.customerSubject.next(null);
		}
	}

	startEdit(): void {
		this.isEditingSubject.next(true);
	}

	cancelEdit(): void {
		this.isEditingSubject.next(false);
		this.messageBoxSubject.next(null);
		this.loadCustomerProfile();
	}

	saveProfile(): void {
		this.saveProfileTrigger.next();
	}
	
	private showMessage(
		type: 'success' | 'error',
		message: string,
		duration = 1000
	): void {
		this.messageBoxSubject.next({ type, message });

		setTimeout(() => {
			this.messageBoxSubject.next(null);
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
