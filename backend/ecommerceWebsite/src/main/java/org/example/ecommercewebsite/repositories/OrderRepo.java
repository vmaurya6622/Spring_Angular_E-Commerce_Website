package org.example.ecommercewebsite.repositories;

import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {
    List<Order> findByCustomerOrderByOrderDateDesc(Customer customer);
    
    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.items i LEFT JOIN FETCH i.product WHERE o.customer = :customer ORDER BY o.orderDate DESC")
    List<Order> findByCustomerWithItemsAndProducts(@Param("customer") Customer customer);
}
