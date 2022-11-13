import { Component, Input, OnInit } from '@angular/core';
import { Agente } from 'src/app/interfaces/agente';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.scss'],
})
export class AgentesComponent implements OnInit {
  @Input() agentes: Agente[] = [];
  @Input() api = '';
  constructor() {}

  @Input() eliminarAgente(rfc: string) {
    console.log('No se recibio funcion eliminar agente');
  }

  ngOnInit() {}
}
