import { Component, OnInit } from '@angular/core';

import { LoginService } from 'src/app/services/login.service';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(
    private loginService: LoginService,
    private sessionService: SessionService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  onSubmit() {
    alert(this.email + ', ' + this.password);
  }

  login() {
    this.loginService.login(this.email, this.password).subscribe(
      (res) => {
        console.log(res)
        if (res.session.tipo !== 'inmobiliaria') {
          return;
        }
        const promesas: Promise<any>[] = [
          this.sessionService.clear(),
          this.sessionService.set('correo', res.session.email),
          this.sessionService.set('tipo', res.session.tipo),
        ];

        Promise.all(promesas)
          .then((a) => {
            console.log(a);
            this.router.navigate(['/', 'perfil']);
          })
          .catch((error) => console.log(error));
      },
      (err) => console.log(err)
    );
    this.modalController.dismiss();
  }

  cerrar() {
    this.modalController.dismiss();
  }
}
