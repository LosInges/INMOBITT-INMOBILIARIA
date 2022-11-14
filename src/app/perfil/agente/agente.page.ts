import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Agente } from 'src/app/interfaces/agente';
import { AgenteService } from 'src/app/services/agente.service';
import { FotoService } from 'src/app/services/foto.service';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agente',
  templateUrl: './agente.page.html',
  styleUrls: ['./agente.page.scss'],
})
export class AgentePage implements OnInit {
  apellidoPat = '';
  apellidoMat = '';
  api = environment.api;
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
  confirmPassword = '';
  mensaje = '';

  constructor(
    private sessionService: SessionService,
    private agenteService: AgenteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fotoService: FotoService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.sessionService.get('correo').then((inmobiliaria) => {
      if (inmobiliaria) {
        this.activatedRoute.params.subscribe((params) => {
          if (params.rfc) {
            this.agenteService
              .getAgente(inmobiliaria, params.rfc)
              .subscribe((agente) => {
                this.agente = agente;
                console.log(agente);
                this.apellidoPat = agente.apellido.split(' ')[0];
                this.apellidoMat = agente.apellido.split(' ')[1];
              });
          }
        });
      }
    });
  }

  actualizarPerfil() {
    // if (
    //   this.agente.rfc.trim() !== "" &&
    //   this.agente.inmobiliaria.trim() !== "" &&
    //   this.agente.nombre.trim() !== "" &&
    //   this.agente.correo.trim() !== "" &&
    //   this.agente.password.trim() !== "" &&
    //   this.agente.apellido.trim() !== "" &&
    //   this.agente.foto.trim() !== "" &&
    //   this.agente.telefono.trim() !== "" &&
    //   this.confirmPassword.trim() !== ""
    // )
    //{
    if (this.confirmPassword === this.agente.password) {
      this.agente.apellido = this.apellidoPat + ' ' + this.apellidoMat;
      this.agenteService
        .postAgente(this.agente)
        .subscribe((res) => console.log(res));
      this.mensaje = 'Actualización EXITOSA';
    } else {
      this.mensaje = 'Ingrese Todos los valores';
    }
    this.presentAlert();
    //}
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.mensaje,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'NO',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'OK',
          cssClass: 'alert-button-confirm',
        },
      ],
    });

    await alert.present();
  }

  eliminarPerfil() {
    if (this.confirmPassword === this.agente.password) {
      this.agenteService
        .deleteAgente(this.agente.inmobiliaria, this.agente.rfc)
        .subscribe((res) => {
          if (res.results) {
            this.router.navigate(['perfil']);
          } else {
            console.log(res);
          }
        });
    }
  }

  tomarFotografia() {
    this.fotoService.tomarFoto().then((photo) => {
      // this.fotoService.subirMiniatura(photo.webPath).subscribe((data) => {
      //   console.log(data);
      // });
      console.log(photo);
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
