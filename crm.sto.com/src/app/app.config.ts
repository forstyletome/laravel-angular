import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {xsrfInterceptor} from './crm/interceptors/xsrf.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {errorInterceptor} from './crm/interceptors/error.interceptor';
import {ConfigService} from './crm/services/config/config.service';
import {AuthService} from './crm/services/auth/auth.service';
import {TranslationService} from './crm/services/languages/translation.service';
import {UserService} from './crm/services/user/user.service';
import {GeneralModel} from './crm/models/general.model';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([xsrfInterceptor, errorInterceptor])),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })]),
    provideAppInitializer(async(): Promise<void> => {

      const configService: ConfigService = inject(ConfigService);
      const authService: AuthService = inject(AuthService);
      const translationService: TranslationService = inject(TranslationService);
      const userService: UserService = inject(UserService);

      await configService.init();
      await authService.initializeCsrf();
      await translationService.loadTranslations();

      try{

        const checkAuth: GeneralModel = await authService.checkAuth();

        if(checkAuth.success){

          authService.setAuthentication(true);

          await userService.loadUser();

        }

      }catch(error){

        authService.setAuthentication(false);

      }

    })
  ]
}
