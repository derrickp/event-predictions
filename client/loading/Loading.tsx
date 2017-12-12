
import * as React from "react";

import CircularProgress from "material-ui/CircularProgress";

export const Loading = () => {
    return (
        <div className={"loading-container"}>
            <div className={"loading-message"}>
                Please wait while we load the stuff.
            </div>
            <div className={"loading-message"}>
                <CircularProgress size={80} thickness={7} />
            </div>
        </div>
    );
};
