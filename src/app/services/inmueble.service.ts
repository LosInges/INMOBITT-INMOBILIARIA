import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inmueble } from '../interfaces/inmueble';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InmuebleService {
  constructor(private httpClient: HttpClient) {}

  getInmueble(inmobiliaria: string, proyecto: string, titulo: string): Observable<Inmueble>{
    return this.httpClient.get<Inmueble>(
      `${environment.api}/inmueble/${inmobiliaria}/${proyecto}/${titulo}`
    )
  }

  getClientesInmueble(inmobiliaria: string, proyecto:string, titulo:string):Observable<string[]>{
    return this.httpClient.get<string[]>(
      `${environment.api}/clientes/inmueble/${inmobiliaria}/${proyecto}/${titulo}`
    )
  }

  getInmueblesProyecto(
    proyecto: string,
    inmobiliaria: string
  ): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/proyecto/${proyecto}/${inmobiliaria}`
    );
  }

  getInmueblesNotario(
    notario: string,
    inmobiliaria: string,
    proyecto: string
  ): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/notario/${notario}/${inmobiliaria}/${proyecto}`
    );
  }

  getInmueblesAgente(
    agente: string,
    inmobiliaria: string,
    proyecto: string
  ): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/agente/${agente}/${inmobiliaria}/${proyecto}`
    );
  }

  postInmueble(inmueble: Inmueble): Observable<any> {
    console.log(inmueble);
    return this.httpClient.post<any>(`${environment.api}/inmueble`, inmueble);
  }

  deleteInmueble(inmueble:Inmueble): Observable<any>{
    return this.httpClient.delete<any>(`${environment.api}/inmueble`, {body: inmueble});
  }

  deleteInmuebleCliente(inmueble:Inmueble): Observable<any>{
    return this.httpClient.delete<any>(`${environment.api}/inmueble/cliente`, {body: inmueble})
  }
}
