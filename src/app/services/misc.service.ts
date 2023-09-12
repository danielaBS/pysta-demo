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
const headers = new Headers();
        headers.append('Access-Control-Allow-Headers', 'Content-Type');
        headers.append('Access-Control-Allow-Methods', 'GET, POST');
        headers.append('Access-Control-Allow-Origin', '*');

@Injectable()
export class VendedoresService {
  public listado = [];

  constructor(private http: HttpClient) {}
  
  //private baseListUrl: string = "http://127.0.0.1:49196/";
  private baseListUrl: string = "http://23.253.57.17:49196/";

  getAll() {
    return this.http.get<Vendedor[]>(this.baseListUrl.concat("usuarios"))    
  }

  getAllAsVendedores(): Observable<any> {
    return this.http.get<Vendedor[]>(this.baseListUrl.concat("usuariosAsVendedores"))    

  }

  getUbicacionVendedores() {
    return this.http.get<UbicacionVendedor[]>(this.baseListUrl.concat("ubicacionVendedores"))    
  }
  getById(id): Observable<any> {
    return this.http.post<any>(this.baseListUrl.concat("usuarios/getById"), {
      "idUsuario" : id
    }, httpOptions)
    .pipe(
      catchError(this.handleError('getVendedor'))
    );
  }

  insertVendedor(vendedor){
    this.http.post<any>(this.baseListUrl.concat("usuarios/nuevoUsuario"), JSON.stringify({   
      "nombreUsuario": vendedor.nombreUsuario,
      "apellidoVendedor": vendedor.apellido,
      "contrasenaUsuario": vendedor.contrasena,
      "correoUsuario": vendedor.correo,
      "idZonasVendedores": vendedor.zonaSelect,
      "telefonoVendedor": vendedor.telefono,
      "ubicacion": {
        "latitud": null,
        "longitud": null
      }
    }), httpOptions).subscribe(
      res=>{

      });    
  }

  updateVendedor(data, id, idsSelec) {  
    this.http.post<any>(this.baseListUrl.concat("usuarios/updateUsuario"), JSON.stringify({
      "idUsuario" : id,
      "correoUsuario": data.correoUsuario,
      "nombreUsuario": data.nombreVendedor,
      "apellidoVendedor": data.apellido,
      "telefonoUsuario": data.telefonoUsuario,
      "idZonasVendedores": idsSelec,
      "ubicacion": {
        "latitud": null,
        "longitud": null
      }

    }), httpOptions).subscribe(
      res => {
      }); 
  }

  getRecorrido(horaIn, horaFin, idUsuarioVendedor): Observable<any> {
    return this.http.post<any>(this.baseListUrl.concat("jornada/getRecorrido"), {
      "id_vendedor_recorrido" : idUsuarioVendedor,
      "horaIn": horaIn,
      "horaFin": horaFin
    }, httpOptions)
    .pipe(
      catchError(this.handleError('getVendedor'))
    );
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

@Injectable()
export class ClientesService {
  public listado = [];

  constructor(private http: HttpClient) {}
  
  //private baseListUrl: string = "http://127.0.0.1:49196/";
  private baseListUrl: string = "http://23.253.57.17:49196/";

  getAll() {
    return this.http.get<Cliente[]>(this.baseListUrl.concat("clientes"))    
  }

  getById(id): Observable<any> {
    return this.http.post<any>(this.baseListUrl.concat("clientes/getById"), {
      "idCliente" : id
    }, httpOptions)
    .pipe(
      catchError(this.handleError('getCliente'))
    );
  }

  insertCliente(cliente){
    this.http.post<any>(this.baseListUrl.concat("clientes/nuevoCliente"), JSON.stringify({
      "nombreCliente": cliente.nombreCliente,
      "idZonaCliente": cliente.idZonaCliente,
      "nitOcc": cliente.nitOcc,
      "direccionCliente": cliente.direccionCliente,
      "correoCliente": cliente.correoCliente,  
      "telefonoCliente": cliente.telefonoCliente
    }), httpOptions).subscribe(
      res=>{

      });    
  }

  updateCliente(data, id) {  
    this.http.post<any>(this.baseListUrl.concat("clientes/updateCliente"), JSON.stringify({
      "nombreCliente": data.nombreCliente,
      "correoCliente": data.correo,
      "direccionCliente": data.direccion,
      "telefonoCliente": data.telefono,
      "idZonaCliente": data.id_zona,
      "prospecto": data.prospecto,
      "idCliente": id
    }), httpOptions).subscribe(
      res => {
      }); 
  }

  getCliente(correo:string): Observable<Cliente> {
    return this.http.get<Cliente>(this.baseListUrl + 'vendedores' + correo)
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
  
//private baseListUrl: string = "http://127.0.0.1:49196/";
private baseListUrl: string = "http://23.253.57.17:49196/";

getAll(fechaIn, fechaFin): Observable<any> {
  return this.http.post<any[]>(this.baseListUrl.concat("visitasFull"), {
    "fechaIn": fechaIn,
    "fechaFin": fechaFin
  }, httpOptions)    
  .pipe(
    catchError(this.handleError('getPedidos'))
  );
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

  constructor(private http: HttpClient) {}
  
  //private baseListUrl: string = "http://127.0.0.1:49196/";
  private baseListUrl: string = "http://23.253.57.17:49196/";

  getAll(fechaIn, fechaFin): Observable<any> {
    return this.http.post<any[]>(this.baseListUrl.concat("pedidosFull"), {
      "fechaIn": fechaIn,
      "fechaFin": fechaFin
    }, httpOptions)    
    .pipe(
      catchError(this.handleError('getPedidos'))
    );
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