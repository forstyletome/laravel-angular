import { Routes } from '@angular/router';
import {LoginComponent} from './crm/components/login/login.component';
import {loginGuard} from './crm/guards/login.guard';
import {HomeComponent} from './crm/components/home/home.component';
import {ForgotPasswordComponent} from './crm/components/forgot-password/forgot-password.component';
import {RegisterComponent} from './crm/components/register/register.component';
import {VerifyEmailComponent} from './crm/components/verify-email/verify-email.component';
import {ResendVerifyEmailComponent} from './crm/components/resend-verify-email/resend-verify-email.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [loginGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [loginGuard]},
  {path: 'verify-email', component: VerifyEmailComponent, canActivate: [loginGuard]},
  {path: 'resend-verify-email', component: ResendVerifyEmailComponent, canActivate: [loginGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [loginGuard]}
];
