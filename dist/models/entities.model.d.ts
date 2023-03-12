import { BaseEntity } from "typeorm";
export declare class User extends BaseEntity {
    uId: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    state: boolean;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
