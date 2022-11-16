import { Component, OnInit } from '@angular/core';

import { Agente } from '../interfaces/agente';
import { AgenteService } from '../services/agente.service';
import { EstadosService } from '../services/estados.service';
import { FotoService } from '../services/foto.service';
import { Inmobiliaria } from '../interfaces/inmobiliaria';
import { InmobiliariaService } from '../services/inmobiliaria.service';
import { ModalController } from '@ionic/angular';
import { Notario } from '../interfaces/notario';
import { NotarioService } from '../services/notario.service';
import { RegistroAgenteComponent } from './registro-agente/registro-agente.component';
import { RegistroNotarioComponent } from './registro-notario/registro-notario.component';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  agentes: Agente[] = [];
  notarios: Notario[] = [];

  api = environment.api;
  confirmPassword = '';
  estados = this.estadosService.getEstados();

  listaVisible = 'Agentes';

  inmobiliaria: Inmobiliaria = {
    correo: '',
    password: '',
    nombre: '',
    foto: '',
    estado: '',
    direccion: {
      calle: '',
      codigopostal: '',
      colonia: '',
      numeroexterior: '',
      numerointerior: '',
      estado: '',
    },
    sedes: [],
  };

  constructor(
    private estadosService: EstadosService,
    private sessionService: SessionService,
    private inmobiliariaService: InmobiliariaService,
    private fotoService: FotoService,
    private agenteService: AgenteService,
    private notarioService: NotarioService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.sessionService.get('correo')?.then((correo) => {
    console.log(correo)
      if (correo) {
        this.inmobiliariaService
          .getInmobiliaria(correo)
          .subscribe((inmobiliaria) => {
            this.inmobiliaria = inmobiliaria;
            this.consultarAgentes();
            this.consultarNotarios();
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
    if (this.confirmPassword === this.inmobiliaria.password) {
      this.inmobiliariaService
        .postInmobiliaria(this.inmobiliaria)
        .subscribe((res) => console.log(res));
    }
    //}
  }

  eliminarPerfil() {
    if (this.confirmPassword === this.inmobiliaria.password) {
      this.inmobiliariaService
        .deleteInmobiliaria(this.inmobiliaria.correo)
        .subscribe((res) => {
          if (res.results) {
            this.sessionService.clear().then(() => this.router.navigate(['']));
          } else {
            console.log(res);
          }
        });
    }
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
          .subscribe((res) => (this.inmobiliaria.foto = res.miniatura));
      };
      fetch(photo.webPath).then((v) =>
        v.blob().then((imagen) => reader.readAsArrayBuffer(imagen))
      );
    });
  }

  async registroAgente() {
    const modal = await this.modalController.create({
      component: RegistroAgenteComponent,
      componentProps: {
        inmobiliaria: this.inmobiliaria.correo,
        estados: this.estados,
        api: this.api,
      },
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.consultarAgentes();
      }
    });
    modal.present();
  }

  eliminarAgente(rfc: string) {
    this.agenteService
      .deleteAgente(this.inmobiliaria.correo, rfc)
      .subscribe((res) => {
        if (res.results) {
          this.consultarAgentes();
        } else {
          console.log(res);
        }
      });
  }

  async registroNotario() {
    const modal = await this.modalController.create({
      component: RegistroNotarioComponent,
      componentProps: { api: this.api, inmobiliaria: this.inmobiliaria.correo },
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.consultarNotarios();
      }
    });
    modal.present();
  }

  eliminarNotario(rfc: string) {
    this.notarioService
      .deleteNotario(this.inmobiliaria.correo, rfc)
      .subscribe((res) => {
        if (res.results) {
          this.consultarNotarios();
        } else {
          console.log(res);
        }
      });
  }

  private consultarAgentes() {
    this.agenteService
      .getAgentes(this.inmobiliaria.correo)
      .subscribe((agentes) => {
        this.agentes = agentes;
        console.log(this.agentes);
      });
  }

  private consultarNotarios() {
    this.notarioService
      .getNotarios(this.inmobiliaria.correo)
      .subscribe((notarios) => {
        this.notarios = notarios;
        console.log(this.notarios);
      });
  }
}
