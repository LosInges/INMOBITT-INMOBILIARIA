import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  constructor() {}

  getServicios(): string[] {
    return ['Agua', 'Luz', 'Gas', 'Internet', 'Teléfono', 'Cable', 'Otros'];
  }
}
