import { UserType } from "./enums";

export type JwtPayloadType = {
    id: number;
    userType: string;
}
export type accessTokenType = {
    accessToken: string;
}
export interface UserProfile {
    email: string;
    username: string;
    userType: UserType;
    id: number;
    created_at: Date;
    updated_at: Date;
    isAccountVerified: boolean;
}