import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, OnChanges } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VendedoresService } from '../../../services/mock.service';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from "../../../customComponents/customPaginator";

import { SnackBarComponent } from '../../../customComponents/snackBar.component';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { Zona } from '../../../models/model';
import { MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';

export interface Agente {
  id: number;
  class: string;
  cols: number;
  rows: number;
  nombre: string;
  apellido: string;
  telefono: string;
  zona: string;
  correo: string;
  color: string;
  initials: string;
}

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html',
  styleUrls: ['./vendedores.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class VendedoresComponent implements OnInit {

  data =[];
  zonas: any;
  tableColumns: string[] = ['nombre', 'identificacion', 'nombreUsuario', 'correoElectronico', 'zona', 'editar'];
  insertForm;
  hide = true;
  tilesAgentes: Agente[] = [];

  showMail = false;

  initials: string;
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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Agente>;
  obs: Observable<any>;

  constructor(
    private service: VendedoresService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
    ) {
  }

  async ngOnInit() {
    this.zonas =  this.service.getZonas();
    this.data =  this.service.getAll() ;
    for (var j= 0; j<this.data.length; j++) {
      if(this.data[j]['idZonasVendedores'] !==null) {
        var ids= this.data[j]['idZonasVendedores'].split(",")
        this.data[j]['nombreZonaVendedor']= ""

        for(var i=0; i<ids.length;i++){
          var indexMul = this.zonas.findIndex(obj => obj.idZona==ids[i].replace('/"','/'));

          this.data[j]['nombreZonaVendedor']+= this.zonas[indexMul].nombreZona + ", "
        }
      }
      
      const randomIndex = Math.floor(Math.random()* Math.floor(this.colors.length));
      
      let initials = "";
      initials+=this.data[j].nombreVendedor[0].toUpperCase()+ this.data[j].apellidoVendedor[0].toUpperCase();      
      
      this.tilesAgentes[j] =
        {id: this.data[j].idUsuario, class: 'tile-large', cols: 1, rows: 1, nombre: this.data[j].nombreVendedor, apellido:this.data[j].apellidoVendedor, telefono: this.data[j].telefonoVendedor, zona: this.data[j]['nombreZonaVendedor'], correo: this.data[j].correoUsuario, color: this.colors[randomIndex], initials: initials}
    }
    this.dataSource= new MatTableDataSource<Agente>(this.tilesAgentes)

    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();

  }

  nuevoAgente(){
    const dialogNuevo = this.matDialog.open(AgregarAgenteComponent, {});
    dialogNuevo.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  imprimir(){

  }

  editarUsuario(event){
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    const dialogEditar = this.matDialog.open(EditarVendedoresComponent, {
      data: {
        id: value
      }
    });
    dialogEditar.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}

// AGREGAR AGENTE COMPONENTE


@Component({
  selector: 'app-agregar-agente',
  template: `
  <div class="form-header d-flex justify-content-center">
  <h1 style="margin:0">Agregar un Vendedor</h1>
  </div>
  <div class="form-container d-flex justify-content-center">
    <form [formGroup]="insertForm" (keydown.enter)="$event.preventDefault()">
      <div class="row" style="margin-top: 0;">
        <div class="inputs-container ">      
          <div class="col-md-12 d-flex justify-content-between">
              <label for="nombreUsuario">
                  Nombre del Vendedor:
              </label>
              <input id="nombreUsuario" type="text" formControlName="nombreUsuario" value="{{nombreUsuario}}">
          </div>
          <div class="col-md-12 d-flex justify-content-between">
              <label for="apellido">
                  Apellido del Vendedor:
              </label>
              <input id="apellido" type="text" formControlName="apellido" value="{{apellido}}">
          </div>
          <div class="col-md-12 d-flex justify-content-between">
          <label for="correo">
                  Correo electrónico:
              </label>
              <input id="correo" type="text" formControlName="correo" value="{{correo}}">
          </div>     
          <div class="col-md-12 d-flex justify-content-between">
            <label for="contrasena">
              Contraseña:
            </label>
            <mat-form-field appearance="outline" style="margin:0; width:55%">
              <input style="padding:0; border:none" matInput [type]="hide ? 'password' : 'text'" formControlName="contrasena">
              <button mat-icon-button matSuffix (click)="hide = !hide" [attr.aria-label]="'Hide password'" [attr.aria-pressed]="hide">
                  <mat-icon>{{hide ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>                        
            </mat-form-field>  
          </div>               
          <div class="col-md-12 d-flex justify-content-between">
              <label for="telefono">
                Teléfono:
              </label>
              <input id="telefono" type="text" formControlName="telefono" value="{{telefono}}">
          </div>          
          <div class="col-md-12 d-flex justify-content-between">
            <mat-label>Seleccione las zonas:</mat-label>        
            <section class="checkboxes">
              <p *ngFor= "let zona of zonas"><mat-checkbox [value]="zona.idZona" formControlName="zonaSelect" (change)="checkZonas($event)">{{zona.nombreZona}}</mat-checkbox></p>
            </section>      
          </div>
        </div>    
      </div>
      <div class="row" style="margin-bottom: 1em">
          <div class="col-md-12 d-flex justify-content-center align-items-center">
            <button class="button btns" type="submit" (click)="onSubmit(insertForm.value)">Agregar</button>
          </div>
      </div>
  </form>
  </div>

  `,
  styleUrls: ['./vendedores.component.css']
})

export class AgregarAgenteComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  dateObj: number = Date.now();
  insertForm;
  nombreUsuario = "";
  apellido = "";
  contrasena = "";
  correo = "";
  id_zona = "";
  telefono = "";
  hide = true;

  cliente: any;
  zonas: any;
  zonaSelect = [];

  constructor(
    private vService: VendedoresService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.insertForm = this.formBuilder.group({
        nombreUsuario: '',
        apellido: '',
        direccion: '',
        correo: '',
        id_zona: '',
        telefono: '',
        contrasena:'',
        zonaSelect: []
    });   
  }
  async ngOnInit() {
    this.zonas = this.vService.getZonas();
  }

  checkZonas(ev) {
    if(ev.source.checked) {
      this.zonaSelect.push(ev.source.value)
    } else {
      for(var i=0; i <this.zonaSelect.length; i++) {
        if(this.zonaSelect.indexOf(ev.source.value) !==-1 ) {
          this.zonaSelect.splice(this.zonaSelect.indexOf(ev.source.value),1)
        } 
      }
    }  
    
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
    data.zonaSelect=this.zonaSelect;

    this.vService.insertVendedor(data);    
    var message= "El Agente se agregó correctamente."
    this.openSnackBar(message);
  }
}


// EDITAR AGENTE COMPONENTE


@Component({
  selector: 'app-editar-vendedor',
  template: `
  <div class="form-header d-flex justify-content-center">
  <h1 style="margin:0">Editar Información del Vendedor</h1>
  </div>
  <div class="form-container d-flex justify-content-center">
  <form [formGroup]="checkoutForm" (keydown.enter)="$event.preventDefault()">
    <div class="row" style="margin-top: 0;">
      <div class="d-flex col-md-12 justify-content-center">
        <div class="circleEd  p-2 bd-highlight" [ngStyle]="{'background-color': color}">
          <div class="initialsEd">{{initials}}</div>
        </div>
      </div>
      <div class="inputs-container ">
        <div class="col-md-12 d-flex justify-content-between">
            <label for="nombreVendedor">
                Nombre del Agente:
            </label>
            <input id="nombreVendedor" type="text" formControlName="nombreVendedor" value="{{nombreVendedor}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
            <label for="apellido">
                Apellido del Agente:
            </label>
            <input id="apellido" type="text" formControlName="apellido" value="{{apellido}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
        <label for="correoUsuario">
                Correo electrónico:
            </label>
            <input id="correoUsuario" type="text" formControlName="correoUsuario" value="{{correoUsuario}}">
        </div>             
        <div class="col-md-12 d-flex justify-content-between">
        <label for="telefonoUsuario">
              Teléfono:
            </label>
            <input id="telefonoUsuario" type="text" formControlName="telefonoUsuario" value="{{telefonoUsuario}}">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
          <mat-label>Seleccione las zonas:</mat-label>        
          <section class="checkboxes">
            <p *ngFor= "let zone of zonaSelect">
              <input style="display: none" formControlName="zones" disabled>
              <mat-checkbox [(ngModel)]="zone.isCheck" [ngModelOptions]="{standalone: true}" (change)="checkZonas($event)">{{zone.nombreZona}}</mat-checkbox>
            </p>
          </section>  

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
  styleUrls: ['./vendedores.component.css']
})
export class EditarVendedoresComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  dateObj: number = Date.now();
  checkoutForm;
  correoUsuario = "";
  nombreVendedor = "";
  apellido = "";
  telefonoUsuario = "";
  idZonaVendedor = "";
  idsSelec=[];

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

  vendedor: any;
  zones;
  zonaSelect= [];
  ids;

  constructor(
    private vendedorService: VendedoresService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.checkoutForm = this.formBuilder.group({
      correoUsuario: '',
      nombreVendedor: '',
      apellido: '',
      idZonaVendedor:'',
      telefonoUsuario: '',
      zones: ''
    });
    
  }
  async ngOnInit() {
    this.vendedor = this.vendedorService.getById(this.data.id);

    this.nombreVendedor = this.vendedor.nombreVendedor;
    this.apellido =  this.vendedor.apellidoVendedor;
    this.correoUsuario = this.vendedor.correoUsuario;
    this.idZonaVendedor = this.vendedor.idZonaVendedor;
    this.telefonoUsuario = this.vendedor.telefonoVendedor;
    this.zonas = this.vendedorService.getZonas();
    this.zonaSelect = this.zonas;

    this.ids= this.vendedor.idZonasVendedores.split(",");

    this.zonaSelect.forEach(obj=> {
      var bool = false;
      for(var i =0; i<this.ids.length; i++) {
        this.ids[i]=Number(this.ids[i])
          if(obj.idZona === this.ids[i]) {          
            bool = true;
          }
      }
      obj.isCheck= bool;
    }) 

    let initials = "";
    const randomIndex = Math.floor(Math.random()* Math.floor(this.colors.length));
    this.color = this.colors[randomIndex]
    initials+=this.nombreVendedor[0].toUpperCase()+ this.vendedor.apellidoVendedor[0].toUpperCase();      
    this.initials = initials; 
    
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

  checkZonas(ev) {
    this.zonaSelect.forEach(obj=> {
      if(obj.isCheck === true){
        this.idsSelec.push(obj.idZona)
      }
    })    
    
  }

  onSubmit(data) {  
    console.log(this.idsSelec)

    if (data.correoUsuario === "") {
      data.correoUsuario = this.correoUsuario;
    }
    if (data.nombreVendedor === "") {
      data.nombreVendedor = this.nombreVendedor;
    }
    if (data.apellido === "") {
      data.apellido = this.apellido;
    }
    if (data.telefonoUsuario === "") {
      data.telefonoUsuario = this.telefonoUsuario;
    }      
    //this.vendedorService.updateVendedor(data,  this.data.id, this.idsSelec);
    var message= "Los datos se actualizaron correctamente."
    this.openSnackBar(message);
  }
}

