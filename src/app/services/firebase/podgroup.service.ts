import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class PodgroupService {
  collectionPath:string = 'rootrecord/PRIMARY/PODGRUPP';
  constructor(private initBD: InitBDService) { }

  async  getAllPODGRUPPID(){
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot
  }

  async  getPODGRUPPNameByID(id:string){
    const dataSnapshot = (await this.initBD.db.doc(this.collectionPath + "/" + id).get());
    return dataSnapshot;
  }
}
