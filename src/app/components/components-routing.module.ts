
import { Routes } from '@angular/router';

import { PedidosComponent } from './pedidos/pedidos.component';
import { VendedoresComponent } from './administracion/vendedores/vendedores.component';
import { ClientesComponent } from './administracion/clientes/clientes.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { UbicacionVendedoresComponent } from './ubicacion-vendedores/ubicacion-vendedores.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';


export const ComponentsRoutes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'pedidos', component: PedidosComponent},
  {path: 'vendedores', component: VendedoresComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'calendario', component: CalendarioComponent},
  {path: 'mapa-vendedores', component: UbicacionVendedoresComponent},
  {path: 'configuracion', component: ConfiguracionesComponent},
];
