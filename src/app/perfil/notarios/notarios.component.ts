import { Component, Input, OnInit } from '@angular/core';
import { Notario } from 'src/app/interfaces/notario';

@Component({
  selector: 'app-notarios',
  templateUrl: './notarios.component.html',
  styleUrls: ['./notarios.component.scss'],
})
export class NotariosComponent implements OnInit {
  @Input() api: string;
  @Input() notarios: Notario[] = [];

  constructor() {}

  @Input() eliminarNotario(correo: string) {}

  ngOnInit() {}
}
