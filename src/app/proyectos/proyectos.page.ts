import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { AltaComponent } from './alta/alta.component';
import { InmobiliariaService } from '../services/inmobiliaria.service';
import { Inmueble } from './../interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { Proyecto } from '../interfaces/proyecto';
import { ProyectosService } from '../services/proyectos.service';
import { SessionService } from '../services/session.service';

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
    private activedRoute: ActivatedRoute,
    private inmuebleService: InmuebleService,
    private alertConttroller: AlertController
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
        this.alertConttroller
          .create({
            header: 'ÉXITOSAME',
            message: 'Se registró el Proyecto',
            buttons: ['CERRAR'],
          })
          .then((a) => {
            a.present();
          });
        this.consultarProyectos();
      }
    });
    return modal.present();
  }

  eliminarInmueble(inmueble: Inmueble) {
    this.inmuebleService
      .getClientesInmueble(
        this.inmobiliaria,
        inmueble.proyecto,
        inmueble.titulo
      )
      .subscribe((clientes) => {
        
        clientes.forEach((cliente) => {
          inmueble.cliente = cliente.cliente;
          this.inmuebleService.deleteInmuebleCliente(inmueble).subscribe(()=>{});
        });
        this.inmuebleService.deleteInmueble(inmueble).subscribe((valor) => {});
      });
  }

  eliminarProyecto(proyecto: Proyecto) {
    this.proyectosService
      .getAgentesProyecto(proyecto.nombre, this.inmobiliaria)
      .subscribe((agentes) => {
        agentes.forEach((agente) => {
          this.proyectosService
            .deleteAgenteProyecto(agente)
            .subscribe((v) => console.log(v));
        });
        this.proyectosService
          .getNotariosProyecto(proyecto.nombre, this.inmobiliaria)
          .subscribe((notarios) => {
            notarios.forEach((notario) => {
              this.proyectosService
                .deleteNotarioProyecto(notario)
                .subscribe((v) => console.log(v));
            });
          });
        this.inmuebleService
          .getInmueblesProyecto(proyecto.nombre, this.inmobiliaria)
          .subscribe((inmuebles) => {
            inmuebles.forEach((inmueble) => {
              this.eliminarInmueble(inmueble);
            });
            this.proyectosService
              .deleteProyecto(proyecto)
              .subscribe((valor) => {
                if (valor.results) {
                  this.proyectos = this.proyectos.filter(
                    (proyectoIterable) => proyecto !== proyectoIterable
                  );
                } else {
                  console.log(valor);
                }
              });
          });
      });
  }

  consultarProyectos() {
    this.proyectosService
      .getProyectosInmobiliaria(this.inmobiliaria)
      .subscribe((proyectos) => {
        this.proyectos = proyectos;
      });
  }
}
