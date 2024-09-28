import { User } from "src/users/entities/user.entity";

export class CreateConsultancyDto {
    readonly title: string;
    readonly description: string;
    readonly startDate: string;
    readonly startTime: string;
    readonly duration: string;
    readonly adviser: User;
    readonly participants: User[];
    readonly type: boolean;
}
