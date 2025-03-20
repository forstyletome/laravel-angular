import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {NgClass} from '@angular/common';
import {LogoutResponse, User} from '../../models/auth.service';

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
  public role:string = '';
  public showPanel:boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private styleService: StyleService
  ){}

  ngOnInit():void {

    this.authService.user$.subscribe((response:User):void => {

      if(response.id > 0){

        this.userName = response.name;

      }

    });

  }

  logout(){

    this.authService.logout().then((response: LogoutResponse):void => {

      if(response.success.data.success){

        const user: User = {
          id: 0,
          name: '',
          email: ''
        };

        this.authService.setAuthentication(false);
        this.authService.setUser(user);
        this.authService.setUserRole([]);
        this.authService.setUserPermission([]);

        this.styleService.setBodyClass('');

        this.router.navigate(['/login']);

      }

    });

  }

  toggleUserPanel():void {

    this.showPanel = !this.showPanel;

  }

}
