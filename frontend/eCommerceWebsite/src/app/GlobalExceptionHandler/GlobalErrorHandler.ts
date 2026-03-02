import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class CustomGlobalErrorHandler implements ErrorHandler{
    handleError(error: any): void {
        const unwrappedError = error?.rejection ?? error;
        const message = String(
            unwrappedError?.message ??
            unwrappedError?.toString?.() ??
            ''
        );

        const isNonFatalFrameworkError =
            message.includes('ExpressionChangedAfterItHasBeenCheckedError') ||
            message.includes('NG0100') ||
            message.includes('NavigationCancelingError') ||
            message.includes('Navigation cancelled');

        console.error('Global Error Caught here: ', error);

        if (isNonFatalFrameworkError) {
            return;
        }

        alert('Something went wrong. Please try again later.');
    }
}