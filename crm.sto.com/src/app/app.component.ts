import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthService} from './crm/services/auth/auth.service';
import {NgIf} from '@angular/common';
import {StyleService} from './crm/services/style/style.service';
import {HeaderComponent} from './crm/components/header/header.component';
import {SidebarComponent} from './crm/components/sidebar/sidebar.component';
import {TranslationService} from './crm/services/languages/translation.service';
import {SystemAlertsComponent} from './crm/components/system-alerts/system-alerts.component';
import {ResponseErrors} from './crm/models/error.service';
import {ErrorService} from './crm/services/errors/error.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgIf,
    HeaderComponent,
    SidebarComponent,
    SystemAlertsComponent
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit{

  public authenticated:boolean = false;
  public bodyClass: string = '';
  public sideBarActive:string = '';
  public showHideSystemErrors: boolean = false;

  constructor(
    private authService: AuthService,
    private styleService: StyleService,
    private translationService: TranslationService,
    private errorService: ErrorService
  ) {}

  async ngOnInit():Promise<void> {

    await this.authService.initializeCsrf();
    await this.translationService.loadTranslations();

    try{

      await this.authService.checkAuth();

      this.authService.setAuthentication(true);

    }catch(error){

      this.authService.setAuthentication(false);

    }

    this.styleService.sideBarClassSubject$.subscribe(
      (className: string): void => {

        this.sideBarActive = className;

      }
    );

    this.authService.isAuthenticated$.subscribe(
      (status: boolean):void => {

        this.authenticated = status;

      }
    );

    this.styleService.bodyClassSubject$.subscribe(
      (bodyClass: string):void => {

        this.bodyClass = bodyClass;

      }
    );

    this.errorService.errorsSystem$.subscribe((errors:ResponseErrors):void => {

      this.showHideSystemErrors = errors.status > 0;

    });

  }

}
