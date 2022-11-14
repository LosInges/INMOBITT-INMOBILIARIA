/* eslint-disable @typescript-eslint/naming-convention */

import { Component, OnInit } from '@angular/core';

import { Estado } from 'src/app/interfaces/estado';
import { EstadosService } from 'src/app/services/estados.service';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { ModalController } from '@ionic/angular';
import { Servicio } from 'src/app/interfaces/servicio';
import { ServicioComponent } from '../servicio/servicio.component';
import { ServiciosService } from 'src/app/services/servicios.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  estados: Estado[] = this.estadosService.getEstados();
  correo = '';
  inmobiliaria = '';
  servicios: Servicio[] = [];

  inmueble: Inmueble = {
    titulo: '',
    estado: '',
    cuartos: 0,
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
    metros_cuadrados: '',
    notario: '',
    pisos: 0,
    precio_renta: 0,
    precio_venta: 0,
    servicios: [],
    agente: '',
    borrado: false,
    visible: true,
  };

  constructor(
    private inmuebleService: InmuebleService,
    private sessionService: SessionService,
    private estadosService: EstadosService,
    private serviciosService: ServiciosService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.sessionService.get('correo')?.then((correo) => {
      this.correo = correo;
    });

    this.serviciosService.getServicios().subscribe((servicios) => {
      this.servicios = servicios;
    });
  }

  registrarInmueble() {
    // this.inmuebleRegistroService.postInmueble(this.inmueble).subscribe((val)=>{
    //   console.log(val)
    // });
    console.log(this.inmueble);
  }

  cerrar() {

  }

  async nuevoServicio() {
    const modal = await this.modalController.create({
      component: ServicioComponent,
      componentProps: { servicios: this.servicios },
    });
    modal.onDidDismiss().then(() => {
      this.serviciosService.getServicios().subscribe((servicios) => {
        this.servicios = servicios;
      });
    });
    return await modal.present();
  }
}
