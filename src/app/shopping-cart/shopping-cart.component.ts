import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardComponent} from '../main/components/product-card/product-card.component';
import {FormsModule} from '@angular/forms';
import {OrderServiceService} from '../services/order/order-service.service';
import { Config, OneTap } from '@vkid/sdk';
import { Renderer2, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  imports: [CommonModule, ProductCardComponent, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {
  localData:Storage = localStorage;
  allCartPoducts :any[] = [];

  constructor(private order: OrderServiceService,
              private _renderer2: Renderer2,
              @Inject(DOCUMENT) private _document: Document) {
  }



  ngOnInit(){
    console.log(localStorage)
    for (var key in this.localData) {
      let jsonProd = this.toJSON(localStorage.getItem(key));
      if(jsonProd?.id != null && jsonProd?.price != null && jsonProd?.name != null
        && jsonProd?.product != null){
        jsonProd["selected"] = false
        this.allCartPoducts.push(jsonProd)
      }
    }

    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
    if ('VKIDSDK' in window) {
      const VKID = window.VKIDSDK;

      VKID.Config.init({
        app: 53308941,
        redirectUrl: 'https://rzm-shop.netlify.app/',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: '', // Заполните нужными доступами по необходимости
      });

      const oneTap = new VKID.OneTap();

      oneTap.render({
        container: document.currentScript.parentElement,
        fastAuthEnabled: false,
        showAlternativeLogin: true,
        contentId: 5
      })
      .on(VKID.WidgetEvents.ERROR, vkidOnError)
      .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, function (payload) {
        const code = payload.code;
        const deviceId = payload.device_id;

        VKID.Auth.exchangeCode(code, deviceId)
          .then(vkidOnSuccess)
          .catch(vkidOnError);
      });

      function vkidOnSuccess(data) {
        // Обработка полученного результата
        alert("success")
      }

      function vkidOnError(error) {
        // Обработка ошибки
        alert('error')
      }
    }
        `;

    this._renderer2.appendChild(this._document.body, script);

  }

  getSelectedProducts() {
    const selected = this.allCartPoducts.filter(p => p.selected);
    console.log('Выбранные товары:', selected);
  }

  toJSON(data:any){
    return JSON.parse(data)
  }

  writeProdJson(product:any){
    console.log(product)
  }
}
