import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';
import { FormControl } from '@angular/forms';

interface Credentials {
  correoUsuario: string,
  contrasenaUsuario: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  exportAs: 'ngForm'
})
export class LoginComponent implements OnInit {

  credentials: Credentials;

  constructor(
    private auth: AuthService,
    private router: Router,
    ) { }
  ngOnInit(): void {
  }
  onSubmit(credentials){
    
    this.router.navigate(['dashboard']);
      
  }

}
