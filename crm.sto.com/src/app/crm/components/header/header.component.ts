import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StyleService} from '../../services/style/style.service';
import {AuthService} from '../../services/auth/auth.service';
import {UserMiniComponent} from '../user-mini/user-mini.component';
import {TranslationService} from '../../services/languages/translation.service';

@Component({
  selector: 'app-header',
  imports: [
    UserMiniComponent
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent {

  public sideBarActive:string = '';

  constructor(
    private styleService: StyleService,
    private authService: AuthService,
    private translationService: TranslationService
  ) {
  }

  ngOnInit() {

    this.styleService.sideBarClassSubject$.subscribe(

      (className: string):void => {

        this.sideBarActive = className;

      }

    );

  }

  toggleSidebar():void{

    this.styleService.setSideBarClass(this.sideBarActive === 'active' ? '' : 'active');

  }

  switchLanguage(lang:string):void{

    this.translationService.setCurrentLanguage(lang);

  }

}
