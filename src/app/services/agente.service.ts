import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agente } from '../interfaces/agente';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inmueble } from '../interfaces/inmueble';

@Injectable({
  providedIn: 'root',
})
export class AgenteService {
  constructor(private httpClient: HttpClient) {}

  postAgente(agente: Agente): Observable<any> {
    return this.httpClient.post<any>(`${environment.api}/agente`, agente);
  }

  getAgente(inmobiliaria: string, rfc: string): Observable<Agente> {
    return this.httpClient.get<Agente>(
      `${environment.api}/agente/${inmobiliaria}/${rfc}`
    );
  }

  getAgentes(inmobiliaria: string): Observable<Agente[]> {
    return this.httpClient.get<Agente[]>(
      `${environment.api}/agentes/${inmobiliaria}`
    );
  }

  getInmueblesAgente(agente: string): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/agente/${agente}`
    );
  }

  deleteAgente(inmobiliaria: string, rfc: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/agente`, {
      body: { rfc, inmobiliaria },
    });
  }
}
