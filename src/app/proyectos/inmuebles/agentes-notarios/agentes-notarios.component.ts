import { Component, Input, OnInit } from '@angular/core';

import { Agente } from 'src/app/interfaces/agente';
import { AgenteService } from 'src/app/services/agente.service';
import { InmuebleService } from './../../../services/inmueble.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Notario } from 'src/app/interfaces/notario';
import { NotarioService } from './../../../services/notario.service';
import { Proyecto } from './../../../interfaces/proyecto';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { Inmueble } from 'src/app/interfaces/inmueble';

@Component({
  selector: 'app-agentes-notarios',
  templateUrl: './agentes-notarios.component.html',
  styleUrls: ['./agentes-notarios.component.scss'],
})
export class AgentesNotariosComponent implements OnInit {
  @Input() inmobiliaria: string;
  @Input() proyecto: string;
  @Input() agentes: Agente[] = [];
  @Input() notarios: Notario[] = [];
  @Input() agentesProyecto: Agente[] = [];
  @Input() notariosProyecto: Notario[] = [];
  @Input() api: string;
  proyectoG: Proyecto;
  eliminado = false;

  agente: Agente;
  notario: Notario;
  seleccion = 'Agentes';
  constructor(
    private modalController: ModalController,
    private proyectosService: ProyectosService,
    private inmuebleService: InmuebleService,
    private notarioService: NotarioService,
    private agenteService: AgenteService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.proyectosService
      .getProyectoInmobiliaria(this.inmobiliaria, this.proyecto)
      .subscribe((proyecto) => {
        this.proyectoG = proyecto;
      });
  }

  agregarAgente(agente: Agente) {
    if (!this.agentesProyecto.find((a) => a.rfc === agente.rfc)) {
      this.proyectosService
        .postAgenteProyecto({
          agente: agente.rfc,
          inmobiliaria: agente.inmobiliaria,
          nombre: this.proyecto,
          ciudad: this.proyectoG.ciudad,
          inicio: this.proyectoG.inicio,
        })
        .subscribe((val) => {
          if (val.results) {
            this.agentesProyecto.push(agente);
          }
        });
    }
  }

  agregarNotario(notario: Notario) {
    if (!this.notariosProyecto.find((a) => a.rfc === notario.rfc)) {
      this.proyectosService
        .postNotarioProyecto({
          notario: notario.rfc,
          inmobiliaria: notario.inmobiliaria,
          nombre: this.proyecto,
          ciudad: this.proyectoG.ciudad,
          inicio: this.proyectoG.inicio,
        })
        .subscribe((val) => {
          if (val.results) {
            this.alertController
              .create({
                header: 'Notario agregado',
                message: 'El notario se ha agregado al proyecto',
                buttons: ['OK'],
              })
              .then((alert) => alert.present());
            this.notariosProyecto.push(notario);
          } else {
            this.alertController
              .create({
                header: 'Error',
                message: 'El notario ya se encuentra en el proyecto',
                buttons: ['OK'],
              })
              .then((alert) => alert.present());
          }
        });
    } else {
      this.alertController
        .create({
          header: 'Atención',
          message: 'El notario ya se encuentra en el proyecto',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
    }
  }

  eliminarAgente(agente: Agente) {
    this.agenteService
      .getInmueblesProyectoAgente(
        agente.rfc,
        agente.inmobiliaria,
        this.proyectoG.nombre
      )
      .subscribe((inmuebles) => {
        inmuebles.forEach((inmueble) => {
          this.eliminarInmueble(inmueble);
        });
      });
    this.proyectosService
      .deleteAgenteProyecto({
        inmobiliaria: agente.inmobiliaria,
        nombre: this.proyectoG.nombre,
        agente: agente.rfc,
      })
      .subscribe((res) => {
        if (res.results) {
          this.agentesProyecto = this.agentesProyecto.filter(
            (a) => a.rfc !== agente.rfc
          );
          this.eliminado = true;
        }
      });
  }

  eliminarNotario(notario: Notario) {
    this.notarioService
      .getInmueblesProyectoNotario(
        notario.rfc,
        notario.inmobiliaria,
        this.proyectoG.nombre
      )
      .subscribe((inmuebles) => {
        inmuebles.forEach((inmueble) => {
          this.eliminarInmueble(inmueble);
        });
      });
    this.proyectosService
      .deleteNotarioProyecto({
        inmobiliaria: notario.inmobiliaria,
        nombre: this.proyectoG.nombre,
        notario: notario.rfc,
      })
      .subscribe((res) => {
        console.log(res);
        if (res.results) {
          this.notariosProyecto = this.notariosProyecto.filter(
            (n) => n.rfc !== notario.rfc
          );
          this.eliminado = true;
        }
      });
  }

  eliminarInmueble(inmueble: Inmueble) {
    this.inmuebleService
      .getClientesInmueble(this.inmobiliaria, this.proyecto, inmueble.titulo)
      .subscribe((clientes) => {
        clientes.forEach((cliente) => {
          inmueble.cliente = cliente;
          this.inmuebleService.deleteInmuebleCliente(inmueble);
        });
        this.inmuebleService.deleteInmueble(inmueble).subscribe((valor) => {});
      });
  }

  cerrar() {
    this.modalController.dismiss({ ok: true, inmueble: this.eliminado });
  }
}
