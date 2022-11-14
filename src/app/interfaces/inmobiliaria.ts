import { Direccion } from './direccion';

export interface Inmobiliaria {
  correo: string;
  password: string;
  nombre: string;
  estado: string;
  direccion: Direccion;
  sedes: string[];
  foto: string;
}
