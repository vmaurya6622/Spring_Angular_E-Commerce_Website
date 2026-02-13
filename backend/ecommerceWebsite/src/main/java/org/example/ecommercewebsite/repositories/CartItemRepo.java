package org.example.ecommercewebsite.repositories;

import org.example.ecommercewebsite.entities.CartItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepo extends JpaRepository<CartItems, Long> {
}
