package org.example.ecommercewebsite.service;

import org.example.ecommercewebsite.entities.Customer;
import org.example.ecommercewebsite.repositories.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

/**
 * <p>
 *     This service mainly facilitates:
 *     <ul>
 *         <li>
 *             Customer Registration (signup)
 *         </li>
 *         <li>
 *             Customer Authentication (login)
 *         </li>
 *         <li>
 *             Fetching customer details
 *         </li>
 *         <li>
 *             updating the customer profile information
 *         </li>
 *     </ul>
 * </p>
 * <p>
 *     Business validation such as duplicate username/email checks are handled at the service
 *     layer.
 * </p>
 */
@Service
public class CustomerService {
    @Autowired
    private  CustomerRepo customerRepo;

    /**
     * Registers a new customer
     * <p>
     *     it validates that username and email are unique before saving them
     * </p>
     * @param customer it is the entity which contains registration details
     * @return returns the saved entity.
     * @throws RuntimeException if the username or email already exists.
     */

    public Customer signup(Customer customer) { // try catch use here
        if (customerRepo.existsByUsername(customer.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (customerRepo.existsByEmail(customer.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return customerRepo.save(customer);
    }

    /**
     * it is used to authenticate a customer using username or email and password
     * <p>
     *     First it attempts to find the customer by its username.
     *     if not found, it attempts to find by email.
     * </p>
     * @param usernameOrEmail Username or email of the customer.
     * @param password password of the customer (plain text)
     * @return Optional containing customer if authentication succeeds otherwise Optional.empty() is returned.
     */

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

    /**
     * Retrieves a customer by its ID.
     * @param id the ID of the customer
     * @return Optional containing customer if found, otherwise it returns Optional,empty().
     */

    public Optional<Customer> findById(Long id) {
        return customerRepo.findById(id);
    }

    /**
     * Updates an existing customer's profile information and send the data to backend DB.
     * <p>
     *     in this piece of code, Only non-null fields from {@code customerDetails} are updates
     *     (partial update behaviour)
     * </p>
     * @param id  id of the customer to update.
     * @param customerDetails it contains the customer object which contains updated fields.
     * @return the updated customer entity.
     * @throws ResponseStatusException if the customer is not found anywhere.
     */

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
