
export interface AuthRequest {
    type: AuthTypes;
    id_token: string;
}

export enum AuthTypes {
    GOOGLE = "google",
}
