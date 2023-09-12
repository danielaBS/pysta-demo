import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { ReportesService, VendedoresService } from '../../services/mock.service';
import { Visita } from '../../models/model';

import * as Chart from 'chart.js';
import * as moment from 'moment';
moment.locale('es')

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})

export class ReportesComponent implements OnInit {

  private chartRef: ElementRef;
  private chart: Chart;  
  
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild(MatSort) sort2: MatSort;
  @ViewChild(MatSort) sort3: MatSort;

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;

  dataSource1: MatTableDataSource<Visita>;
  dataSource2: MatTableDataSource<Visita>;
  dataSource3: MatTableDataSource<any>;

  obs1: Observable<any>;
  obs2: Observable<any>;
  obs3: Observable<any>;

  contextMenuPosition = { x: '0px', y: '0px' };

  rangoFechas;
  idVendedor;

  vendedores:  any[];
  vendedores2:  any[] =[];
  ventasYvisitas: any[];
  visitas=[];
  ventas= [];
  jornadas: any[];
  vendedoresForSelect: any[];
   
  dataVV: any[];
  visitasVendedorRes: any[];
  visitasVendedorJson: any[];
  
  dataPC: any[];
  pedidosClienteRes: any[];
  pedidosClienteJson: any[];
  
  newData1: any[];
  newData2: any[];
  newData3: any[];

  columnsVisitasVendedores: string[] = ['idUsuarioVendedor', 'nombreVendedor', 'cantidadVisitas', 'promedioDuracion'];
  columnsVentasClientes: string[] = ['idCliente', 'sucursal', 'cantidadPedidos', 'promedioTotal'];
  columnsJornadas: string[] = ['idJornada', 'vendedor', 'horaInicio', 'horaFin'];


  fechaIn= moment().subtract(7,'d').format('YYYY/MM/DD');
  fechaFin= moment().format('YYYY/MM/DD');

  labelsDias = [moment().subtract(6,'d').format('ddd-DD'), moment().subtract(5,'d').format('ddd-DD'), moment().subtract(4,'d').format('ddd-DD'), moment().subtract(3,'d').format('ddd-DD'), moment().subtract(2,'d').format('ddd-DD'), moment().subtract(1,'d').format('ddd-DD'), moment().format('ddd-DD')]

  horaIn = moment().format('YYYY-MM-DD 00:00');
  horaFin = moment().format('YYYY-MM-DD HH:MM');

  id="";

  constructor(
    private vService: VendedoresService,
    private service: ReportesService,
    private matDialog: MatDialog,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
  ) { 
    this.rangoFechas = this.formBuilder.group({
      horaIn: '',
      horaFin: ''      
    });    
    this.idVendedor = this.formBuilder.group({
      id: ''
    });  
  }

  async ngOnInit() {    
    this.vendedoresForSelect = await this.vService.getAll().toPromise();  
    this.vendedores = await this.service.getTop5().toPromise();
    this.ventasYvisitas = await this.service.getVentasTotales().toPromise();
    console.log(this.ventasYvisitas);
    
    if(this.id !== "" && this.id.length>0) {
      this.jornadas = await this.service.getJornadasByUser(this.id).toPromise();
      this.id="";
    } else {
      this.jornadas = await this.service.getJornadasByDate(this.horaIn, this.horaFin).toPromise();
    }
   
    for(let key in this.ventasYvisitas) {
      for(var i=0; i<this.ventasYvisitas[key].length; i++) {
        if(key ==="visitas") {
          if (this.labelsDias.indexOf(moment(this.ventasYvisitas[key][i]['DATE(createdAtV)']).format('ddd-DD'))){
            this.visitas[this.labelsDias.indexOf(moment(this.ventasYvisitas[key][i]['DATE(createdAtV)']).format('ddd-DD'))+1] =this.ventasYvisitas[key][i][""]
          } else {
            this.visitas[i] = 0
          }
        } else if (key==="pedidos") {
          if (this.labelsDias.indexOf(moment(this.ventasYvisitas[key][i]['DATE(createdAtP)']).format('ddd-DD'))){
            this.ventas[this.labelsDias.indexOf(moment(this.ventasYvisitas[key][i]['DATE(createdAtP)']).format('ddd-DD'))+1] =this.ventasYvisitas[key][i][""]
          } else {
            this.ventas[i] = 0
          }
  
        }       
      }       
    }
  
    this.dataVV = await this.service.getVisitasVendedor().toPromise();
    this.visitasVendedorRes = this.dataVV['res'];
    this.visitasVendedorJson = this.dataVV['json'];

    this.visitasVendedorRes.forEach((x, index) => x.totalVisitas = this.visitasVendedorJson[index][""]);
    this.visitasVendedorRes.forEach((x, index) => x.promedio = this.visitasVendedorRes[index][""]);

    this.dataPC = await this.service.getVentasCliente().toPromise();
    this.pedidosClienteRes = this.dataPC['res'];
    this.pedidosClienteJson = this.dataPC['json'];

    this.pedidosClienteRes.forEach((x, index) => x.totalPedidos = this.pedidosClienteJson[index]["COUNT(*)"]);
    this.pedidosClienteRes.forEach((x, index) => x.promedio = this.pedidosClienteRes[index][""]);

    this.newData1 = this.visitasVendedorRes; 
    this.dataSource1= new MatTableDataSource<Visita>(this.newData1)
    this.changeDetectorRef.detectChanges();
    this.dataSource1.paginator = this.paginator1;
    this.obs1 = this.dataSource1.connect();

    this.newData2 = this.pedidosClienteRes; 
    this.dataSource2= new MatTableDataSource<Visita>(this.newData2)
    this.changeDetectorRef.detectChanges();
    this.dataSource2.paginator = this.paginator2;
    this.obs2 = this.dataSource2.connect();

    this.newData3 = this.jornadas;
    this.dataSource3= new MatTableDataSource<Visita>(this.newData3)
    this.changeDetectorRef.detectChanges();
    this.dataSource3.paginator = this.paginator3;
    this.obs3 = this.dataSource3.connect();

    this.initialChart();
  }

  loadData(values) {
    if(values.horaIn){
      this.horaIn= moment(values.horaIn).format('YYYY/MM/DD HH:MM')
    }
    if(values.horaFin){
      this.horaFin= moment(values.horaFin).format('YYYY/MM/DD HH:MM')
    }    
    this.ngOnInit();
  }

  loadDataByUser(values) {
    this.id = values.id;
    this.ngOnInit();
  }

  findInJson(nombreVendedor){
    return this.vendedores['pedidos'].find(item=> 
      item.nombreVendedor === nombreVendedor
      )
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }


  imprimir(){

  }

  initialChart() {


    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: [this.labelsDias[0] , this.labelsDias[1], this.labelsDias[2], this.labelsDias[3], this.labelsDias[4], this.labelsDias[5] , this.labelsDias[6],],
        datasets: [
          {
            label: 'Cantidad de Visitas',
            data: [this.visitas[0], this.visitas[1], this.visitas[2], this.visitas[3], this.visitas[4], this.visitas[5], this.visitas[6]],
            backgroundColor: 'transparent',
            borderColor:  '#FCCA46',
            datalabels: {
              display: false,           
            },
          }, {
            label: 'Cantidad de Pedidos',
            data: [this.ventas[0], this.ventas[1], this.ventas[2], this.ventas[3], this.ventas[4], this.ventas[5], this.ventas[6]],
            backgroundColor: 'transparent',
            borderColor:  '#233D4D',
            datalabels: {
              display: false,             
            },

          }        
        ]        
      }              
    });
    this.chart = new Chart('chart2', {
      type: 'bar',
      data: {
        labels: [this.vendedores[0]["nombreVendedor"].split(" ")[0], this.vendedores[1]["nombreVendedor"].split(" ")[0], this.vendedores[2]["nombreVendedor"].split(" ")[0], this.vendedores[3]["nombreVendedor"].split(" ")[0], this.vendedores[4]["nombreVendedor"].split(" ")[0]],
        datasets: [
          {
            label: 'Cantidad de Visitas',
            data: [
              this.vendedores[0]["cantidad_visitas"], this.vendedores[1]["cantidad_visitas"], this.vendedores[2]["cantidad_visitas"], this.vendedores[3]["cantidad_visitas"], this.vendedores[4]["cantidad_visitas"]
            ],
            backgroundColor: '#2EC4B6',
            datalabels: {
              display: true,           
            },
          }, {
            label: 'Cantidad de Pedidos',
            data: [
              this.vendedores[0]["cantidad_pedidos"], this.vendedores[1]["cantidad_pedidos"], this.vendedores[2]["cantidad_pedidos"], this.vendedores[3]["cantidad_pedidos"], this.vendedores[4]["cantidad_pedidos"]
            ],
            backgroundColor: '#8FBFE0',
            datalabels: {
              display: true,             
            },
            order:2

          }        
        ]        
      },
      options: {
        scales: {
            xAxes: [{
                stacked: true
            }],
            yAxes: [{
                stacked: true
            }]
        }
    }         
    });
  }
  
}
