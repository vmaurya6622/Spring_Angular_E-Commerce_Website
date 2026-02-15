package org.example.ecommercewebsite.repositories;

import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);
}
