import { Injectable } from '@angular/core';
import {InitBDService} from './firebase/init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationsService {
  collectionPath:string = 'rootrecord/PRIMARY/RECOMMENDATION';
  constructor(private initBD: InitBDService) { }

  async  getAllRECOMMENDATIONID(){
    const snapshot = await this.initBD.db.collection(this.collectionPath).get();
    return snapshot

  }

  async  getRecommendationByRef(segments:string[]){
    let ref="/";
    segments.splice(5).forEach((segment)=>{
      // console.log(segment)
      ref+=segment+'/'
    })
    return this.initBD.db.doc(ref).get();
  }

  async updateRecommendationName(id:string, newName:string){
    await this.initBD.db.doc(this.collectionPath+"/"+id).update({recGroupName: newName});
  }

  async deleteRecommendation(id: string) {
    const docRef = this.initBD.db.doc(`${this.collectionPath}/${id}`);
    docRef.delete()
    /*console.log("del")*/
  }

  async  addRecommendation(name:any) {
    const docRef = await this.initBD.db.collection(this.collectionPath)
    return docRef.add({recGroupName: name})
  }
}
