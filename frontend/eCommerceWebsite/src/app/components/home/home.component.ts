import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 12;
  darkMode: boolean = false;
  showDropdown: boolean = false;
  isLoggedIn: boolean = false;

  books: Book[] = [];

  constructor() {
    // Creating 42 dummy books
    for (let i = 1; i <= 42; i++) {
      this.books.push({
        id: i,
        title: 'Book Title ' + i,
        price: 299 + i,
        image: 'https://picsum.photos/200/300?random=' + i
      });
    }
  }

  get filteredBooks() {
    return this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedBooks() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredBooks.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  login() {
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
    this.showDropdown = false;
  }
}