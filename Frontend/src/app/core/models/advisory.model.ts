import { User } from "./user.model";

export interface Advisory {
    _id: string | null;
    title: string;
    description?: string;
    startDate: string;
    startTime: string;
    duration: string;
    adviser?: User;
    participants?: User[];
    type: boolean;
    ownerId?: string;
}
