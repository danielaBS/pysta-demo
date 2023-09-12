import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginator } from "../../customComponents/customPaginator";

import { ConfigService, VendedoresService } from '../../services/mock.service';
import { Zona } from '../../models/model';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';

export interface Agente {
  id: number;
  class: string;
  cols: number;
  rows: number;
  nombre: string;
  telefono: string;
  zona: string;
  correo: string;
  color: string;
  initials: string;
}

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ]
})
export class ConfiguracionesComponent implements OnInit {

  data;
  newData;
  zonas: Zona[];
  days = [{"id": 1, "nombre": 'L', "checked": true}, {"id": 2, "nombre": 'M', "checked": true}, {"id": 3, "nombre": 'X', "checked": true}, {"id": 4, "nombre": 'J', "checked": true}, {"id": 5, "nombre": 'V', "checked": true}, {"id": 6, "nombre": 'S', "checked": false}, {"id": 7, "nombre": 'D', "checked": false}]

  tableColumns: string[] = ['nombre', 'identificacion', 'nombreUsuario', 'correoElectronico', 'zona', 'editar'];
  tilesAgentes: Agente[] = [];
  
  searchText;

  checkoutForm;
  rangoHora;
  visitsType;

  tipoVisita = [];

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
    private formBuilder: FormBuilder,
    private service: VendedoresService,
    private cService: ConfigService,
    ) { 
      this.checkoutForm = this.formBuilder.group({
        agenteSelect: '',
      });
      this.rangoHora = this.formBuilder.group({
        horaIn: '',
        horaFin: '',
      });
      this.visitsType = this.formBuilder.group({
        tipo: ''
      })
    
  }

  async ngOnInit() {

    this.service.getZonas().subscribe((zonas: Zona[]) => {
      this.zonas = zonas;
    });
    this.data = await this.service.getAll().toPromise();

    this.data.forEach(x => x.checked = true);

    this.newData = this.data;

  }
  
  checkAllCheckBox(ev) {
		this.newData.forEach(x => x.checked = ev.target.checked)
	}
	isAllCheckBoxChecked() {
		return this.newData.every(p => p.checked);
	} 

  checkAllCheckBoxDays(ev) {
		this.days.forEach(x => x.checked = ev.target.checked)
	}
	isAllCheckBoxCheckedDays() {
		return this.days.every(p => p.checked);
	} 

  assignCopy(){
    this.newData = Object.assign([], this.data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if(!filterValue){
      this.assignCopy();
    } // when nothing has typed
    this.newData = Object.assign([], this.data).filter(
     item => item.nombreVendedor.toLowerCase().indexOf(filterValue.toLowerCase()) > -1
    ) 
  }

    
  onEnter(event: any) {
    this.tipoVisita.push(event.target.value);
    event.target.value = "";      
  }

  deleteItem(event: any){
    var target = event.target || event.srcElement || event.currentTarget;
    var parent= target.closest('.item');
    var id = parent.attributes.id.nodeValue;

    parent.remove();

    let index = this.tipoVisita.findIndex(a => a == id);

    if (index != -1) {
      this.tipoVisita.splice(index, 1);
    }
  }    
  saveVisitTypes(){
    for(var i=0; i<this.tipoVisita.length; i++) {
      this.cService.setVisitsType(this.tipoVisita[i]);
    }
  }

}
