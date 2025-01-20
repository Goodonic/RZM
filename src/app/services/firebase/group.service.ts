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



  async  addNewGRUPP(NewNOM:any) {
    const docRef = this.initBD.db.collection(this.collectionPath).doc();
    // {available_nom,bodymaid_nom,cash_nom,frontpic_nom,grupp_nom,name_nom,podgrupp_nom,scale_nom}
    await docRef.set({
      available_nom: NewNOM.available_nom,
      bodymaid_nom: NewNOM.bodymaid_nom,
      cash_nom: NewNOM.cash_nom,
      frontpic_nom: NewNOM.frontpic_nom,
      grupp_nom: NewNOM.grupp_nom,
      name_nom: NewNOM.name_nom,
      podgrupp_nom:NewNOM.podgrupp_nom,
      scale_nom:NewNOM.scale_nom,
    });
  }
}
