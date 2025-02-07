import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Message } from '../models/message.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsocketService {
  private client: Client;
  private connected = new BehaviorSubject<boolean>(false);

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/chat'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('WebSocket Connected');
        this.connected.next(true); // Set connection status to true
      },
      onDisconnect: () => {
        console.log('WebSocket Disconnected');
        this.connected.next(false);
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame);
      }
    });

    this.client.activate();
  }

  sendMessage(message: Message) {
    if (this.connected.value) {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(message)
      });
    } else {
      console.warn('STOMP connection not ready, message not sent.');
    }
  }

  subscribeToMessages(callback: (message: Message) => void) {
    this.connected.subscribe((isConnected) => {
      if (isConnected) {
        console.log('Subscribing to messages...');
        this.client.subscribe('/topic/public', (message: IMessage) => {
          callback(JSON.parse(message.body));
        });
      }
    });
  }
}
