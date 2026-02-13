import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  searchText: string = '';
  darkMode: boolean = false;
  showDropdown: boolean = false;
  isLoggedIn: boolean = false;
  selectedCheckout: string = 'cod';

  cartItems: CartItem[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      price: 350,
      image: 'https://picsum.photos/200/300?random=1',
      quantity: 2
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      price: 299,
      image: 'https://picsum.photos/200/300?random=2',
      quantity: 1
    },
    {
      id: 3,
      title: '1984',
      price: 450,
      image: 'https://picsum.photos/200/300?random=3',
      quantity: 3
    }
  ];

  shippingCost: number = 0;

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.1);
  }

  get total(): number {
    return this.subtotal + this.tax + this.shippingCost;
  }

  increaseQuantity(id: number) {
    const item = this.cartItems.find(item => item.id === id);
    if (item) {
      item.quantity++;
    }
  }

  decreaseQuantity(id: number) {
    const item = this.cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
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
    this.isLoggedIn = true;
  }

  logout() {
    this.isLoggedIn = false;
    this.showDropdown = false;
  }
}
