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
    //cascade se : agar order save/delete hoga items bhi save/delete hoge. includes persist, merge, remove, refresh, detach
    // fetch default mode is lazy if set eager then jab order hoga items automatically load honge
    private List<OrderItem> items = new ArrayList<>();

    private Double subtotal;
    private Double tax;
    private Double shippingCost;
    private Double total;

    private String paymentMethod;
    private String status; // pending, shipped, delivered, cancelled

    private LocalDateTime orderDate;

    @PrePersist

    //this is JPA lifecycle callback annotation:
    // Ye method automatically call hota hai just BEFORE entity database me insert hoti hai
    // it is used to set default values.
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        if (status == null) {
            status = "pending";
        }
    }
}
/**
 * Lecture on DB annotations:
 * @PrePersist: Jab entity pehli baar DB me insert hone wali hoti hai
 * @PostPersist: INSERT ho chuka hai -> DB ne ID generate kar diya -> ab method call hoti hai
 * @PreUpdate: Jab existing entity update hone wali ho toh us entity ke update hone se just pehle
 * inverse is @PostUpdate
 * and similar is @PreRemove and @PostRemove and similar kind of @PreLoad and @PostLoad.
 */