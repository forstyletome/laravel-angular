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
    provideAppInitializer((): Promise<void> => {
      const configService: ConfigService = inject(ConfigService);
      return configService.init();
    }),
  ]
};
