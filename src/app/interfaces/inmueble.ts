/* eslint-disable @typescript-eslint/naming-convention */
import { Direccion } from './direccion';

export interface Inmueble {
  titulo: string;
  estado: string;
  cuartos: number;
  descripcion: string;
  direccion: Direccion;
  foto: string;
  metros_cuadrados: string;
  notario: string;
  pisos: number;
  precio_renta: number;
  precio_venta: number;
  servicios: string[];
  agente: string;
  borrado: false;
  visible: true;
  cliente?: string;
}
