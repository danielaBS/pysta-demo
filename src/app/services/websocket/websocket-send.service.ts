import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class WebsocketSendService {

  public socketResponse: Subject<any>;

  constructor(private webSocket: WebsocketService) {
    this.socketResponse =  this.webSocket.connect()
    .pipe(map(
      (response: MessageEvent): any => {
        const data = this.dataMessage(response.data);
        return {
          data
        };
      }
    )) as Subject<any>;
  }

  private dataMessage(data) {
    let objetoJS;
    try {
      objetoJS = JSON.parse(data);
    } catch (excepcion) {
      alert(excepcion.message);
    }

    if (objetoJS[0] === 3) {
      if (objetoJS[2].resultado  && objetoJS[2].resultado.indexOf('KO') === 0  ) {
        // console.log(objetoJS[2].mensaje);
      } else {
          return objetoJS[2];
      }
    } else if (objetoJS[0] === 8) {
        if (objetoJS[2].resultado  && objetoJS[2].resultado.indexOf('KO') === 0 ) {
          // Error
          // console.log(objetoJS[2].mensaje);
        } else {
          if (objetoJS[2]) {
            // console.log(objetoJS[2]);
          } else {
            // TODO: Que hacer cuando no vengan respuestas?
            // respuesta generica
          }
          // TODO: En caso que sea un evento y no esté asociado a un servicio, ejecutar un callback generico
        }
      } else if (objetoJS[0] === 4) {
        // TODO: ERROR
        // console.log(objetoJS[0]);
      } else if (objetoJS[0] === 0) {
        // Welcome, guardar id de sesión
        // this.idSession = objetoJS[1];
        // console.log('Conectado con: ' + objetoJS[3]);
      }
  }
}
