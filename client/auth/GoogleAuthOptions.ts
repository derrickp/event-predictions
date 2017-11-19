
export interface GoogleAuthOptions {
    scope: string;
    longTitle: boolean;
    theme: string;
    onsuccess: (user: gapi.auth2.GoogleUser) => void;
    onfailure: () => void;
}