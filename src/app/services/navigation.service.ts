import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject  }    from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private messageSource = new BehaviorSubject('Control procesos');
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }
}