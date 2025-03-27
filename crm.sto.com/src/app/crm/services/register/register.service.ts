import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {
  ForgotPasswordResponse,
  RegisterData,
  RegisterResponse, ResendVerifyEmailResponse,
  ResetPasswordData,
  ResetPasswordResponse, VerifyResponse
} from '../../models/register.service';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class RegisterService{

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ){}

  async register(data: RegisterData): Promise<RegisterResponse> {

    return await firstValueFrom(this.http.post<RegisterResponse>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.registerUrl,
      data,
      {
        withCredentials: true
      }
    ));

  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {

    return await firstValueFrom(this.http.post<ForgotPasswordResponse>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.forgotPasswordUrl,
      {
        email
      },
      {
        withCredentials: true
      }
    ));

  }

  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {

    return await firstValueFrom(this.http.post<ResetPasswordResponse>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.resetPasswordUrl,
      data,
      {
        withCredentials: true
      }
    ));

  }

  async verifyEmail(id: number, hash: string, expires: number): Promise<VerifyResponse> {

    const url:string = this.configService.apiUrl + this.configService.apiPrefix + this.configService.verifyEmailUrl + '?id=' + id + '&hash=' + hash + '&expires=' + expires;

    return await firstValueFrom(this.http.get<VerifyResponse>(
      url,
      {
        withCredentials: true
      }
    ));

  }

  async resendVerifyEmail(email: string): Promise<ResendVerifyEmailResponse> {

    return await firstValueFrom(this.http.post<ResendVerifyEmailResponse>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.resendVerifyEmail,
      {
        email
      },
      {
        withCredentials: true
      }
    ));

  }

}
