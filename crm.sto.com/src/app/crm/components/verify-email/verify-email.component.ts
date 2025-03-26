import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {StyleService} from '../../services/style/style.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {VerifyResponse} from '../../models/auth.service';
import {ErrorService} from '../../services/errors/error.service';
import {ResponseErrors} from '../../models/error.service';

@Component({
  selector: 'app-verify-email',
  imports: [
    FormsModule,
    LanguageSwitcherComponent,
    NgForOf,
    NgIf,
    TranslatePipe,
    RouterLink
  ],
  templateUrl: './verify-email.component.html',
  standalone: true,
  styleUrl: './verify-email.component.scss'
})

export class VerifyEmailComponent implements OnInit, OnDestroy{

  id: number = 0;
  hash: string = '';
  expires:number = 0;

  public errors: ResponseErrors = {
    data: {},
    messages: {},
    type: '',
    status: 0
  };

  protected readonly Object: ObjectConstructor = Object;

  constructor(
    private errorService: ErrorService,
    private styleService: StyleService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ){
  }

  ngOnInit():void {

    this.styleService.setBodyClass('login');

    this.route.queryParams.subscribe(async params => {

      this.id = params['id'] || 0;
      this.hash = params['hash'] || '';
      this.expires = params['expires'] || 0;

      await this.verifyEmail();

    });

    this.errorService.errors$.subscribe((errors:ResponseErrors):void => {

      this.errors = errors;

    });

  }

  protected async verifyEmail():Promise<void> {

    this.errorService.clearErrors('STANDARD_ERROR');

    const response: VerifyResponse = await this.authService.verifyEmail(this.id, this.hash, this.expires);

    if(response.success.data.success){

      this.errorService.setErrors({
        data: {
          type: 'SUCCESS_ALERT'
        },
        messages: response.success.messages,
        type: 'SYSTEM_ERROR',
        status: 200
      }, 'SYSTEM_ERROR');

      await this.router.navigate(['/login']);

    }

  }

  protected onResendVerifyEmail(): void{

    this.router.navigate(['/resend-verify-email']);

  }

  protected getErrors(): string[] {

    return Object.keys(this.errors.messages);

  }

  ngOnDestroy(): void {

    this.errorService.clearErrors('STANDARD_ERROR');

  }

}
