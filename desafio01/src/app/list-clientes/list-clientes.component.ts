import { Component,Input } from '@angular/core';

import { ClienteData } from '../app.component'

@Component({
  selector: 'app-list-clientes',
  templateUrl: './list-clientes.component.html',
  styleUrls: ['./list-clientes.component.css']
})
export class ListClientesComponent {

  @Input()
  clientes: Array<ClienteData>
}
