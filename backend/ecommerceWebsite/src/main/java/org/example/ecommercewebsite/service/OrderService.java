package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.*;
import org.example.ecommercewebsite.repositories.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final CartRepo cartRepo;
    private final CartItemRepo cartItemRepo;
    private final CustomerRepo customerRepo;
    private final ProductRepo productRepo;

    public OrderService(OrderRepo orderRepo, CartRepo cartRepo, CartItemRepo cartItemRepo, 
                       CustomerRepo customerRepo, ProductRepo productRepo) {
        this.orderRepo = orderRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public Order checkout(Long customerId, String paymentMethod, Double shippingCost) {
        System.out.println("Checkout started for customer ID: " + customerId);
        // Get customer
        Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        System.out.println("Customer found: " + customer.getName());

        // Get customer's cart
        CartManager cart = cartRepo.findByCustomer(customer)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
        System.out.println("Cart found with " + cart.getItems().size() + " items");

        if (cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
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
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
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
        order.setTax(subtotal * 0.10); // 10% GST
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

    public List<Order> getCustomerOrders(Long customerId) {
        System.out.println("Fetching orders for customer ID: " + customerId);
        Customer customer = customerRepo.findById(customerId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));
        System.out.println("Customer found: " + customer.getName());
        List<Order> orders = orderRepo.findByCustomerWithItemsAndProducts(customer);
        System.out.println("Found " + orders.size() + " orders for customer " + customer.getName());
        for (Order order : orders) {
            System.out.println("Order ID: " + order.getId() + ", Items: " + order.getItems().size() + ", Total: " + order.getTotal());
        }
        return orders;
    }

    public Order getOrderById(Long orderId) {
        return orderRepo.findById(orderId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }
}
