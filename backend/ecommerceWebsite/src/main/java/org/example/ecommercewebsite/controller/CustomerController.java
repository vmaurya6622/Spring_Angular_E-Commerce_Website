package org.example.ecommercewebsite.controller;

import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Customer customer) {
        try {
            Customer savedCustomer = customerService.signup(customer);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Signup successful");
            response.put("customer", savedCustomer);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String usernameOrEmail = credentials.get("usernameOrEmail");
        String password = credentials.get("password");

        Optional<Customer> customer = customerService.login(usernameOrEmail, password);
        
        if (customer.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("customer", customer.get());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        Optional<Customer> customer = customerService.findById(id);
        if (customer.isPresent()) {
            return ResponseEntity.ok(customer.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
