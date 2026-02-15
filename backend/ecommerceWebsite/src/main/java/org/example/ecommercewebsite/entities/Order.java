package org.example.ecommercewebsite.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    private Double subtotal;
    private Double tax;
    private Double shippingCost;
    private Double total;

    private String paymentMethod;
    private String status; // pending, shipped, delivered, cancelled

    private LocalDateTime orderDate;

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        if (status == null) {
            status = "pending";
        }
    }
}
