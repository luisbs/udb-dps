import { firestore } from 'firebase'

export interface RecordData {
  number: number
  amount: number
  discount: number
  clientRef: firestore.DocumentReference
  lastModification: firestore.Timestamp
}

export interface RecordView extends RecordData {
  id: string
  clientId: string
}
