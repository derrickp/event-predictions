
import { Handle } from "./Handle";

export class Observable {
    callbacks: Map<(propertyName: string) => void, Handle> = new Map();

    watch(callback: (propertyName: string) => void): Handle {
        if (this.callbacks.has(callback)) {
            return this.callbacks.get(callback) as Handle;
        }
        const handle: Handle = {
            remove: () => {
                this.callbacks.delete(callback);
            },
        };
        this.callbacks.set(callback, handle);
        return handle;
    }

    notify(propertyName: string) {
        for (const callback of this.callbacks.keys()) {
            callback(propertyName);
        }
    }
}
