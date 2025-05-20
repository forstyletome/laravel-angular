import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {ErrorService} from '../../services/errors/error.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth/auth.service';
import {withLatestFrom} from 'rxjs';
import {ConfigService} from '../../services/config/config.service';
import {SystemError} from '../../models/error.service';

@Component({
  selector: 'app-system-alerts',
  imports: [
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './system-alerts.component.html',
  styleUrl: './system-alerts.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SystemAlertsComponent implements OnInit{

  public errors: SystemError = {
    data: {
      type: ''
    },
    messages: {},
    type: '',
    status: 0,
    success: false
  };

  protected readonly Object: ObjectConstructor = Object;

  ngOnInit(): void {

    this.errorService.errorsSystem$
      .pipe(withLatestFrom(this.authService.isAuthenticated$))
      .subscribe(([errors, authenticated]:[SystemError, boolean]):void => {

        switch(errors.status){

          case 401:



          break;

          case 419:

            if(!authenticated){

              window.location.href = this.configService.loginUrl;

            }

          break;

        }

        this.errors = errors;

      });

  }

  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
    private configService: ConfigService
  ){}

  protected closeWindow(): void{

    this.errorService.clearErrors('SYSTEM_ERROR');

  }

  protected getErrors(): string[] {

    return Object.keys(this.errors.messages);

  }

}
