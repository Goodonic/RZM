import {Component, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardComponent} from '../main/components/product-card/product-card.component';
import {FormsModule} from '@angular/forms';
import {OrderServiceService} from '../services/order/order-service.service';
import { Config, OneTap } from '@vkid/sdk';
import { Renderer2, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import VKIDSDK from '@vkid/sdk';

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
              @Inject(DOCUMENT) private _document: Document,
              private _elementRef : ElementRef) {
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
        redirectUrl: 'https://vk.com/nikitwdh',
        responseMode: VKID.ConfigResponseMode.Callback,
        source: VKID.ConfigSource.LOWCODE,
        scope: 'message', // Заполните нужными доступами по необходимости
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
    // Обработка успешной авторизации
    alert("Успешная авторизация");
    console.log(data);

    // Пример отправки сообщения от имени пользователя через VK API.
    // Убедитесь, что данные содержат user_id (или mid) и access_token, а пользователь выдал разрешение на доступ к сообщениям.
    VK.Api.call('messages.send', {
      user_id: data.user_id || data.mid, // Зависит от структуры возвращаемых данных
      message: 'TEST',
      random_id: Date.now()
    }, function(result) {
      if (result.response) {
        console.log('Сообщение успешно отправлено');
      } else {
        console.error('Ошибка при отправке сообщения:', result.error);
      }
    });

  }

      function vkidOnError(error) {
        // Обработка ошибки
        alert(error)
        console.log(error)
      }
    }
        `;

    this._renderer2.appendChild(this._elementRef.nativeElement.querySelector(`#vkOrder`), script);

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
