import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ClientData } from '../models/client-data';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private db: AngularFirestore) { }
  private CollectionName = 'clients';

  get(): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection<ClientData>(this.CollectionName, ref => ref.orderBy('lastModification', 'desc')).get()
  }

  push(client: ClientData): Promise<DocumentReference> {
    return this.db.collection(this.CollectionName).add(client)
  }

  put(id: string, client: Partial<ClientData>): Promise<void>{
    return this.db.collection(this.CollectionName).doc(id).update(client)
  }

  delete(id: string): Promise<void>{
    return this.db.collection(this.CollectionName).doc(id).delete()
  }
}
