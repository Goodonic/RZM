import { Component } from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {ProductCardComponent} from './components/product-card/product-card.component';

@Component({
  selector: 'app-main',
  imports: [ProductCardComponent, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
