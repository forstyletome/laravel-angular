import {Injectable} from '@angular/core';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {
  LoginResponse,
  ResetPasswordData
} from '../../models/auth.service';
import {GeneralModel} from '../../models/general.model';

@Injectable({
  providedIn: 'root',
})

export class AuthService{

  public isAuthenticatedSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated$:Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ){}

  setAuthentication(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  async initializeCsrf(): Promise<void>{

    await firstValueFrom(this.http.get(this.configService.apiUrl + this.configService.sanctumUrl, { withCredentials: true }));

  }

  async checkAuth(): Promise<GeneralModel>{

    const currentPath: string = this.getFirstLevelPath();

    return await firstValueFrom(this.http.get<GeneralModel>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.checkAuthUrl, {
      withCredentials: true,
      headers: {
        'X-Client-Path': currentPath
      }
    }));

  }

  async login(email: string, password: string):Promise<LoginResponse> {

    return await firstValueFrom(this.http.post<LoginResponse>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.loginUrl,
      {
        email,
        password
      },
      {
        withCredentials: true
      }
    ));

  }

  async logout(): Promise<GeneralModel> {

    return await firstValueFrom(this.http.post<GeneralModel>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.logoutUrl, {}, { withCredentials: true }));

  }

  async forgotPassword(email: string): Promise<GeneralModel> {

    return await firstValueFrom(this.http.post<GeneralModel>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.forgotPasswordUrl,
      {
        email
      },
      {
        withCredentials: true
      }
    ));

  }

  async resetPassword(data: ResetPasswordData): Promise<GeneralModel> {

    return await firstValueFrom(this.http.post<GeneralModel>(
      this.configService.apiUrl + this.configService.apiPrefix + this.configService.resetPasswordUrl,
      data,
      {
        withCredentials: true
      }
    ));

  }

  public getXsrfToken(): string | null {

    const tokenName:string = 'XSRF-TOKEN';
    const cookies:string[] = document.cookie.split('; ');
    const token:string|undefined = cookies.find(row => row.startsWith(tokenName));

    return token ? decodeURIComponent(token.split('=')[1]) : null;

  }

  public getFirstLevelPath(): string {

    const path = window.location.pathname.split('/').filter(Boolean);

    return path.length > 0 ? `/${path[0]}` : '/';

  }

}
