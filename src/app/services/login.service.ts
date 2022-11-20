import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.api}/login`, {
      email,
      password,
    });
  }

  solicitarRegistro(correo: string): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.api}/solicitar/registro/${correo}`
    );
  }
}
