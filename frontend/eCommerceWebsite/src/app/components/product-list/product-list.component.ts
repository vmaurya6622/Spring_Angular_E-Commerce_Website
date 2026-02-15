import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductComponent } from '../product/product.component';

@Component({
	selector: 'app-product-list',
	standalone: true,
	imports: [CommonModule, RouterModule, ProductComponent],
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
	products: Product[] = [];
	page = 0;
	size = 6;
	totalPages = 0;
	isLoading = false;
	errorMessage = '';

	constructor(
		private productService: ProductService,
		private cartService: CartService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loadProducts();
	}

	loadProducts(): void {
		this.isLoading = true;
		this.errorMessage = '';
		this.productService.getProducts(this.page, this.size).subscribe({
			next: response => {
				this.products = response.content;
				this.totalPages = response.totalPages;
				this.isLoading = false;
			},
			error: () => {
				this.errorMessage = 'Unable to load products. Please try again later.';
				this.isLoading = false;
			}
		});
	}

	goToPage(page: number): void {
		if (page < 0 || page >= this.totalPages) {
			return;
		}
		this.page = page;
		this.loadProducts();
	}

	onAddToCart(product: Product): void {
		this.cartService.addItem(product.id, 1).subscribe();
	}

	onViewDetails(product: Product): void {
		this.router.navigate(['/products', product.id]);
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}
}
