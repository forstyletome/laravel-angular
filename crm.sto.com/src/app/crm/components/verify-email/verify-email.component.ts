import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LanguageSwitcherComponent} from '../language-switcher/language-switcher.component';
import {NgForOf, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {StyleService} from '../../services/style/style.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {VerifyResponse} from '../../models/auth.service';

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
export class VerifyEmailComponent {

  errorsMessage: {[key: string]: string[]} = {};

  id: number = 0;
  hash: string = '';
  expires:number = 0;

  resultVerify:boolean = false;

  constructor(
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

      this.verifyEmail(this.id, this.hash, this.expires);

    });

  }

  getErrors(): string[] {
    return Object.values(this.errorsMessage).flat();
  }

  verifyEmail(
    id: number,
    hash: string,
    expires: number
  ) {

    this.authService.verifyEmail(
      id,
      hash,
      expires
    ).then(
      (data: VerifyResponse) => {

          this.resultVerify = true;
          this.errorsMessage = {};

      },
      (error) => {

        console.log(error);

        switch (error.status) {

          case 401:
          case 403:
          case 410:

            this.errorsMessage = error.error;

          break;

          case 422:

            this.errorsMessage = error.error.errors;

          break;

        }

      }
    );

  }

  toLogin():void{

    this.router.navigate(['/login']);

  }

}
