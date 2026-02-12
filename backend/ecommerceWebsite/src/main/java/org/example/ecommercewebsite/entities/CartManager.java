package org.example.ecommercewebsite.entities;


import jakarta.persistence.*;
import lombok.Data;
import java.util.*;
@Entity
@Data
public class CartManager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL)
    private List<CartItems> items;
}
