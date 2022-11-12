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

  postInmueble(inmueble: Inmueble): Observable<any> {
    console.log(inmueble);
    return this.httpClient.post<any>(`${environment.api}/inmueble`, inmueble);
  }
}
