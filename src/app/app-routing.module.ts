import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/Auth/auth-guard.service';
import { LoginComponent } from './login/login.component';

import { ComponentsComponent } from './components/components.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { VendedoresComponent } from './components/administracion/vendedores/vendedores.component';
import { ClientesComponent } from './components/administracion/clientes/clientes.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { ReporteVisitasComponent } from './components/reporte-visitas/reporte-visitas.component';
import { UbicacionVendedoresComponent } from './components/ubicacion-vendedores/ubicacion-vendedores.component';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';


const routes: Routes = [  
  {
    path: '',
    component: ComponentsComponent,
   // canActivate: [AuthGuardService],
    children: [
      {
        path: '',
       // canActivateChild: [ AuthGuardService ],
        children: [
          { path: '', redirectTo: 'visitas', pathMatch: 'full', data: {role: 'full', title:'VISITAS'} },
          { path: 'pedidos', component : PedidosComponent, data: {role: 'basico', title:'PEDIDOS'} },                  
          { path: 'vendedores', component : VendedoresComponent, data: {role: 'full', title:'VENDEDORES'} },
          { path: 'clientes', component : ClientesComponent, data: {role: 'full', title:'CLIENTES'} },
          { path: 'visitas', component : ReporteVisitasComponent, data: {role: 'full', title:'VISITAS'} },
          { path: 'reportes', component : ReportesComponent, data: {role: 'full', title:'REPORTES'} },
          { path: 'mapa-vendedores', component : UbicacionVendedoresComponent, data: {role: 'full', title:'MAPA VENDEDORES'} },
          { path: 'configuracion', component : ConfiguracionesComponent, data: {role: 'full', title:'CONFIGURACIÓN'} },
          { path: 'no-autorizado', component: UnauthorizedComponent, data: {role: 'basico', title: 'NO AUTORIZADO'}} 
        ]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: '', loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  {
    path: '**', redirectTo: '', pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      paramsInheritanceStrategy: 'always'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
