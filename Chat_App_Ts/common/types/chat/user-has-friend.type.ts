import { FriendStateEnum } from "../../enum/friend-state.enum";
import { User } from '../../interface/User';

export interface UserHasFriend extends User {
  state: FriendStateEnum;
  isSender: boolean;
}
