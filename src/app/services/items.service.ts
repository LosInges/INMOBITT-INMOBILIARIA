import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../interfaces/item';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private httpClient: HttpClient) {}

  getItems(paquete: string): Observable<Item[]> {
    return this.httpClient.get<Item[]>(`${environment.api}/items/${paquete}`);
  }

  postItem(item: Item): Observable<any> {
    return this.httpClient.post<any>(`${environment.api}/item`, item, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteItem(id: string, id_item: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/item`, {
      body: { id, id_item },
    });
  }

  deleteUltimoItem(idPaquete: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.api}/ultimoItem`, {
      body: { id: idPaquete },
    });
  }
}
