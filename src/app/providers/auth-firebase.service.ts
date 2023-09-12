import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from "@angular/router";
import {User} from '@firebase/auth-types';


@Injectable({
  providedIn: 'root'
})

export class AuthFirebaseService {

  private user: Observable<User | null >;

  constructor(
    private afAuth: AngularFireAuth,
    public router: Router,
  ) {
    this.user = this.afAuth.authState;
  }

  get authenticated():boolean {
    return this.user != null; // True ó False
  }
  // Obtener el observador del usuario actual
  get currentUser() {
    return this.user;
  }
  signUpWithEmail(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
     .then((result) => {
       window.alert("You have been successfully registered!");
       console.log(result.user)
     }).catch((error) => {
       window.alert(error.message)
     })
  }
  // Ingreso con email
  signInWithEmail(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
       .then((result) => {
          this.router.navigate(['<!-- enter your route name here -->']);
       }).catch((error) => {
         window.alert(error.message)
       })
  }
  
  // Recuperar contraseña
  resetPassword(email): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }
  // Verificar correo
  
  verifyEmail() {
    return this.afAuth.currentUser.then(u => u.sendEmailVerification())
    .then(() => {
      this.router.navigate(['verify-email']);
    })
  }
  // Finalizar sesión
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
