import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inmueble } from '../interfaces/inmueble';
import { Notario } from '../interfaces/notario';

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

  getInmueblesNotario(notario: string): Observable<Inmueble[]> {
    return this.httpClient.get<Inmueble[]>(
      `${environment.api}/inmuebles/notario/${notario}`
    );
  }

  deleteNotario(inmobiliaria: string, rfc: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/notario`, {
      body: { rfc, inmobiliaria },
    });
  }
}
