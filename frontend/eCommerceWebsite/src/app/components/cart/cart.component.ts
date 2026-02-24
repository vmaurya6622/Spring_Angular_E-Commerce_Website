import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, tap, catchError, startWith } from 'rxjs';
import { of } from 'rxjs';

interface CartItemView {
	id: number;
	title: string;
	price: number;
	image: string;
	quantity: number;
	stock: number;
	productId: number;
}

@Component({
	selector: 'app-cart',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule],
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
	searchText: string = '';
	darkMode: boolean = false;
	showDropdown: boolean = false;
	isLoggedIn: boolean = false;
	customerName: string = '';
	selectedCheckout: string = 'cod';
	shippingCost: number = 0;
	private cartItemsSubject = new BehaviorSubject<CartItemView[]>([]);
	private loadCartTrigger = new BehaviorSubject<void>(undefined);
	private quantityUpdateTrigger = new BehaviorSubject<{ id: number; qty: number } | null>(null);
	private removeItemTrigger = new BehaviorSubject<number | null>(null);
	private loadingSubject = new BehaviorSubject<boolean>(true);
	private errorMessageSubject = new BehaviorSubject<string>('');
	
	cartItems$: Observable<CartItemView[]>;
	isLoading$: Observable<boolean>;
	errorMessage$: Observable<string>;
	subtotal$: Observable<number>;
	tax$: Observable<number>;
	total$: Observable<number>;

	constructor(
		private cartService: CartService,
		private http: HttpClient,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		// cartItems$ observes directly from the subject (typed as CartItemView[])
		this.cartItems$ = this.cartItemsSubject.asObservable().pipe(shareReplay(1));
		this.isLoading$ = this.loadingSubject.asObservable().pipe(shareReplay(1));
		this.errorMessage$ = this.errorMessageSubject.asObservable().pipe(shareReplay(1));
		
		// Load cart trigger pipeline (updates cartItemsSubject)
		this.loadCartTrigger.pipe(
			switchMap(() => this.cartService.loadCart().pipe(
				tap(items => {
					this.cartItemsSubject.next(items.map(item => this.mapItem(item)));
					this.loadingSubject.next(false);
					this.errorMessageSubject.next('');
				}),
				catchError(err => {
					console.error('Error loading cart:', err);
					this.cartItemsSubject.next([]);
					this.loadingSubject.next(false);
					this.errorMessageSubject.next('Failed to load cart');
					return of(null);
				})
			))
		).subscribe();
		
		// Quantity update trigger pipeline (updates cartItemsSubject)
		this.quantityUpdateTrigger.pipe(
			switchMap(update => update ? this.cartService.updateQuantity(update.id, update.qty).pipe(
				tap(items => {
					this.cartItemsSubject.next(items.map(item => this.mapItem(item)));
					this.errorMessageSubject.next('');
				}),
				catchError(err => {
					console.error('Error updating quantity:', err);
					this.errorMessageSubject.next(err.error?.message || 'Failed to update quantity');
					this.loadCartTrigger.next();
					return of(null);
				})
			) : of(null))
		).subscribe();
		
		// Remove item trigger pipeline (updates cartItemsSubject)
		this.removeItemTrigger.pipe(
			switchMap(id => id ? this.cartService.removeItem(id).pipe(
				tap(items => {
					this.cartItemsSubject.next(items.map(item => this.mapItem(item)));
					this.errorMessageSubject.next('');
				}),
				catchError(err => {
					console.error('Error removing item:', err);
					this.errorMessageSubject.next(err.error?.message || 'Failed to remove item');
					this.loadCartTrigger.next();
					return of(null);
				})
			) : of(null))
		).subscribe();
		
		// Derived computed observables from cartItems$
		this.subtotal$ = this.cartItems$.pipe(
			map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0)),
			shareReplay(1)
		);
		
		this.tax$ = this.subtotal$.pipe(
			map(subtotal => Math.round(subtotal * 0.1)),
			shareReplay(1)
		);
		
		this.total$ = this.subtotal$.pipe(
			map(subtotal => subtotal + Math.round(subtotal * 0.1) + this.shippingCost),
			shareReplay(1)
		);
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			const customerData = localStorage.getItem('customer');
			if (!customerData) {
				this.loadingSubject.next(false);
				this.router.navigate(['/login']);
				return;
			}
			const customer = JSON.parse(customerData);
			this.isLoggedIn = true;
			this.customerName = customer.name || 'User';
			this.loadCartTrigger.next();
		}
	}



	increaseQuantity(id: number, currentQuantity: number): void {
		const item = this.cartItemsSubject.value.find(i => i.id === id);
		if (item && currentQuantity >= item.stock) {
			alert(`Cannot add more! Only ${item.stock} items available in stock.`);
			return;
		}
		this.quantityUpdateTrigger.next({ id, qty: currentQuantity + 1 });
	}

	decreaseQuantity(id: number, currentQuantity: number): void {
		this.quantityUpdateTrigger.next({ id, qty: currentQuantity - 1 });
	}

	removeItem(id: number): void {
		console.log('Removing item with id:', id);
		const currentItems = this.cartItemsSubject.value;
		const itemIndex = currentItems.findIndex(item => item.id === id);
		if (itemIndex > -1) {
			const updatedItems = [...currentItems];
			updatedItems.splice(itemIndex, 1);
			this.cartItemsSubject.next(updatedItems);
		}
		this.removeItemTrigger.next(id);
	}


	checkout(): void {
		if (this.cartItemsSubject.value.length === 0) {
			alert('Your cart is empty!');
			return;
		}

		if (!isPlatformBrowser(this.platformId)) return;

		const customerData = localStorage.getItem('customer');
		if (!customerData) {
			alert('Please login to checkout');
			this.router.navigate(['/login']);
			return;
		}

		const customer = JSON.parse(customerData);
		const checkoutRequest = {
			customerId: customer.id,
			paymentMethod: this.selectedCheckout,
			shippingCost: this.shippingCost
		};

		this.http.post('http://localhost:8080/api/orders/checkout', checkoutRequest).pipe(
			tap((order: any) => {
				const checkoutInfo = `
					Checkout Successful!
					==================
					Order ID: ${order.id}
					Payment Method: ${this.getCheckoutMethodName(this.selectedCheckout)}

					Subtotal: ₹${order.subtotal.toFixed(2)}
					Tax (10%): ₹${order.tax.toFixed(2)}
					Shipping: ${order.shippingCost === 0 ? 'FREE' : '₹' + order.shippingCost.toFixed(2)}
					Total: ₹${order.total.toFixed(2)}

					Items: ${order.items.length} item(s)
					Thank you for your purchase!
						`;
				alert(checkoutInfo);
				this.cartItemsSubject.next([]);
				this.router.navigate(['/orders']);
				window.location.href = '/orders';
			}),
			catchError((err: any) => {
				console.error('Checkout error:', err);
				alert(err.error?.message || 'Checkout failed. Please try again.');
				return of(null);
			})
		).subscribe();
	}
	private getCheckoutMethodName(method: string): string {
		const methods: { [key: string]: string } = {
			'cod': 'Cash on Delivery',
			'card': 'Debit/Credit Card',
			'upi': 'UPI Payment',
			'wallet': 'Digital Wallet'
		};
		return methods[method] || method;
	}

	toggleTheme() {
		this.darkMode = !this.darkMode;
	}

	login() {
		this.router.navigate(['/login']);
	}

	logout() {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('customer');
		}
		this.isLoggedIn = false;
		this.customerName = '';
		this.showDropdown = false;
		this.router.navigate(['/login']);
	}

	navigateToProfile() {
		this.router.navigate(['/profile']);
	}

	navigateToAddress() {
		this.router.navigate(['/address']);
	}

	navigateToOrders() {
		this.router.navigate(['/orders']);
	}

	continueShopping(): void {
		this.router.navigate(['/']);
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}

	trackByItemId(index: number, item: CartItemView): number {
		return item.id;
	}

	private mapItem(item: CartItem): CartItemView {
		return {
			id: item.id,
			title: item.product.name,
			price: item.product.price,
			image: item.product.imageUrl,
			quantity: item.quantity,
			stock: item.product.stock,
			productId: item.product.id
		};
	}
}
