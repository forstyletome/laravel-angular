import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {StyleService} from '../../services/style/style.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarComponent {

  public sideBarActive:string = '';

  constructor(public styleService: StyleService){}

  ngOnInit():void {

    this.styleService.sideBarClassSubject$.subscribe(

      (className: string):void => {

        this.sideBarActive = className;

      }

    );

  }

}
