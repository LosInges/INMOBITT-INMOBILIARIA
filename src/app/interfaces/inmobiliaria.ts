import { Direccion } from "./direccion";
import { Notario } from "./notario";

export interface Inmobiliaria {
    correo: string;
    password: string;
    nombre: string;
    estado: string;
    direccion: Direccion;
    notarios: Notario[];
    agentes: string[]; 
    foto: string; 
  }
  