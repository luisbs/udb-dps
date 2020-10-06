import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.css']
})
export class AppMenuComponent implements OnInit {
  logged = false
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    this.afAuth.user.subscribe(user => this.logged = !!user)
  }

  logout() {
    this.afAuth.signOut()
    .then(() => {
      this.toast.show('Sesion cerrada', 'success')
      this.router.navigate(['/'])
    })
    .catch(err => this.toast.show(err, 'error'))
  }
}
