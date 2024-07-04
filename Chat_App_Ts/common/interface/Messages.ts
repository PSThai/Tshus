import { MesssageState } from "common/enum/message-state";
import { MessageType } from "../enum/message-type";
import { ChaterType } from "../types/chat/chater.type";

export interface Messages {
     _id?: string;
     conversation: string | undefined;
     type: MessageType;
     files: any[];
     messages: string;
     state: MesssageState;
     sender: ChaterType;
     send_at?: Date;
     last_message?: string;
}
