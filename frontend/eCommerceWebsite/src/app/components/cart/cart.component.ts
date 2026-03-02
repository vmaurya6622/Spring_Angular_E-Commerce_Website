import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, shareReplay, firstValueFrom } from 'rxjs';
import { CommonFooterComponent } from '../Common/CommonFooter/CommonFooter';

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
	imports: [CommonModule, FormsModule, RouterModule,CommonFooterComponent],
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
		this.cartItems$ = this.cartItemsSubject.asObservable().pipe(shareReplay(1));
		this.isLoading$ = this.loadingSubject.asObservable().pipe(shareReplay(1));
		this.errorMessage$ = this.errorMessageSubject.asObservable().pipe(shareReplay(1));

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
			void this.loadCart();
		}
	}

    private async loadCart(): Promise<void> {
		this.loadingSubject.next(true);
		try {
			const items = await firstValueFrom(this.cartService.loadCart());
			this.cartItemsSubject.next(items.map(item => this.mapItem(item)));
			this.errorMessageSubject.next('');
		} catch (err) {
			console.error('Error loading cart:', err);
			this.cartItemsSubject.next([]);
			this.errorMessageSubject.next('Failed to load cart');
		} finally {
			this.loadingSubject.next(false);
		}
	}

	private async updateQuantity(id: number, qty: number): Promise<void> {
		try {
			const items = await firstValueFrom(this.cartService.updateQuantity(id, qty));
			this.cartItemsSubject.next(items.map(item => this.mapItem(item)));
			this.errorMessageSubject.next('');
		} catch (err: any) {
			console.error('Error updating quantity:', err);
			this.errorMessageSubject.next(err.error?.message || 'Failed to update quantity');
			await this.loadCart();
		}
	}

	private async removeCartItem(id: number): Promise<void> {
		try {
			const items = await firstValueFrom(this.cartService.removeItem(id));
			this.cartItemsSubject.next(items.map(item => this.mapItem(item)));
			this.errorMessageSubject.next('');
		} catch (err: any) {
			console.error('Error removing item:', err);
			this.errorMessageSubject.next(err.error?.message || 'Failed to remove item');
			await this.loadCart();
		}
	}
	increaseQuantity(id: number, currentQuantity: number): void {
		const item = this.cartItemsSubject.value.find(i => i.id === id);
		if (item && currentQuantity >= item.stock) {
			alert(`Cannot add more! Only ${item.stock} items available in stock.`);
			return;
		}
		void this.updateQuantity(id, currentQuantity + 1);
	}

	decreaseQuantity(id: number, currentQuantity: number): void {
		void this.updateQuantity(id, currentQuantity - 1);
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
		void this.removeCartItem(id);
	}


	async checkout(): Promise<void> {
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

		try {
			const order: any = await firstValueFrom(
				this.http.post('http://localhost:8080/api/orders/checkout', checkoutRequest)
			);
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
		} catch (err: any) {
			console.error('Checkout error:', err);
			alert(err.error?.message || 'Checkout failed maybe the product is now out of stock. Please try again...');
		}
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
