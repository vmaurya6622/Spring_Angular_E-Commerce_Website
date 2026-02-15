import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, map, tap, throwError } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

interface CartResponse {
	id: number;
	items: CartItem[];
}

@Injectable({
	providedIn: 'root'
})
export class CartService {
	private readonly baseUrl = 'http://localhost:8080/api/cart';
	private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
	readonly cartItems$ = this.cartItemsSubject.asObservable();

	constructor(
		private http: HttpClient,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	private getCustomerId(): number | null {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}
		const customerData = localStorage.getItem('customer');
		if (customerData) {
			const customer = JSON.parse(customerData);
			return customer.id;
		}
		return null;
	}

	loadCart(): Observable<CartItem[]> {
		const customerId = this.getCustomerId();
		if (!customerId) {
			return throwError(() => new Error('Please login to view cart'));
		}
		return this.http.get<CartResponse>(`${this.baseUrl}/${customerId}`).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}

	addItem(productId: number, quantity: number): Observable<CartItem[]> {
		const customerId = this.getCustomerId();
		if (!customerId) {
			return throwError(() => new Error('Please login to add items to cart'));
		}
		return this.http.post<CartResponse>(`${this.baseUrl}/${customerId}/items`, { productId, quantity }).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}

	updateQuantity(itemId: number, quantity: number): Observable<CartItem[]> {
		const customerId = this.getCustomerId();
		if (!customerId) {
			return throwError(() => new Error('Please login to update cart'));
		}
		return this.http.patch<CartResponse>(`${this.baseUrl}/${customerId}/items/${itemId}`, { quantity }).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}

	removeItem(itemId: number): Observable<CartItem[]> {
		const customerId = this.getCustomerId();
		if (!customerId) {
			return throwError(() => new Error('Please login to remove items'));
		}
		return this.http.delete<CartResponse>(`${this.baseUrl}/${customerId}/items/${itemId}`).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}
}
