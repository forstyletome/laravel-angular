import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {User, UserData, UserPermission, UserRole} from '../../models/user.service';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class UserService{

  public userSubject:BehaviorSubject<User> = new BehaviorSubject<User>(
    {
      user:{
        id: 0,
        name: '',
        email: ''
      },
      roles: [],
      permissions: []
    }
  );

  user$:Observable<User> = this.userSubject.asObservable();

  public userRoleSubject:BehaviorSubject<UserRole> = new BehaviorSubject<UserRole>({roles: []});
  userRole$:Observable<UserRole> = this.userRoleSubject.asObservable();

  public userPermissionSubject:BehaviorSubject<UserPermission> = new BehaviorSubject<UserPermission>({permissions: []});
  userPermission$:Observable<UserPermission> = this.userPermissionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ){}

  async getUser(): Promise<UserData>{

    return await firstValueFrom(this.http.get<UserData>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.userUrl + this.configService.userGetUrl, { withCredentials: true }));

  }

  async loadUser(): Promise<void>{

    await this.getUser().then((response: UserData):void => {

      if(response.data.user.id > 0){

        this.setUser(response.data);
        this.setUserRoles(response.data.roles);
        this.setUserPermissions(response.data.permissions);

      }

    });

  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  setUserRoles(roles: string[]): void {
    this.userRoleSubject.next({roles});
  }

  setUserPermissions(permissions: string[]): void {
    this.userPermissionSubject.next({permissions});
  }

}
