import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
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

	constructor(private http: HttpClient) {}

	loadCart(): Observable<CartItem[]> {
		return this.http.get<CartResponse>(this.baseUrl).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}

	addItem(productId: number, quantity: number): Observable<CartItem[]> {
		return this.http.post<CartResponse>(`${this.baseUrl}/items`, { productId, quantity }).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}

	updateQuantity(itemId: number, quantity: number): Observable<CartItem[]> {
		return this.http.patch<CartResponse>(`${this.baseUrl}/items/${itemId}`, { quantity }).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}

	removeItem(itemId: number): Observable<CartItem[]> {
		return this.http.delete<CartResponse>(`${this.baseUrl}/items/${itemId}`).pipe(
			map(response => response.items ?? []),
			tap(items => this.cartItemsSubject.next(items))
		);
	}
}
