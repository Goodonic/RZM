import { Injectable } from '@angular/core';
import {InitBDService} from "./init/init-bd.service"
import {group} from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class NOMService {
  collectionPath:string = 'rootrecord/PRIMARY/NOM';
  constructor(private initBD: InitBDService) { }

   async  getAllNOMID(){
    var IDs:string[] = [];
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot
    // snapshot.forEach((doc) => {
    //     console.log(doc.id, '=>', doc.data());
    //   }
    //
    // );

  }


   async  getNOMByID(id:string){
    const dataSnapshot = await this.initBD.db.doc(this.collectionPath+"/"+id).get();
    return dataSnapshot;

  }


   async  addNewNOM(NewNOM:any) {
    const docRef = this.initBD.db.collection(this.collectionPath).doc();
    // {available_nom,bodymaid_nom,cash_nom,frontpic_nom,grupp_nom,name_nom,podgrupp_nom,scale_nom}
     NewNOM.grupp_nom = this.initBD.db.doc(NewNOM.grupp_nom)
     NewNOM.podgrupp_nom = this.initBD.db.doc(NewNOM.podgrupp_nom)
     NewNOM.available_nom = this.initBD.db.doc(NewNOM.available_nom)
     NewNOM.bodymaid_nom = this.initBD.db.doc(NewNOM.bodymaid_nom)
     NewNOM.product_type = this.initBD.db.doc(NewNOM.product_type)
     NewNOM.name_nom = this.initBD.db.doc(NewNOM.name_nom)
     NewNOM.scale_nom = this.initBD.db.doc(NewNOM.scale_nom)
     // console.log(NewNOM.name_nom)

    await docRef.set({
      available_nom: NewNOM.available_nom,
      bodymaid_nom: NewNOM.bodymaid_nom,
      cash_nom: NewNOM.cash_nom,
      frontpic_nom: NewNOM.frontpic_nom,
      grupp_nom: NewNOM.grupp_nom,
      name_nom: NewNOM.name_nom,
      podgrupp_nom:NewNOM.podgrupp_nom,
      product_type:NewNOM.product_type,
      scale_nom:NewNOM.scale_nom,
    });
  }



}
