import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
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

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
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
      }
    }

    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(0, 100).subscribe({
      next: response => {
        this.books = response.content.map(product => this.mapProduct(product));
      },
      error: () => {
        this.books = [];
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

      this.cartService.addItem(book.id, 1).subscribe({
        next: () => {
          alert(`${book.title} added to cart successfully!`);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          alert('Failed to add item to cart. Please try again.');
        }
      });
    }
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
