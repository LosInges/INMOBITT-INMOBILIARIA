import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Agente } from '../interfaces/agente';
import { AgenteService } from '../services/agente.service';
import { EstadosService } from '../services/estados.service';
import { FotoService } from '../services/foto.service';
import { Inmobiliaria } from '../interfaces/inmobiliaria';
import { InmobiliariaService } from '../services/inmobiliaria.service';
import { Inmueble } from './../interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { MapsComponent } from '../maps/maps.component';
import { Notario } from '../interfaces/notario';
import { NotarioService } from 'src/app/services/notario.service';
import { ProyectosService } from './../services/proyectos.service';
import { RegistroAgenteComponent } from './registro-agente/registro-agente.component';
import { RegistroNotarioComponent } from './registro-notario/registro-notario.component';
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
  inmuebles: Inmueble;
  notario: string = this.activatedRoute.snapshot.paramMap.get('notario');
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
      lat: 0,
      lng: 0,
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private proyectoService: ProyectosService,
    private inmuebleService: InmuebleService,
    private alertConttroller: AlertController
  ) {}

  ngOnInit() {
    this.sessionService.get('correo')?.then((correo) => {
      console.log(correo);
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
    if (this.confirmPassword === this.inmobiliaria.password) {
      this.inmobiliariaService
        .postInmobiliaria(this.inmobiliaria)
        .subscribe((res) => console.log(res));
    }
    //}
  }

  eliminarPerfil() {
    if (this.confirmPassword === this.inmobiliaria.password) {
      this.agentes.forEach((agente) => {
        this.eliminarAgente(agente);
      });
      this.notarios.forEach((notario) => {
        this.eliminarNotario(notario);
      });
      this.proyectoService
        .getProyectosInmobiliaria(this.inmobiliaria.correo)
        .subscribe((proyectos) => {
          proyectos.forEach((proyecto) => {
            this.proyectoService
              .deleteProyecto(proyecto)
              .subscribe((val) => console.log(val));
          });
        });
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
      cssClass: 'modalRegistrar',
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.consultarAgentes();
      }
    });
    modal.present();
  }

  async registroNotario() {
    const modal = await this.modalController.create({
      component: RegistroNotarioComponent,
      componentProps: { api: this.api, inmobiliaria: this.inmobiliaria.correo },
      cssClass: 'modalRegistrar',
    });
    modal.onDidDismiss().then((res) => {
      if (res.data) {
        this.consultarNotarios();
      }
    });
    modal.present();
  }

  eliminarNotario(notario: Notario) {
    this.notarioService.getProyectos(notario.rfc).subscribe((proyectos) => {
      proyectos.forEach((proyecto) => {
        this.notarioService
          .getInmueblesProyectoNotario(
            notario.rfc,
            this.inmobiliaria.correo,
            proyecto.nombre
          )
          .subscribe((inmuebles) => {
            inmuebles.forEach((inmueble) => {
              this.eliminarInmueble(inmueble);
            });
          });
        this.eliminarNotarioProyecto(notario.rfc, proyecto.nombre);
      });
    });
    this.notarioService
      .deleteNotario(this.inmobiliaria.correo, notario.rfc)
      .subscribe((res) => {
        if (res.results) {
          this.consultarNotarios();
        } else {
          console.log(res);
        }
      });
  }

  eliminarInmueble(inmueble: Inmueble) {
    this.inmuebleService
      .getClientesInmueble(
        inmueble.inmobiliaria,
        inmueble.proyecto,
        inmueble.titulo
      )
      .subscribe((clientes) => {
        clientes.forEach((cliente) => {
          inmueble.cliente = cliente.cliente;
          this.inmuebleService.deleteInmuebleCliente(inmueble);
        });
        this.inmuebleService
          .getFotos(inmueble.inmobiliaria, inmueble.proyecto, inmueble.titulo)
          .subscribe((imagenes) => {
            imagenes.forEach((imagen) =>
              this.inmuebleService.deleteImagen(imagen).subscribe(() => {})
            );
          });
        this.inmuebleService.deleteInmueble(inmueble).subscribe(() => {});
      });
  }

  eliminarNotarioProyecto(rfc: string, proyecto: string) {
    this.proyectoService
      .deleteNotarioProyecto({
        inmobiliaria: this.inmobiliaria.correo,
        nombre: proyecto,
        notario: rfc,
      })
      .subscribe((respuesta) => {
        console.log(respuesta);
      });
  }

  consultarInmuebleDelNotario() {
    this.notarioService
      .getInmueblesNotario(this.notario)
      .subscribe((inmuebles) => {
        inmuebles.forEach((inmueble) => {
          this.inmuebles = inmueble;
          console.log(inmueble);
        });
      });
  }

  consultarAgentes() {
    this.agenteService
      .getAgentes(this.inmobiliaria.correo)
      .subscribe((agentes) => {
        this.agentes = agentes;
      });
  }

  consultarNotarios() {
    this.notarioService
      .getNotarios(this.inmobiliaria.correo)
      .subscribe((notarios) => {
        this.notarios = notarios;
      });
  }

  eliminarAgenteProyecto(rfc: string, proyecto: string) {
    this.proyectoService
      .deleteAgenteProyecto({
        inmobiliaria: this.inmobiliaria.correo,
        nombre: proyecto,
        agente: rfc,
      })
      .subscribe((respuesta) => {
        console.log(respuesta);
      });
  }
  eliminarAgente(agente: Agente) {
    this.agenteService.getProyectos(agente.rfc).subscribe((proyectos) => {
      proyectos.forEach((proyecto) => {
        this.agenteService
          .getInmueblesProyectoAgente(
            agente.rfc,
            this.inmobiliaria.correo,
            proyecto.nombre
          )
          .subscribe((inmuebles) => {
            inmuebles.forEach((inmueble) => {
              this.eliminarInmueble(inmueble);
            });
          });
        this.eliminarAgenteProyecto(agente.rfc, proyecto.nombre);
      });
    });
    this.agenteService
      .deleteAgente(this.inmobiliaria.correo, agente.rfc)
      .subscribe((res) => {
        if (res.results) {
          this.consultarAgentes();
        } else {
          console.log(res);
        }
      });
  }

  async verDireccion() {
    const modal = await this.modalController.create({
      component: MapsComponent,
      componentProps: { position: this.inmobiliaria.direccion },
      cssClass: 'modalGeneral',
    });

    modal.present();
  }
  async guardarDireccion() {
    const modal = await this.modalController.create({
      component: MapsComponent,
      componentProps: { position: this.inmobiliaria.direccion },
      cssClass: 'modalGeneral',
    });

    modal.onDidDismiss().then((res) => {
      if (res.data?.pos) {
        this.inmobiliaria.direccion = res.data.pos;
      }
    });
    modal.present();
  }
}
