import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs';

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: string;
  orderDate: Date;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  customer: Customer | null = null;
  orders: Order[] = [];
  expandedOrderId: string | null = null;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    console.log('=== ORDERS COMPONENT INIT ===');
    if (isPlatformBrowser(this.platformId)) {
      const customerData = localStorage.getItem('customer');
      console.log('Customer data from localStorage:', customerData);
      if (customerData) {
        this.customer = JSON.parse(customerData);
        console.log('Parsed customer:', this.customer);
        console.log('Customer ID:', this.customer?.id);
        this.loadOrders();
      } else {
        console.warn('No customer data found, redirecting to login');
        this.router.navigate(['/login']);
      }
    } else {
      console.log('Not in browser, skipping init');
    }
  }

  loadOrders(): void {
    console.log('=== LOAD ORDERS CALLED ===');
    if (!isPlatformBrowser(this.platformId)) {
      console.log('Not in browser, skipping loadOrders');
      return;
    }

    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      console.error('No customer data in localStorage');
      return;
    }

    const customer = JSON.parse(customerData);
    console.log('Loading orders for customer ID:', customer.id);
    console.log('Customer name:', customer.name);
    const apiUrl = `http://localhost:8080/api/orders/customer/${customer.id}`;
    console.log('API URL:', apiUrl);
    console.log('Making GET request...');
    
    this.http.get<any[]>(apiUrl)
      .subscribe({
        next: (orders) => {
          console.log('=== API RESPONSE SUCCESS ===');
          console.log('Raw response:', orders);
          console.log('Response type:', typeof orders);
          console.log('Is Array:', Array.isArray(orders));
          console.log('Number of orders:', orders.length);
          
          if (orders.length === 0) {
            console.warn('!!! NO ORDERS FOUND FOR CUSTOMER !!!');
            console.warn('This might mean:');
            console.warn('1. No orders have been placed yet');
            console.warn('2. Backend restarted and database was dropped (create-drop mode)');
            console.warn('3. Customer ID mismatch');
          } else {
            console.log('Processing orders...');
            orders.forEach((order, index) => {
              console.log(`Order ${index + 1}:`, order);
            });
          }
          
          this.orders = orders.map(order => ({
            id: order.id.toString(),
            orderDate: new Date(order.orderDate),
            items: order.items.map((item: any) => ({
              id: item.id.toString(),
              productName: item.product.name,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal
            })),
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            status: order.status as 'pending' | 'shipped' | 'delivered' | 'cancelled'
          }));
          console.log('Processed orders:', this.orders);
          console.log('=== LOAD ORDERS COMPLETE ===');
        },
        error: (err) => {
          console.error('=== API ERROR ===');
          console.error('Error loading orders:', err);
          console.error('Error status:', err.status);
          console.error('Error statusText:', err.statusText);
          console.error('Error message:', err.message);
          console.error('Error details:', err.error);
          console.error('Full error object:', JSON.stringify(err, null, 2));
          alert('Failed to load orders. Check console for details.');
        }
      });
  }

  toggleOrderDetails(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  getTotalSpent(): number {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  getFirstOrderItemCount(): number {
    return this.orders.length > 0 ? this.orders[0].items.length : 0;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered':
        return 'green';
      case 'shipped':
        return 'blue';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'shipped':
        return '📦';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '✗';
      default:
        return '?';
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('customer');
    }
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
