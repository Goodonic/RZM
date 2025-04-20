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

  async  getPodGroupByRef(segments:string[]){
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

  async  getPODGRUPPNameByID(id:string){
    const dataSnapshot = (await this.initBD.db.doc(this.collectionPath + "/" + id).get());
    return dataSnapshot;
  }

  async updatePodGroupName(id:string, newName:string){
    await this.initBD.db.doc(this.collectionPath+"/"+id).update({name_podgrupp: newName});
  }

  async deletePodGroup(id: string) {
    const docRef = this.initBD.db.doc(`${this.collectionPath}/${id}`);
    docRef.delete()
    /*console.log("del")*/
  }

  async  addPodGroup(name:any) {
    const docRef = await this.initBD.db.collection(this.collectionPath)
    return docRef.add({name_podgrupp: name})
  }
}
