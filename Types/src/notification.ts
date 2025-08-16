import { Format } from "./format";
import { User } from "./user";
 
export type Notification = {
    format: Format;
    dateGenerated: Date;
    user: User;
    state: boolean;
};
