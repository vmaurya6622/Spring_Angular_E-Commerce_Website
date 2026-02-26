import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class CustomGlobalErrorHandler implements ErrorHandler{
    handleError(error: any): void {
        console.error('Global Error Caught here: ',error);
        alert('Something went wrong. Please try again later.');
    }
}