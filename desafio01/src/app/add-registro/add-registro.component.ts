import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'

import { Cliente } from '../add-client/add-client.component';

export interface RegistroCliente {
  dui: string
  monto: number
}

@Component({
  selector: 'app-add-registro',
  templateUrl: './add-registro.component.html',
  styleUrls: ['./add-registro.component.css']
})
export class AddRegistroComponent {
  registroForm = new FormGroup({
    cliente: new FormControl(''),
    monto: new FormControl(0)
  })

  @Input()
  clientes: Array<Cliente>

  @Output()
  addRegistro: EventEmitter<RegistroCliente> = new EventEmitter<RegistroCliente>()

  // Validacion
  clienteInvalido?: string
  montoInvalido?: string
  formInvalido?: string

  checkDui(text: string): boolean {
    return /^\d{8}-\d{1}$/g.test(text)
  }

  checkNumber(number: number): boolean {
    return number && number.toString && /^\d+$/g.test(number.toString())
  }

  onInput(campo: string) {
    const v: { cliente: string, monto: number } = this.registroForm.value
    this.formInvalido = null

    if (campo === "cliente") this.clienteInvalido = this.checkDui(v.cliente) ? null : "Debe seleccionar un cliente"
    if (campo === "monto") this.montoInvalido = this.checkNumber(v.monto) ? null : "El monto debe ser un numero"
  }

  onSubmit() {
    this.onInput("cliente")
    this.onInput("monto")

    if (this.clienteInvalido || this.formInvalido) {
      this.formInvalido = "Hay campos invalidos"
      return
    }

    this.addRegistro.emit(this.registroForm.value)
    this.registroForm.setValue({ cliente: '', monto: 0 })
  }
}
