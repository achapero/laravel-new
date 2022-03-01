require("./bootstrap");

import React from "react";
import { render } from "react-dom";
import Routes from "./components/routes";
import { H } from "highlight.run";
H.init(process.env.MIX_HIGHLIGHT_ID, {
    networkRecording: {
        enabled: true,
        recordHeadersAndBody: true
    }
});

render(<Routes />, document.getElementById("app"));
