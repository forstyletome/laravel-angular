import {HttpInterceptorFn} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ErrorService} from '../services/errors/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const errorService:ErrorService = inject(ErrorService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      if(error.error && error.error.errors){

        errorService.setErrors(error.error.errors);

      }else{

        errorService.anotherError(error);

      }

      return throwError(() => '');

    })

  );

};
