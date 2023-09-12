import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { VisitasService, VendedoresService, ClientesService } from '../../services/mock.service';
import { WebsocketSendService } from 'src/app/services/websocket/websocket-send.service';

import { MatMenuTrigger } from '@angular/material/menu';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Visita, Zona, Vendedor } from '../../models/model';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from "../../customComponents/customPaginator";
import * as moment from 'moment';

@Component({
  selector: 'app-reporte-visitas',
  templateUrl: './reporte-visitas.component.html',
  styleUrls: ['./reporte-visitas.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class ReporteVisitasComponent implements OnInit {
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Visita>;
  obs: Observable<any>;

  contextMenuPosition = { x: '0px', y: '0px' };

  rangoFechas;
  data: any;
  newData =[];
  vendedores: any
  tableColumns: string[] = ['checked', 'idVisita', 'id_usuario', 'nombreVendedor', 'id_cliente', 'fechaHoraInicio', 'duracion', 'tipo'];
  color: string[] =[];
  initial: string[] = [];
  vendedor: any;
  allChecked: boolean = false;

  fechaIn= moment().format('YYYY/MM/DD');
  fechaFin= moment().format('YYYY/MM/DD');
  fecha;
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
    private service: VisitasService,
    private vService: VendedoresService,
    private cService: ClientesService,
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private webSocket: WebsocketSendService,
  ) { 
    this.rangoFechas = this.formBuilder.group({
      fechaIn: '',
      fechaFin: ''      
    });
  }

  async ngOnInit() {
    if(this.fechaFin === this.fechaIn) {
      this.fecha = this.fechaFin
    } else{
      this.fecha = `${this.fechaIn} a ${this.fechaFin}`
    }
    this.data =  this.service.getAll(this.fechaIn+" 00:00:00", this.fechaFin+"  23:59:59");

    
    for (var j= 0; j<this.data.length; j++) {        
      let initials = "";
      var vendedor = this.vService.getById(this.data[j].id_vendedor_visita);
      var cliente = this.cService.getById(this.data[j].id_cliente_visita);
     
      const randomIndex = Math.floor(Math.random()* Math.floor(this.colors.length));
      this.color[j] = this.colors[randomIndex]      
      initials+= vendedor.nombreVendedor[0].toUpperCase()+ vendedor.apellidoVendedor[0].toUpperCase();      
      this.data[j].nombreVendedor = vendedor.nombreVendedor;
      this.data[j].apellidoVendedor = vendedor.apellidoVendedor;
      this.data[j].nombreCliente = cliente.nombreCliente;
      this.data.forEach(x=>x.duracion = moment.duration(moment(x.fechaHoraFin).diff(moment(x.fechaHoraInicio))).asMinutes());
      this.initial[j] = initials;      
    }


    this.newData = this.data; 
    this.dataSource= new MatTableDataSource<Visita>(this.newData)
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();

  }

  async exportarCSV(){
    
    let arrID=[];
    
    for (var j= 0; j<this.newData.length; j++) {
      if(this.newData[j].checked){     
        arrID.push(this.newData[j].idVisita) 
      }
    }

    this.getData(arrID);

    this.webSocket.socketResponse.subscribe(res => {
      console.log(res)
      if(res) {
        const datos = this.convertirArregloString(res.data.T0.Registros);
        const elementoBlob = new Blob(['\ufeff', datos], {type: 'text/plain'});
        const downloadLink = document.getElementById('download-link');
        downloadLink.setAttribute('href', window.URL.createObjectURL(elementoBlob));
        downloadLink.setAttribute('download', `reporte-${this.fecha}.csv`);
        downloadLink.click();
      } else {
        this.getData(arrID);

      }
    });
    
  }
  
  getData(arrID){
    var comando;
    if (arrID.length===0) {
      comando = {
        uri: 'almatec.os.consultar',
        parametros: {
          fuenteDatos: 'Pysta.ListadoVisitas_Filtros',
          parametros: `'${this.fechaIn} 00:00:00', '${this.fechaFin} 23:59:59',null, null, null`         
        }
      };
    } else {
      comando = {
        uri: 'almatec.os.consultar',
        parametros:  {
          fuenteDatos: 'Pysta.ListadoVisitas_Filtros',
          parametros:  `null,null,null,null, '[${arrID}]'`
        }
      };
    }
    console.log(comando)
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

  checkAllCheckBox(ev) {
		this.newData.forEach(x => x.checked = ev.target.checked)
	}

	isAllCheckBoxChecked() {
		return this.newData.every(p => p.checked);
	} 


  loadData(values) {
    if(values.fechaIn){
      this.fechaIn= moment(values.fechaIn).format('YYYY/MM/DD')
    }
    if(values.fechaFin){
      this.fechaFin= moment(values.fechaFin).format('YYYY/MM/DD')
    }

    this.ngOnInit();
  }

  onContextMenu(event: MouseEvent, item: Visita) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuAction1(item: Item) {
    const dialogEditar = this.matDialog.open(VerDetalleVisitaComponent, {
      data: {
        item: item
      }
    });
  }

  onContextMenuAction2(item: Item) {
    alert(`Click on Action 2 for ${item.name}`);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  imprimir(){

  }
}


@Component({
  selector: 'app-ver-detalle-visita',
  template: `
  <div class="container-accordeon">
    <h1>Detalles de la visita #{{data.item.idVisita}}</h1>
    <mat-accordion>
      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title>
            Información de la visita
          </mat-panel-title>
        </mat-expansion-panel-header>
        <p>Hora Inicio: {{data.item.fechaHoraInicio | date:"MMM/dd HH:mm":"+0000"}}</p>
        <p>Hora Fin: {{data.item.fechaHoraFin | date:"MMM/dd HH:mm":"+0000"}}</p>
        <p>Ubicación: </p>
        <agm-map [zoom]="zoom" [latitude]="lat" [longitude]="lng">
          <agm-marker [latitude]="lat" [longitude]="lng"></agm-marker>
        </agm-map>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            Información del Vendedor
          </mat-panel-title>
        </mat-expansion-panel-header>
        <p>Nombre: {{data.item.nombreVendedor}}</p>
        <p>Teléfono: {{data.item.telefonoVendedor}}</p>
        <p>Zona: {{this.data.item.nombreZonaVendedor}}</p>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            Información del Cliente
          </mat-panel-title>
        </mat-expansion-panel-header>
        <p>Nit o CC.: {{data.item.nitOcc}}</p>
        <p>Nombre: {{data.item.nombreCliente}}</p>
        <p>Teléfono: {{data.item.telefonoCliente}}</p>
        <p>Dirección: {{data.item.direccionCliente}} -  {{data.item.sucursal}}</p>
        <p>Zona: {{data.item.nombreZonaCliente}}</p>
      </mat-expansion-panel>
    </mat-accordion>
  </div>  

  `,
  styleUrls: ['./reporte-visitas.component.css']
})

export class VerDetalleVisitaComponent implements OnInit {
  item= [];
  imgFirma;
  zonas: Zona[];
  lat;
  lng;
  zoom: number = 13;

  constructor(
    private service: VisitasService,
    private vService: VendedoresService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    async ngOnInit() {
      this.vService.getZonas().subscribe((zonas: Zona[]) => {
        this.zonas = zonas;
        var index = this.zonas.findIndex(obj => obj.idZona==this.data.item['idZonaCliente']);
        var ids= this.data.item['idZonasVendedores'].split(",")
        this.data.item['nombreZonaVendedor']= ""
        for(var i=0; i<ids.length;i++){
          var indexMul = this.zonas.findIndex(obj => obj.idZona==ids[i].replace('/"','/'));
          this.data.item['nombreZonaVendedor']+= this.zonas[indexMul].nombreZona + ", "
    
        }
        
        this.data.item['nombreZonaCliente']= this.zonas[index].nombreZona
      });

      this.lat = Number(this.data.item.ubicacionV.latitud);
      this.lng = Number(this.data.item.ubicacionV.longitud);


    }
}

export interface Item {
  id: number;
  name: string;
}
