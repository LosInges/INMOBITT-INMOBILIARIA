import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agente } from 'src/app/interfaces/agente';

@Component({
  selector: 'app-agentes',
  templateUrl: './agentes.component.html',
  styleUrls: ['./agentes.component.scss'],
})
export class AgentesComponent implements OnInit {
  @Input() agentes: Agente[] = [];
  @Input() api = '';
  constructor(private router: Router) {}

  @Input() eliminarAgente(rfc: string) {
    console.log('No se recibio funcion eliminar agente');
  }

  editarAgente(rfc: string) {
    this.router.navigate(['perfil', 'agente', rfc]);
  }

  ngOnInit() {}
}
