import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { inmueble } from '../interfaces/inmueble';


@Injectable({
    providedIn: 'root',
  })
  export class InmuebleRegistroService {
    constructor(private httpClient: HttpClient) {}
    
    postInmueble(InmuebleRegistro: inmueble): Observable<any> {
      console.log(InmuebleRegistro)
      return this.httpClient.post<any>(
        `${environment.api}/inmueble`,
        InmuebleRegistro
      );
    }
    
  }
  