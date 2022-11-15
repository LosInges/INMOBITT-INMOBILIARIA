import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inmueble } from '../interfaces/inmueble';

@Injectable({
  providedIn: 'root',
})
export class InmuebleService {
  constructor(private httpClient: HttpClient) {}

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
}
