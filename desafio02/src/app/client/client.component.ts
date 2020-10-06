import { Component, OnInit, NgZone } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'

import { ClientView } from './models/client-data'
import { ClientService } from './services/client.service'
import { firestore } from 'firebase'
import { ToastService } from '../toast/toast.service'

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients: ClientView[] = []

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private formB: FormBuilder,
    private ngZone: NgZone,
    private clientService: ClientService,
    private toast: ToastService,
  ) { }

  //* Formulario
  clientForm = this.formB.group({
    id: new FormControl(''),
    dui: new FormControl(''),
    name: new FormControl(''),
    repairs: new FormControl(0),
    vehiculo: new FormControl(''),
  })

  duiInvalido?: string
  nameInvalido?: string
  vehiculoInvalido?: string

  checkDui(text: string): boolean {
    return /^\d{8}-\d{1}$/g.test(text)
  }

  checkName(text: string): boolean {
    return /^[a-zA-Z]+[a-zA-Z ]*$/g.test(text)
  }

  onInput(campo: "dui" | "name" | "vehiculo") {
    const v: ClientView = this.clientForm.value

    if (campo === "dui") this.duiInvalido = this.checkDui(v.dui) ? null : "El DUI debe llevar una patron '12345678-9'"
    if (campo === "name") this.nameInvalido = this.checkName(v.name) ? null : "El nombre es requerido"
    if (campo === "vehiculo") this.vehiculoInvalido = this.checkName(v.vehiculo) ? null : "El nombre del vehiculo es requerido"
  }

  setForm(client?: ClientView) {
    if (!client) {
      this.clientForm.setValue({ id: '', dui: '', name: '', repairs: 0, vehiculo: '' })
    } else {
      this.clientForm.setValue({
        id: client.id,
        dui: client.dui,
        name: client.name,
        repairs: client.repairs,
        vehiculo: client.vehiculo,
      })
    }
  }

  onSubmit() {
    this.onInput("dui")
    this.onInput("name")
    this.onInput("vehiculo")

    if (this.duiInvalido || this.nameInvalido || this.vehiculoInvalido) {
      this.toast.show('Hay campos invalidos', 'error')
      return
    }

    this.saveData(this.clientForm.value)
    this.modal?.hide()
    this.setForm()
  }

  //* Control
  private modal = null

  ngOnInit(): void {
    this.afAuth.user.subscribe(user => {
      if (!user) this.ngZone.run(() => this.router.navigate(['/']))
    })
    this.loadData()
    // @ts-ignore
    this.modal = new bootstrap.Modal(document.getElementById('clientModal'), {})
  }

  //* CRUD
  loadData() {
    this.clientService.get().subscribe(data => {
      this.clients = []
      data.docs.forEach(doc => {
        this.clients.push({
          id: doc.id,
          ...doc.data() as Omit<ClientView, "id">
        })
      })
    })
  }

  removeData(id: string) {
    this.clientService.delete(id)
    .then(() => { this.loadData(); this.toast.show('Removido') })
    .catch(err => this.toast.show(err, 'error'))
  }

  saveData(client: Omit<ClientView, "lastModification"> ) {
    if (client.id) {
      const { id, ...data } = client
      this.clientService.put(id, { ...data, lastModification: firestore.Timestamp.now() })
      .then(() => { this.loadData(); this.toast.show('Modificado') })
      .catch(err => this.toast.show(err, 'error'))
    } else {
      this.clientService.push({
        dui: client.dui,
        name: client.name,
        repairs: 0,
        vehiculo: client.vehiculo,
        lastModification: firestore.Timestamp.now(),
      })
      .then(() => { this.loadData(); this.toast.show('Añadido') })
      .catch(err => this.toast.show(err, 'error'))
    }
  }
}
