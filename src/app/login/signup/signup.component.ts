import { Component, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { EstadosService } from 'src/app/services/estados.service';
import { Inmobiliaria } from 'src/app/interfaces/inmobiliaria';
import { InmobiliariaService } from 'src/app/services/inmobiliaria.service';
import { ModalController } from '@ionic/angular';
import { MapsComponent } from 'src/app/maps/maps.component';
import { LoginService } from 'src/app/services/login.service';

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
    if (
      this.inmobiliaria.correo.trim() !== '' &&
      this.inmobiliaria.nombre.trim() !== '' &&
      this.inmobiliaria.password.trim() !== '' &&
      this.confirmPassword.trim() !== ''
    ) {
      if (this.confirmPassword === this.inmobiliaria.password) {
        this.loginService
          .solicitarRegistro(this.inmobiliaria.correo)
          .subscribe((solicitud) => {
            if (solicitud.permiso) {
              this.inmobiliariaService
                .postInmobiliaria(this.inmobiliaria)
                .subscribe((res) => {
                  if (res.results) {
                    this.modalController.dismiss();
                  } else {
                    console.log(res);
                    this.mostrarAlerta(
                      'Completado',
                      'Creación',
                      'Inmobiliaria creada exitosamente.'
                    );
                    this.cerrar();
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
      } else {
        this.mostrarAlerta(
          'Error:',
          'Confirmación de clave incorrecta',
          '¿es correcta o esta vacia?'
        );
      }
    } else {
      this.mostrarAlerta(
        'Error',
        'Campos vacios',
        'No deje espacios en blanco.'
      );
    }
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
