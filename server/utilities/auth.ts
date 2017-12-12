
import { AuthRequest, AuthTypes } from "../../common/AuthRequest";

const GOOGLE_CLIENT_ID = "1038329696712-dcn0006s74elafi2t6prumb13olmu4q1.apps.googleusercontent.com";

export async function verify(request: AuthRequest): Promise<GeneralAuthResponse> {
    if (!request.id_token) {
        throw new Error("no-id-token");
    }

    switch (request.type) {
        case AuthTypes.GOOGLE:
            const authResponse = await verifyGoogleId(request.id_token);
            return {
                email: authResponse.email,
                name: authResponse.name,
                picture: authResponse.picture,
            };
        default:
            throw new Error("invalid-auth-type");
    }
}

function verifyGoogleId(token: string): Promise<GoogleAuthResponse> {
    return new Promise<GoogleAuthResponse>((resolve, reject) => {
        const GoogleAuth = require("google-auth-library");
        const auth = new GoogleAuth();
        const client = new auth.OAuth2(GOOGLE_CLIENT_ID, "", "");
        client.verifyIdToken(
            token,
            GOOGLE_CLIENT_ID,
            // Or, if multiple clients access the backend:
            // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
            (error: string, login: any) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }
                const payload: GoogleAuthResponse = login.getPayload();
                resolve(payload);
            });
    });
}

export interface GoogleAuthResponse {
    email: string;
    email_verified: boolean;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    locale: string;
}

export interface GeneralAuthResponse {
    email: string;
    name: string;
    picture: string;
}
