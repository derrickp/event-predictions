
export function getKeyFromEmail(email: string): string {
    if (!email || email === "") {
        return email;
    }
    const key = (new Buffer(email)).toString("base64");
    return key;
}
