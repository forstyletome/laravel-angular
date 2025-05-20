import { Component } from '@angular/core';
import {TranslationService} from '../../services/languages/translation.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [
    TranslatePipe
  ],
  templateUrl: './language-switcher.component.html',
  standalone: true,
  styleUrl: './language-switcher.component.scss'
})
export class LanguageSwitcherComponent {

  constructor(
    private translationService: TranslationService
  ){}

  switchLanguage(lang:string):void{

    this.translationService.setCurrentLanguage(lang);

  }

}
