import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LanguageSwitcherComponent} from "../language-switcher/language-switcher.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {ErrorService} from '../../services/errors/error.service';
import {RegisterData} from '../../models/register.service';
import {RegisterService} from '../../services/register/register.service';
import {GeneralModel} from '../../models/general.model';
import {StandardError} from '../../models/error.service';

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

export class RegisterComponent implements OnInit, OnDestroy{

  public email:string = '';
  public password:string = '';
  public name:string = '';
  public policy:boolean = false;
  public password_confirmation:string = '';

  public registrationSuccess:boolean = false;

  public errors: StandardError = {
    data: {},
    messages: {},
    type: '',
    status: 0,
    success: false
  };

  public showHidePassword:boolean = false;

  protected readonly Object: ObjectConstructor = Object;

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.errorService.errors$.subscribe((errors:StandardError):void => {

      this.errors = errors;

    });

  }

  constructor(
    private registerService: RegisterService,
    private styleService: StyleService,
    private errorService: ErrorService,
  ){}

  protected async register():Promise<void>{

    this.errorService.clearErrors('STANDARD_ERROR');

    const data: RegisterData = {
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
      policy: this.policy
    };

    const response: GeneralModel = await this.registerService.register(data);

    if(response.success){

      this.registrationSuccess = true;

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
