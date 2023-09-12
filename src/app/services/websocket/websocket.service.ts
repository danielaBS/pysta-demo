import { Injectable } from '@angular/core';
import * as Rx from 'rxjs';

import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject: Rx.Subject<MessageEvent>;
  private comandosWamp;

  private ServerURL = 'wss://gc.globalcircuit.co:443/websocket';

  constructor(private messageService: MessageService) {
    this.connect();
  }

  public connect(): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(this.ServerURL);
    }
    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    const ws = new WebSocket(url);

    this.comandosWamp = Object.create(null);

    const observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {

      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);

      return ws.close.bind(ws);
    });
    const observer = {
      next: (data: object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(this.ejecutarComando(data)));
        } else if (ws.readyState === WebSocket.CONNECTING) {
          let intentos = 10;
          const interval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify(this.ejecutarComando(data)));
              clearInterval(interval);
            } else {
              intentos--;
            }
            if (intentos === 0) {
              this.messageService.enviarAlerta({
                visible: true,
                text: 'No hay conexión ',
                style: ''
              });
              clearInterval(intentos);
            }
          }, 600);
          // setTimeout(() => {
          //   ws.send(JSON.stringify(this.ejecutarComando(data)));
          // }, 600);
          // if (ws.readyState === WebSocket.OPEN) {
          //   this.messageService.enviarAlerta({
          //     visible: true,
          //     text: 'No hay conexíon ',
          //     style: ''
          //   });
          // }
        }
        // if (ws.readyState !== WebSocket.OPEN) {
        //   setTimeout(() => {
        //     ws.send(JSON.stringify(this.ejecutarComando(data)));
        //   }, 600);
        // } else {
        //   ws.send(JSON.stringify(this.ejecutarComando(data)));

        //   if (ws.readyState !== WebSocket.OPEN) {
        //     this.messageService.enviarAlerta({
        //       visible: true,
        //       text: 'No hay conexíon ',
        //       style: ''
        //     });
        //   }
        // }
      }
    };
    return Rx.Subject.create(observer, observable);
  }

  public ejecutarComando(comando) {
    const idComando = this.crearUUID();
    this.comandosWamp[idComando] = comando;
    let comandoArray;
    if (comando.parametros) {
      comandoArray = ['2', idComando, comando.uri, comando.parametros];
    } else {
      comandoArray = ['2', idComando, comando.uri];
    }
    return comandoArray;
  }

  private crearUUID(): string {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';  										// bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] && 0x3) || 0x8, 1);	// bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    const uuid = s.join('');
    return(uuid);
  }
}
