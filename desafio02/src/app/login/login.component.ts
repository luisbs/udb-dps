import { Component, OnInit, NgZone } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
import { auth } from 'firebase'
import { ToastService } from '../toast/toast.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private formB: FormBuilder,
    private ngZone: NgZone,
    private toast: ToastService,
  ) { }

  loginForm = this.formB.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })

  checkField(field: string) {
    return this.loginForm.controls[field].touched && this.loginForm.controls[field].errors?.required
  }

  ngOnInit() {
    this.afAuth.user.subscribe(user => {
      if (user) {
        this.toast.show("Logueado!!", "success")
        this.ngZone.run(() => this.router.navigate(['/records']))
      }
    })
  }

  signUp() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(() => {
        this.toast.show("Logueado!!", "success")
        this.router.navigate(['/records'])
      })
      .catch(err => this.toast.show(err.message, "error"))
  }

  createUser() {
    this.afAuth.createUserWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        this.toast.show("Logueado!!", "success")
        this.router.navigate(['/records'])
      })
      .catch(err => this.toast.show(err.message, "error"))
  }

  signIn() {
    this.afAuth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        this.toast.show("Logueado!!", "success")
        this.router.navigate(['/records'])
      })
      .catch(err => this.toast.show(err.message, "error"))
  }
}
