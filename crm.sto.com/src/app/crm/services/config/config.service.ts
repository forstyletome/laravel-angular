import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {ErrorService} from '../errors/error.service';
import {DomainApiMapResponse} from '../../models/config.service';

@Injectable({
  providedIn: 'root',
})

export class ConfigService{

  apiUrl: string = '';
  apiPrefix: string = '/api';
  domainFileNameUrl: string = 'config/domains-config.json';
  sanctumUrl: string = '/sanctum/csrf-cookie';
  checkAuthUrl: string = '/check-auth';
  loginUrl: string = '/login';
  registerUrl: string = '/register';
  verifyEmailUrl: string = '/verify-email';
  forgotPasswordUrl: string = '/forgot-password';
  resetPasswordUrl: string = '/reset-password';
  verify2FACodeUrl: string = '/verify-2fa';
  resendVerifyEmail: string = '/resend-verify-email';
  resend2FACodeUrl: string = '/resend-2fa';
  logoutUrl: string = '/logout';
  userUrl: string = '/user';
  translationsUrl: string = '/translations';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ){}

  async init():Promise<void> {

    const config:DomainApiMapResponse = await this.loadConfig();
    const host:string = window.location.hostname;

    if(config[host]){

      this.apiUrl = config[host];

    }else if(config['default']){

      this.apiUrl = config['default'];

    }

  }

  private async loadConfig(): Promise<DomainApiMapResponse> {

    return await firstValueFrom(this.http.get<DomainApiMapResponse>(this.domainFileNameUrl));

  }

}
