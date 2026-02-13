package org.example.ecommercewebsite.controller;

import org.example.ecommercewebsite.entities.Product;
import org.example.ecommercewebsite.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:4200")
public class productController {
	private final ProductService productService;

	public productController(ProductService productService) {
		this.productService = productService;
	}

	@GetMapping
	public Page<Product> getProducts(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "12") int size
	) {
		return productService.getProducts(page, size);
	}

	@GetMapping("/{id}")
	public Product getProduct(@PathVariable Long id) {
		return productService.getProductById(id);
	}
}
