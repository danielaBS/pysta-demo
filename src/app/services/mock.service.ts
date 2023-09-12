import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vendedor, Cliente, Zona, UbicacionVendedor } from '../models/model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable()
export class VendedoresService {

  public usuarios = require("./Data/usuario.json")
  public zonas = require("./Data/zona.json")

  public listado = [];

  constructor(private http: HttpClient) {}
  

  getAll() {
    return this.usuarios;    
  }

  getAllAsVendedores() {

  }

  getUbicacionVendedores() {
  }

  getById(id) {
    var user = this.usuarios.filter(user => Number(user.idUsuario) === Number(id));
    return user[0];
  }

  insertVendedor(vendedor){
    const newUser = { ...vendedor };
 
    this.usuarios = { ...this.usuarios, newUser };

  }

  updateVendedor(data, id, idsSelec) {  
    
  }

  getRecorrido(horaIn, horaFin, idUsuarioVendedor) {
    
  }

  getZonas(){
    return this.zonas;   
  }
  getZonasObs(): Observable<any>{
    return of(this.zonas);   
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }

}

@Injectable()
export class ClientesService {
  public listado = [];

  constructor(private http: HttpClient) {}
  
  public clientes = require("./Data/cliente.json")


  getAll() {
    return this.clientes   
  }

  getById(id) {
    var cliente = this.clientes.filter(client => Number(client.idCliente) === Number(id));
    return cliente[0];
  }

  insertCliente(cliente){
    
  }

  updateCliente(data, id) {  
    
  }

  getCliente(correo:string) {
    
  }  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }
}

@Injectable()
export class VisitasService {
  public listado = [];

  constructor(private http: HttpClient) {}
  public visitas = require("./Data/visita.json")

//private baseListUrl: string = "http://127.0.0.1:49196/";
private baseListUrl: string = "http://23.253.57.17:49196/";

getAll(fechaIn, fechaFin): Observable<any> {
  var visitas = this.visitas.filter(visita => Date.parse(visita.fechaHoraInicio) > Date.parse(fechaIn));
  visitas = this.visitas.filter(visita => Date.parse(visita.fechaHoraFin) < Date.parse(fechaFin));
  
    return visitas;
}

  getById(id): Observable<any> {
    return this.http.post<any>(this.baseListUrl.concat("clientes/getByCode"), {
      "codigoCliente" : id
    }, httpOptions)
    .pipe(
      catchError(this.handleError('getCliente'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }
}


@Injectable()
export class PedidosService {
  public listado = [];
  public pedidos = require("./Data/pedido.json")


  constructor(private http: HttpClient) {}
  
  //private baseListUrl: string = "http://127.0.0.1:49196/";
  private baseListUrl: string = "http://23.253.57.17:49196/";

  getAll(fechaIn, fechaFin): Observable<any> {
    var pedidos = this.pedidos.filter(pedido => Date.parse(pedido.createdAt) > Date.parse(fechaIn));
    pedidos = this.pedidos.filter(pedido => Date.parse(pedido.createdAt) < Date.parse(fechaFin));
    
    return pedidos;
  }

  
  pdf() {
    return this.http.post<any>(this.baseListUrl.concat("pedidos/nuevoPedido"), JSON.stringify({   
      "idClientePedido": 8,
      "idVendedorPedido": 4,
      "descripcion": [
        {"idProducto": 3, "descripcion": "DESENGRASANTE BIO", "cantidad": 3, "valor unidad": "1600"},
        {"idProducto":5, "descripcion": "limpia vidrios botella 100ml","cantidad": 2, "valor unidad": "3100"}

      
      ],
      "totalPedido": "11000",
      "observacionesPedido": "Entregar entre semana en la tarde",
      "modoPago": "contado",
        "ubicacion": {
            "latitud": 3.79,
            "longitud": 70.67
        },
        "firma": "null"
    }), httpOptions).subscribe(
      res=>{
        console.log(res)

      });    
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }
}

@Injectable()
export class ReportesService {
  public listado = [];

  constructor(private http: HttpClient) {}
  
  //private baseListUrl: string = "http://127.0.0.1:49196/";
  private baseListUrl: string = "http://23.253.57.17:49196/";

  getVisitasVendedor() {
    return this.http.get<any[]>(this.baseListUrl.concat("reportes/visitasVendedor"))    
  }

  getVentasCliente(): Observable<any> {
    return this.http.get<any[]>(this.baseListUrl.concat("reportes/ventasCliente"))    
  }

  getVentasTotales(): Observable<any> {
    return this.http.get<any[]>(this.baseListUrl.concat("reportes/ventasTotales"))    
  }

  getTop5(): Observable<any>{
    return this.http.get<any[]>(this.baseListUrl.concat("reportes/getTop5"))    
  }
  getZonas(){
    return this.http.get<Zona[]>(this.baseListUrl.concat("zonas"))    
  }

  getJornadasByDate(horaIn, horaFin): Observable<any> {
    return this.http.post<any[]>(this.baseListUrl.concat("jornada/getByDate"), {
      "horaIn": horaIn,
      "horaFin": horaFin
    }, httpOptions)    
    .pipe(
      catchError(this.handleError('getJornadasByDate'))
    );
  }

  getJornadasByUser(idUsuarioJornada): Observable<any> {
    return this.http.post<any[]>(this.baseListUrl.concat("jornada/getByUser"), {
      "idUsuarioJornada": idUsuarioJornada
    }, httpOptions)    
    .pipe(
      catchError(this.handleError('getJornadasByUser'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }

}


@Injectable()
export class ConfigService {
  public listado = [];

  constructor(private http: HttpClient) {}
  
  //private baseListUrl: string = "http://127.0.0.1:49196/";
  private baseListUrl: string = "http://23.253.57.17:49196/";
  
  setVisitsType(array)  {
    this.http.post<any>(this.baseListUrl.concat("config/setVisitsType"), JSON.stringify({
      "visitsType" : array
    }), httpOptions)
    .subscribe(res =>{

    })
  }

  getZonas(){
    return this.http.get<Zona[]>(this.baseListUrl.concat("zonas"))    
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    //this.messageService.add(`HeroService: ${message}`);
  }

}