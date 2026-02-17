package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.repositories.CustomerRepo;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepo.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        // Update fields if they are provided (not null)
        if (customerDetails.getName() != null) {
            customer.setName(customerDetails.getName());
        }
        if (customerDetails.getEmail() != null) {
            customer.setEmail(customerDetails.getEmail());
        }
        if (customerDetails.getMobile() != null) {
            customer.setMobile(customerDetails.getMobile());
        }
        if (customerDetails.getAge() != null) {
            customer.setAge(customerDetails.getAge());
        }
        if (customerDetails.getSex() != null) {
            customer.setSex(customerDetails.getSex());
        }
        if (customerDetails.getAddress() != null) {
            customer.setAddress(customerDetails.getAddress());
        }
        if (customerDetails.getDob() != null) {
            customer.setDob(customerDetails.getDob());
        }

        return customerRepo.save(customer);
    }
}
