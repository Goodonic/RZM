import { Injectable } from '@angular/core';
import {InitBDService} from "../init/init-bd.service"
@Injectable({
  providedIn: 'root'
})
export class ImgService {
  collectionPath:string = 'rootrecord/PRIMARY/NOM';
  constructor(private initBD: InitBDService) { }

  async addImage(id:string, image:string){
    var cityRef = this.initBD.db.collection(this.collectionPath).doc(id);

// Set the 'capital' field of the city
    var updateSingle = cityRef.update({ frontpic_nom: image });
  }
}
