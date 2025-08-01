import { Format } from "./format";
import { User } from "./user";
 
export type Notification = {
    format: Format;
    dateGenerated: Date;
    users: User[];
    state: boolean;
};
