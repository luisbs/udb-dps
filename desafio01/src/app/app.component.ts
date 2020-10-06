import { Component } from '@angular/core';

import { Cliente } from './add-client/add-client.component'

export interface ClienteData extends Cliente {
  registros?: Array<{
    ocasion: number
    descuento: number
    monto: number
  }>
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'El taller de Don Alex';
  clientes: Array<Cliente> = []

  onAddCliente(value: any) {
    this.clientes.push(value)
  }

  onAddRegistro(v: { cliente: string, monto: number }): void {
    const i = this.clientes.findIndex(c => c.dui === v.cliente)
    if (i === -1) return

    if (!this.clientes[i].registros) {
      this.clientes[i].registros = [{
        ocasion: 1,
        descuento: 0,
        monto: v.monto
      }]
      return
    }

    const last = this.clientes[i].registros.length -1
    const oca = this.clientes[i].registros[last].ocasion +1
    let desc = 0
    if (oca > 1) desc = 0.05
    if (oca > 4) desc = 0.10

    this.clientes[i].registros.push({
      ocasion: oca,
      descuento: desc,
      monto: v.monto
    })
  }
}
