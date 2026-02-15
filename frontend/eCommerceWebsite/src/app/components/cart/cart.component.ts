import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';

interface CartItemView {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  // stock: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  searchText: string = '';
  darkMode: boolean = false;
  showDropdown: boolean = false;
  isLoggedIn: boolean = false;
  selectedCheckout: string = 'cod';

  cartItems: CartItemView[] = [];

  shippingCost: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.loadCart().subscribe(items => {
      this.cartItems = items.map(item => this.mapItem(item));
    });
  }

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.1);
  }

  get total(): number {
    return this.subtotal + this.tax + this.shippingCost;
  }

  increaseQuantity(id: number, currentQuantity: number) {
    this.cartService.updateQuantity(id, currentQuantity + 1).subscribe(items => {
      this.cartItems = items.map(item => this.mapItem(item));
    });
  }

  decreaseQuantity(id: number, currentQuantity: number) {
    this.cartService.updateQuantity(id, currentQuantity - 1).subscribe(items => {
      this.cartItems = items.map(item => this.mapItem(item));
    });
  }

  removeItem(id: number) {
    this.cartService.removeItem(id).subscribe(items => {
      this.cartItems = items.map(item => this.mapItem(item));
    });
  }

  checkout() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const checkoutInfo = `
      Checkout Successful!
      ==================
      Payment Method: ${this.getCheckoutMethodName(this.selectedCheckout)}
      
      Order Summary:
      Subtotal: ₹${this.subtotal}
      Tax (10%): ₹${this.tax}
      Shipping: ${this.shippingCost === 0 ? 'FREE' : '₹' + this.shippingCost}
      Total: ₹${this.total}
      
      Items: ${this.cartItems.length} book(s)
      Thank you for your purchase!
    `;

    alert(checkoutInfo);
    // Here you would typically call a backend API to process the order
    this.cartItems = [];
  }

  private getCheckoutMethodName(method: string): string {
    const methods: { [key: string]: string } = {
      'cod': 'Cash on Delivery',
      'card': 'Debit/Credit Card',
      'upi': 'UPI Payment',
      'wallet': 'Digital Wallet'
    };
    return methods[method] || method;
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.isLoggedIn = false;
    this.showDropdown = false;
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  private mapItem(item: CartItem): CartItemView {
    return {
      id: item.id,
      title: item.product.name,
      price: item.product.price,
      image: item.product.imageUrl,
      quantity: item.quantity
    };
  }
}
