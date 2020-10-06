import { firestore } from 'firebase'
import { RecordData } from 'src/app/record/models/record-data'

export interface ClientData {
  dui: string
  name: string
  vehiculo: string
  repairs: number
  lastModification: firestore.Timestamp
}

export interface ClientView extends ClientData {
  id: string
}
