import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Proyecto } from '../interfaces/proyecto';
import { InmobiliariaService } from '../services/inmobiliaria.service';
import { ProyectosService } from '../services/proyectos.service';
import { SessionService } from '../services/session.service';
import { AltaComponent } from './alta/alta.component';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss'],
})
export class ProyectosPage implements OnInit {
  proyectos: Proyecto[] = [];
  estados: string[] = [];
  inmobiliaria: string;

  constructor(
    private sessionService: SessionService,
    private proyectosService: ProyectosService,
    private inmobiliariaService: InmobiliariaService,
    private modalController: ModalController,
    private router: Router,
    private activedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.sessionService.get('correo').then((inmobiliaria) => {
      this.inmobiliaria = inmobiliaria;
      this.inmobiliariaService
        .getInmobiliaria(inmobiliaria)
        .subscribe((datos) => {
          this.estados = datos.sedes;
          this.estados.push(datos.estado);
          this.estados.sort();
        });
      this.consultarProyectos();
    });
  }

  verProyecto(nombre: string) {
    this.router.navigate(['./', nombre, 'inmuebles'], {
      relativeTo: this.activedRoute,
    });
  }

  async registrarProyecto() {
    const modal = await this.modalController.create({
      component: AltaComponent,
      componentProps: {
        inmobiliaria: this.inmobiliaria,
        estados: this.estados,
      },
      cssClass: 'modalGeneral',
    });
    modal.onDidDismiss().then((datos) => {
      if (datos.data?.ok) {
        this.consultarProyectos();
      }
    });
    return modal.present();
  }
  eliminarProyecto(nombre: string) {}

  consultarProyectos() {
    this.proyectosService
      .getProyectosInmobiliaria(this.inmobiliaria)
      .subscribe((proyectos) => {
        this.proyectos = proyectos;
      });
  }
}
