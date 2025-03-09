import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() image: string = ""; // Изображение товара
  @Input() price: string=''; // Цена товара
  @Input() description: string=''; // Описание товара
  @Input() name: string=''; // Название товара
  @Input() product: string=''; // Название товара


}
