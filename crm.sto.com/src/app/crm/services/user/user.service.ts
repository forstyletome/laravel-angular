import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {User, UserPermission, UserRole} from '../../models/user.service';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class UserService{

  public userSubject:BehaviorSubject<User> = new BehaviorSubject<User>({id:0, name:'', email:''});
  user$:Observable<User> = this.userSubject.asObservable();

  public userRoleSubject:BehaviorSubject<UserRole> = new BehaviorSubject<UserRole>({roles: []});
  userRole$:Observable<UserRole> = this.userRoleSubject.asObservable();

  public userPermissionSubject:BehaviorSubject<UserPermission> = new BehaviorSubject<UserPermission>({permissions: []});
  userPermission$:Observable<UserPermission> = this.userPermissionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ){}

  async getUser(): Promise<User>{

    return await firstValueFrom(this.http.get<User>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.userUrl, { withCredentials: true }));

  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  setUserRole(roles: string[]): void {
    this.userRoleSubject.next({roles});
  }

  setUserPermission(permissions: string[]): void {
    this.userPermissionSubject.next({permissions});
  }

}
