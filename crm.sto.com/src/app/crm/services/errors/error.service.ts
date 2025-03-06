import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ResponseErrors} from '../../models/error.service';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class ErrorService{

  private errorsSubject:BehaviorSubject<ResponseErrors> = new BehaviorSubject<ResponseErrors>({});

  errors$:Observable<ResponseErrors> = this.errorsSubject.asObservable();

  public setErrors(errors: ResponseErrors):void {

    this.errorsSubject.next(errors);

  }

  public clearErrors():void {

    this.errorsSubject.next({});

  }

  hasError(key: string): boolean{

    const errors:ResponseErrors = this.errorsSubject.value;

    return !!errors[key];

  }

  getError(key: string): string | undefined {

    const errors:ResponseErrors = this.errorsSubject.value;

    return errors[key];

  }

  getErrors(): string[] | undefined {
    return Object.keys(this.errorsSubject.value);
  }

  setAnotherErrors(error:string|object, status:number):void {

    console.log(error);
    console.log(status);

      //this.errorsSubject.next(errors);

  }

  anotherError(error:HttpErrorResponse):void{

    switch (error.status) {

      case 419:

        this.setAnotherErrors(error.error.message, error.status);

      break;

    }

  }

}
