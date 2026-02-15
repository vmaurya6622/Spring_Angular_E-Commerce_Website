package org.example.ecommercewebsite.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private Integer age;
    
    private String sex;
    
    @Column(name = "date_of_birth")
    private LocalDate dob;
    
    @Column(nullable = false)
    private String mobile;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false, unique = true)
    private String email;
}
