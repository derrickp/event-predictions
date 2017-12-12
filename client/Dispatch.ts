
import { Handle } from "../common/Handle";
import { AppEvents } from "./AppEvents";

interface Subscription {
    callback: (eventName: AppEvents, data?: any) => void;
}

const _subscriptions: Map<AppEvents, Set<Subscription>> = new Map();

export function subscribe(eventName: AppEvents, callback: (eventName: AppEvents, data?: any) => void): Handle {
    const subscription: Subscription = {
        callback,
    };
    const handle: Handle = {
        remove: () => {
            const subs = _subscriptions.get(eventName) as Set<Subscription>;
            subs.delete(subscription);
        },
    };

    if (!_subscriptions.has(eventName)) {
        _subscriptions.set(eventName, new Set());
    }
    const subscriptions = _subscriptions.get(eventName) as Set<Subscription>;
    subscriptions.add(subscription);
    return handle;
}

export function publish(eventName: AppEvents, data?: any) {
    if (_subscriptions.has(AppEvents.ALL_EVENTS)) {
        const allSubscriptions = _subscriptions.get(AppEvents.ALL_EVENTS) as Set<Subscription>;
        for (const subscription of allSubscriptions) {
            subscription.callback(eventName, data);
        }
    }

    if (!_subscriptions.has(eventName)) {
        return;
    }

    const subscriptions = _subscriptions.get(eventName) as Set<Subscription>;
    for (const subscription of subscriptions) {
        subscription.callback(eventName, data);
    }
}
