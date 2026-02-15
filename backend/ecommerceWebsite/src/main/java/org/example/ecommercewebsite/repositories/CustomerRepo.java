package org.example.ecommercewebsite.repositories;

import org.example.ecommercewebsite.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUsername(String username);
    Optional<Customer> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
