import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SessionService } from '../services/session.service';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit() {}

  async abrirRegistro() {
    const modal = await this.modalController.create({
      component: SignupComponent,
      cssClass: 'modalRegistrar',
    });
    return await modal.present();
  }

  async abrirIngresar() {
    const modal = await this.modalController.create({
      component: LoginComponent,
      cssClass: 'modalIngresar',
    });
    return await modal.present();
  }
}
