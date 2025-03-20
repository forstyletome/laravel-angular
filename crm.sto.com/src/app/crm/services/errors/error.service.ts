import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ResponseErrors} from '../../models/error.service';

@Injectable({
  providedIn: 'root',
})

export class ErrorService{

  private errorsSubject:BehaviorSubject<ResponseErrors> = new BehaviorSubject<ResponseErrors>(
    {
      data: {},
      messages: {},
      type: '',
      status:0
    }
  );

  errors$:Observable<ResponseErrors> = this.errorsSubject.asObservable();

  private errorsSystemSubject:BehaviorSubject<ResponseErrors> = new BehaviorSubject<ResponseErrors>(
    {
      data: {},
      messages: {},
      type: '',
      status: 0
    }
  );

  errorsSystem$:Observable<ResponseErrors> = this.errorsSystemSubject.asObservable();

  public setErrors(errors: ResponseErrors, type: string):void {

    switch(type){

      case 'STANDARD_ERROR':

        this.errorsSubject.next(errors);

      break;

      case 'SYSTEM_ERROR':

        this.errorsSystemSubject.next(errors);

      break;

    }

  }

  public clearErrors(type: string):void {

    switch(type){

      case 'STANDARD_ERROR':

        this.errorsSubject.next({
          data: {},
          messages: {},
          type: '',
          status: 0
        });

      break;

      case 'SYSTEM_ERROR':

        this.errorsSystemSubject.next({
          data: {},
          messages: {},
          type: '',
          status: 0
        });

      break;

    }

  }

  hasError(key: string, type: string): boolean{

    switch(type){

      case 'STANDARD_ERROR':

        return !!this.errorsSubject.value.messages[key];

      break;

      case 'SYSTEM_ERROR':

        return !!this.errorsSystemSubject.value.messages[key];

      break;

    }

    return false;

  }

  getError(key: string, type: string): string | undefined {

    switch(type){

      case 'STANDARD_ERROR':

        return this.errorsSubject.value.messages[key];

      break;

      case 'SYSTEM_ERROR':

        return this.errorsSystemSubject.value.messages[key];

      break;

    }

    return '';

  }

  getErrors(type: string): string[] | undefined {

    //console.log(Object.keys(this.errorsSubject.value.messages));

    switch(type){

      case 'STANDARD_ERROR':

        return Object.keys(this.errorsSubject.value.messages);

      break;

      case 'SYSTEM_ERROR':

        return Object.keys(this.errorsSystemSubject.value.messages);

      break;

    }

    return [];

  }

}
