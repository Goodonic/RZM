import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class TypeService {
  collectionPath:string = 'rootrecord/PRIMARY/PRODUCTTYPE';
  constructor(private initBD: InitBDService) { }

  async  getAllTYPEID(){
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot

  }

  async  getTypeByRef(segments:string[]){
    // console.log(segments)
    let ref="/";
    segments.splice(5).forEach((segment)=>{
      // console.log(segment)
      ref+=segment+'/'
    })
    // console.log(ref)
    // const dataSnapshot = await this.initBD.db.doc(ref).get().then(data=>console.log(data))
    return this.initBD.db.doc(ref).get();
  }

  async updateTypeName(id:string, newName:string){
    await this.initBD.db.doc(this.collectionPath+"/"+id).update({product_type: newName});
  }

  async deleteType(id: string) {
    const docRef = this.initBD.db.doc(`${this.collectionPath}/${id}`);
    docRef.delete()
    /*console.log("del")*/
  }

  async  addType(name:any) {
    const docRef = await this.initBD.db.collection(this.collectionPath)
    return  docRef.add({product_type: name})
  }
}
