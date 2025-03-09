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
  async updateScaleName(id:string, newName:string){
    await this.initBD.db.doc(this.collectionPath+"/"+id).update({product_scale: newName});
  }

  async deleteScale(id: string) {
    const docRef = this.initBD.db.doc(`${this.collectionPath}/${id}`);
    docRef.delete()
    /*console.log("del")*/
  }
  async  addScale(name:any) {
    const docRef = await this.initBD.db.collection(this.collectionPath)
    docRef.add({product_scale: name})
  }
}
