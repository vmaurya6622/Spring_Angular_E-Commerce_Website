import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
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
  books: Book[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
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

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  logout(): void {
    this.isLoggedIn = false;
    this.showDropdown = false;
  }

  addToCart(book: Book): void {
    if (book.stock > 0) {
      alert(`${book.title} added to cart`);
      book.stock--; // visually reduce stock
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
