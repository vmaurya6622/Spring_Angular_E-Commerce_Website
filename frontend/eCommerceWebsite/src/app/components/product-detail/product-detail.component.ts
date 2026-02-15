import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
	selector: 'app-product-detail',
	standalone: true,
	imports: [CommonModule, RouterModule],
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
	product?: Product;
	isLoading = false;
	errorMessage = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private productService: ProductService,
		private cartService: CartService
	) {}

	ngOnInit(): void {
		const idParam = this.route.snapshot.paramMap.get('id');
		const id = idParam ? Number(idParam) : null;
		if (!id) {
			this.errorMessage = 'Product not found.';
			return;
		}

		this.isLoading = true;
		this.productService.getProductById(id).subscribe({
			next: product => {
				this.product = product;
				this.isLoading = false;
			},
			error: () => {
				this.errorMessage = 'Unable to load product details.';
				this.isLoading = false;
			}
		});
	}

	addToCart(): void {
		if (!this.product) {
			return;
		}
		this.cartService.addItem(this.product.id, 1).subscribe();
	}

	goToHome(): void {
		this.router.navigate(['/']);
	}
}
