import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {StyleService} from '../../services/style/style.service';
import {NgClass} from '@angular/common';
import {User} from '../../models/auth.service';

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
export class UserMiniComponent {

  public userName:string = '';
  public role:string = '';
  public showPanel:boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private styleService: StyleService
  ){}

  ngOnInit():void {

    this.authService.user$.subscribe((data:User | null):void => {

      if(data){

        this.userName = data.name;

      }

    });

  }

  logout(){

    this.authService.logout().then((data):void => {

      if(data){

        this.authService.setAuthenticationStatus(false);
        this.authService.setUserStatus(null);
        this.authService.setUserIdStatus(0);

        this.styleService.setBodyClass('');

        this.router.navigate(['/login']);

      }

    });

  }

  toggleUserPanel():void {

    this.showPanel = !this.showPanel;

  }
}
