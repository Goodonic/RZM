import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductPageService {
  private dataSubject = new BehaviorSubject<any>(null);

  data$ = this.dataSubject.asObservable();

  setData(data:any){
    this.dataSubject.next(data)
  }
}
