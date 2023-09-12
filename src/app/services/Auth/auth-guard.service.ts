import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: "root" })

export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(public auth: AuthService, public router: Router) {
  }
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {   
      this.router.navigate(['login']);
      return false;
    } 
    this.auth.isLoggedIn();
    return true;
      
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    
    const role = localStorage.getItem('role');
    const roleExpected = route.data.role;
    if(roleExpected === "full" && role === "admin" ) {
      return true;      
    } else if (role==="admin"){
      return true;
    } else if (roleExpected !== role) {
      if( role==="basico") {
        this.router.navigate(['/pedidos']);
      } else {
        this.router.navigate(['/no-autorizado']);
      }
      
      return false;
    }      
    return true 
  } 
}