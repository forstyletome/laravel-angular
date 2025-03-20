import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {ResponseErrors} from '../../models/error.service';
import {ErrorService} from '../../services/errors/error.service';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {withLatestFrom} from 'rxjs';
import {ConfigService} from '../../services/config/config.service';

@Component({
  selector: 'app-system-alerts',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './system-alerts.component.html',
  styleUrl: './system-alerts.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SystemAlertsComponent implements OnInit{

  public errors: ResponseErrors = {
    data: {},
    messages: {},
    type: '',
    status: 0
  };

  public authenticated:boolean = false;

  ngOnInit(): void {

    this.errorService.errorsSystem$
      .pipe(withLatestFrom(this.authService.isAuthenticated$))
      .subscribe(([errors, authenticated]:[ResponseErrors, boolean]):void => {

        switch(errors.status){

          case 419:

            if(!authenticated){

              window.location.href = this.configService.loginUrl;

            }

          break;

        }

        this.errors = errors;
        this.authenticated = authenticated;

      });

  }

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private configService: ConfigService
  ){}

  protected getErrors(): string[] | undefined {

    return this.errorService.getErrors('SYSTEM_ERROR');

  }

  protected readonly Object = Object;

}
