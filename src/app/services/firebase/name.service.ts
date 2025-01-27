import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  collectionPath:string = 'rootrecord/PRIMARY/NAME';
  constructor(private initBD: InitBDService) { }

  async  getAllNAMEID(){
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot

  }

  async  getNameByRef(segments:string[]){
    let ref="/";
    segments.splice(5).forEach((segment)=>{
      ref+=segment+'/'
    })
    return this.initBD.db.doc(ref).get();
  }
}
