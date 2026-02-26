package org.example.ecommercewebsite.exception;

public class CustomResourceNotFoundException extends RuntimeException{
    public CustomResourceNotFoundException(String message) {
        super(message);
    }
}
