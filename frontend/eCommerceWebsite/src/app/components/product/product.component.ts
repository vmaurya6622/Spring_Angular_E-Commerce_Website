import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
	selector: 'app-product',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.css']
})
export class ProductComponent {
	@Input() product!: Product;
	@Output() addToCart = new EventEmitter<Product>();
	@Output() viewDetails = new EventEmitter<Product>();

	onAddToCart(): void {
		this.addToCart.emit(this.product);
	}

	onViewDetails(): void {
		this.viewDetails.emit(this.product);
	}
}
