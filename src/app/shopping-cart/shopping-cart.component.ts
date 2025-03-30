import {Component, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardComponent} from '../main/components/product-card/product-card.component';
import {FormsModule} from '@angular/forms';
import {OrderServiceService} from '../services/order/order-service.service';
import { Config, OneTap } from '@vkid/sdk';
import { Renderer2, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as VKIDSDK from '@vkid/sdk';

declare const VK: any;

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
              private renderer: Renderer2,
              @Inject(DOCUMENT) private _document: Document,
              private el : ElementRef) {

  }



  ngOnInit() {
    console.log(localStorage)
    for (var key in this.localData) {
      let jsonProd = this.toJSON(localStorage.getItem(key));
      if (jsonProd?.id != null && jsonProd?.price != null && jsonProd?.name != null
        && jsonProd?.product != null) {
        jsonProd["selected"] = false
        this.allCartPoducts.push(jsonProd)
      }
    }

  }

  ngAfterViewInit(): void {
    // Инициализация конфигурации VKID SDK

    VKIDSDK.Config.init({
      app: 53308941,
      redirectUrl: 'https://vk.com/nikitwdh', // можно использовать для обратного перехода, если требуется
      responseMode: VKIDSDK.ConfigResponseMode.Callback,
      source: VKIDSDK.ConfigSource.LOWCODE,
      scope: '' // Запрашиваем разрешение для отправки сообщений
    });
    VK.init({
      apiId: 53308941
    });

    const oneTap = new VKIDSDK.OneTap();

    oneTap.render({
      container: this.el.nativeElement.querySelector('#vkOrder'),
      fastAuthEnabled: false,
      showAlternativeLogin: true,
      contentId: 5
    })
      .on(VKIDSDK.WidgetEvents.ERROR, (error: any) => {
        console.error("VKIDSDK error:", error);
      })
      .on(VKIDSDK.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
        const { code, device_id } = payload;

        // Обмен кода на данные авторизации
        VKIDSDK.Auth.exchangeCode(code, device_id)
          .then((data: any) => {
            console.log('Успешная авторизация:', data);
            console.log(data.user_id)
            // Получаем ID авторизованного пользователя
            const userId = data.user_id;

            // Используем community token для отправки сообщения
            const communityToken = 'vk1.a.EiMFAAYxNOP3J-_gH6YeU_aObk5bJGkSBSzIZoxTlPUL5i3dLMUMBwpYm0Hr76vLKdGa_ZqI2npd-esAiV6zytip-u8wIMkvBltA8r5fKR79pdIqhDodIzL9-KjspNmsbWoLiQR3o6dlnCPdSR6wh370T4TO4J5ldj2i7QGyrxAEoHpnLxuRhTZzX3g1WS47u4AH_gs617NOeaLiTvgQFw'; // Замените на ваш токен сообщества

            // Отправка сообщения от имени сообщества авторизованному пользователю

            VK.Api.call('messages.send', {
              peer_id: data.session.user.id,         // ID получателя (чат или пользователь)
              message: 'TEST',
              random_id: Date.now(),
              group_id: 205456566,        // ID сообщества, от имени которого отправляется сообщение
              from_group: 1,             // Обязательно для отправки от имени сообщества
              access_token: communityToken,
              v: '5.131'
            }, (result: any) => {
              if (result.response) {
                console.log('Сообщение успешно отправлено');
                window.location.href = 'https://vk.com/id' + userId;
              } else {
                console.error('Ошибка при отправке сообщения:', result.error);
              }
            });
          })
          .catch((error: any) => {
            console.error("Ошибка при обмене кода:", error);
          });
      });
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
