import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { LoginComponent } from './login/login.component'
import { ClientComponent } from './client/client.component'
import { RecordComponent } from './record/record.component'

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'clients', component: ClientComponent },
  { path: 'records', component: RecordComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
