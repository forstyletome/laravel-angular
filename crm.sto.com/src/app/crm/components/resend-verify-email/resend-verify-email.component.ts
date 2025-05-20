import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {ErrorService} from '../../services/errors/error.service';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {FormsModule} from '@angular/forms';
import {RegisterService} from '../../services/register/register.service';
import {GeneralModel} from '../../models/general.model';
import {StandardError} from '../../models/error.service';

@Component({
  selector: 'app-resend-verify-email',
  imports: [
    LanguageSwitcherComponent,
    NgForOf,
    NgIf,
    TranslatePipe,
    RouterLink,
    FormsModule,
    NgClass
  ],
  templateUrl: './resend-verify-email.component.html',
  styleUrl: './resend-verify-email.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ResendVerifyEmailComponent implements OnInit, OnDestroy{

  public email:string = '';
  public showHideSuccessText: boolean = false;
  public successText: object = {};

  protected readonly Object: ObjectConstructor = Object;

  public errors: StandardError = {
    data: {},
    messages: {},
    type: '',
    status: 0,
    success: false
  };

  constructor(
    private errorService: ErrorService,
    private styleService: StyleService,
    private registerService: RegisterService
  ){}

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.errorService.errors$.subscribe((errors:StandardError):void => {

      this.errors = errors;

    });

  }

  protected async resendVerifyEmail(): Promise<void>{

    this.errorService.clearErrors('STANDARD_ERROR');

    const resendVerifyEmail: GeneralModel = await this.registerService.resendVerifyEmail(this.email);

    if(resendVerifyEmail.success){

      this.showHideSuccessText = true;
      this.successText = resendVerifyEmail.messages;

    }

  }

  protected hasError(key: string): boolean {

    return !!this.errors.messages[key];

  }

  protected getErrors(): string[] {

    return Object.keys(this.errors.messages);

  }

  ngOnDestroy(): void {

    this.errorService.clearErrors('STANDARD_ERROR');

  }

}
