package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.CartItems;
import org.example.ecommercewebsite.entities.CartManager;
import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.entities.Product;
import org.example.ecommercewebsite.repositories.CartItemRepo;
import org.example.ecommercewebsite.repositories.CartRepo;
import org.example.ecommercewebsite.repositories.CustomerRepo;
import org.example.ecommercewebsite.repositories.ProductRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CartService {
	private final CartRepo cartRepo;
	private final CartItemRepo cartItemRepo;
	private final ProductRepo productRepo;
	private final CustomerRepo customerRepo;

	public CartService(CartRepo cartRepo, CartItemRepo cartItemRepo, ProductRepo productRepo, CustomerRepo customerRepo) {
		this.cartRepo = cartRepo;
		this.cartItemRepo = cartItemRepo;
		this.productRepo = productRepo;
		this.customerRepo = customerRepo;
	}

	public CartManager getOrCreateCartForCustomer(Long customerId) {
		Customer customer = customerRepo.findById(customerId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
		
		Optional<CartManager> existingCart = cartRepo.findByCustomerWithItems(customer);
		if (existingCart.isPresent()) {
			return existingCart.get();
		}
		
		CartManager newCart = new CartManager();
		newCart.setCustomer(customer);
		return cartRepo.save(newCart);
	}

	public CartManager addItem(Long customerId, Long productId, int quantity) {
		if (quantity <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
		}

		CartManager cart = getOrCreateCartForCustomer(customerId);
		Product product = productRepo.findById(productId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

		CartItems existingItem = cart.getItems()
			.stream()
			.filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
			.findFirst()
			.orElse(null);

		if (existingItem != null) {
			int newQuantity = existingItem.getQuantity() + quantity;
			if (newQuantity > product.getStock()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
					"Cannot add more items. Only " + product.getStock() + " available in stock. You already have " 
					+ existingItem.getQuantity() + " in your cart.");
			}
			existingItem.setQuantity(newQuantity);
			cartItemRepo.save(existingItem);
			return cart;
		}

		// Check stock for new item
		if (quantity > product.getStock()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
				"Cannot add " + quantity + " items. Only " + product.getStock() + " available in stock.");
		}

		CartItems newItem = new CartItems();
		newItem.setCart(cart);
		newItem.setProduct(product);
		newItem.setQuantity(quantity);
		cart.getItems().add(newItem);
		cartItemRepo.save(newItem);
		return cart;
	}

	public CartManager updateQuantity(Long customerId, Long itemId, int quantity) {
		CartItems item = cartItemRepo.findById(itemId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

		if (quantity <= 0) {
			cartItemRepo.delete(item);
			return getOrCreateCartForCustomer(customerId);
		}

		// Validate stock before updating
		Product product = item.getProduct();
		if (quantity > product.getStock()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
				"Cannot update quantity. Only " + product.getStock() + " available in stock.");
		}

		item.setQuantity(quantity);
		cartItemRepo.save(item);
		return getOrCreateCartForCustomer(customerId);
	}

	public CartManager removeItem(Long customerId, Long itemId) {
		CartItems item = cartItemRepo.findById(itemId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
		cartItemRepo.delete(item);
		return getOrCreateCartForCustomer(customerId);
	}
}
