import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {DomainApiMapResponse} from '../../models/config.service';

@Injectable({
  providedIn: 'root',
})

export class ConfigService{

  apiUrl: string = '';
  apiPrefix: string = '/api';
  domainFileNameUrl: string = 'config/domains-config.json';
  sanctumUrl: string = '/sanctum/csrf-cookie';
  translationsUrl: string = '/translations';

  checkAuthUrl: string = '/auth/check-auth';
  loginUrl: string = '/auth/login';
  verify2FACodeUrl: string = '/auth/verify-2fa';
  resend2FACodeUrl: string = '/auth/resend-2fa';
  logoutUrl: string = '/auth/logout';

  registerUrl: string = '/register';
  verifyEmailUrl: string = '/register/verify-email';
  resendVerifyEmail: string = '/register/resend-verify-email';

  forgotPasswordUrl: string = '/password/forgot-password';
  resetPasswordUrl: string = '/password/reset-password';

  userUrl: string = '/user';
  userGetUrl: string = '/get';

  constructor(
    private http: HttpClient
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
