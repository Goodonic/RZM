import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class AvailableService {

  collectionPath:string = 'rootrecord/PRIMARY/AVAILABLE';
  constructor(private initBD: InitBDService) { }

  async  getAllAVAILABLEID(){
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot
  }

  async  getAvailableByRef(segments:string[]){
    let ref="/";
    segments.splice(5).forEach((segment)=>{
      // console.log(segment)
      ref+=segment+'/'
    })
    return this.initBD.db.doc(ref).get();
  }

}
