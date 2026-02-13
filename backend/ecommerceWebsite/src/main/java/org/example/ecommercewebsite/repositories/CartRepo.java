package org.example.ecommercewebsite.repositories;

import org.example.ecommercewebsite.entities.CartManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepo extends JpaRepository<CartManager, Long> {
}
