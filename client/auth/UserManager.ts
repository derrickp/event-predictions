
import { AppEvents } from "../AppEvents";
import * as auth from "../api/auth";
import { AuthTypes } from "../../common/AuthRequest";
import { publish } from "../Dispatch";
import { GoogleAuthOptions } from "./GoogleAuthOptions";
import { Observable } from "../../common/Observable";
import { UserDTO } from "../../common/dtos/UserDTO";

const GOOGLE_CLIENT_ID = "1038329696712-dcn0006s74elafi2t6prumb13olmu4q1.apps.googleusercontent.com";
const GOOGLE_SCOPE = "profile email";

export default class UserManager extends Observable {
    private _authType: AuthTypes;
    private _initialized: boolean = false;
    private _googleAuth: gapi.auth2.GoogleAuth;
    private _user: UserDTO;
    private _token: string;

    authOptions: GoogleAuthOptions;

    get user() {
        return this._user;
    }

    get token() {
        return this._token;
    }

    constructor() {
        super();
        this.googleAuthCallback = this.googleAuthCallback.bind(this);
        this.googleAuthFailure = this.googleAuthFailure.bind(this);
    }

    async googleAuthCallback(googleUser: gapi.auth2.GoogleUser) {
        // If we already have a user, then we're good.
        // Let's just leave it for now.
        if (this.user) {
            return;
        }
        this._authType = AuthTypes.GOOGLE;
        publish(AppEvents.LOADING);
        const id_token = googleUser.getAuthResponse().id_token;
        const token = await auth.authenticate(AuthTypes.GOOGLE, id_token);
        this._token = token;
        const dto = await auth.getCurrentUser(token);
        this._user = dto;
        publish(AppEvents.NEW_USER);
    }

    googleAuthFailure() {
        publish(AppEvents.AUTH_FAILED);
    }

    async initialize() {
        if (this._initialized) {
            return;
        }
        console.time("auth-init");
        await this._configureGoogleAuth();
        await this._initGoogle();
        this.authOptions = {
            longTitle: true,
            scope: GOOGLE_SCOPE,
            onsuccess: this.googleAuthCallback,
            onfailure: this.googleAuthFailure,
            theme: "dark"
        }
        const googleUser = this._getGoogleUser();
        if (googleUser) {
            await this.googleAuthCallback(googleUser);
        }
        this._initialized = true;
        console.timeEnd("auth-init");
    }

    async signOut() {
        publish(AppEvents.LOADING);
        delete this._user;
        switch (this._authType) {
            case AuthTypes.GOOGLE:
                await this._googleSignOut();
                break;
        }
        publish(AppEvents.NEW_USER);
    }

    async _googleSignOut() {
        await gapi.auth2.getAuthInstance().signOut();
    }

    private _configureGoogleAuth(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const config: gapi.CallbackOrConfig = {
                callback: () => {
                    resolve();
                },
                onerror: (errorMessage: string) => {
                    reject(new Error(errorMessage));
                },
                timeout: 1000,
                ontimeout: () => {
                    reject(new Error("google auth timeout"));
                }
            }
            gapi.load("auth2", config);
        });
    }

    private _initGoogle(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            gapi.auth2.init({
                client_id: GOOGLE_CLIENT_ID
            }).then(() => {
                this._googleAuth = gapi.auth2.getAuthInstance();
                resolve();
            }, (errorMessage) => {
                reject(new Error(errorMessage));
            });
        });
    }

    private _getGoogleUser(): gapi.auth2.GoogleUser | undefined {
        const loggedIn = this._googleAuth.isSignedIn.get();
        if (loggedIn) {
            return this._googleAuth.currentUser.get();
        }
        return undefined;
    }
}