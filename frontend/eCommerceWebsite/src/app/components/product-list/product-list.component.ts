import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, tap, catchError, of } from 'rxjs';

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
  
  private loadProductsTrigger = new BehaviorSubject<void>(undefined);
  private goToPageTrigger = new BehaviorSubject<number>(0);
  private addToCartTrigger = new BehaviorSubject<Product | null>(null);

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {
    // Load products trigger pipeline
    this.loadProductsTrigger.pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMap(() => this.productService.getProducts(this.page, this.size).pipe(
        tap(response => {
          this.productsSubject.next(response.content ?? []);
          this.totalPagesSubject.next(response.totalPages ?? 0);
          this.errorMessageSubject.next('');
        }),
        catchError(err => {
          console.error('Error loading products:', err);
          this.errorMessageSubject.next('Unable to load products. Please try again later.');
          this.productsSubject.next([]);
          this.totalPagesSubject.next(0);
          return of(null);
        }),
        tap(() => this.loadingSubject.next(false))
      ))
    ).subscribe();

    // Go to page trigger pipeline
    this.goToPageTrigger.pipe(
      switchMap(pageNum => {
        const totalPages = this.totalPagesSubject.value;
        if (pageNum < 0 || pageNum >= totalPages) return of(null);
        
        this.page = pageNum;
        this.loadProductsTrigger.next();
        return of(null);
      })
    ).subscribe();

    // Add to cart trigger pipeline
    this.addToCartTrigger.pipe(
      switchMap(product => product ? this.cartService.addItem(product.id, 1).pipe(
        tap(() => {
          alert(`${product.name} added to cart`);
        }),
        catchError(err => {
          console.error('Error adding to cart:', err);
          alert(err.error?.message || 'Failed to add item to cart.');
          return of(null);
        })
      ) : of(null))
    ).subscribe();
  }

  ngOnInit(): void {
    this.loadProductsTrigger.next();
  }

  goToPage(page: number): void {
    this.goToPageTrigger.next(page);
  }

  onAddToCart(product: Product): void {
    this.addToCartTrigger.next(product);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  onViewDetails(product: Product): void {
    this.router.navigate(['/products', product.id]);
  }
}