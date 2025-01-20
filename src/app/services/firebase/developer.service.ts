import { Injectable } from '@angular/core';
import {InitBDService} from './init/init-bd.service';

@Injectable({
  providedIn: 'root'
})
export class DeveloperService {

  collectionPath:string = 'rootrecord/PRIMARY/BODYMAID';
  constructor(private initBD: InitBDService) { }
}
