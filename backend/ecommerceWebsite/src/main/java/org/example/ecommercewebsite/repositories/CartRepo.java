package org.example.ecommercewebsite.repositories;

import org.example.ecommercewebsite.entities.CartManager;
import org.example.ecommercewebsite.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<CartManager, Long> {
    Optional<CartManager> findByCustomer(Customer customer);
    
    @Query("SELECT DISTINCT c FROM CartManager c LEFT JOIN FETCH c.items i LEFT JOIN FETCH i.product WHERE c.customer = :customer")
    List<CartManager> findAllByCustomerWithItems(@Param("customer") Customer customer);
}
