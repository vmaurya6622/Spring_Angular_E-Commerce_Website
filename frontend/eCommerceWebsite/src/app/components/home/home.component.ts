import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchText = '';
  currentPage = 1;
  itemsPerPage = 12;
  darkMode = false;
  showDropdown = false;
  isLoggedIn = false;
  customerName = '';
  books: Book[] = [];
  productsInCart: Set<number> = new Set();

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Check if user is logged in (only in browser, not on server)
    if (isPlatformBrowser(this.platformId)) {
      const customerData = localStorage.getItem('customer');
      if (customerData) {
        const customer = JSON.parse(customerData);
        this.isLoggedIn = true;
        this.customerName = customer.name || 'User';
        this.loadCartItems();
      }
    }

    this.loadProducts();
  }

  loadCartItems(): void {
    this.cartService.loadCart().subscribe({
      next: (items) => {
        // Mark all products that are in the cart
        items.forEach(item => {
          this.productsInCart.add(item.product.id);
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading cart items:', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadProducts(): void {
    this.productService.getProducts(0, 100).subscribe({
      next: response => {
        this.books = response.content.map(product => this.mapProduct(product));
        this.cdr.detectChanges();
      },
      error: () => {
        this.books = [];
        this.cdr.detectChanges();
      }
    });
  }

  get filteredBooks(): Book[] {
    return this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedBooks(): Book[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBooks.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredBooks.length / this.itemsPerPage));
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
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

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('customer');
    }
    this.isLoggedIn = false;
    this.customerName = '';
    this.showDropdown = false;
    this.router.navigate(['/login']);
  }

  addToCart(book: Book): void {
    if (book.stock > 0) {
      if (!this.isLoggedIn) {
        alert('Please login to add items to cart');
        this.router.navigate(['/login']);
        return;
      }

      // First check current cart quantity for this product
      this.cartService.loadCart().subscribe({
        next: (cartItems) => {
          const existingItem = cartItems.find(item => item.product.id === book.id);
          const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
          
          if (currentQuantityInCart >= book.stock) {
            alert(`Cannot add more! Only ${book.stock} items available in stock. You already have ${currentQuantityInCart} in your cart.`);
            return;
          }

          // Proceed with adding to cart
          this.cartService.addItem(book.id, 1).subscribe({
            next: () => {
              console.log('Adding product to cart Set:', book.id);
              // Create new Set instance to trigger change detection
              this.productsInCart = new Set(this.productsInCart).add(book.id);
              console.log('Products in cart:', Array.from(this.productsInCart));
              // Manually trigger change detection
              this.cdr.detectChanges();
              alert(`${book.title} added to cart successfully!`);
            },
            error: (err) => {
              console.error('Error adding to cart:', err);
              const errorMessage = err.error?.message || err.message || 'Failed to add item to cart. Please try again.';
              alert(errorMessage);
            }
          });
        },
        error: (err) => {
          console.error('Error checking cart:', err);
          // If cart check fails, try adding anyway
          this.cartService.addItem(book.id, 1).subscribe({
            next: () => {
              this.productsInCart = new Set(this.productsInCart).add(book.id);
              this.cdr.detectChanges();
              alert(`${book.title} added to cart successfully!`);
            },
            error: (err) => {
              console.error('Error adding to cart:', err);
              const errorMessage = err.error?.message || err.message || 'Failed to add item to cart. Please try again.';
              alert(errorMessage);
            }
          });
        }
      });
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
      image: product.imageUrl,
      stock: product.stock
    };
  }
}
