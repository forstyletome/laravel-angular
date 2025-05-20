import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {
  LoginResponse
} from '../../models/auth.service';
import {ErrorService} from '../../services/errors/error.service';
import {ConfigService} from '../../services/config/config.service';
import {VerifyTwoFactorCodeResponse} from '../../models/two-factor-auth';
import {TwoFactorAuthService} from '../../services/two-factor-auth/two-factor-auth.service';
import {UserService} from '../../services/user/user.service';
import {GeneralModel} from '../../models/general.model';
import {StandardError} from '../../models/error.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    NgIf,
    TranslatePipe,
    NgForOf,
    NgClass,
    LanguageSwitcherComponent,
    RouterLink
  ],
  templateUrl: 'login.component.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginComponent implements OnInit, OnDestroy{

  public email:string = '';
  public password:string = '';

  public code:string = '';
  public requires2FA: boolean = false;

  public countdown: number = 0;
  public interval: any;

  public errors: StandardError = {
    data: {},
    messages: {},
    type: '',
    status: 0,
    success: false
  };

  public showHidePassword: boolean = false;
  public showHideForgotPasswordForm: boolean = false;

  public showHideResendLink: boolean = false;

  public codeResented: boolean = false;
  public codeResentedText: object = {};

  protected readonly Object: ObjectConstructor = Object;

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.errorService.errors$.subscribe((errors:StandardError):void => {

      this.errors = errors;

    });

  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private twoFactorAuthService: TwoFactorAuthService,
    private router: Router,
    private styleService: StyleService,
    private errorService: ErrorService,
    private configService: ConfigService
  ){}

  protected async login(): Promise<void>{

    this.errorService.clearErrors('STANDARD_ERROR');

    await this.authService.login(this.email, this.password).then((response: LoginResponse):void => {

      if(response.success){

        this.requires2FA = true;

        this.countdown = 60;

        this.interval = setInterval(():void => {

          this.countdown--;

          if(this.countdown === 0){

            clearInterval(this.interval);

          }

        }, 1000);

      }else{

        if(
          response.data.showHideResendLink
        ){

          this.showHideResendLink = true;

        }

      }

    })

  }

  protected async verify2FA(): Promise<void>{

    this.errorService.clearErrors('STANDARD_ERROR');

    await this.twoFactorAuthService.verifyTwoFactorCode(this.email, this.code).then((response:VerifyTwoFactorCodeResponse):void => {

        if(response.success){

          this.authService.setAuthentication(true);
          this.userService.setUser(response.data);
          this.userService.setUserRoles(response.data.roles);
          this.userService.setUserPermissions(response.data.permissions);

          this.styleService.setBodyClass('');

          this.router.navigate(['/']);

        }

    });

  }

  protected async resendCode(): Promise<void> {

    this.errorService.clearErrors('STANDARD_ERROR');

    this.codeResented = false;

    this.code = '';
    this.countdown = 60;

    this.interval = setInterval(():void => {

      this.countdown--;

      if(this.countdown === 0){

        clearInterval(this.interval);

      }

    }, 1000);

    await this.twoFactorAuthService.resend2FA(this.email, this.countdown).then((response:GeneralModel): void => {

      if(response.success){

        this.codeResented = true;
        this.codeResentedText = response.messages;

      }

    });

  }

  protected togglePassword():void{

    this.showHidePassword = !this.showHidePassword;

  }

  protected forgotPasswordForm():void{

    this.errorService.clearErrors('STANDARD_ERROR');

    this.email = '';
    this.password = '';

    this.showHideForgotPasswordForm = !this.showHideForgotPasswordForm;

  }

  protected async forgotPassword():Promise<void> {

    this.errorService.clearErrors('STANDARD_ERROR');

    await this.authService.forgotPassword(this.email).then(

      (response:GeneralModel):void => {

        if(response.success){

          this.errorService.setErrors({
            data: response.data,
            messages: response.messages,
            status: response.status,
            success: response.success,
            type: response.type
          }, 'SYSTEM_ERROR');

          this.router.navigate(['/forgot-password']);

        }

      }

    );

  }

  protected hasError(key: string): boolean {

    return !!this.errors.messages[key];

  }

  protected getErrors(): string[] {

    return Object.keys(this.errors.messages);

  }

  protected backToLoginForm():void{

    this.showHideForgotPasswordForm = false;
    this.requires2FA = false;

    this.email = '';
    this.password = '';

    this.errorService.clearErrors('STANDARD_ERROR');

  }

  protected showResendEmailLink(): void{

    this.router.navigate([this.configService.resendVerifyEmail]);

  }

  ngOnDestroy(): void {

    this.errorService.clearErrors('STANDARD_ERROR');

  }

}
