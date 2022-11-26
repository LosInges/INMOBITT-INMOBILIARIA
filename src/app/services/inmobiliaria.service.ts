import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inmobiliaria } from '../interfaces/inmobiliaria';

@Injectable({
  providedIn: 'root',
})
export class InmobiliariaService {
  constructor(private httpClient: HttpClient) {}

  postInmobiliaria(inmobiliaria: Inmobiliaria): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.api}/inmobiliaria`,
      inmobiliaria
    );
  }

  getInmobiliaria(correo: string): Observable<Inmobiliaria> {
    return this.httpClient.get<Inmobiliaria>(
      `${environment.api}/inmobiliaria/${correo}`
    );
  }

  deleteInmobiliaria(correo: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/inmobiliaria`, {
      body: { correo },
    });
  }
}
