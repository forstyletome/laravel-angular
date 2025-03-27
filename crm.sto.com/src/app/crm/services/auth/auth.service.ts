import {Injectable} from '@angular/core';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {LoginResponse, LogoutResponse} from '../../models/auth.service';

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

  async checkAuth(): Promise<object>{

    return await firstValueFrom(this.http.get(this.configService.apiUrl + this.configService.apiPrefix + this.configService.checkAuthUrl, {
      withCredentials: true
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

  async logout(): Promise<LogoutResponse> {

    return await firstValueFrom(this.http.post<LogoutResponse>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.logoutUrl, {}, { withCredentials: true }));

  }

  public getXsrfToken(): string | null {

    const tokenName:string = 'XSRF-TOKEN';
    const cookies:string[] = document.cookie.split('; ');
    const token:string|undefined = cookies.find(row => row.startsWith(tokenName));

    return token ? decodeURIComponent(token.split('=')[1]) : null;

  }

}
