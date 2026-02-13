import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

interface ProductPage {
	content: Product[];
	totalElements: number;
	totalPages: number;
	number: number;
	size: number;
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	private readonly baseUrl = 'http://localhost:8080/api/products';

	constructor(private http: HttpClient) {}

	getProducts(page: number, size: number): Observable<ProductPage> {
		const params = new HttpParams()
			.set('page', page)
			.set('size', size);
		return this.http.get<ProductPage>(this.baseUrl, { params });
	}

	getProductById(id: number): Observable<Product> {
		return this.http.get<Product>(`${this.baseUrl}/${id}`);
	}
}
