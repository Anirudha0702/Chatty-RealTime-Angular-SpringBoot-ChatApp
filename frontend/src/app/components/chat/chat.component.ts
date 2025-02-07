import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../core/services/websocket.service';
import { EncryptionService } from '../../core/services/encryption.service';
import { AuthService } from '../../core/services/auth.service';
import { Message } from '../../core/models/message.model';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage = '';
  currentUser = this.auth.getCurrentUser();
  private subscription: any;

  constructor(
    private ws: WebsocketService,
    private encryption: EncryptionService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.subscription = this.ws.subscribeToMessages(msg => {
      msg.content = this.encryption.decrypt(msg.content);
      if (msg.receiver === this.currentUser?.username || msg.receiver === 'Anonymous') {
        this.messages.push(msg);
      }
    });
  }


  sendMessage() {
    if (this.newMessage.trim()) {
      const encrypted = this.encryption.encrypt(this.newMessage);
      const message: Message = {
        content: encrypted,
        sender: this.currentUser?.username || 'Anonymous',
        receiver: "test",
        timestamp: new Date()
      };
      this.ws.sendMessage(message);
      this.newMessage = '';
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
