package org.example.ecommercewebsite.entities;


import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
@Entity
@Data
public class CartManager {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<CartItems> items = new ArrayList<>();
}
