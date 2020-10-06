import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RecordData } from '../models/record-data'

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  constructor(private db: AngularFirestore) { }
  private CollectionName = 'records';

  get(): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection<RecordData>(this.CollectionName, ref => ref.orderBy('lastModification', 'desc')).get()
  }

  push(record: RecordData): Promise<DocumentReference> {
    return this.db.collection(this.CollectionName).add(record)
  }

  put(id: string, record: Partial<RecordData>): Promise<void>{
    return this.db.collection(this.CollectionName).doc(id).update(record)
  }

  delete(id: string): Promise<void>{
    return this.db.collection(this.CollectionName).doc(id).delete()
  }
}
