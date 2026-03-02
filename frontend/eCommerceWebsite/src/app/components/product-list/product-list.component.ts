import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, map, shareReplay, firstValueFrom } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { ProductComponent } from '../Common/product/product.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  page = 0;
  size = 6;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$: Observable<Product[]> = this.productsSubject.asObservable().pipe(shareReplay(1));
  private totalPagesSubject = new BehaviorSubject<number>(0);
  totalPages$: Observable<number> = this.totalPagesSubject.asObservable().pipe(shareReplay(1));
  pages$: Observable<number[]> = this.totalPages$.pipe(
    map(totalPages => Array.from({ length: totalPages }, (_, index) => index)),
    shareReplay(1)
  );
  private loadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.loadingSubject.asObservable().pipe(shareReplay(1));
  private errorMessageSubject = new BehaviorSubject<string>('');
  errorMessage$: Observable<string> = this.errorMessageSubject.asObservable().pipe(shareReplay(1));

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    void this.loadProducts();
  }

  private async loadProducts(): Promise<void> {
    this.loadingSubject.next(true);
    try {
      const response = await firstValueFrom(this.productService.getProducts(this.page, this.size));
      this.productsSubject.next(response.content ?? []);
      this.totalPagesSubject.next(response.totalPages ?? 0);
      this.errorMessageSubject.next('');
    } catch (err) {
      console.error('Error loading products:', err);
      this.errorMessageSubject.next('Unable to load products. Please try again later.');
      this.productsSubject.next([]);
      this.totalPagesSubject.next(0);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  goToPage(page: number): void {
    const totalPages = this.totalPagesSubject.value;
    if (page < 0 || page >= totalPages) return;

    this.page = page;
    void this.loadProducts();
  }

  async onAddToCart(product: Product): Promise<void> {
    try {
      await firstValueFrom(this.cartService.addItem(product.id, 1));
      alert(`${product.name} added to cart`);
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      alert(err.error?.message || 'Failed to add item to cart.');
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  onViewDetails(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }
}