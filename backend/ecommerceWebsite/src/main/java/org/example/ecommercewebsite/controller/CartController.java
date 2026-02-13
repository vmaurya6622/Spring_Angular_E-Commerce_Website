package org.example.ecommercewebsite.controller;

import org.example.ecommercewebsite.entities.CartManager;
import org.example.ecommercewebsite.service.CartService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200")
public class CartController {
	private final CartService cartService;

	public CartController(CartService cartService) {
		this.cartService = cartService;
	}

	@GetMapping
	public CartManager getCart() {
		return cartService.getOrCreateCart();
	}

	@PostMapping("/items")
	public CartManager addItem(@RequestBody AddCartItemRequest request) {
		int quantity = request.quantity() == null ? 1 : request.quantity();
		return cartService.addItem(request.productId(), quantity);
	}

	@PatchMapping("/items/{itemId}")
	public CartManager updateQuantity(
		@PathVariable Long itemId,
		@RequestBody UpdateCartItemRequest request
	) {
		int quantity = request.quantity() == null ? 1 : request.quantity();
		return cartService.updateQuantity(itemId, quantity);
	}

	@DeleteMapping("/items/{itemId}")
	public CartManager removeItem(@PathVariable Long itemId) {
		return cartService.removeItem(itemId);
	}

	public record AddCartItemRequest(Long productId, Integer quantity) {
	}

	public record UpdateCartItemRequest(Integer quantity) {
	}
}
