import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { VendedoresService } from '../../services/mock.service';
import { Vendedor } from '../../models/model';

import {MatDialog} from '@angular/material/dialog';

import { FormBuilder } from '@angular/forms';

import { GoogleMapsAPIWrapper } from '@agm/core';

import * as moment from 'moment';

@Component({
  selector: 'app-ubicacion-vendedores',
  templateUrl: './ubicacion-vendedores.component.html',
  styleUrls: ['./ubicacion-vendedores.component.css'],
  animations: [
    trigger('filtros', [
      state('open', style({
        width: '300px',
        height: '458px',
        position: 'absolute',
        'z-index': 2,
        right: '66px',
        top: '130px',
      })),
      state('closed', style({
        width: '300px',
        height: '458px',
        position: 'absolute',
        'z-index': 2,
        right: '66px',
        top: '130px',
        opacity: '0',
        display: 'none',
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ])
  ],
})

export class UbicacionVendedoresComponent implements OnInit {
  
  zoom: number = 12;

  vendedores: Vendedor[];
  vendedoresRec: Vendedor[];
  newData: Vendedor[];
  newDataRec: Vendedor[];
  ubicacion: Vendedor[];
  recorridos: any;
  lat= 3.454688;
  lng= -76.5371312;

  map: any;

  rangoFechas;
  idVendedor;
  fecha= moment().format('YYYY/MM/DD');
  horaIn= this.fecha+ " " + moment().subtract(1,'h').format('HH:mm');
  horaFin = this.fecha + " "+ moment().format('HH:mm');

  interval;
  searchText;
  searchText2;
  show = false; 
  mapType=true;
  previous;

  id;
  nombre
  apellido;
  date;

  displayDirections = true;

  constructor(
    private vService: VendedoresService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public gMaps: GoogleMapsAPIWrapper,
    ) {  
      this.rangoFechas = this.formBuilder.group({
        fecha: '',
        horaIn: '',
        horaFin: '',
        vendedorId: ''
    });
     }

  async ngOnInit() {
    this.vendedores =  this.vService.getAll();  
    this.vendedoresRec =  this.vService.getAll();
    this.recorridos =  this.vService.getRecorrido(this.horaIn, this.horaFin, this.vendedores[0].idUsuarioVendedor);
    console.log(this.vendedores)


    this.vendedores.forEach(x => x.checked = true);
    this.vendedores.forEach(x => x.nombreVendedor = x.nombreVendedor+ " " + x.apellidoVendedor);
    this.vendedores.forEach(x => x.iniciales = x.nombreVendedor[0] + x.apellidoVendedor[0]);

    this.vendedoresRec.forEach(x => x.checked = false);
    this.vendedoresRec.forEach(x => x.nombreVendedor = x.nombreVendedor+ " " + x.apellidoVendedor);

    this.newData = this.vendedores;
    this.newDataRec = this.vendedoresRec;

    this.refreshData();
    this.interval = setInterval(() => { 
        this.refreshData(); 
    }, 600000);
  }


  async loadData(values) {

    if(values.fecha){
      this.fecha= moment(values.fecha).format('YYYY/MM/DD')
    }
    if (values.horaIn) {
      this.horaIn= this.fecha + " " +values.horaIn;
    }
    if(values.horaFin) {
      this.horaFin = this.fecha + " " + values.horaFin;

    }
    this.recorridos = this.vService.getRecorrido(this.horaIn, this.horaFin, values.vendedorId);
    
    var lengthLat=[];
    var lengthLng=[];    

    for(var i=0; i< this.recorridos.length; i++){
      this.lat = this.recorridos[0].localizacion.latitud;
      this.lng = this.recorridos[0].localizacion.longitud;
      lengthLat.push(this.recorridos[i].localizacion.latitud);
      lengthLng.push(this.recorridos[i].localizacion.longitud);
    }
    const position = new google.maps.LatLng(this.lat, this.lng);
    this.map.panTo(position);
    //this.ngOnInit();
  }

  buscarVendedor() {
    this.show = !this.show;
  }

  uncheck(ev) {
    this.newDataRec.forEach(x => x.checked = false)

    this.newDataRec.forEach(x=>{
      if(Number(x.idUsuarioVendedor) === Number(ev.target.value)) {
        this.rangoFechas.controls['vendedorId'].setValue(x.idUsuarioVendedor);
        x.checked=true;
      }
    })

  }
  checkAllCheckBox(ev) {
		this.newData.forEach(x => x.checked = ev.target.checked)
	}
	isAllCheckBoxChecked() {
		return this.newData.every(p => p.checked);
	} 

  assignCopy(){
    this.newData = Object.assign([], this.vendedores);
  }
  assignCopyRec(){
    this.newDataRec = Object.assign([], this.vendedoresRec);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(!filterValue){
      this.assignCopy();
    } // when nothing has typed
    this.newData = Object.assign([], this.vendedores).filter(
     item => item.nombreVendedor.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
    ) 
  }
  applyFilterRec(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(!filterValue){
      this.assignCopyRec();
    } // when nothing has typed
    this.newDataRec = Object.assign([], this.vendedoresRec).filter(
     item => item.nombreVendedor.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
    ) 
  }

  public loadAPIWrapper(map) {
    console.log("hola");
    this.map = map;
  }

  clickedMarker(infowindow, id, nombre, apellido) {
    this.id= id;
    this.nombre= nombre;
    this.apellido= apellido;

    if (this.previous) {
        this.previous.close();
    }
    this.previous = infowindow;
 }
 clickedMarkerRec(infowindow, date) {
  this.date= date;
  console.log(this.date)

  if (this.previous) {
      this.previous.close();
  }
  this.previous = infowindow;
}
  
  refreshData(){
    this.vService.getAll()
        .subscribe(data => {
            this.ubicacion = data;
        });
  }
}
