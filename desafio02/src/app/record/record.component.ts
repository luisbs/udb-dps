import { Component, OnInit, NgZone } from '@angular/core'
import { FormBuilder, FormControl } from '@angular/forms'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'
import { firestore } from 'firebase'
import { Router } from '@angular/router'

import { ClientService } from '../client/services/client.service'
import { RecordService } from './services/record.service'
import { RecordView } from './models/record-data'
import { ClientView } from '../client/models/client-data'
import { ToastService } from '../toast/toast.service'

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  clients: ClientView[] = []
  records: RecordView[] = []
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private formB: FormBuilder,
    private ngZone: NgZone,
    private clientService: ClientService,
    private recordService: RecordService,
    private toast: ToastService,
  ) { }

  //* Formulario
  recordForm = this.formB.group({
    id: new FormControl(''),
    clientId: new FormControl(''),
    number: new FormControl(0),
    amount: new FormControl(1),
    discount: new FormControl(0),
    total: new FormControl({ value: 0, disabled: true }),
  })

  clientInvalido?: string
  discountInvalido?: string
  amountInvalido?: string

  checkNumber(number: number): boolean {
    return (number || number === 0) && number.toString && /^\d+(\.\d+)?$/g.test(number.toString())
  }

  onInput(campo: "clientId" | "amount" | "discount") {
    let v: RecordView = this.recordForm.value

    if (campo === "clientId") {
      this.clientInvalido = /^\S+$/g.test(v.clientId) ? null : 'Seleccione un cliente'
      if (/^\S+$/g.test(v.clientId)) {
        const ocation = this.recordClient(v.clientId).repairs + 1
        let desc = 0
        if (ocation > 1) desc = 0.05
        if (ocation > 4) desc = 0.10
        this.recordForm.controls.discount.setValue(desc)
        this.recordForm.controls.number.setValue(ocation)
      }
    }
    if (campo === "amount") this.amountInvalido = this.checkNumber(v.amount) ? null : "El monto debe ser un numero"
    if (campo === "discount") this.discountInvalido = this.checkNumber(v.discount) ? null : "El descuento debe ser un numero"

    v = this.recordForm.value
    this.recordForm.controls.total.setValue(v.amount - (v.amount * v.discount))
  }

  setForm(record?: RecordView) {
    if (!record) {
      this.recordForm.setValue({ id: '', clientId: '', number: 1, amount: 1, discount: 0, total: 0 })
    } else {
      this.recordForm.setValue({
        id: record.id,
        clientId: record.clientId,
        number: record.number,
        amount: record.amount,
        discount: record.discount,
        total: record.amount - (record.amount * record.discount),
      })
    }
  }

  onSubmit() {
    this.onInput("amount")
    this.onInput("discount")
    this.onInput("clientId")

    if (this.amountInvalido) {
      this.toast.show('Hay campos invalidos', 'error')
      return
    }

    this.saveData(this.recordForm.value)
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
    this.modal = new bootstrap.Modal(document.getElementById('recordModal'), {})
  }

  recordClient(clientId: string) {
    return this.clients.find(c => c.id === clientId)
  }

  //* CRUD
  loadData() {
    this.recordService.get().subscribe(data => {
      this.records = []
      data.docs.forEach(doc => {
        this.records.push({
          id: doc.id,
          clientId: (doc.get("clientRef") as firestore.DocumentReference).id,
          ...doc.data() as Omit<RecordView, "id">
        })
      })
    })
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
    this.recordService.delete(id)
    .then(() => { this.loadData(); this.toast.show('Removido') })
    .catch(err => this.toast.show(err, 'error'))
  }

  saveData(record: Omit<RecordView, "lastModification"> ) {
    if (record.id) {
      const { id, ...data } = record
      this.recordService.put(id, { ...data, lastModification: firestore.Timestamp.now() })
      .then(() => {
        this.clientService.put(record.clientId, { repairs: record.number })
        this.toast.show('Modificado')
      })
      .catch(err => this.toast.show(err, 'error'))
    } else {
      this.recordService.push({
        amount: record.amount,
        number: record.number,
        discount: record.discount,
        clientRef: this.db.collection('clients').doc(record.clientId).ref,
        lastModification: firestore.Timestamp.now(),
      })
      .then(() => {
        this.clientService.put(record.clientId, { repairs: record.number })
        this.toast.show('Añadido')
        this.loadData()
      })
      .catch(err => this.toast.show(err, 'error'))
    }
  }
}
