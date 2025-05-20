import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {GeneralModel} from '../../models/general.model';
import {StandardError, SystemError} from '../../models/error.service';

@Injectable({
  providedIn: 'root',
})

export class ErrorService{

  private errorsSubject:BehaviorSubject<GeneralModel> = new BehaviorSubject<GeneralModel>(
    {
      data: {},
      messages: {},
      status:0,
      success: false,
      type: ''
    }
  );

  errors$:Observable<GeneralModel> = this.errorsSubject.asObservable();

  private errorsSystemSubject:BehaviorSubject<SystemError> = new BehaviorSubject<SystemError>(
    {
      data: {
        type: ''
      },
      messages: {},
      status:0,
      success: false,
      type: ''
    }
  );

  errorsSystem$:Observable<SystemError> = this.errorsSystemSubject.asObservable();

  public setErrors(errors: StandardError | SystemError, type: string):void {

    switch(type){

      case 'STANDARD_ERROR':

        if(this.isStandardError(errors)){

          this.errorsSubject.next(errors);

        }

      break;

      case 'SYSTEM_ERROR':

        if (this.isSystemError((errors))){

          this.errorsSystemSubject.next(errors);

        }

      break;

    }

  }

  public clearErrors(type: string):void {

    switch (type){

      case 'STANDARD_ERROR':

        this.errorsSubject.next({
          data: {},
          messages: {},
          status: 0,
          success: false,
          type: ''
        });

      break;

      case 'SYSTEM_ERROR':

        this.errorsSystemSubject.next({
          data: {
            type: ''
          },
          messages: {},
          status: 0,
          success: false,
          type: ''
        });

      break;

    }

  }

  hasError(key: string, type: string): boolean{

    switch(type){

      case 'STANDARD_ERROR':

        return !!this.errorsSubject.value.messages[key];

      case 'SYSTEM_ERROR':

        return !!this.errorsSystemSubject.value.messages[key];

    }

    return false;

  }

  getError(key: string, type: string): string{

    switch(type){

      case 'STANDARD_ERROR':

        return this.errorsSubject.value.messages[key];

      case 'SYSTEM_ERROR':

        return this.errorsSystemSubject.value.messages[key];

    }

    return '';

  }

  getErrors(type: string): StandardError | SystemError {

    switch(type){

      case 'STANDARD_ERROR':

        return this.errorsSubject.value;

      case 'SYSTEM_ERROR':

        return this.errorsSystemSubject.value;

    }

    return {
      data: {},
      messages: {},
      status: 0,
      success: false,
      type: ''
    }

  }

  isStandardError(error: any): error is StandardError {
    return error && typeof error.data === 'object' && !('type' in error.data);
  }

  isSystemError(error: any): error is SystemError {
    return error && typeof error.data === 'object' && 'type' in error.data;
  }

}
