import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { HttpClient } from '@angular/common/http';

interface CartItemView {
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
export class CartComponent implements OnInit {
  searchText: string = '';
  darkMode: boolean = false;
  showDropdown: boolean = false;
  isLoggedIn: boolean = false;
  customerName: string = '';
  selectedCheckout: string = 'cod';
  cartItems: CartItemView[] = [];
  shippingCost: number = 0;
  isLoading: boolean = true;

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const customerData = localStorage.getItem('customer');
      if (customerData) {
        const customer = JSON.parse(customerData);
        this.isLoggedIn = true;
        this.customerName = customer.name || 'User';
        this.loadCart();
      } else {
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    }
  }

  loadCart(): void {
    this.cartService.loadCart().subscribe({
      next: (items) => {
        console.log('Cart items loaded:', items);
        this.cartItems = items.map(item => this.mapItem(item));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.cartItems = [];
        this.isLoading = false;
      }
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

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      alert('Please login to checkout');
      this.router.navigate(['/login']);
      return;
    }

    const customer = JSON.parse(customerData);
    const checkoutRequest = {
      customerId: customer.id,
      paymentMethod: this.selectedCheckout,
      shippingCost: this.shippingCost
    };

    this.http.post('http://localhost:8080/api/orders/checkout', checkoutRequest)
      .subscribe({
        next: (order: any) => {
          const checkoutInfo = `
      Checkout Successful!
      ==================
      Order ID: ${order.id}
      Payment Method: ${this.getCheckoutMethodName(this.selectedCheckout)}
      
      Order Summary:
      Subtotal: ₹${order.subtotal.toFixed(2)}
      Tax (10%): ₹${order.tax.toFixed(2)}
      Shipping: ${order.shippingCost === 0 ? 'FREE' : '₹' + order.shippingCost.toFixed(2)}
      Total: ₹${order.total.toFixed(2)}
      
      Items: ${order.items.length} item(s)
      Thank you for your purchase!
          `;
          alert(checkoutInfo);
          this.cartItems = [];
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          console.error('Checkout error:', err);
          alert(err.error.message || 'Checkout failed. Please try again.');
        }
      });
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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('customer');
    }
    this.isLoggedIn = false;
    this.customerName = '';
    this.showDropdown = false;
    this.router.navigate(['/login']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToAddress() {
    this.router.navigate(['/address']);
  }

  navigateToOrders() {
    this.router.navigate(['/orders']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  goToHome(): void {
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
