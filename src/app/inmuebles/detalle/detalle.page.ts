import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { Direccion } from 'src/app/interfaces/direccion';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { MapsComponent } from 'src/app/maps/maps.component';
import { SessionService } from 'src/app/services/session.service';

/* eslint-disable @typescript-eslint/naming-convention */

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  correo = '';
  inmueble: Inmueble = {
    inmobiliaria: '',
    proyecto: '',
    titulo: '',
    estado: '',
    cuartos: 0,
    descripcion: '',
    direccion: {
     lat:0,
     lng:0
    },
    notario: '',
    foto: '',
    metros_cuadrados: 0,
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
    private alertConttroller: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.sessionService.get('correo')?.then((correo) => {
      this.correo = correo;
    });
  }

  actualizarInmueble() {
    this.inmuebleService.postInmueble(this.inmueble).subscribe((res) => {
      this.alertConttroller
        .create({
          header: 'ÉXITOSAME',
          message: 'Se ACTUALIZÓ el INMUEBLE',
          buttons: ['CERRAR'],
        })
        .then((alert) => {
          alert.present();
        });
    });
  }
  async verPosicion(position: Direccion) {
    const modal = await this.modalController.create({
      component: MapsComponent,
      componentProps: { position },
      cssClass: 'modalGeneral'
    });
  }
}
