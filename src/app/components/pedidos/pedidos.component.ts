import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { VendedoresService, PedidosService, ClientesService } from '../../services/mock.service';
import { WebsocketSendService } from 'src/app/services/websocket/websocket-send.service';

import { MatMenuTrigger } from '@angular/material/menu';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { Zona, Pedido, Vendedor } from '../../models/model';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from "../../customComponents/customPaginator";
import * as moment from 'moment';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class PedidosComponent implements OnInit {

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<Pedido>;
  obs: Observable<any>;

  contextMenuPosition = { x: '0px', y: '0px' };

  rangoFechas;
  data: any;
  newData =[];
  vendedores: any;
  tableVColumns: string[] = [ 'checked','nombre'];
  tableColumns: string[] = [ 'checked','idpedido', 'fecha', 'idVendedorPedido', 'nombreVendedor', 'idClientePedido', 'modoPago', 'totalPedido', 'pdf'];
  colorV: string[] =[];

  fechaIn= moment().format('YYYY/MM/DD');
  fechaFin= moment().format('YYYY/MM/DD');
  fecha;

  initialV: string[] = [];
  isOpen = false;

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
    private vService: VendedoresService,
    private cService: ClientesService,
    private service: PedidosService,
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
    
    this.data.forEach(x=>{
      if(x.firma) {
        x.firma= `http://23.253.57.17:49196/firmas/${x.firma.split("/")[x.firma.split("/").length-1].split(" ")[0]}%20${x.firma.split("/")[x.firma.split("/").length-1].split(" ")[1]}`
      }
    })

    for (var j= 0; j<this.data.length; j++) {

      var vendedor = this.vService.getById(this.data[j].idVendedorPedido);
      var cliente = this.cService.getById(this.data[j].idClientePedido);

      this.data[j].nombreVendedor = vendedor.nombreVendedor;
      this.data[j].apellidoVendedor = vendedor.apellidoVendedor;
      this.data[j].nombreCliente = cliente.nombreCliente;   

      let initialsV = "";
      const randomIndex = Math.floor(Math.random()* Math.floor(this.colors.length));
      this.colorV[j] = this.colors[randomIndex]
      initialsV+=this.data[j].nombreVendedor[0].toUpperCase()+ this.data[j].apellidoVendedor[0].toUpperCase();      
           
      this.initialV[j] = initialsV;
    }    


    this.newData = this.data; 
    this.dataSource= new MatTableDataSource<Pedido>(this.newData)
    this.changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.obs = this.dataSource.connect();

  }

  async exportarCSV(){
    
    let arrID =[];
    
    for (var j= 0; j<this.newData.length; j++) {
      if(this.newData[j].checked){    
        arrID.push(this.newData[j].idpedido)
        
      }
    }

    this.getData(arrID);

    this.webSocket.socketResponse.subscribe(res => {
      if(res) {
        const datos = this.convertirArregloString(res.data.T0.Registros);
        const elementoBlob = new Blob(['\ufeff', datos], {type: 'text/plain'});
        const downloadLink = document.getElementById('download-link');
        downloadLink.setAttribute('href', window.URL.createObjectURL(elementoBlob));
        downloadLink.setAttribute('download', `reporte-${this.fechaIn}-${this.fechaFin}.csv`);
        downloadLink.click();
      } else {
        this.getData(arrID);
      }
    });
    
  }

  async pdf(event){
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    console.log(value)
    window.open('http://23.253.57.17:49196/PDF/' +value +'.pdf', "_blank");
  }

  getData(arrID){
    var comando;
    if (arrID.length===0) {
      comando = {
        uri: 'almatec.os.consultar',
        parametros: {
          fuenteDatos: 'Pysta.ListadoPedidos_validacionFiltros',
          parametros: `'${this.fechaIn} 00:00:00', '${this.fechaFin} 23:59:59',null, null, null`         
        }
      };
    } else {
      comando = {
        uri: 'almatec.os.consultar',
        parametros:  {
          fuenteDatos: 'Pysta.ListadoPedidos_validacionFiltros',
          parametros:  `null,null,null, null, '[${arrID}]'`
        }
      };
    }
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
  
  onContextMenu(event: MouseEvent, item: Pedido) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuAction1(item: Item) {
    const dialogEditar = this.matDialog.open(VerDetallePedidoComponent, {
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
    this.newData= this.dataSource.filteredData;
  }

  imprimir(){

  }
}

@Component({
  selector: 'app-ver-detalle-pedido',
  template: `
  <div class="container-accordeon">
    <h1 style="margin: 15px  0 10px 15px">Detalles del Pedido #{{data.item.idpedido}}</h1>
    <mat-accordion>
      <mat-expansion-panel [expanded]="true">
        <mat-expansion-panel-header>
          <mat-panel-title>
            Información del Pedido
          </mat-panel-title>
        </mat-expansion-panel-header>
        <p>Fecha: {{data.item.createdAtP | date:"MMM/dd HH:mm":"+0000"}}</p>
        <p>Observación: {{data.item.observacionesPedido}}</p>
        <p>Firma:</p><p *ngIf="!data.item.firma"> No hay firmas para mostrar</p>
        <img src="{{data.item.firma}}" width="300px">
        <p>Descripción del pedido:<p>
        <table mat-table [dataSource]="data.item.descripcion">
          <!-- Name Column -->
          <ng-container matColumnDef="cantidad">
              <th mat-header-cell *matHeaderCellDef> Cantidad </th>
              <td mat-cell *matCellDef="let element"> {{element.cantidad}} </td>
          </ng-container>  
          <!-- Name Column -->
          <ng-container matColumnDef="descripcion">
              <th mat-header-cell *matHeaderCellDef> Descripción </th>
              <td mat-cell *matCellDef="let element"> {{element.descripcion}} </td>
          </ng-container> 
          <!-- Name Column -->
          <ng-container matColumnDef="valorUnidad">
              <th mat-header-cell *matHeaderCellDef> Valor Unidad </th>
              <td mat-cell *matCellDef="let element"> {{element['valor unidad']}} </td>
          </ng-container> 

          <!-- Weight Column -->
          <tr mat-header-row *matHeaderRowDef="tableColumns"></tr>
          <tr mat-row *matRowDef="let myRowData; columns: tableColumns"></tr>
        </table>
        <br>
        </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            Información del Vendedor
          </mat-panel-title>
        </mat-expansion-panel-header>
        <p>Nombre: {{data.item.nombreVendedor}}</p>
        <p>Zona: {{this.data.item.nombreZonaVendedor}}</p>
        <p>Telefono: {{data.item.telefonoVendedor}}</p>
      </mat-expansion-panel>
      <mat-expansion-panel>
        <mat-expansion-panel-header>
          <mat-panel-title>
            Información del Cliente
          </mat-panel-title>
        </mat-expansion-panel-header>
        <p>Nit o CC.: {{data.item.nitOcc}}</p>
        <p>Nombre: {{data.item.nombreCliente}}</p>
        <p>Telefono: {{data.item.telefonoCliente}}</p>
        <p>Dirección: {{data.item.direccionCliente}} -  {{data.item.sucursal}}</p>
        <p>Zona: {{data.item.nombreZonaCliente}}</p>
      </mat-expansion-panel>
    </mat-accordion>
  </div>

  `,
  styleUrls: ['./pedidos.component.css']
})

export class VerDetallePedidoComponent implements OnInit {
  item= [];
  imgFirma;
  zonas: Zona[];
  lat;
  lng;
  zoom: number = 13;

  tableColumns: string[] = [ 'cantidad', 'descripcion', 'valorUnidad'];

  constructor(
    private service: PedidosService,
    private vService: VendedoresService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    async ngOnInit() {
     this.zonas = await this.vService.getZonas().toPromise();   
     var index = this.zonas.findIndex(obj => obj.idZona==this.data.item['idZonaCliente']);
     var ids= this.data.item['idZonasVendedores'].split(",")
     this.data.item['nombreZonaVendedor']= ""
     for(var i=0; i<ids.length;i++){
        var indexMul = this.zonas.findIndex(obj => obj.idZona==ids[i].replace('/"','/'));
       this.data.item['nombreZonaVendedor']+= this.zonas[indexMul].nombreZona + ", "
      }
    
    this.data.item['nombreZonaCliente']= this.zonas[index].nombreZona  
          
    }     
    
}

export interface Item {
  id: number;
  name: string;
}
