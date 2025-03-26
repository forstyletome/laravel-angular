import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {StyleService} from '../../services/style/style.service';
import {UserMiniComponent} from '../user-mini/user-mini.component';
import {TranslationService} from '../../services/languages/translation.service';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  imports: [
    UserMiniComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HeaderComponent implements OnInit, OnDestroy{

  public sideBarActive:string = '';

  constructor(
    private styleService: StyleService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {

    this.styleService.sideBarClassSubject$.subscribe(

      (className: string):void => {

        this.sideBarActive = className;

      }

    );

  }

  protected toggleSidebar():void{

    this.styleService.setSideBarClass(this.sideBarActive === 'active' ? '' : 'active');

  }

  protected switchLanguage(lang:string):void{

    this.translationService.setCurrentLanguage(lang);

  }

  ngOnDestroy(): void {

  }

}
