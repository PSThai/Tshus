import { RoommembersEnum } from "../enum/roommember-role.enum";

export interface Roommembers {
     _id: string;
     nickname: string;
     role: RoommembersEnum;
     block: boolean;
     createdAt: Date;
     updated_at: Date;
}