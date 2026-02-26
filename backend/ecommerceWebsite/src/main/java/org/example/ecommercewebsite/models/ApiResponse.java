package org.example.ecommercewebsite.models;

public class ApiResponse<T> {
    private String message;
    private T data;

    public String getMessage() {
        return message;
    }

    public ApiResponse( String message,T data) {
        this.data = data;
        this.message = message;
    }

    public T getData() {
        return data;
    }
}
