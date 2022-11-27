import { AlertController, ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

import { Agente } from 'src/app/interfaces/agente';
import { AgenteService } from 'src/app/services/agente.service';
import { Estado } from 'src/app/interfaces/estado';
import { FotoService } from 'src/app/services/foto.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-agente',
  templateUrl: './registro-agente.component.html',
  styleUrls: ['./registro-agente.component.scss'],
})
export class RegistroAgenteComponent implements OnInit {
  @Input() inmobiliaria = '';
  @Input() estados: Estado[];
  @Input() api: string;

  apellidoPat = '';
  apellidoMat = '';
  confirmPassword = '';

  agente: Agente = {
    rfc: '',
    inmobiliaria: '',
    nombre: '',
    correo: '',
    password: '',
    apellido: '',
    telefono: '',
    foto: '',
  };

  constructor(
    private agenteService: AgenteService,
    private fotoService: FotoService,
    private modalController: ModalController,
    private loginService: LoginService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.agente.inmobiliaria = this.inmobiliaria;
  }

  onSubmit() {
    this.agente.apellido = this.apellidoPat + ' ' + this.apellidoMat;
    if (
      this.agente.nombre.trim().length > 0 &&
      this.agente.password.trim().length > 0 &&
      this.agente.telefono.trim().length > 0 &&
      this.agente.rfc.trim().length > 0 &&
      this.agente.apellido.trim().length > 0
    ) {
      if (this.confirmPassword === this.agente.password) {
        if (
          this.agente.correo.match(
            '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@' +
              '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
          )
        ) {
          this.loginService
            .solicitarRegistro(this.agente.rfc)
            .subscribe((solicitud) => {
              if (solicitud.permiso) {
                this.agenteService.postAgente(this.agente).subscribe((res) => {
                  if (res.results) {
                    this.mostrarAlerta(
                      'Completado',
                      'Creación',
                      'Agente registrado exitosamente.'
                    );
                    this.modalController.dismiss({ registrado: true });
                  } else {
                    console.log(res);
                    this.mostrarAlerta(
                      'Error',
                      'Creación',
                      'Agente no registrado, intente de nuevo.'
                    );
                  }
                });
              } else {
                this.mostrarAlerta(
                  'Error:',
                  'RFC ya registrado',
                  'Favor de introducir otro RFC.'
                );
              }
            });
        } else {
          this.mostrarAlerta(
            'Error:',
            'Formato correo inválido',
            'Favor de introducir un correo válido.'
          );
        }
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

  async mostrarAlerta(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK'],
    });
    return alert.present();
  }
  cerrar() {
    this.modalController.dismiss(this.agente);
  }

  tomarFotografia() {
    this.fotoService.tomarFoto().then((photo) => {
      const reader = new FileReader();
      const datos = new FormData();
      reader.onload = () => {
        const imgBlob = new Blob([reader.result], {
          type: `image/${photo.format}`,
        });
        datos.append('img', imgBlob, `imagen.${photo.format}`);
        this.fotoService
          .subirImgMiniatura(datos)
          .subscribe((res) => (this.agente.foto = res.path));
      };
      fetch(photo.webPath).then((v) =>
        v.blob().then((imagen) => reader.readAsArrayBuffer(imagen))
      );
    });
  }
}
