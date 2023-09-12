import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AppToolbarService, MenuItem } from '../services/AppToolbar/app-toolbar.service';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {
  appName = 'Gestión domicilios';
  message;
  mainMenuItems;
  activeMenuItem$: Observable<MenuItem>;

  constructor(private toolbarService: AppToolbarService) {
    this.mainMenuItems = this.toolbarService.getMenuItems();
    this.activeMenuItem$ = this.toolbarService.activeMenuItem$;
  }

  ngOnInit(): void {
    
  }

}
