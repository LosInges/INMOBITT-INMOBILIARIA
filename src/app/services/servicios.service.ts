import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Servicio } from '../interfaces/servicio';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  constructor(private httpClient: HttpClient) {}

  getServicios(): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(`${environment.api}/servicios`);
  }

  postServicio(servicio: Servicio): Observable<any> {
    return this.httpClient.post<any>(
      `${environment.api}/servicio`,
      servicio
    );
  }
}
