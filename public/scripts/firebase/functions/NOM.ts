// import * as init from '../initBD';


import  {initBD as db} from "../initBD"
let collectionPath:string = 'rootrecord/PRIMARY/NOM';

export async function getAllNOMID(){
  var IDs:string[] = [];
  const snapshot = await db.collection(collectionPath).get();
  snapshot.forEach((doc) => {
    // console.log(doc.id, '=>', doc.data());
    IDs.push(doc.id)
  }
  );

}


export async function getNOMByID(){
  const snapshot = await db.collection(collectionPath).get();
  snapshot.forEach((doc) => {
    console.log(doc.id, '=>', doc.data());
  });
}


export async function addNewNOM(NewNOM:any) {
  const docRef = db.collection(collectionPath).doc();
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



// addNewNOM("f","s").then(console.log("work"))
//
