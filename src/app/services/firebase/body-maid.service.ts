import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class BodyMaidService {
  collectionPath:string = 'rootrecord/PRIMARY/BODYMAID';
  constructor(private initBD: InitBDService) { }

  async  getAllBODYMAIDID(){
    var IDs:string[] = [];
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot

  }

  async  getBodyMaidByRef(segments:string[]){
    let ref="/";
    segments.splice(5).forEach((segment)=>{
      // console.log(segment)
      ref+=segment+'/'
    })
    return this.initBD.db.doc(ref).get();
  }

  async updateBodyMaidName(id:string, newName:string){
    await this.initBD.db.doc(this.collectionPath+"/"+id).update({name_bodymaid: newName});
  }

  async deleteBodyMaid(id: string) {
    const docRef = this.initBD.db.doc(`${this.collectionPath}/${id}`);
    docRef.delete()
    /*console.log("del")*/
  }

  async  addBodyMaid(name:any) {
    const docRef = await this.initBD.db.collection(this.collectionPath)
    return docRef.add({name_bodymaid: name})
  }
}
