import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class StyleService {

  public bodyClassSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  bodyClassSubject$:Observable<string> = this.bodyClassSubject.asObservable();

  public sideBarClassSubject:BehaviorSubject<string> = new BehaviorSubject<string>('');
  sideBarClassSubject$:Observable<string> = this.sideBarClassSubject.asObservable();

  setBodyClass(className: string): void {
    this.bodyClassSubject.next(className);
  }

  setSideBarClass(className: string): void {
    this.sideBarClassSubject.next(className);
  }

}
