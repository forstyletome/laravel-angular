import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {StyleService} from '../../services/style/style.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {ResetPasswordData, ResetPasswordResponse} from '../../models/auth.service';
import {ResponseErrors} from '../../models/error.service';
import {ErrorService} from '../../services/errors/error.service';

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

export class ForgotPasswordComponent implements OnInit{

  public errors: ResponseErrors = {};

  public email: string = '';
  public token: string = '';
  public password:string = '';
  public password_confirmation:string = '';

  public resetPasswordConfirmed:boolean = false;
  public resetPasswordConfirmedMessage:object = {};

  public showHidePassword:boolean = false;

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

    this.errorService.errors$.subscribe((errors:ResponseErrors):void => {

      this.errors = errors;

    });

  }

  protected hasError(key: string): boolean {

    return this.errorService.hasError(key);

  }

  protected getErrors(): string[] | undefined {

    return this.errorService.getErrors();

  }

  protected async resetPassword(): Promise<void>{

    this.errorService.clearErrors();

    const data: ResetPasswordData = {
      email: this.email,
      token: this.token,
      password: this.password,
      password_confirmation: this.password_confirmation
    }

    const resetPassword: ResetPasswordResponse = await this.authService.resetPassword(data);

    if(resetPassword.status){

      this.resetPasswordConfirmed = true;
      this.resetPasswordConfirmedMessage = resetPassword.message;

    }

  }

  protected togglePassword():void{

    this.showHidePassword = !this.showHidePassword;

  }

  ngOnDestroy(): void {

    this.errorService.clearErrors();

  }

}
