import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FotoService } from '../services/foto.service';
import { Inmobiliaria } from '../interfaces/inmobiliaria';
import { EstadosService } from '../services/estados.service';
import { InmobiliariaService } from '../services/inmobiliaria.service';
import { SessionService } from '../services/session.service';
import { ModalController } from '@ionic/angular';
import { RegistroAgenteComponent } from './registro-agente/registro-agente.component';
import { AgenteService } from '../services/agente.service';
import { RegistroNotarioComponent } from './registro-notario/registro-notario.component';
import { Agente } from '../interfaces/agente';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  agentes: Agente[] = [];

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
    notarios: [],
  };

  constructor(
    private estadosService: EstadosService,
    private sessionService: SessionService,
    private inmobiliariaService: InmobiliariaService,
    private fotoService: FotoService,
    private agenteService: AgenteService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.sessionService.get('correo')?.then((correo) => {
      if (correo) {
        this.inmobiliariaService
          .getInmobiliaria(correo)
          .subscribe((inmobiliaria) => {
            this.inmobiliaria = inmobiliaria;
            this.consultarAgentes();
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
      componentProps: { api: this.api },
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        if (this.inmobiliaria.notarios) {
          this.inmobiliaria.notarios.push(res.data);
        } else {
          this.inmobiliaria.notarios = [res.data];
        }
        this.inmobiliariaService
          .postInmobiliaria(this.inmobiliaria)
          .subscribe((result) => {
            console.log(result);
          });
      }
    });
    modal.present();
  }

  eliminarNotario(correo: string) {
    this.inmobiliaria.notarios = this.inmobiliaria.notarios.filter(
      (notario) => notario.correo !== correo
    );
    this.inmobiliariaService.postInmobiliaria(this.inmobiliaria).subscribe();
  }

  private consultarAgentes() {
    this.agenteService
      .getAgentes(this.inmobiliaria.correo)
      .subscribe((agentes) => {
        this.agentes = agentes;
      });
  }
}
