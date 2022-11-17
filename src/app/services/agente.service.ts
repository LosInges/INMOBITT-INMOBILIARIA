import { Agente } from '../interfaces/agente';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inmueble } from '../interfaces/inmueble';
import { Observable } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto';
import { environment } from 'src/environments/environment';

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
  getProyectos(agente: string): Observable<Proyecto[]> {
    return this.httpClient.get<Proyecto[]>(
      `${environment.api}/proyectos/agente/${agente}`
    );
  }
  getInmueblesProyectoAgente(
    agente: string,
    inmobiliaria: string,
    proyecto: string
  ): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/agente/${agente}/${inmobiliaria}/${proyecto}`
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
