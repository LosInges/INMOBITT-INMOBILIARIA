import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inmueble } from '../interfaces/inmueble';
import { Proyecto } from '../interfaces/proyecto';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  constructor(private httpClient: HttpClient) {}

  getProyectosInmobiliaria(inmobiliaria: string): Observable<Proyecto[]> {
    return this.httpClient.get<Proyecto[]>(
      `${environment.api}/proyectos/inmobiliaria/${inmobiliaria}`
    );
  }

  getProyectoInmobiliaria(
    inmobiliaria: string,
    proyecto: string
  ): Observable<Proyecto> {
    return this.httpClient.get<Proyecto>(
      `${environment.api}/proyecto/inmobiliaria/${inmobiliaria}/${proyecto}`
    );
  }

  getAgentesProyecto(
    proyecto: string,
    inmobiliaria: string
  ): Observable<Agente[]> {
    return this.httpClient.get<Agente[]>(
      `${environment.api}/agentes/proyecto/${proyecto}/${inmobiliaria}`
    );
  }

  getNotariosProyecto(
    proyecto: string,
    inmobiliaria: string
  ): Observable<Notario[]> {
    return this.httpClient.get<Notario[]>(
      `${environment.api}/notarios/proyecto/${proyecto}/${inmobiliaria}`
    );
  }

  postProyecto(proyecto: Proyecto): Observable<any> {
    return this.httpClient.post<any>(`${environment.api}/proyecto`, proyecto);
  }

  postNotarioProyecto(notario: Notario): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.api}/notario/proyecto`,
      notario
    );
  }

  postAgenteProyecto(agente: Agente): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.api}/agente/proyecto`,
      agente
    );
  }

  deleteProyecto(proyecto: Proyecto): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/proyecto`, {
      body: proyecto,
    });
  }

  deleteNotarioProyecto(notario: Notario): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/notario/proyecto`, {
      body: notario,
    });
  }

  deleteAgenteProyecto(agente: Agente): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/agente/proyecto`, {
      body: agente,
    });
  }
}

export interface Agente {
  agente: string;
  inmobiliaria: string;
  nombre: string;
}

export interface Notario {
  notario: string;
  inmobiliaria: string;
  nombre: string;
}
