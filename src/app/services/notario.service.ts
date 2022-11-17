import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inmueble } from '../interfaces/inmueble';
import { Notario } from '../interfaces/notario';
import { Observable } from 'rxjs';
import { Proyecto } from '../interfaces/proyecto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotarioService {
  constructor(private httpClient: HttpClient) {}

  postNotario(notario: Notario): Observable<any> {
    return this.httpClient.post<any>(`${environment.api}/notario`, notario);
  }

  getNotarios(inmobiliaria: string): Observable<Notario[]> {
    return this.httpClient.get<Notario[]>(
      `${environment.api}/notarios/${inmobiliaria}`
    );
  }

  getNotario(inmobiliaria: string, rfc: string): Observable<Notario> {
    return this.httpClient.get<Notario>(
      `${environment.api}/notario/${inmobiliaria}/${rfc}`
    );
  }

  getProyectos(notario: string): Observable<Proyecto[]>{
    return this.httpClient.get<Proyecto[]>(
      `${environment.api}/proyectos/notario/${notario}`
    )
  }

  getInmueblesNotario(notario: string): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/notario/${notario}`
    );
  }

  getInmueblesProyectoNotario(notario: string, inmobiliaria:string, proyecto:string): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/notario/${notario}/${inmobiliaria}/${proyecto}`
    );
  }

  deleteNotario(inmobiliaria: string, rfc: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/notario`, {
      body: { rfc, inmobiliaria },
    });
  }
}
