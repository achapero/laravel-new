import React from "react";

const PageTerminals = () => {
    return (
        <div>
            <iframe
                src={window.location.origin + "/form/terminalorderrequest"}
                frameBorder="0"
                width="100%"
                style={{ height: "100vh" }}
            ></iframe>
        </div>
    );
};

export default PageTerminals;
