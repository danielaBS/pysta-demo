import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messageSource = new BehaviorSubject({});
  message = this.messageSource.asObservable();

  constructor() { }

  enviarAlerta(message: object) {
    this.messageSource.next(message);
  }
}
