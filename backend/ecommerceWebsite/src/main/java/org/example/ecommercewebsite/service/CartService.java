package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.CartItems;
import org.example.ecommercewebsite.entities.CartManager;
import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.entities.Product;
import org.example.ecommercewebsite.exception.CustomResourceNotFoundException;
import org.example.ecommercewebsite.exception.InvalidRequestException;
import org.example.ecommercewebsite.repositories.CartItemRepo;
import org.example.ecommercewebsite.repositories.CartRepo;
import org.example.ecommercewebsite.repositories.CustomerRepo;
import org.example.ecommercewebsite.repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* Service class is mainly responsible for managing shopping cart operations
*
* <p>
* This service mainly handles:
* <ul>
*       <li> Creating and/ or retrieving cart for the costumer</li>
* 	    <li> Adding products to the cart </li>
*		<li> Updating the product quantity </li>
* 		<li> Removing Item(S) from the cart</li>
* </ul>
* It ensures proper stock management and validation along with ownership validation before
* any cart operation is performed.
 */


@Service
public class CartService {
	@Autowired
	private CartRepo cartRepo;
	@Autowired
	private CartItemRepo cartItemRepo;
	@Autowired
	private ProductRepo productRepo;
	@Autowired
	private  CustomerRepo customerRepo;

	/**
	 * It retrieves existing cart for the customer or creates a new one if none exists.
	 * @param customerId which is the ID of the customer.
	 * @return existing or newly created CartManager instance.
	 * @throws CustomResourceNotFoundException if the customer is not found.
	 */

	public CartManager getOrCreateCartForCustomer(Long customerId) {
		Customer customer = customerRepo.findById(customerId)
			.orElseThrow(() -> new CustomResourceNotFoundException("Customer not found"));

		List<CartManager> existingCarts = cartRepo.findAllByCustomerWithItems(customer);
		if (!existingCarts.isEmpty()) {
			return existingCarts.get(0);
		}
		
		CartManager newCart = new CartManager();
		newCart.setCustomer(customer);
		return cartRepo.save(newCart);
	}

	/**
	 * Helps to add the product to the customer cart.
	 * <p>
	 *     if the product already exists in the cart, its quantity is increased/ updated.
	 *     moreover, stock availability validation is checked before adding or updating.
	 * </p>
	 * @param customerId unique customer id which requests the product to add to their cart.
	 * @param productId ID of product to be added to the cart.
	 * @param quantity the quantity to be added to the cart.
	 * @return updated CartManager
	 * @throws InvalidRequestException if the quantity is invalid or insufficient stocks.
	 * @throws CustomResourceNotFoundException if the product is not found.
	 */

	public CartManager addItem(Long customerId, Long productId, int quantity) {
		if (quantity <= 0) {
			throw new InvalidRequestException("Quantity must be at least 1");
		}

		CartManager cart = getOrCreateCartForCustomer(customerId);
		Product product = productRepo.findById(productId)
			.orElseThrow(() -> new CustomResourceNotFoundException("Product not found"));

		CartItems existingItem = cart.getItems()
			.stream()
			.filter(item -> item.getProduct() != null && item.getProduct().getId().equals(productId))
			.findFirst()
			.orElse(null);

		if (existingItem != null) {
			int newQuantity = existingItem.getQuantity() + quantity;
			if (newQuantity > product.getStock()) {
				throw new InvalidRequestException(
					"Cannot add more items. Only " + product.getStock() + " available in stock. You already have " 
					+ existingItem.getQuantity() + " in your cart.");
			}
			existingItem.setQuantity(newQuantity);
			cartItemRepo.save(existingItem);
			return cart;
		}

		// Check stock for new item
		if (quantity > product.getStock()) {
			throw new InvalidRequestException(
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

	/**
	 * It updates the quantity of cart manager
	 * <p>
	 *     if the quantity of the product is <=0, then the item will be removed from the cart
	 *     stock availability is validated before updating to the cart.
	 * </p>
	 * @param customerId unique customerID of the customer who is required to update the quantity.
	 * @param itemId ID of the cart item.
	 * @param quantity new quantity of the product requested.
	 * @return updated CartManager.
	 * @throws CustomResourceNotFoundException if the cart item is not found.
	 * @throws InvalidRequestException if the stock is insufficient.
	 */

	public CartManager updateQuantity(Long customerId, Long itemId, int quantity) {
		CartItems item = cartItemRepo.findById(itemId)
			.orElseThrow(() -> new CustomResourceNotFoundException("Cart item not found"));

		if (quantity <= 0) {
			cartItemRepo.delete(item);
			return getOrCreateCartForCustomer(customerId);
		}

		// Validate stock before updating
		Product product = item.getProduct();
		if (quantity > product.getStock()) {
			throw new InvalidRequestException(
				"Cannot update quantity. Only " + product.getStock() + " available in stock.");
		}

		item.setQuantity(quantity);
		cartItemRepo.save(item);
		return getOrCreateCartForCustomer(customerId);
	}

	/**
	 * Remove a specific item/product from the customer's cart
	 * <p>
	 *     It also ensures that the item first belong to the customer before removing it from the
	 *     cart.
	 * </p>
	 * @param customerId Unique ID of the customer.
	 * @param itemId Id of the cart item to remove.
	 * @return updated cartManager.
	 * @throws CustomResourceNotFoundException if the cart item is not found.
	 * @throws InvalidRequestException if the item does not belong to the customer's cart.
	 */

	public CartManager removeItem(Long customerId, Long itemId) {
		CartManager cart = getOrCreateCartForCustomer(customerId);
		CartItems item = cartItemRepo.findById(itemId)
			.orElseThrow(() -> new CustomResourceNotFoundException("Cart item not found"));
		if (!item.getCart().getId().equals(cart.getId())) {
			throw new InvalidRequestException("Item does not belong to this cart");
		}
		cart.getItems().remove(item);
		cartItemRepo.delete(item);
		return cartRepo.save(cart);
	}

}
