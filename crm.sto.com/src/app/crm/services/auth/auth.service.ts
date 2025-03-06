import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {ConfigService} from '../config/config.service';
import {AuthResponse, ForgotPasswordResponse, GetUserResponse, LoginResponse, LogoutResponse, RegisterData, RegisterResponse, resend2FAResponse, ResetPasswordData, ResetPasswordResponse, User, VerifyResponse, VerifyTwoFactorCodeResponse
} from '../../models/auth.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {

  public isAuthenticatedSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAuthenticated$:Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  public userIdSubject:BehaviorSubject<number> = new BehaviorSubject<number>(0);
  userId$:Observable<number> = this.userIdSubject.asObservable();

  public userSubject:BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$:Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ){}

  setAuthenticationStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  setUserIdStatus(userId: number): void {
    this.userIdSubject.next(userId);
  }

  setUserStatus(user: User | null): void {
    this.userSubject.next(user);
  }

  async initializeCsrf(): Promise<void>{

    await firstValueFrom(this.http.get(this.configService.apiUrl + this.configService.sanctumUrl, { withCredentials: true }));

  }

  async checkAuth(): Promise<AuthResponse>{

    return await firstValueFrom(this.http.get<AuthResponse>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.checkAuthUrl, {
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

  async register(data: RegisterData): Promise<RegisterResponse> {

    return await firstValueFrom(this.http.post<RegisterResponse>(
        this.configService.apiUrl + this.configService.apiPrefix + this.configService.registerUrl,
        data,
        {
          withCredentials: true
        }
      ));

  }

  async verifyEmail(id: number, hash: string, expires: number): Promise<VerifyResponse> {

    const url:string = `${this.configService.apiUrl + this.configService.apiPrefix + this.configService.verifyEmailUrl}?id=${id}&hash=${hash}&expires=${expires}`;

    return await firstValueFrom(this.http.get<VerifyResponse>(
        url,
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

  async verifyTwoFactorCode(user_id: number, code: string): Promise<VerifyTwoFactorCodeResponse> {

    return await firstValueFrom(this.http.post<VerifyTwoFactorCodeResponse>(
        this.configService.apiUrl + this.configService.apiPrefix + this.configService.verify2FACodeUrl,
        { user_id, code: code },
        { withCredentials: true}
      ));

  }

  async resend2FA(userId: number): Promise<resend2FAResponse> {

    return await firstValueFrom(this.http.post<resend2FAResponse>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.resend2FACodeUrl, { user_id: userId }, { withCredentials: true }));

  }

  async logout(): Promise<LogoutResponse> {

    return await firstValueFrom(this.http.post<LogoutResponse>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.logoutUrl, {}, { withCredentials: true }));

  }

  async getUser(): Promise<GetUserResponse>{

    return await firstValueFrom(this.http.get<GetUserResponse>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.userUrl, { withCredentials: true }));

  }

  public getXsrfToken(): string | null {

    const tokenName:string = 'XSRF-TOKEN';
    const cookies:string[] = document.cookie.split('; ');
    const token:string|undefined = cookies.find(row => row.startsWith(tokenName));

    return token ? decodeURIComponent(token.split('=')[1]) : null;

  }

}
