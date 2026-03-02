import { BehaviorSubject, Observable, Subject, shareReplay, switchMap, tap, catchError, of, startWith } from 'rxjs';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { CommonFooterComponent } from '../Common/CommonFooter/CommonFooter';

@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule,CommonFooterComponent],
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
	private readonly apiBaseUrl = 'http://localhost:8080';
	private productSubject = new BehaviorSubject<Product | null>(null);
	product$: Observable<Product | null>;
	private loadingSubject = new BehaviorSubject<boolean>(false);
	isLoading$: Observable<boolean> = this.loadingSubject.asObservable().pipe(shareReplay(1));
	private errorMessageSubject = new BehaviorSubject<string>('');
	errorMessage$: Observable<string> = this.errorMessageSubject.asObservable().pipe(shareReplay(1));
	searchText = '';
	darkMode = false;
	showDropdown = false;
	isLoggedIn = false;
	customerName = '';
	private isInCartSubject = new BehaviorSubject<boolean>(false);
	isInCart$: Observable<boolean> = this.isInCartSubject.asObservable().pipe(shareReplay(1));
	private readonly addToCartTrigger = new Subject<void>();
	readonly addToCartEffect$ = this.addToCartTrigger.pipe(
		switchMap(() => {
			const product = this.productSubject.value;
			if (!product || product.stock === 0) return of(null);

			if (!this.isLoggedIn) {
				alert('Please login to add items to cart');
				this.router.navigate(['/login']);
				return of(null);
			}

			return this.cartService.loadCart().pipe(
				switchMap(cartItems => {
					const existingItem = cartItems.find(item => item.product.id === product.id);
					const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

					if (currentQuantityInCart >= product.stock) {
						alert(
							`Cannot add more! Only ${product.stock} items available in stock. ` +
							`You already have ${currentQuantityInCart} in your cart.`
						);
						return of(null);
					}

					return this.cartService.addItem(product.id, 1).pipe(
						tap(() => {
							this.isInCartSubject.next(true);
							alert(`${product.name} added to cart successfully!`);
						}),
						catchError((err: any) => {
							console.error('Error adding to cart:', err);
							if (err.status === 401 || err.status === 403) {
								alert('Please login to add items to cart');
								this.router.navigate(['/login']);
								return of(null);
							}
							alert(err.error?.message || 'Failed to add item to cart.');
							return of(null);
						})
					);
				}),
				catchError((err: any) => {
					console.error('Error adding to cart:', err);
					if (err.status === 401 || err.status === 403) {
						alert('Please login to add items to cart');
						this.router.navigate(['/login']);
						return of(null);
					}
					alert(err.error?.message || 'Failed to add item to cart.');
					return of(null);
				})
			);
		}),
		startWith(null),
		shareReplay(1)
	);

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private cartService: CartService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.product$ = this.route.paramMap.pipe(
			tap(() => {
				this.loadingSubject.next(true);
				this.errorMessageSubject.next('');
				this.productSubject.next(null);
				this.isInCartSubject.next(false);
			}),
			switchMap(params => {
				const idParam = params.get('id');
				const id = idParam ? Number(idParam) : null;

				if (!id) {
					this.errorMessageSubject.next('Product not found.');
					this.loadingSubject.next(false);
					return of(null);
				}

				return this.productService.getProductById(id).pipe(
					tap(product => {
						this.productSubject.next({
							...product,
							imageUrl: this.normalizeImageUrl(product.imageUrl)
						});
					}),
					switchMap(product => {
						if (!this.isLoggedIn) {
							this.isInCartSubject.next(false);
							return of(product);
						}
						return this.cartService.loadCart().pipe(
							tap(items => {
								this.isInCartSubject.next(items.some(item => item.product.id === product.id));
							}),
							switchMap(() => of(product)),
							catchError(err => {
								console.error('Error checking cart:', err);
								this.isInCartSubject.next(false);
								return of(product);
							})
						);
					}),
					catchError(err => {
						console.error('Error loading product:', err);
						this.errorMessageSubject.next('Unable to load product details. Please try again later.');
						this.productSubject.next(null);
						return of(null);
					}),
					tap(() => this.loadingSubject.next(false))
				);
			})
		);
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			const customerData = localStorage.getItem('customer');
			if (customerData) {
				const customer = JSON.parse(customerData);
				this.isLoggedIn = true;
				this.customerName = customer.name || 'User';
			}
		}
	}

	addToCart(): void {
		const product = this.productSubject.value;
		if (!product || product.stock === 0) return;
		this.addToCartTrigger.next();
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}

	goToCart(): void {
		this.router.navigate(['/cart']);
	}

	toggleTheme(): void {
		this.darkMode = !this.darkMode;
	}

	login(): void {
		this.router.navigate(['/login']);
	}

	navigateToProfile(): void {
		this.router.navigate(['/profile']);
	}

	navigateToAddress(): void {
		this.router.navigate(['/address']);
	}

	navigateToOrders(): void {
		this.router.navigate(['/orders']);
	}

	logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('customer');
		}
		this.isLoggedIn = false;
		this.customerName = '';
		this.showDropdown = false;
		this.isInCartSubject.next(false);
		this.router.navigate(['/login']);
	}

	private normalizeImageUrl(imageUrl: string): string {
		if (!imageUrl) return '/assets/logo.png';
		if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
		if (imageUrl.startsWith('/assets/')) return imageUrl;
		if (imageUrl.startsWith('/')) return `${this.apiBaseUrl}${imageUrl}`;
		return `${this.apiBaseUrl}/${imageUrl}`;
	}
}
