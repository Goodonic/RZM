import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import {J} from '@angular/cdk/keycodes';

declare var Email: any; // Глобальная переменная, предоставляемая SMTP.js

@Injectable({
  providedIn: 'root'
})
export class OrderServiceService {
  total = 0;
  sendOrderEmail(data: any): void {
    const orderData = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < (orderData.products).length; i++){
      delete orderData.products[i]['image']
      JSON.stringify(orderData.products)
      this.total += orderData.products[i].price
    }
    console.log(orderData.products)
    // Программная генерация HTML-шаблона письма
    const emailContent = this.createEmailContent(orderData);
    console.log(emailContent)
    console.log(orderData.products)
    const templateParams = {
      from_name: orderData.name,  // Можно использовать для указания отправителя в шаблоне
      order_id: Math.floor(Math.random()*10000),
      orders: orderData.products,
      eMail: orderData.eMail,
      VK:orderData.vk,
      tel:orderData.tel,
      Name:orderData.Name,
      email: orderData.testEMail,
      cost:{total: this.total}
      // Можно добавить и другие параметры по необходимости
    };

    emailjs.send('service_g1b53jn', 'template_9xzen66', templateParams, '2LkaiWOp4OD7j-n5A')
      .then((result: EmailJSResponseStatus) => {
        console.log('Email sent successfully:', result.text);
      }, (error) => {
        console.error('Error sending email:', error);
      });
    this.total = 0
  }

  private createEmailContent(orderData: any): string {
    console.log("orderData")
    console.log(orderData)
    // Пример динамически сформированного HTML-содержимого
    let content = `<h1>Новый заказ</h1>`;
    content += `<p><strong>Имя:</strong> ${orderData.name}</p>`;
    content += `<p><strong>Контактный телефон:</strong> ${orderData.tel}</p>`;
    content += `<p><strong>ВК:</strong> ${orderData.vk}</p>`;
    content += `<p><strong>eMail:</strong> ${orderData.eMail}</p>`;
    content += `<p><strong>qwer:</strong> ${orderData.products}</p>`;
    // for (let i = 0; i < (orderData.products).length; i++){
    //   content += `<p><strong>eMail:</strong> ${orderData.products[i]}</p>`;
    // }
    // content += `<p><strong>Товар:</strong> ${orderData.product}</p>`;
    // content += `<p><strong>Количество:</strong> ${orderData.quantity}</p>`;
    // Добавьте другие поля по необходимости
    return content;
  }

  private generateEmailBody(orderData: any): string {
    let body = '<h1>Новый заказ</h1>';
    for (const key in orderData) {
      if (orderData.hasOwnProperty(key)) {
        body += `<p><strong>${key}:</strong> ${orderData[key]}</p>`;
      }
    }
    return body;
  }

}
