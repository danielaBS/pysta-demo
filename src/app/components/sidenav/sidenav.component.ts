import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { AuthService } from '../../services/Auth/auth.service';
import { AppToolbarService, MenuItem } from '../../services/AppToolbar/app-toolbar.service';
import { MessagingService } from '../../services/messaging.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{
  titlePage : string;
  role = localStorage.getItem("role");
  accessRole=1;
  showFiller = true;
  panelOpenState = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  mainMenuItems;
  activeMenuItem$: Observable<MenuItem>;
  nombreUsuario;
  nombre;
  initials: string;
  circleColor : string;
  colors = [
    '#87C1ED',
    '#608FB3',
    '#2A3C4A',
    '#2E5573',
    '#02223B'    
  ];
  notification;
     
  constructor(
    private toolbarService: AppToolbarService, 
    private breakpointObserver: BreakpointObserver,
    private data: NavigationService,
    private Auth: AuthService,
    private messagingService: MessagingService,
   ) {
    this.mainMenuItems = this.toolbarService.getMenuItems();
    this.activeMenuItem$ = this.toolbarService.activeMenuItem$;
    this.nombre = localStorage.getItem('nombreVendedor');

   }

    ngOnInit() {
      if(this.role === "basico") {
        this.accessRole = 0;
      }
      this.messagingService.requestPermission()
      this.messagingService.receiveMessage()
      this.notification = this.messagingService.currentMessage;

      this.data.currentMessage.subscribe(message => this.titlePage = message);

      this.createInitials();

      const randomIndex = Math.floor(Math.random()* Math.floor(this.colors.length));
      this.circleColor = this.colors[randomIndex];   
    }

    createInitials(){
      let initials = "";
      for(var i= 0; i <this.nombre.length; i++) {
        if(this.nombre.charAt(i)=== ' ') {
          continue;
        }
        if(this.nombre.charAt(i) === this.nombre.charAt(i).toUpperCase()){
          initials+= this.nombre.charAt(i);
          if(initials.length == 2){
            break;
          }
        }
      }
      this.initials = initials;
    }

    over() {
      this.showFiller = true;
    }
    out (){
      this.showFiller = false;
    }

    logout() {
      this.Auth.logout();
    }

}
