package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.*;
import org.example.ecommercewebsite.exception.CustomResourceNotFoundException;
import org.example.ecommercewebsite.exception.InvalidRequestException;
import org.example.ecommercewebsite.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service class responsible for handing order-related operations.
 * <p>
 *     This service usually manages:
 *      <ul>
 *          <li>
 *              Checkout processes.
 *          </li>
 *          <li>
 *              Order creation form the cart
 *          </li>
 *          <li>
 *              Stock validation and deduction in case of successful checkout.
 *          </li>
 *          <li>
 *              fetching customer details
 *          </li>
 *          <li>
 *              fectching order by its ID.
 *          </li>
 *      </ul>
 * </p>
 * <p>
 *     The checkout process is purely transactional to ensure data consistency. if any step fails,
 *     the entire transaction is rolled back.
 * </p>
 */

@Service
public class OrderService {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private CartItemRepo cartItemRepo;
    @Autowired
    private CustomerRepo customerRepo;
    @Autowired
    private ProductRepo productRepo;

    /**
     * It helps to process the checkout for a customer.
     * <p>
     *     This method:
     *     <ul>
     *         <li>
     *             Validates customer existence
     *         </li>
     *         <li>
     *             validates cart existence and its non-empty state.
     *         </li>
     *         <li>
     *             it checks the stock availability for each product
     *         </li>
     *         <li>
     *             Creates order and OrderItem entries
     *         </li>
     *         <li>
     *             Reduces the product available stock
     *         </li>
     *         <li>
     *             Calculates the subtotal cost incl. tax and gives total.
     *         </li>
     *         <li>
     *             Clears the cart after successful order creation/ checkout.
     *         </li>
     *     </ul>
     * </p>
     * @param customerId customerID of the customer.
     * @param paymentMethod selected payment method by the user.
     * @param shippingCost which is 0 by default but can be changed.
     * @return the saved Order entity
     * @throws CustomResourceNotFoundException if the customer or cart is not found.
     * @throws InvalidRequestException if cart is empty or insufficient stocks.
     */

    @Transactional
    public Order checkout(Long customerId, String paymentMethod, Double shippingCost) {
        System.out.println("Checkout started for customer ID: " + customerId);
        Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new CustomResourceNotFoundException("Customer not found"));
        System.out.println("Customer found: " + customer.getName());
        List<CartManager> carts = cartRepo.findAllByCustomerWithItems(customer);
        if (carts.isEmpty()) {
            throw new CustomResourceNotFoundException("Cart not found");
        }
        CartManager cart = carts.stream()
            .filter(c -> c.getItems() != null && !c.getItems().isEmpty())
            .findFirst()
            .orElse(carts.get(0));
        System.out.println("Cart found with " + cart.getItems().size() + " items");

        if (cart.getItems().isEmpty()) {
            throw new InvalidRequestException("Cart is empty");
        }

        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setPaymentMethod(paymentMethod);
        order.setShippingCost(shippingCost != null ? shippingCost : 0.0);
        order.setStatus("pending");

        double subtotal = 0.0;

        // Process each cart item
        for (CartItems cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            // Check stock availability
            if (product.getStock() < cartItem.getQuantity()) {
                throw new InvalidRequestException(
                    "Insufficient stock for product: " + product.getName());
            }

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice() * cartItem.getQuantity());
            
            order.getItems().add(orderItem);
            subtotal += orderItem.getSubtotal();

            // Decrease product stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepo.save(product);
        }

        // Calculate totals
        order.setSubtotal(subtotal);
        order.setTax(subtotal * 0.10); // 10% GST addition
        order.setTotal(order.getSubtotal() + order.getTax() + order.getShippingCost());

        // Save order
        Order savedOrder = orderRepo.save(order);
        System.out.println("Order saved with ID: " + savedOrder.getId());
        System.out.println("Order has " + savedOrder.getItems().size() + " items");

        // Clear cart
        cartItemRepo.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepo.save(cart);
        System.out.println("Cart cleared");

        return savedOrder;
    }

    /**
     * it Retrieves all the orders given by a customer
     * @param customerId customer id of the user.
     * @return list of Order Entities.
     * @throws CustomResourceNotFoundException if the requested customer not found!
     */
    public List<Order> getCustomerOrders(Long customerId) {
        System.out.println("Fetching orders for customer ID: " + customerId);
        Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new CustomResourceNotFoundException("Customer not found"));
        System.out.println("Customer found: " + customer.getName());
        List<Order> orders = orderRepo.findByCustomerWithItemsAndProducts(customer);
        System.out.println("Found " + orders.size() + " orders for customer " + customer.getName());
        for (Order order : orders) {
            System.out.println("Order ID: " + order.getId() + ", Items: " + order.getItems().size() + ", Total: " + order.getTotal());
        }
        return orders;
    }

    /**
     * Retrieves a specific order of the customer by its ID.
      * @param orderId order id of the customer
     * @return the order entity
     * @throws CustomResourceNotFoundException if the requested order is not found.
     */

    public Order getOrderById(Long orderId) {
        return orderRepo.findById(orderId)
            .orElseThrow(() -> new CustomResourceNotFoundException("Order not found"));
    }
}
