import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const customerData = localStorage.getItem('customer');
      if (customerData) {
        this.customer = JSON.parse(customerData);
        this.loadOrders();
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  loadOrders(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      return;
    }

    const customer = JSON.parse(customerData);
    this.http.get<any[]>(`http://localhost:8080/api/orders/customer/${customer.id}`)
      .subscribe({
        next: (orders) => {
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
        },
        error: (err) => {
          console.error('Error loading orders:', err);
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
