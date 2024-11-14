import { Format } from "./format";

export type Notification = {
    format: Format;
    dateGenerated: Date;
    registered: boolean;
};
