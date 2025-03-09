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
    console.log(ref)
    return this.initBD.db.doc(ref).get();
  }
  async updateName(id:string, newName:string){
    await this.initBD.db.doc(this.collectionPath+"/"+id).update({product_name: newName});
  }
  async deleteName(id: string) {
    const docRef = this.initBD.db.doc(`${this.collectionPath}/${id}`);
    docRef.delete()
    /*console.log("del")*/
  }
}
