import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Agente } from 'src/app/interfaces/agente';
import { AgenteService } from 'src/app/services/agente.service';
import { AgentesNotariosComponent } from './agentes-notarios/agentes-notarios.component';
import { AltaComponent } from './alta/alta.component';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { ModalController } from '@ionic/angular';
import { Notario } from 'src/app/interfaces/notario';
import { NotarioService } from 'src/app/services/notario.service';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inmuebles',
  templateUrl: './inmuebles.page.html',
  styleUrls: ['./inmuebles.page.scss'],
})
export class InmueblesPage implements OnInit {
  proyecto: string = this.activatedRoute.snapshot.paramMap.get('proyecto');
  inmobiliaria: string;
  estado: string;
  api = environment.api;
  agentesProyecto: Agente[];
  notariosProyecto: Notario[];
  agentes: Agente[];
  notarios: Notario[];
  servicios = this.serviciosService.getServicios();
  inmuebles: Inmueble[] = [];

  constructor(
    private proyectosService: ProyectosService,
    private sessionService: SessionService,
    private agenteService: AgenteService,
    private notarioService: NotarioService,
    private inmuebleService: InmuebleService,
    private serviciosService: ServiciosService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
  private router: Router
  ) {}

  ngOnInit() {
    this.sessionService.get('correo').then((inmobiliaria) => {
      this.inmobiliaria = inmobiliaria;
      this.proyectosService
        .getProyectoInmobiliaria(inmobiliaria, this.proyecto)
        .subscribe((proyecto) => {
          this.estado = proyecto.ciudad;
        });
      this.agenteService.getAgentes(inmobiliaria).subscribe((agentes) => {
        this.agentes = agentes;
      });
      this.notarioService.getNotarios(inmobiliaria).subscribe((notarios) => {
        this.notarios = notarios;
      });
      this.consultarAgentes();
      this.consultarNotarios();
      this.consultarInmuebles();
    });
  }

  async agregarInmueble() {
    const modal = await this.modalController.create({
      component: AltaComponent,
      componentProps: {
        proyecto: this.proyecto,
        inmobiliaria: this.inmobiliaria,
        estado: this.estado,
        agentes: this.agentesProyecto,
        notarios: this.notariosProyecto,
        servicios: this.servicios,
      },
      cssClass: 'modalGeneral',
    });
    modal.onDidDismiss().then((datos) => {
      if (datos.data?.ok) {
        this.consultarInmuebles();
      }
    });
    return await modal.present();
  }

  async gestionarNotariosAgentes() {
    const modal = await this.modalController.create({
      component: AgentesNotariosComponent,
      componentProps: {
        inmobiliaria: this.inmobiliaria,
        proyecto: this.proyecto,
        agentes: this.agentes,
        notarios: this.notarios,
        agentesProyecto: this.agentesProyecto,
        notariosProyecto: this.notariosProyecto,
        api: this.api,
      },
      cssClass: 'modalGeneral',
    });
    modal.onDidDismiss().then((datos) => {
      if (datos.data?.ok) {
        this.consultarAgentes();
        this.consultarNotarios();
        if (datos.data?.inmueble) {
          this.consultarInmuebles();
        }
      }
    });
    return await modal.present();
  }

  consultarInmuebles() {
    this.inmuebleService
      .getInmueblesProyecto(this.proyecto, this.inmobiliaria)
      .subscribe((inmuebles) => {
        this.inmuebles = inmuebles;
      });
  }

  consultarAgentes() {
    this.agentesProyecto = [];
    this.proyectosService
      .getAgentesProyecto(this.proyecto, this.inmobiliaria)
      .subscribe((agentes) => {
        agentes.forEach((a) => {
          this.agenteService
            .getAgente(this.inmobiliaria, a.agente)
            .subscribe((agente) => {
              this.agentesProyecto.push(agente);
            });
        });
      });
  }
  consultarNotarios() {
    this.notariosProyecto = [];
    this.proyectosService
      .getNotariosProyecto(this.proyecto, this.inmobiliaria)
      .subscribe((notarios) => {
        notarios.forEach((n) => {
          this.notarioService
            .getNotario(this.inmobiliaria, n.notario)
            .subscribe((notario) => {
              this.notariosProyecto.push(notario);
            });
        });
      });
  }
  verInmueble(titulo: string){
    this.router.navigate(['./','inmueble',titulo],{relativeTo:this.activatedRoute})
   
  }
}
