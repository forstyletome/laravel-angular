import {HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth.service';
import {TranslationService} from '../services/languages/translation.service';
import {ConfigService} from '../services/config/config.service';

export const xsrfInterceptor: HttpInterceptorFn = (req, next) => {

  const authService:AuthService = inject(AuthService);
  const translationService:TranslationService = inject(TranslationService);
  const configService: ConfigService = inject(ConfigService);

  const locale:string = translationService.loadLanguageFromStorage();

  if(!req.url.includes(configService.sanctumUrl)){

    const token:string|null = authService.getXsrfToken();

    if(token){

      const clonedRequest:HttpRequest<any> = req.clone({
        setHeaders: {
          'X-XSRF-TOKEN': token || '',
          'Accept-Language': locale || 'en'
        }
      });

      return next(clonedRequest);

    }

  }

  return next(req);

};
