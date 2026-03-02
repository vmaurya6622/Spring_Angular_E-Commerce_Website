import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule, } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, shareReplay, switchMap, of, catchError } from 'rxjs';
import { CommonFooterComponent } from '../Common/CommonFooter/CommonFooter';

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
	imports: [CommonModule, RouterModule,CommonFooterComponent],
	templateUrl: './orders.component.html',
	styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
	customer: Customer | null = null;
	private readonly customerSubject = new BehaviorSubject<Customer | null>(null);
	orders$: Observable<Order[] | null> = this.customerSubject.pipe(
		switchMap(customer => {
			if (!customer) return of(null);
			const apiUrl = `http://localhost:8080/api/orders/customer/${customer.id}`;
			return this.http.get<any[]>(apiUrl).pipe(
				map(rawOrders => (rawOrders ?? []).map(order => ({
					id: order.id?.toString() ?? '',
					orderDate: order.orderDate ? new Date(order.orderDate) : new Date(),
					items: (order.items ?? []).map((item: any) => ({
						id: item.id?.toString() ?? '',
						productName: item.product?.name ?? item.productName ?? 'Unknown Product',
						quantity: item.quantity ?? 0,
						price: item.price ?? 0,
						subtotal: item.subtotal ?? 0
					})),
					subtotal: order.subtotal ?? 0,
					tax: order.tax ?? 0,
					total: order.total ?? 0,
					status: order.status ?? 'pending'
				} as Order))),
				catchError(err => {
					console.error('Error loading orders:', err);
					alert('Failed to load orders. Please try again.');
					return of([]);
				})
			);
		}),
		shareReplay(1)
	);
	totalSpent$: Observable<number> = this.orders$.pipe(
		map(orders => orders?.reduce((sum, order) => sum + order.total, 0) ?? 0),
		shareReplay(1)
	);
	recentItemsCount$: Observable<number> = this.orders$.pipe(
		map(orders => orders?.[0]?.items?.length ?? 0),
		shareReplay(1)
	);

	expandedOrderId: string | null = null;

	constructor(
		public router: Router,
		private http: HttpClient,
		@Inject(PLATFORM_ID) private platformId: Object
	) {}

	ngOnInit(): void {
		if (!isPlatformBrowser(this.platformId)) return;

		const customerData = localStorage.getItem('customer');

		if (!customerData) {
			this.router.navigate(['/login']);
			return;
		}

		this.customer = JSON.parse(customerData);
		this.customerSubject.next(this.customer);
	}

	toggleOrderDetails(orderId: string): void {
		this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
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
		this.customer = null;
		this.customerSubject.next(null);
		this.router.navigate(['/login']);
	}

	goBack(): void {
		this.router.navigate(['/']);
	}
}
