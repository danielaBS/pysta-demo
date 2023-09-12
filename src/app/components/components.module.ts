import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

import { PedidosComponent, VerDetallePedidoComponent } from './pedidos/pedidos.component';
import { ComponentsRoutes } from './components-routing.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { VendedoresComponent, AgregarAgenteComponent, EditarVendedoresComponent } from './administracion/vendedores/vendedores.component';
import { ClientesComponent, AgregarClienteComponent, EditarClientesComponent } from './administracion/clientes/clientes.component';
import { ReportesComponent } from './reportes/reportes.component';
import { CalendarioComponent } from './calendario/calendario.component'
import { ReporteVisitasComponent, VerDetalleVisitaComponent } from './reporte-visitas/reporte-visitas.component';
import { UbicacionVendedoresComponent } from './ubicacion-vendedores/ubicacion-vendedores.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';

import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

import { MatTableExporterModule } from 'mat-table-exporter';

import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    PedidosComponent,
    SidenavComponent,
    VendedoresComponent,
    ClientesComponent,
    EditarVendedoresComponent,
    EditarClientesComponent,
    AgregarClienteComponent,
    AgregarAgenteComponent,
    ReportesComponent,
    VerDetallePedidoComponent,
    VerDetalleVisitaComponent,
    CalendarioComponent,
    ReporteVisitasComponent,
    UbicacionVendedoresComponent,
    ConfiguracionesComponent,
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    FullCalendarModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    NgbModule,
    MatGridListModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    OverlayModule,
    MatTooltipModule,
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableExporterModule,
    NgxMaterialTimepickerModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDB0vYSRMzO7aYCLC254POj-PKKi-AT6P4'
    }),
    AgmDirectionModule,
  ],
  exports: [
    PedidosComponent,
    SidenavComponent,
    VendedoresComponent,
    ClientesComponent,
    EditarVendedoresComponent,
    ReportesComponent,
    VerDetalleVisitaComponent,
    VerDetallePedidoComponent,
    AgregarClienteComponent,
    AgregarAgenteComponent,
    CalendarioComponent,
    UbicacionVendedoresComponent,
    ConfiguracionesComponent,
  ],
  providers:[GoogleMapsAPIWrapper]

})
export class ComponentsModule { }
