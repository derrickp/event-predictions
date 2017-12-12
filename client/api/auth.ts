
import { AuthRequest, AuthTypes } from "../../common/AuthRequest";
import { AuthResponse } from "../../common/AuthResponse";
import { UserDTO } from "../../common/dtos/UserDTO";
import { apiUrl } from "../config";

export async function authenticate(type: AuthTypes, idToken: string): Promise<string> {
    const authRequest: AuthRequest = {
        type,
        id_token: idToken,
    };
    const response = await fetch(`${apiUrl}/authenticate`, {
        method: "POST",
        body: JSON.stringify(authRequest),
        headers: [
            [ "Content-Type", "application/json" ],
        ],
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }
    const json: AuthResponse = await response.json();
    return json.token;
}

export async function getCurrentUser(token: string): Promise<UserDTO> {
    const url = `${apiUrl}/users/my-info`;
    const response = await fetch(url, {
        headers: [
            [ "Authorization", `Bearer ${token}` ],
        ],
        method: "GET",
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }
    const json: UserDTO = await response.json();
    return json;
}
