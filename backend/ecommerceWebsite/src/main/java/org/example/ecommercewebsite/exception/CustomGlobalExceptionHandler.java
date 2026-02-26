//package org.example.ecommercewebsite.exception;
//
//import jakarta.servlet.http.HttpServletRequest;
//import org.apache.coyote.BadRequestException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.ErrorResponse;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//
//@ControllerAdvice
//public class CustomGlobalExceptionHandler {
//    @ExceptionHandler(CustomResourceNotFoundException.class)
//    public ResponseEntity<ErrorResponse> handleCustomResourceNotFoundException(CustomResourceNotFoundException e, HttpServletRequest request) {
//        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Not Found", e.getMessage(), request.getRequestURI());
//        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
//    }
//
//    @ExceptionHandler(BadRequestException.class)
//    public ResponseEntity<ErrorResponse> handleBadRequest(
//            BadRequestException ex,
//            HttpServletRequest request) {
//
//        ErrorResponse error = new ErrorResponse(
//                HttpStatus.BAD_REQUEST.value(),
//                "Bad Request",
//                ex.getMessage(),
//                request.getRequestURI()
//        );
//
//        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
//    }
//
//    // 3️⃣ Handle Generic Exceptions
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleGlobalException(
//            Exception ex,
//            HttpServletRequest request) {
//
//        ErrorResponse error = new ErrorResponse(
//                HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                "Internal Server Error",
//                ex.getMessage(),
//                request.getRequestURI()
//        );
//
//        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//}
