import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {
  RegisterData
} from '../../models/register.service';
import {firstValueFrom} from 'rxjs';
import {GeneralModel} from '../../models/general.model';

@Injectable({
  providedIn: 'root',
})

export class RegisterService{

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ){}

  async register(data: RegisterData): Promise<GeneralModel> {

    return await firstValueFrom(this.http.post<GeneralModel>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.registerUrl,
      data,
      {
        withCredentials: true
      }
    ));

  }

  async verifyEmail(id: number, hash: string, expires: number): Promise<GeneralModel> {

    const url:string = this.configService.apiUrl + this.configService.apiPrefix + this.configService.verifyEmailUrl + '?id=' + id + '&hash=' + hash + '&expires=' + expires;

    return await firstValueFrom(this.http.get<GeneralModel>(
      url,
      {
        withCredentials: true
      }
    ));

  }

  async resendVerifyEmail(email: string): Promise<GeneralModel> {

    return await firstValueFrom(this.http.post<GeneralModel>(
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
