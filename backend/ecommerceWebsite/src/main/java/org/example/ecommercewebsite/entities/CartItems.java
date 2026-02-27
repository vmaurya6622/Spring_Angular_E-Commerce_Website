package org.example.ecommercewebsite.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity // this just ensures spring ki ye sab database ko define kia jara h. its object will be mapped to database
@Data // this automatically generates getters and setters no need to create manually.
public class CartItems {
    @Id // indicates that this is the primary key.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private CartManager cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Integer quantity;
}
