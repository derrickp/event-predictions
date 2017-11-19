
import { AuthTypes, AuthRequest } from "../../common/AuthRequest";
import { AuthResponse } from "../../common/AuthResponse";
import { apiUrl } from "../config";
import { User } from "../../common/User";

export async function authenticate(type: AuthTypes, id_token: string): Promise<string> {
    const authRequest: AuthRequest = {
        type,
        id_token
    };
    const response = await fetch(`${apiUrl}/authenticate`, {
        method: "POST",
        body: JSON.stringify(authRequest),
        headers: [
            [ "Content-Type", "application/json" ]
        ]
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }
    const json: AuthResponse = await response.json();
    return json.token;
}

export async function getCurrentUser(token: string): Promise<User> {
    const url = `${apiUrl}/users/my-info`;
    const response = await fetch(url, {
        headers: [
            [ "Authorization", `Bearer ${token}` ]
        ],
        method: "GET"
    });
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
    }
    const json: User = await response.json();
    return json;
}