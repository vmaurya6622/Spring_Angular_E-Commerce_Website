package org.example.ecommercewebsite.controller;

import org.example.ecommercewebsite.entities.Order;
import org.example.ecommercewebsite.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public Order checkout(@RequestBody CheckoutRequest request) {
        return orderService.checkout(
            request.customerId(), 
            request.paymentMethod(), 
            request.shippingCost()
        );
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getCustomerOrders(@PathVariable Long customerId) {
        return orderService.getCustomerOrders(customerId);
    }

    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    public record CheckoutRequest(Long customerId, String paymentMethod, Double shippingCost) {}
}
