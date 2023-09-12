import {Component, OnInit, ViewChild} from '@angular/core';

import {VisitasService} from "../../services/mock.service";

import { FormBuilder } from '@angular/forms';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import esLocale from '@fullcalendar/core/locales/es';

import * as moment from 'moment';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})

export class CalendarioComponent implements OnInit {

  rangoFechas;
  events: any[];
  options: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    }
  };
  fechaIn= moment().subtract(7,'d').format('YYYY/MM/DD');
  fechaFin= moment().format('YYYY/MM/DD');

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  constructor(private service: VisitasService,
    private formBuilder: FormBuilder,
    ) {
    this.rangoFechas = this.formBuilder.group({
      fechaIn: '',
      fechaFin: ''      
  });
  }

  ngOnInit(): void {
    this.initialize();
  }


  async initialize() {
    let data = await this.service.getAll(this.fechaIn, this.fechaFin).toPromise();
    this.events = data.map(function(obj){
      var rObj = {};
      rObj['start'] = obj.fechaHoraInicio;
      rObj['end'] = obj.fechaHoraFin;
      rObj['title'] = obj.nombre;
      return rObj;
    });
    this.options.events = this.events;

    /*this.options = {
    //  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      defaultDate: '2017-02-01',
      themeSystem: 'bootstrap4',
      header: {
        left: 'prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }
    }*/




    console.log('ladata ',data)
  }

}
