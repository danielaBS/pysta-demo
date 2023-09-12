import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AsyncPipe } from '../../node_modules/@angular/common';
import { environment } from '../environments/environment';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthFirebaseService } from './providers/auth-firebase.service';
import { AuthGuardService } from './services/Auth/auth-guard.service';
import { AuthService } from './services/Auth/auth.service';
import { MessagingService } from './services/messaging.service';
import { AppToolbarService } from './services/AppToolbar/app-toolbar.service';

import { HttpClientModule } from '@angular/common/http'
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { LoginComponent } from './login/login.component';
import { ComponentsModule } from './components/components.module';
import { ComponentsComponent } from './components/components.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LOCALE_ID } from '@angular/core';

import { NativeDateAdapter } from "@angular/material/core";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-CO';

//for real data
//import { VendedoresService, ClientesService, VisitasService, PedidosService, ReportesService, ConfigService } from './services/misc.service';
// For mock data
import { VendedoresService, ClientesService, VisitasService, PedidosService, ReportesService, ConfigService } from './services/mock.service';

import { WebsocketSendService } from './services/websocket/websocket-send.service';
import { WebsocketService } from './services/websocket/websocket.service';
import { MessageService } from './services/message/message.service';


//NG Prime
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import listPlugin from '@fullcalendar/list';

import interactionPlugin from '@fullcalendar/interaction';

registerLocaleData(localeEs);


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  listPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    ComponentsComponent,
    LoginComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    FontAwesomeModule,
    FullCalendarModule,
  ],
  providers: [
    AuthFirebaseService,
    AuthGuardService,
    AuthService,
    AsyncPipe,
    MessagingService,
    AppToolbarService,
    VendedoresService,
    ClientesService,
    VisitasService,
    PedidosService,
    ReportesService,
    ConfigService,
    WebsocketSendService,
    WebsocketService,
    MessageService,
    NativeDateAdapter,
    MomentDateAdapter,
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private adapter: DateAdapter<any>, private adapterM: MomentDateAdapter) {
    this.adapter.setLocale('es-CO');
    this.adapterM.setLocale('es-CO');

  }
 }
