export interface Conversations {
  _id: string;
  type: string;
  chats?: any;
  rooms?: any;
  last_send: Date;
  last_message: string;
  createdAt: Date;
}
