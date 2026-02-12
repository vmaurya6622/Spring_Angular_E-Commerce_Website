package org.example.ecommercewebsite.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CartItems {
    @jakarta.persistence.Id
    private Long id1;
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private CartManager cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
}
