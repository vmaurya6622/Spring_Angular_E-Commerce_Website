import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const GlobalErrorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 0) { alert('Network error'); }
            if (error.status === 401) { alert('Unauthorized'); }
            if (error.status === 404) { alert('Not Found'); }
            if (error.status === 500) { alert('Server Error'); }
            return throwError(() => error);
        })
    );
};