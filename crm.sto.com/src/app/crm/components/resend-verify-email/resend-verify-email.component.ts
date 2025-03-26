import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {ResponseErrors} from '../../models/error.service';
import {ErrorService} from '../../services/errors/error.service';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import { ResendVerifyEmailResponse } from '../../models/auth.service';

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
  public successText: string = '';

  protected readonly Object: ObjectConstructor = Object;

  public errors: ResponseErrors = {
    data: {},
    messages: {},
    type: '',
    status: 0
  };

  constructor(
    private errorService: ErrorService,
    private styleService: StyleService,
    private authService: AuthService
  ){}

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.errorService.errors$.subscribe((errors:ResponseErrors):void => {

      this.errors = errors;

    });

  }

  protected async resendVerifyEmail(): Promise<void>{

    this.errorService.clearErrors('STANDARD_ERROR');

    const resendVerifyEmail: ResendVerifyEmailResponse = await this.authService.resendVerifyEmail(this.email);

    if(resendVerifyEmail.success.data.success){

      this.showHideSuccessText = true;
      this.successText = resendVerifyEmail.success.messages;

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
