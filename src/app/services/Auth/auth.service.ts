import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, BehaviorSubject  } from 'rxjs';
import jwt_decode from "jwt-decode";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*'
  })
};
const headers = new Headers();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET');
        headers.append('Access-Control-Allow-Origin', '*');

@Injectable({providedIn: 'root'})        
export class AuthService {
  token: string;
  isLogin = false;
  roleAs: string;
  dataUsuario;

  constructor(public jwtHelper: JwtHelperService, private http: HttpClient) {
  }
  //url = "http://127.0.0.1:49196/usuarios/loginWeb";
  url = "http://23.253.57.17:49196/usuarios/loginWeb";

  isLogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 
  login(credentials: JSON): Observable<JSON> {
    return this.http.post<JSON>(this.url, credentials).pipe(
      tap((data: JSON) => localStorage.setItem('token', data['token'])),      
      tap((data: JSON) => this.dataUsuario = data['data']),    
      tap(data => localStorage.setItem('nombreVendedor', this.dataUsuario[0].nombreVendedor)),
      tap(data => localStorage.setItem('idUsuario', this.dataUsuario[0].idUsuario)),

      catchError(this.handleError<JSON>('loginFailed'))
    );    
  }

  isLoggedIn() {
    localStorage.setItem('STATE', 'true');    
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true') {
      this.isLogin = true;
      const decoded = jwt_decode(this.token);
      localStorage.setItem('role', decoded['role']);

    } else {
      this.isLogin = false;
    }      
    return this.isLogin;
    
  }

  public isAuthenticated(): boolean {    
    this.token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(this.token);
  }
  
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nombreVendedor");
    localStorage.removeItem("idUsuario");
    this.isLogged.next(false);
    window.location.reload();
  }
  getRole() {
    this.roleAs = localStorage.getItem('role');
    return this.roleAs;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      alert("Correo o contraseña incorrectos");

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }

}