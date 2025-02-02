import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class ScaleService {
  collectionPath:string = 'rootrecord/PRIMARY/SCALE';
  constructor(private initBD: InitBDService) { }

  async  getAllSCALEID(){
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot

  }

  async  getScaleByRef(segments:string[]){
    let ref="/";
    segments.splice(5).forEach((segment)=>{
      ref+=segment+'/'
    })
    console.log(ref)
    return this.initBD.db.doc(ref).get();
  }
}
