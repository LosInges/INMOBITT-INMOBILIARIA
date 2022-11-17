import { Component } from '@angular/core';
import { SessionService } from './services/session.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [ 
    
    { title: 'Perfil', url: '/perfil', icon: 'paper-plane' },
    { title: 'Proyectos', url: '/proyectos', icon: 'heart' },
    {
      title: 'Cerrar Sesion',
      url: '',
      click: () => this.sessionService.clear(),
      icon: 'log-out-outline',
    }
  ];
  constructor(private sessionService: SessionService) {}

  click(funcion: any) {
    if (funcion) {
      funcion();
    }
  }
}
