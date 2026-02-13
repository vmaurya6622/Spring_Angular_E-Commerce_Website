package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.CartItems;
import org.example.ecommercewebsite.entities.CartManager;
import org.example.ecommercewebsite.entities.Product;
import org.example.ecommercewebsite.repositories.CartItemRepo;
import org.example.ecommercewebsite.repositories.CartRepo;
import org.example.ecommercewebsite.repositories.ProductRepo;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class CartService {
	private final CartRepo cartRepo;
	private final CartItemRepo cartItemRepo;
	private final ProductRepo productRepo;

	public CartService(CartRepo cartRepo, CartItemRepo cartItemRepo, ProductRepo productRepo) {
		this.cartRepo = cartRepo;
		this.cartItemRepo = cartItemRepo;
		this.productRepo = productRepo;
	}

	public CartManager getOrCreateCart() {
		Optional<CartManager> existing = cartRepo.findAll(PageRequest.of(0, 1))
			.getContent()
			.stream()
			.findFirst();
		return existing.orElseGet(() -> cartRepo.save(new CartManager()));
	}

	public CartManager addItem(Long productId, int quantity) {
		if (quantity <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
		}

		CartManager cart = getOrCreateCart();
		Product product = productRepo.findById(productId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

		CartItems existingItem = cart.getItems()
			.stream()
			.filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
			.findFirst()
			.orElse(null);

		if (existingItem != null) {
			existingItem.setQuantity(existingItem.getQuantity() + quantity);
			cartItemRepo.save(existingItem);
			return cart;
		}

		CartItems newItem = new CartItems();
		newItem.setCart(cart);
		newItem.setProduct(product);
		newItem.setQuantity(quantity);
		cart.getItems().add(newItem);
		cartItemRepo.save(newItem);
		return cart;
	}

	public CartManager updateQuantity(Long itemId, int quantity) {
		CartItems item = cartItemRepo.findById(itemId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));

		if (quantity <= 0) {
			cartItemRepo.delete(item);
			return getOrCreateCart();
		}

		item.setQuantity(quantity);
		cartItemRepo.save(item);
		return getOrCreateCart();
	}

	public CartManager removeItem(Long itemId) {
		CartItems item = cartItemRepo.findById(itemId)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
		cartItemRepo.delete(item);
		return getOrCreateCart();
	}
}
