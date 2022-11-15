/* eslint-disable @typescript-eslint/naming-convention */
import { Direccion } from './direccion';

export interface Inmueble {
  inmobiliaria: string;
  proyecto: string;
  titulo: string;
  estado: string;
  foto: string;
  direccion: Direccion;
  precio_renta: number;
  precio_venta: number;
  cuartos: number;
  pisos: number;
  metros_cuadrados: number;
  descripcion: string;
  servicios: string[];
  notario: string;
  agente: string;
  visible: boolean;
  borrado: boolean;
  cliente?: string;
}
