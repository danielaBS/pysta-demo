import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
 
@Injectable()
export class MessagingService {
 
currentMessage = new BehaviorSubject(null);
 
constructor(private angularFireMessaging: AngularFireMessaging) {
 
     /*this.angularFireMessaging.messaging.subscribe(
     (msgings) => {
      msgings.onMessage((payload) => {
        console.log('Message received. ', payload);
        const NotificationOptions = {
          body: payload.notification.body,
          data: payload.notification,
          icon: payload.notification.icon
        }
        navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
          registration.showNotification(payload.notification.title, NotificationOptions);
        });
        this.currentMessage.next(payload);
      })
      msgings.onTokenRefresh=msgings.onTokenRefresh.bind(msgings);
    })*/
  }
 
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
    (token) => {
    });
  }
 
  receiveMessage() {
   /* this.angularFireMessaging.messaging.subscribe(
      (msgings) => {
       msgings.onMessage((payload) => {
         console.log('Message received. ', payload);
         const NotificationOptions = {
           body: payload.notification.body,
           data: payload.notification,
           icon: payload.notification.icon
         }
         navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
           registration.showNotification(payload.notification.title, NotificationOptions);
         });
         this.currentMessage.next(payload);
       })
       msgings.onTokenRefresh=msgings.onTokenRefresh.bind(msgings);
     })*/
  }

  listenToNotifications() {
    return this.angularFireMessaging.messages;
  }

  listenNotifications() {
    return this.angularFireMessaging;
  }
    
}
