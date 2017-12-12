
import * as React from "react";

export interface WelcomeMessageProps { }

export function WelcomeMessage(props: WelcomeMessageProps) {
    return (
        <div className={"welcome-container"}>
            <div className="welcome-message">
                Welcome to the new Event Predictions app!
                To see your upcoming events please log in.
            </div>
        </div>
    );
}
