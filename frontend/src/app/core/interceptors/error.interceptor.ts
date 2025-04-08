import { 
  HttpInterceptorFn,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
 } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = "Something Went Wrong.";

      if(error.status === 0){
        errorMsg = 'Network Error. Please check your Internet connection.'
      } else if(error.status === 401){
        errorMsg = 'Unauthorized. Please Log in again.'
      } else if (error.status === 403) {
        errorMsg = 'Access denied.';
      } else if (error.status === 404) {
        errorMsg = 'Resource not found.';
      } else if (error.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      } else if(error.error?.error){
        errorMsg = error.error.error
      }

      toastr.error(errorMsg, 'Error');
      return throwError(() => error)
    })
  );
};
