import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Agente } from 'src/app/interfaces/agente';
import { Notario } from 'src/app/interfaces/notario';
import { ProyectosService } from 'src/app/services/proyectos.service';

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
  eliminado = false;

  agente: Agente;
  notario: Notario;
  seleccion = 'Agentes';
  constructor(
    private modalController: ModalController,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit() {}

  agregarAgente(agente: Agente) {
    if (!this.agentesProyecto.find((a) => a.rfc === agente.rfc)) {
      this.proyectosService
        .postAgenteProyecto({
          agente: agente.rfc,
          inmobiliaria: agente.inmobiliaria,
          nombre: this.proyecto,
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
          inmobiliaria: notario.inmobiliaria,
          nombre: this.proyecto,
          notario: notario.rfc,
        })
        .subscribe((val) => {
          if (val.results) {
            this.notariosProyecto.push(notario);
          }else{
            console.log(val);
          }
        });
    }
  }

  eliminarAgente(agente: Agente) {
    this.agentesProyecto = this.agentesProyecto.filter(
      (a) => a.rfc !== agente.rfc
    );
    this.eliminado = true;
  }

  eliminarNotario(notario: Notario) {
    this.agentesProyecto = this.agentesProyecto.filter(
      (n) => n.rfc !== notario.rfc
    );
    this.eliminado = true;
  }

  cerrar() {
    this.modalController.dismiss({ ok: true, inmueble: this.eliminado });
  }
}
