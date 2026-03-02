import { Component, OnInit, PLATFORM_ID, Inject, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Observable, BehaviorSubject, combineLatest, map, shareReplay, firstValueFrom } from 'rxjs';
import { PaginationComponent } from '../Common/pagination/pagination.component';
import { CommonFooterComponent } from '../Common/CommonFooter/CommonFooter';
import { NavbarComponent } from '../Common/navbar/navbar.component';

interface Book {
	id: number;
	title: string;
	price: number;
	image: string;
	stock: number;
}

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, FormsModule, PaginationComponent, CommonFooterComponent, NavbarComponent],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {

	searchText = '';
	currentPage = 1;
	itemsPerPage = 10;
	darkMode = false;
	showDropdown = false;
	isLoggedIn = false;
	customerName = '';
	totalPages = 1;
	private readonly apiBaseUrl = 'http://localhost:8080';
	private booksSubject = new BehaviorSubject<Book[]>([]);
	private searchTextSubject = new BehaviorSubject<string>('');
	private currentPageSubject = new BehaviorSubject<number>(1);
	books$: Observable<Book[]> = this.booksSubject.asObservable().pipe(shareReplay(1));
	filteredBooks$: Observable<Book[]> = combineLatest([
		this.books$,
		this.searchTextSubject
	]).pipe(
		map(([books, searchText]) => {
			const query = searchText.trim().toLowerCase();
			return books.filter(book => book.title.toLowerCase().includes(query));
		}),
		shareReplay(1)
	);
	totalPages$: Observable<number> = this.filteredBooks$.pipe(
		map(books => Math.max(1, Math.ceil(books.length / this.itemsPerPage))),
		shareReplay(1)
	);
	pages$: Observable<number[]> = this.totalPages$.pipe(
		map(total => Array.from({ length: total }, (_, index) => index + 1)),
		shareReplay(1)
	);
	paginatedBooks$: Observable<Book[]> = combineLatest([
		this.filteredBooks$,
		this.currentPageSubject
	]).pipe(
		map(([books, currentPage]) => {
			const start = (currentPage - 1) * this.itemsPerPage;
			return books.slice(start, start + this.itemsPerPage);
		}),
		shareReplay(1)
	);

	productsInCart: Set<number> = new Set();

	constructor(
		private productService: ProductService,
		private cartService: CartService,
		private router: Router,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			const customerData = localStorage.getItem('customer');
			if (customerData) {
				const customer = JSON.parse(customerData);
				this.isLoggedIn = true;
				this.customerName = customer.name || 'User';
			}
		}

		void this.loadProducts();

		if (this.isLoggedIn) {
			void this.loadCartItems();
		}
	}

	private async loadProducts(): Promise<void> {
		try {
			const response = await firstValueFrom(this.productService.getProducts(0, 100));
			this.booksSubject.next((response.content ?? []).map((product: Product) =>
				this.mapProduct(product)
			));
		} catch (error) {
			console.error('Error loading products:', error);
			this.booksSubject.next([]);
		}
	}

	private async loadCartItems(): Promise<void> {
		try {
			const items = await firstValueFrom(this.cartService.loadCart());
			this.productsInCart = new Set(items.map(item => item.product.id));
		} catch (err) {
			console.error('Error loading cart items:', err);
		}
	}

	onSearch(value: string): void {
		this.searchText = value;
		this.currentPage = 1;
		this.searchTextSubject.next(value);
		this.currentPageSubject.next(1);
	}

	changePage(page: number): void {
		this.currentPage = page;
		this.currentPageSubject.next(page);
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

	goToCart(): void {
		this.router.navigate(['/cart']);
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}

	viewDetails(bookId: number): void {
		this.router.navigate(['/products', bookId]);
	}

	logout(): void {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem('customer');
		}
		this.isLoggedIn = false;
		this.customerName = '';
		this.showDropdown = false;
		this.router.navigate(['/login']);
	}

	async addToCart(book: Book): Promise<void> {
		if (book.stock <= 0) return;

		if (!this.isLoggedIn) {
			alert('Please login first');
			this.router.navigate(['/login']);
			return;
		}

		try {
			const cartItems = await firstValueFrom(this.cartService.loadCart());
			const existingItem = cartItems.find(item => item.product.id === book.id);
			const currentQuantity = existingItem ? existingItem.quantity : 0;

			if (currentQuantity >= book.stock) {
				alert(`Only ${book.stock} items available. You already have ${currentQuantity} in cart.`);
				return;
			}

			await firstValueFrom(this.cartService.addItem(book.id, 1));
			this.productsInCart.add(book.id);
			this.productsInCart = new Set(this.productsInCart);
			alert(`${book.title} added to cart!`);
		} catch (err: any) {
			console.error('Error adding to cart:', err);
			if (err.status === 401 || err.status === 403) {
				alert('Please login first');
				this.router.navigate(['/login']);
				return;
			}
			alert(err.error?.message || 'Failed to add item');
		}
	}

	isInCart(bookId: number): boolean {
		const inCart = this.productsInCart.has(bookId);
		// console.log(`Checking if book ${bookId} is in cart:`, inCart);
		return inCart;
	}

	private mapProduct(product: Product): Book {
		return {
			id: product.id,
			title: product.name,
			price: product.price,
			image: this.normalizeImageUrl(product.imageUrl),
			stock: product.stock
		};
	}

	private normalizeImageUrl(imageUrl: string): string {
		if (!imageUrl) return '/assets/logo.png';
		if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
		if (imageUrl.startsWith('/assets/')) return imageUrl;
		if (imageUrl.startsWith('/')) return `${this.apiBaseUrl}${imageUrl}`;
		return `${this.apiBaseUrl}/${imageUrl}`;
	}
}
