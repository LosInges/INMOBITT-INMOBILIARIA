import { Component } from '@angular/core';
import { SessionService } from './services/session.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Iniciar Sesion', url: 'login', icon: 'mail' },
    { title: 'Perfil', url: '/perfil', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
    {
      title: 'Cerrar Sesion',
      url: '',
      click: () => this.sessionService.clear(),
      icon: 'log-out-outline',
    }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private sessionService: SessionService) {}

  click(funcion: any) {
    if (funcion) {
      funcion();
    }
  }
}
