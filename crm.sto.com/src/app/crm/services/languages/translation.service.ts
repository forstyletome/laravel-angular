import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {ConfigService} from '../config/config.service';
import {Translations} from '../../models/translation.service';

@Injectable({
  providedIn: 'root'
})

export class TranslationService{

  private storageKey: string = 'currentLanguage';

  public currentLanguageSubject:BehaviorSubject<string> = new BehaviorSubject<string>('en');

  currentLanguage$:Observable<string> = this.currentLanguageSubject.asObservable();

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private configService: ConfigService
  ){}

  async loadTranslations(): Promise<void> {

    const translations: Translations = await firstValueFrom(this.http.get<Translations>(this.configService.apiUrl + this.configService.apiPrefix + this.configService.translationsUrl, { withCredentials: true }));

      Object.keys(translations).forEach((lang: string):void => {

        this.translate.setTranslation(lang, translations[lang]);

      });

      const currentLanguage:string = this.loadLanguageFromStorage();
      this.setCurrentLanguage(currentLanguage);

  }

  loadLanguageFromStorage(): string {

    return localStorage.getItem(this.storageKey) || 'en';

  }

  setCurrentLanguage(language: string): void {

    localStorage.setItem(this.storageKey, language);

    this.currentLanguageSubject.next(language);

    this.translate.setDefaultLang(language);
    this.translate.use(language);

  }

}
