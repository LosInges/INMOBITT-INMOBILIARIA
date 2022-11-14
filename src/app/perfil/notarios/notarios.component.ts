import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notario } from 'src/app/interfaces/notario';

@Component({
  selector: 'app-notarios',
  templateUrl: './notarios.component.html',
  styleUrls: ['./notarios.component.scss'],
})
export class NotariosComponent implements OnInit {
  @Input() api: string;
  @Input() notarios: Notario[] = [];

  constructor(private router: Router) {}

  @Input() eliminarNotario(correo: string) {}

  editarNotario(rfc: string) {
    this.router.navigate(['perfil', 'notario', rfc]);
  }

  ngOnInit() {}
}
