package org.example.ecommercewebsite.controller;
import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.exception.CustomResourceNotFoundException;
import org.example.ecommercewebsite.exception.InvalidRequestException;
import org.example.ecommercewebsite.models.ApiResponse;
import org.example.ecommercewebsite.models.CustomerLoginCredentials;
import org.example.ecommercewebsite.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Customer>> signup(@RequestBody Customer customer) {
        Customer savedCustomer = customerService.signup(customer);
        return ResponseEntity.ok(
                new ApiResponse<>("Signup successful", savedCustomer)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Customer>> login(@RequestBody CustomerLoginCredentials credentials) {
        Optional<Customer> customer = customerService.login(credentials.getUsernameOrEmail(), credentials.getPassword());
        if (customer.isEmpty()) {
            throw new InvalidRequestException("Invalid username or password");
        }
        return ResponseEntity.ok(new ApiResponse<>("Login successful", customer.get()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable Long id) {
        Optional<Customer> customer = customerService.findById(id);
        if (customer.isEmpty()) {
            throw new CustomResourceNotFoundException("Customer not found");
        }
        return ResponseEntity.ok(customer.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        Customer updatedCustomer = customerService.updateCustomer(id, customerDetails);
        return ResponseEntity.ok(new ApiResponse<>("Profile updated successfully.", updatedCustomer));
    }
}
