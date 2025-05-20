import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {StyleService} from '../../services/style/style.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ErrorService} from '../../services/errors/error.service';
import {ResetPasswordData} from '../../models/auth.service';
import {AuthService} from '../../services/auth/auth.service';
import {GeneralModel} from '../../models/general.model';
import {StandardError} from '../../models/error.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TranslatePipe,
    NgClass,
    LanguageSwitcherComponent,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  standalone: true,
  styleUrl: './forgot-password.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ForgotPasswordComponent implements OnInit, OnDestroy{

  public errors: StandardError = {
    data: {},
    messages: {},
    type: '',
    status: 0,
    success: false
  };

  public email: string = '';
  public token: string = '';
  public password:string = '';
  public password_confirmation:string = '';

  public resetPasswordConfirmed:boolean = false;
  public resetPasswordConfirmedMessage:object = {};

  public showHidePassword:boolean = false;

  protected readonly Object: ObjectConstructor = Object;

  constructor(
    private styleService: StyleService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private errorService: ErrorService
  ){}

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.route.queryParams.subscribe(params => {

      this.token = params['token'] || '';
      this.email = params['email'] || '';

    });

    this.errorService.errors$.subscribe((errors:StandardError):void => {

      this.errors = errors;

    });

  }

  protected async resetPassword(): Promise<void>{

    this.errorService.clearErrors('STANDARD_ERROR');

    const data: ResetPasswordData = {
      email: this.email,
      token: this.token,
      password: this.password,
      password_confirmation: this.password_confirmation
    }

    const resetPassword: GeneralModel = await this.authService.resetPassword(data);

    if(resetPassword.success){

      this.resetPasswordConfirmed = true;
      this.resetPasswordConfirmedMessage = resetPassword.messages;

    }

  }

  protected hasError(key: string): boolean {

    return !!this.errors.messages[key];

  }

  protected getErrors(): string[] {

    return Object.keys(this.errors.messages);

  }

  protected togglePassword():void{

    this.showHidePassword = !this.showHidePassword;

  }

  ngOnDestroy(): void {

    this.errorService.clearErrors('STANDARD_ERROR');

  }

}
