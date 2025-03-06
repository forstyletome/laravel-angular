import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {
  ForgotPasswordResponse,
  LoginResponse,
  resend2FAResponse,
  VerifyTwoFactorCodeResponse
} from '../../models/auth.service';
import {ErrorService} from '../../services/errors/error.service';
import {ResponseErrors} from '../../models/error.service';
import {ConfigService} from '../../services/config/config.service';

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

export class LoginComponent implements OnInit{

  public email:string = '';
  public password:string = '';

  public code:string = '';
  public requires2FA: boolean = false;

  public countdown: number = 0;
  public interval: any;

  public errors: ResponseErrors = {};

  public showHidePassword:boolean = false;
  public showHideForgotPasswordForm:boolean = false;

  public codeResented:boolean = false;
  public codeResentedText:string = '';

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.errorService.errors$.subscribe((errors:ResponseErrors):void => {

      this.errors = errors;

    });

  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private styleService: StyleService,
    private errorService: ErrorService,
    private configService: ConfigService
  ){}

  protected async login(): Promise<void>{

    this.errorService.clearErrors();

    const response: LoginResponse = await this.authService.login(this.email, this.password);

    if(response.data.user_id > 0){

      this.authService.setUserIdStatus(response.data.user_id);
      this.requires2FA = true;

      this.errorService.clearErrors();

    }

  }

  protected async verify2FA(): Promise<void>{

    this.errorService.clearErrors();

    await this.authService.verifyTwoFactorCode(this.authService.userIdSubject.value, this.code).then((data:VerifyTwoFactorCodeResponse):void => {

        if(data.authenticated){

          this.authService.setAuthenticationStatus(data.authenticated);

          this.styleService.setBodyClass('');

          this.router.navigate(['/']);

        }

    });

  }

  protected async resendCode(): Promise<void> {

    this.errorService.clearErrors();

    this.codeResented = false;

    this.code = '';
    this.countdown = 30;

    this.interval = setInterval(():void => {

      this.countdown--;

      if(this.countdown === 0){

        clearInterval(this.interval);

      }

    }, 1000);

    await this.authService.resend2FA(this.authService.userIdSubject.value).then(
      (data:resend2FAResponse): void => {

        this.codeResented  = true;
        this.codeResentedText = data.message;

      });

  }

  protected togglePassword():void{

    this.showHidePassword = !this.showHidePassword;

  }

  protected forgotPasswordForm():void{

    this.errorService.clearErrors();

    this.email = '';
    this.password = '';

    this.showHideForgotPasswordForm = !this.showHideForgotPasswordForm;

  }

  protected async forgotPassword():Promise<void> {

    this.errorService.clearErrors();

    await this.authService.forgotPassword(this.email).then(

      (data:ForgotPasswordResponse):void => {

        if(data.status){

          this.router.navigate([this.configService.forgotPasswordUrl]);

        }

      }

    );

  }

  protected hasError(key: string): boolean {

    return this.errorService.hasError(key);

  }

  protected getErrors(): string[] | undefined {

    return this.errorService.getErrors();

  }

  protected backToLoginForm():void{

    this.showHideForgotPasswordForm = false;

    this.email = '';
    this.password = '';

    this.errorService.clearErrors();

  }

  ngOnDestroy(): void {

    this.errorService.clearErrors();

  }

}
