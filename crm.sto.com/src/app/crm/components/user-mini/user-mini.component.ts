import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {NgClass} from '@angular/common';
import {UserService} from '../../services/user/user.service';
import {User} from '../../models/user.service';
import {GeneralModel} from '../../models/general.model';

@Component({
  selector: 'app-user-mini',
  imports: [
    NgClass
  ],
  templateUrl: './user-mini.component.html',
  standalone: true,
  styleUrl: './user-mini.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class UserMiniComponent implements OnInit{

  public userName:string = '';
  public showPanel:boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private styleService: StyleService
  ){}

  ngOnInit():void {

    this.userService.user$.subscribe((response:User):void => {

      if(response.user.id > 0){

        this.userName = response.user.name;

      }

    });

  }

  logout(){

    this.authService.logout().then((response: GeneralModel):void => {

      if(response.success){

        const user: User = {
          user: {
            id: 0,
            name: '',
            email: ''
          },
          roles: [],
          permissions: []
        };

        this.authService.setAuthentication(false);
        this.userService.setUser(user);
        this.userService.setUserRoles([]);
        this.userService.setUserPermissions([]);

        this.styleService.setBodyClass('');

        this.router.navigate(['/login']);

      }

    });

  }

  toggleUserPanel():void {

    this.showPanel = !this.showPanel;

  }

}
