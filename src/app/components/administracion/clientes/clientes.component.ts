import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { WebsocketSendService } from 'src/app/services/websocket/websocket-send.service';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { ClientesService, VendedoresService } from '../../../services/mock.service';
import { MatSort } from '@angular/material/sort';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { MatPaginatorIntl } from '@angular/material/paginator';


import { SnackBarComponent } from '../../../customComponents/snackBar.component';

import { Cliente, Zona } from '../../../models/model';
import { MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {CustomPaginator} from "../../../customComponents/customPaginator";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class ClientesComponent implements OnInit {

  data: Cliente[];
  zonas: any;
  tableColumns: string[] = ['logo', 'id', 'nombreCliente', 'id_zona', 'correo', 'editar'];
  insertForm;

  alphabet= ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

  color: string[] =[];
  initial: string[] = [];

  colors = [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#f9844a',
    '#f9c74f',
    '#90be6d',
    '#43aa8b',
    '#4d908e'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Cliente>;
  obs: Observable<any>;

  constructor(
    private service: ClientesService,
    private vService: VendedoresService,
    private matDialog: MatDialog,
    private webSocket: WebsocketSendService,
    private changeDetectorRef: ChangeDetectorRef,
    ) {

  }

  async ngOnInit() {
    this.zonas = this.vService.getZonas();
    this.data = this.service.getAll();
    this.dataSource = new MatTableDataSource<Cliente>(this.data);
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();

    for (var j= 0; j<this.data.length; j++) {
      let initials = "";

      const randomIndex = Math.floor(Math.random()* Math.floor(this.colors.length));
      this.color[j] = this.colors[randomIndex]
      for(var i= 0; i <this.data[j].nombreCliente.length; i++) {
        if(this.data[j].nombreCliente.charAt(i)=== ' ') {
          continue;
        }
        if(this.data[j].nombreCliente.charAt(i) === this.data[j].nombreCliente.charAt(i).toUpperCase()){
          initials+= this.data[j].nombreCliente.charAt(i);
          if(initials.length == 2){
            break;
          }
        }
      }
      this.initial[j] = initials
    }
    this.data.forEach(x=> {
      var index = this.zonas.findIndex(obj => obj.idZona==x.idZonaCliente);

      x.nombreZona= this.zonas[index].nombreZona
    })

  }

  async exportarCSV(){
    let arrID =[];

    this.getData(arrID);

    this.webSocket.socketResponse.subscribe(res => {
      if(res) {
        console.log(res)
        const datos = this.convertirArregloString(res.data.T0.Registros);
        const elementoBlob = new Blob(['\ufeff', datos], {type: 'text/plain'});
        const downloadLink = document.getElementById('download-link');
        downloadLink.setAttribute('href', window.URL.createObjectURL(elementoBlob));
        downloadLink.setAttribute('download', `clientes.csv`);
        downloadLink.click();
      } else {
        this.getData(arrID);
      }
    });
    
  }

  getData(arrID){
    const comando = {
        uri: 'almatec.os.consultar',
        parametros: {
          fuenteDatos: 'Pysta.ListadoClientes_Filtros',
          parametros: `null, null, null, null`         
        }
      };
    
    this.webSocket.socketResponse.next(comando);
  }

  convertirArregloString(arreglo) {
    let tabla = '';

    for (const arr of arreglo) {
      for (let a of arr) {
        a = a.toString().replace('Ç', '\r\n');
      }
    }

    const arregloCompleto = JSON.parse(JSON.stringify(arreglo));

    for (const arr of arregloCompleto) {
      let registro = arr.join(';');
      registro += '\r\n';
      tabla += registro;
    }
    return tabla;
  }

  nuevoCliente(){
    const dialogNuevo = this.matDialog.open(AgregarClienteComponent, {});
    dialogNuevo.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  editarCliente(event){
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    const dialogEditar = this.matDialog.open(EditarClientesComponent, {
      data: {
        id: value
      }

    });
    dialogEditar.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  imprimir(){

  }
}


// AGREGAR CLIENTE COMPONENTE


@Component({
  selector: 'app-agregar-cliente',
  template: `
  <div class="form-header d-flex justify-content-center">
  <h1 style="margin:0">Agregar un Cliente</h1>
  </div>
  <div class="form-container d-flex justify-content-center">
  <form [formGroup]="insertForm" (keydown.enter)="$event.preventDefault()">
    <div class="row" style="margin-top: 0;">
      <div class="inputs-container ">     
        <div class="col-md-12 d-flex justify-content-between">
            <label for="nombreCliente">
                Nombre del cliente:
            </label>
            <input id="nombreCliente" type="text" formControlName="nombreCliente" value="{{nombreCliente}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
            <label for="nitOcc">
                Nit o CC.:
            </label>
            <input id="nitOcc" type="text" formControlName="nitOcc" value="{{nitOcc}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
        <label for="correoCliente">
                Correo electrónico:
            </label>
            <input id="correoCliente" type="text" formControlName="correoCliente" value="{{correoCliente}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
        <label for="telefonoCliente">
                Teléfono:
            </label>
            <input id="telefonoCliente" type="text" formControlName="telefonoCliente" value="{{telefonoCliente}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
        <label for="direccionCliente">
              Dirección:
            </label>
            <input id="direccionCliente" type="text" formControlName="direccionCliente" value="{{direccionCliente}}">
        </div>           
        <div class="col-md-12 d-flex justify-content-between">
        <mat-label>Zona:</mat-label>
        <mat-select formControlName="idZonaCliente" required placeholder="Seleccione una zona">
            <mat-option *ngFor= "let zona of zonas" [value]="zona.idZona">{{zona.nombreZona}}</mat-option>
        </mat-select>
        </div>
      </div>
    </div>
    <div class="row">
        <div class="col-md-12 d-flex justify-content-center align-items-center">
          <button class="button btns" type="submit" (click)="onSubmit(insertForm.value)">Agregar</button>
        </div>
    </div>
</form>
  </div>

  `,
  styleUrls: ['./clientes.component.css']
})

export class AgregarClienteComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  dateObj: number = Date.now();
  insertForm;

  nitOcc = "";
  nombreCliente = "";
  correoCliente = "";
  direccionCliente = "";
  idZonaCliente = "";
  telefonoCliente = "";

  cliente: any;
  zonas: any;

  constructor(
    private service: ClientesService,
    private vService: VendedoresService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.insertForm = this.formBuilder.group({
        nombreCliente: '',
        nitOcc: '',
        direccionCliente: '',
        correoCliente: '',
        idZonaCliente: '',
        telefonoCliente: ''
    });
  }
  async ngOnInit() {
    this.zonas = this.vService.getZonas();
  }

  openSnackBar( message) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: message
    });
    this.matDialog.closeAll()
    
  }

  onSubmit(data) {
    this.service.insertCliente(data);
    var message= "El cliente se agregó correctamente."
    this.openSnackBar(message);
  }
}


// EDITAR CLIENTE COMPONENTE


@Component({
  selector: 'app-editar-cliente',
  template: `
  <div class="form-header d-flex justify-content-center">
  <h1 style="margin:0">Editar Información del Cliente</h1>
  </div>
  <div class="form-container d-flex justify-content-center">
  <form [formGroup]="checkoutForm" (keydown.enter)="$event.preventDefault()">
    <div class="row" style="margin-top: 0;">
      <div class="d-flex col-md-12 justify-content-center">
        <div class="circleEd  p-2 bd-highlight" [ngStyle]="{'background-color': color}">
          <div class="initialsEd">{{initials}}</div>
        </div>
      </div>
      <div class="d-flex flex-row col-md-12 justify-content-center">
        <p><strong>ID del cliente: </strong> {{data.id}} - NIT O CC.: <strong>{{nitOcc}}</strong></p>
      </div>
      <div class="inputs-container ">
        <div class="col-md-12 d-flex justify-content-between">
            <label for="nombreCliente">
                Nombre del cliente:
            </label>
            <input id="nombreCliente" type="text" formControlName="nombreCliente" value="{{nombreCliente}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
        <label for="correo">
                Correo electrónico:
            </label>
            <input id="correo" type="text" formControlName="correo" value="{{correo}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
        <label for="telefono">
                Teléfono:
            </label>
            <input id="telefono" type="text" formControlName="telefono" value="{{telefono}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
        <label for="direccion">
              Dirección:
            </label>
            <input id="direccion" type="text" formControlName="direccion" value="{{direccion}}">
        </div>      
        <div class="col-md-12 d-flex justify-content-between">
          <mat-label>Zona:</mat-label>
          <mat-select formControlName="id_zona" required [(ngModel)]="id_zona">
              <mat-option *ngFor= "let zona of zonas" [value]="zona.idZona" selected>{{zona.nombreZona}}</mat-option>
          </mat-select>
        </div>
        <div class="col-md-12 d-flex justify-content-between">
          <mat-label>Prospecto:</mat-label>
          <mat-checkbox class="example-margin" formControlName="prospecto" [(ngModel)]="prospecto"></mat-checkbox>
        </div>
      </div>
    </div>
    <div class="row">
        <div class="col-md-12 d-flex justify-content-center align-items-center">
          <button class="button btns" type="submit" (click)="onSubmit(checkoutForm.value)">Actualizar datos</button>
        </div>
    </div>
  </form>
  </div>

  `,
  styleUrls: ['./clientes.component.css']
})

export class EditarClientesComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  dateObj: number = Date.now();
  checkoutForm;
  nombreCliente = "";
  correo = "";
  direccion = "";
  telefono = "";
  id_zona = "";
  prospecto= "";
  nitOcc= "";

  cliente: any;
  zonas: any;

  color='';
  initials='';

  colors = [
    '#f94144',
    '#f3722c',
    '#f8961e',
    '#f9844a',
    '#f9c74f',
    '#90be6d',
    '#43aa8b',
    '#4d908e'
  ];

  constructor(
    private service: ClientesService,
    private vService: VendedoresService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.checkoutForm = this.formBuilder.group({
        nombreCliente: '',
        correo: '',
        direccion: '',
        telefono: '',
        id_zona: '',
        prospecto: '',
    });
  }
  async ngOnInit() {
    this.cliente = this.service.getById(this.data.id);

    this.nombreCliente = this.cliente.nombreCliente;
    this.correo = this.cliente.correoCliente;
    this.direccion =  this.cliente.direccionCliente;
    this.id_zona = this.cliente.idZonaCliente;
    this.telefono = this.cliente.telefonoCliente;
    this.prospecto =  this.cliente.prospecto;
    this.nitOcc = this.cliente.nitOcc;

    let initials = "";
    const randomIndex = Math.floor(Math.random()* Math.floor(this.colors.length));
      this.color = this.colors[randomIndex]
      for(var i= 0; i <this.nombreCliente.length; i++) {
        if(this.nombreCliente.charAt(i)=== ' ') {
          continue;
        }
        if(this.nombreCliente.charAt(i) === this.nombreCliente.charAt(i).toUpperCase()){
          initials+= this.nombreCliente.charAt(i);
          if(initials.length == 2){
            break;
          }
        }
      }
      this.initials = initials
    this.vService.getZonasObs().subscribe((zonas: Observable<any>) => {
      this.zonas = zonas;
    });

  }

  openSnackBar( message) {
    this._snackBar.openFromComponent(SnackBarComponent, {
      duration: 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: message
    });
    this.matDialog.closeAll();
  }

  onSubmit(data) {
    if (data.nombreCliente === "") {
      data.nombreCliente = this.nombreCliente;
    }
    if (data.correo === "") {
      data.correo = this.correo;
    }
    if (data.direccion === "") {
      data.direccion = this.direccion;
    }   
    if (data.id_zona === "") {
      data.id_zona = this.id_zona;
    }
    this.service.updateCliente(data, this.data.id);
    var message= "Los datos se actualizaron correctamente."
    this.openSnackBar(message);
  }
}
