import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  collectionPath:string = 'rootrecord/PRIMARY/GRUPP';
  constructor(private initBD: InitBDService) { }

  async  getAllGRUPPID(){
    var IDs:string[] = [];
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot
    // snapshot.forEach((doc) => {
    //     console.log(doc.id, '=>', doc.data());
    //   }
    //
    // );

  }

  async  getAllPodGroupsIdByGroupId(id:string){
    var IDs:string[] = [];
    const snapshot = await this.initBD.db.collection(this.collectionPath+"/"+id+"/PODGRUPP").get();
    return snapshot
    // snapshot.forEach((doc) => {
    //     console.log(doc.id, '=>', doc.data());
    //   }
    //
    // );

  }

  async getPodGroupNameById(id:string){
    const snapshot = await this.initBD.db.collection(this.collectionPath+"/"+id+"/"+"grupp").get();
    return snapshot
  }

  async  getGRUPPNameByID(id:string){
    const dataSnapshot = (await this.initBD.db.doc(this.collectionPath + "/" + id).get());
    return dataSnapshot;
  }

  async  getGRUPPByRef(segments:string[]){
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

  async updateGroupName(id:string, newName:string){
    await this.initBD.db.doc(this.collectionPath+"/"+id).update({grupp: newName});
  }

  async deleteGroup(id: string) {
    const docRef = this.initBD.db.doc(`${this.collectionPath}/${id}`);
     docRef.delete()
    /*console.log("del")*/
  }


  async  addGRUPP(name:any) {
    const docRef = await this.initBD.db.collection(this.collectionPath)
    return docRef.add({grupp: name})
  }
}
