import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule],
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
	product?: Product;
	isLoading = false;
	errorMessage = '';
	searchText = '';
	darkMode = false;
	showDropdown = false;
	isLoggedIn = false;
	customerName = '';
	isInCart = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private cartService: CartService,
		private cdr: ChangeDetectorRef,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	ngOnInit(): void {
		// Check if user is logged in
		if (isPlatformBrowser(this.platformId)) {
			const customerData = localStorage.getItem('customer');
			if (customerData) {
				const customer = JSON.parse(customerData);
				this.isLoggedIn = true;
				this.customerName = customer.name || 'User';
				this.cdr.detectChanges();
			}
		}

		// Subscribe to route params to handle navigation between product details
		this.route.paramMap.subscribe(params => {
			const idParam = params.get('id');
			const id = idParam ? Number(idParam) : null;
			
			if (!id) {
				this.errorMessage = 'Product not found.';
				this.cdr.detectChanges();
				return;
			}

			this.loadProduct(id);
		});
	}

	loadProduct(id: number): void {
		this.isLoading = true;
		this.errorMessage = '';
		this.product = undefined;
		this.isInCart = false;
		this.cdr.detectChanges();
		
		this.productService.getProductById(id).subscribe({
			next: product => {
				this.product = product;
				this.isLoading = false;
				this.cdr.detectChanges();
				this.checkIfInCart(product.id);
			},
			error: (err) => {
				console.error('Error loading product:', err);
				this.errorMessage = 'Unable to load product details.';
				this.isLoading = false;
				this.cdr.detectChanges();
			}
		});
	}

	checkIfInCart(productId: number): void {
		if (!this.isLoggedIn) return;

		this.cartService.loadCart().subscribe({
			next: (items) => {
				this.isInCart = items.some(item => item.product.id === productId);
				this.cdr.detectChanges();
			},
			error: (err) => console.error('Error checking cart:', err)
		});
	}

	addToCart(): void {
		if (!this.product || this.product.stock === 0) {
			return;
		}

		if (!this.isLoggedIn) {
			alert('Please login to add items to cart');
			this.router.navigate(['/login']);
			return;
		}

		// Check current cart quantity
		this.cartService.loadCart().subscribe({
			next: (cartItems) => {
				const existingItem = cartItems.find(item => item.product.id === this.product!.id);
				const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

				if (currentQuantityInCart >= this.product!.stock) {
					alert(`Cannot add more! Only ${this.product!.stock} items available in stock. You already have ${currentQuantityInCart} in your cart.`);
					return;
				}

				// Add to cart
				this.cartService.addItem(this.product!.id, 1).subscribe({
					next: () => {
						this.isInCart = true;
						this.cdr.detectChanges();
						alert(`${this.product!.name} added to cart successfully!`);
					},
					error: (err) => {
						console.error('Error adding to cart:', err);
						const errorMessage = err.error?.message || err.message || 'Failed to add item to cart.';
						alert(errorMessage);
					}
				});
			},
			error: (err) => {
				console.error('Error checking cart:', err);
				// Try adding anyway
				this.cartService.addItem(this.product!.id, 1).subscribe({
					next: () => {
						this.isInCart = true;
						this.cdr.detectChanges();
						alert(`${this.product!.name} added to cart successfully!`);
					},
					error: (err) => alert('Failed to add item to cart.')
				});
			}
		});
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}

	goToCart(): void {
		this.router.navigate(['/cart']);
	}

	toggleTheme(): void {
		this.darkMode = !this.darkMode;
		this.cdr.detectChanges();
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
		this.isInCart = false;
		this.cdr.detectChanges();
		this.router.navigate(['/login']);
	}
}
