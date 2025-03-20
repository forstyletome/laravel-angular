import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {AuthService} from '../../services/auth/auth.service';
import {Router, RouterLink} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {RegisterData, RegisterResponse} from '../../models/auth.service';
import {ResponseErrors} from '../../models/error.service';
import {ErrorService} from '../../services/errors/error.service';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    LanguageSwitcherComponent,
    NgForOf,
    NgIf,
    TranslatePipe,
    NgClass,
    RouterLink
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RegisterComponent implements OnInit{

  public email:string = '';
  public password:string = '';
  public name:string = '';
  public policy:boolean = false;
  public password_confirmation:string = '';

  public registrationSuccess:boolean = false;

  public errors: ResponseErrors = {
    data: {},
    messages: {},
    type: '',
    status: 0
  };

  public showHidePassword:boolean = false;

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.errorService.errors$.subscribe((errors:ResponseErrors):void => {

      this.errors = errors;

    });

  }

  constructor(
    private authService: AuthService,
    private styleService: StyleService,
    private errorService: ErrorService,
  ){}

  protected hasError(key: string): boolean {
    return this.errorService.hasError(key, 'STANDARD_ERROR');
  }

  protected getErrors(): string[] | undefined {
    return this.errorService.getErrors('STANDARD_ERROR');
  }

  protected togglePassword():void{

    this.showHidePassword = !this.showHidePassword;

  }

  protected async register():Promise<void>{

    this.errorService.clearErrors('STANDARD_ERROR');

    const data: RegisterData = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      policy: this.policy
    };

    const response: RegisterResponse = await this.authService.register(data);

    if(response.success){

      this.registrationSuccess = true;

      //this.authService.setUserIdStatus(response.data.id);

      this.errorService.clearErrors('STANDARD_ERROR');

    }

  }

  ngOnDestroy(): void {

    this.errorService.clearErrors('STANDARD_ERROR');

  }

}
