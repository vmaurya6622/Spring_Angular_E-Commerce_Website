package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.Product;
import org.example.ecommercewebsite.repositories.ProductRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {
	private final ProductRepo productRepo;

	public ProductService(ProductRepo productRepo) {
		this.productRepo = productRepo;
	}

	public Page<Product> getProducts(int page, int size) {
		int pageNumber = Math.max(page, 0);
		int pageSize = Math.max(size, 1);
		return productRepo.findAll(PageRequest.of(pageNumber, pageSize, Sort.by("id").ascending()));
	}

	public Product getProductById(Long id) {
		return productRepo.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
	}
}
