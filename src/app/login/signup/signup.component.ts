import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { EstadosService } from 'src/app/services/estados.service';
import { Inmobiliaria } from 'src/app/interfaces/inmobiliaria';
import { InmobiliariaService } from 'src/app/services/inmobiliaria.service';
import { LoginService } from 'src/app/services/login.service';
import { MapsComponent } from 'src/app/maps/maps.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  inmobiliaria: Inmobiliaria = {
    correo: '',
    password: '',
    nombre: '',
    estado: '',
    foto: '',
    direccion: {
      lat: 0,
      lng: 0,
    },
    sedes: [],
  };
  confirmPassword = '';

  estados = this.estadosService.getEstados();

  constructor(
    private estadosService: EstadosService,
    private inmobiliariaService: InmobiliariaService,
    private alertCtrl: AlertController,
    private modalController: ModalController,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    console.log(this.estados);
  }

  onSubmit() {
    if (this.validaciones()) {
      this.loginService
        .solicitarRegistro(this.inmobiliaria.correo)
        .subscribe((solicitud) => {
          if (solicitud.permiso) {
            console.log(this.inmobiliaria);

            this.inmobiliariaService
              .postInmobiliaria(this.inmobiliaria)
              .subscribe((res) => {
                if (res.results) {
                  this.mostrarAlerta(
                    'Completado',
                    'Creación',
                    'Inmobiliaria creada exitosamente.'
                  );
                  this.modalController.dismiss();
                } else {
                  console.log(res);
                  this.mostrarAlerta(
                    'Error',
                    '',
                    'Inmobiliaria no creada, intente de nuevo.'
                  );
                }
              });
          } else {
            this.mostrarAlerta(
              'Error:',
              'Correo ya registrado',
              'Favor de introducir otro correo.'
            );
          }
        });
    }
  }

  validaciones(): boolean {
    console.log(this.inmobiliaria);

    if (
      this.inmobiliaria.correo.trim().length <= 0 ||
      this.inmobiliaria.estado.trim().length <= 0 ||
      this.inmobiliaria.nombre.trim().length <= 0 ||
      this.inmobiliaria.password.trim().length <= 0
    ) {
      this.mostrarAlerta(
        'Error',
        'Campos vacios',
        'No deje espacios en blanco.'
      );
      return false;
    }

    if (!this.inmobiliaria.correo.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      this.mostrarAlerta('Error:', 'Revise el formato del correo', 'por favor');
      return false;
    }
    if (!this.inmobiliaria.nombre.match(/^[_a-zA-Z ]+$/)) {
      this.mostrarAlerta('Error:', 'Revise del campo nombre', 'por favor');
      return false;
    }
    if (this.confirmPassword !== this.inmobiliaria.password) {
      this.mostrarAlerta(
        'Error:',
        'Confirmación de clave incorrecta',
        '¿Es correcta o esta vacia?'
      );
      return false;
    }
    console.log('TODO OK EN VALIDACIONES');
    return true;
  }

  cerrar() {
    this.modalController.dismiss();
  }

  async mostrarAlerta(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
  }

  async guardarDireccion() {
    const modal = await this.modalController.create({
      component: MapsComponent,
      componentProps: { position: this.inmobiliaria.direccion },
      cssClass: 'modalGeneral',
    });

    modal.onDidDismiss().then((res) => {
      if (res.data.pos) {
        this.inmobiliaria.direccion = res.data.pos;
      }
    });
    modal.present();
  }
}
