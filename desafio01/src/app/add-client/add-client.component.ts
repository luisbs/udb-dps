import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'

export interface Cliente {
  dui: string
  name: string
  vehiculo: string
}

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  clienteForm = new FormGroup({
    dui: new FormControl(''),
    name: new FormControl(''),
    vehiculo: new FormControl('')
  })

  // Validacion
  duiInvalido?: string
  nameInvalido?: string
  vehiculoInvalido?: string
  formInvalido?: string

  @Output()
  addCliente: EventEmitter<Cliente> = new EventEmitter<Cliente>()

  checkDui(text: string): boolean {
    return /^\d{8}-\d{1}$/g.test(text)
  }

  checkName(text: string): boolean {
    return /^[a-zA-Z]+[a-zA-Z ]*$/g.test(text)
  }

  onInput(campo: string) {
    const v: Cliente = this.clienteForm.value
    this.formInvalido = null
    console.log(campo);

    if (campo === "dui") this.duiInvalido = this.checkDui(v.dui) ? null : "El DUI debe llevar una patron '12345678-9'"
    if (campo === "name") this.nameInvalido = this.checkName(v.name) ? null : "El nombre es requerido"
    if (campo === "vehiculo") this.vehiculoInvalido = this.checkName(v.vehiculo) ? null : "El nombre del vehiculo es requerido"
  }

  onSubmit() {
    this.onInput("dui")
    this.onInput("name")
    this.onInput("vehiculo")

    if (this.duiInvalido || this.nameInvalido || this.vehiculoInvalido) {
      this.formInvalido = "Hay campos invalidos"
      return
    }

    this.addCliente.emit(this.clienteForm.value)
    this.clienteForm.setValue({ dui: "", name: "", vehiculo: "" })
  }
}
