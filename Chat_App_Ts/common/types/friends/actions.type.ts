import { ChaterType } from "../user/chater.type";

export type FriendsActionsDto = {
  action: string;
  id: string;
  sender: ChaterType;
  receiver: ChaterType;
}
