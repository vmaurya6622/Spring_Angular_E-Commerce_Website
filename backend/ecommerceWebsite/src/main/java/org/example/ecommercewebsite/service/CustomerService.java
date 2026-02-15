package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.repositories.CustomerRepo;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerService {
    private final CustomerRepo customerRepo;

    public CustomerService(CustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }

    public Customer signup(Customer customer) {
        if (customerRepo.existsByUsername(customer.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (customerRepo.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return customerRepo.save(customer);
    }

    public Optional<Customer> login(String usernameOrEmail, String password) {
        Optional<Customer> customer = customerRepo.findByUsername(usernameOrEmail);
        if (customer.isEmpty()) {
            customer = customerRepo.findByEmail(usernameOrEmail);
        }
        
        if (customer.isPresent() && customer.get().getPassword().equals(password)) {
            return customer;
        }
        return Optional.empty();
    }

    public Optional<Customer> findById(Long id) {
        return customerRepo.findById(id);
    }
}
