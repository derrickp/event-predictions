
import { AppEvents } from "../AppEvents";
import * as auth from "../api/auth";
import { AuthTypes } from "../../common/AuthRequest";
import { GoogleAuthOptions } from "./GoogleAuthOptions";
import { User } from "./User";
import * as userFactory from "./UserFactory";
import { WatchHandle } from "../WatchHandle";

const GOOGLE_CLIENT_ID = "1038329696712-dcn0006s74elafi2t6prumb13olmu4q1.apps.googleusercontent.com";
const GOOGLE_SCOPE = "profile email";

export default class UserManager {

    private _initialized: boolean = false;
    private _googleAuth: gapi.auth2.GoogleAuth;
    private _watchCallbacks: Set<(eventName: string) => void> = new Set();
    private _user: User;

    authOptions: GoogleAuthOptions;

    get user() {
        return this._user;
    }

    constructor() {
        this.googleAuthCallback = this.googleAuthCallback.bind(this);
        this.googleAuthFailure = this.googleAuthFailure.bind(this);
    }

    watch(callback: (eventName: string) => void): WatchHandle {
        this._watchCallbacks.add(callback);
        return {
            remove: () => {
                this._watchCallbacks.delete(callback);
            }
        };
    }

    notify(event: AppEvents) {
        for (const callback of this._watchCallbacks) {
            callback(event);
        }
    }

    async googleAuthCallback(googleUser: gapi.auth2.GoogleUser) {
        this.notify(AppEvents.LOADING);
        const id_token = googleUser.getAuthResponse().id_token;
        const token = await auth.authenticate(AuthTypes.GOOGLE, id_token);
        const dto = await auth.getCurrentUser(token);
        const user = userFactory.get(dto, AuthTypes.GOOGLE);
        this._user = user;
        this.notify(AppEvents.NEW_USER);
    }

    googleAuthFailure() {
        debugger;
        this.notify(AppEvents.LOADING);
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
            this.googleAuthCallback(googleUser);
        }
        this._initialized = true;
        console.timeEnd("auth-init");
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