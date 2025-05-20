import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {VerifyTwoFactorCodeResponse} from '../../models/two-factor-auth';
import {firstValueFrom} from 'rxjs';
import {GeneralModel} from '../../models/general.model';

@Injectable({
  providedIn: 'root',
})

export class TwoFactorAuthService{

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ){}

  async verifyTwoFactorCode(email: string, code: string): Promise<VerifyTwoFactorCodeResponse> {

    return await firstValueFrom(this.http.post<VerifyTwoFactorCodeResponse>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.verify2FACodeUrl,
      { email, code: code },
      { withCredentials: true}
    ));

  }

  async resend2FA(email: string, countdown: number): Promise<GeneralModel> {

    return await firstValueFrom(this.http.post<GeneralModel>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.resend2FACodeUrl, { email: email, countdown: countdown }, { withCredentials: true }));

  }

}
