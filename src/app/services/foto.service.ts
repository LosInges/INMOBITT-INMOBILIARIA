import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  constructor(private httpClient: HttpClient) {}

  async tomarFoto() {
    // Take a photo
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
  }

  subirMiniatura(datos: FormData): Observable<Fotografia> {
    return this.httpClient.post<Fotografia>(`${environment.api}/miniatura`, datos);
  }
}

export interface Fotografia{
  ok: boolean;
  path: string;
  err?: object;
}
