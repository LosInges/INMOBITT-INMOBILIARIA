/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Agente } from 'src/app/interfaces/agente';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { Notario } from 'src/app/interfaces/notario';
import { InmuebleService } from 'src/app/services/inmueble.service';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.scss'],
})
export class AltaComponent implements OnInit {
  @Input() proyecto: string;
  @Input() estado: string;
  @Input() inmobiliaria: string;
  @Input() agentes: Agente[] = [];
  @Input() notarios: Notario[] = [];
  @Input() servicios: string[] = [];

  inmueble: Inmueble = {
    inmobiliaria: '',
    proyecto: '',
    titulo: '',
    estado: '',
    cuartos: 1,
    descripcion: '',
    direccion: {
      calle: '',
      codigopostal: '',
      colonia: '',
      numeroexterior: '',
      numerointerior: '',
      estado: '',
    },
    foto: '',
    metros_cuadrados: 0,
    notario: '',
    pisos: 1,
    precio_renta: 0,
    precio_venta: 0,
    servicios: [],
    agente: '',
    borrado: false,
    visible: true,
  };

  constructor(
    private inmuebleService: InmuebleService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.inmueble.inmobiliaria = this.inmobiliaria;
    this.inmueble.proyecto = this.proyecto;
    this.inmueble.estado = this.estado;
  }

  registrarInmueble() {
    // this.inmuebleRegistroService.postInmueble(this.inmueble).subscribe((val)=>{
    //   console.log(val)
    // });
    console.log(this.inmueble);
  }

  cerrar() {
    this.modalController.dismiss();
  }
}
