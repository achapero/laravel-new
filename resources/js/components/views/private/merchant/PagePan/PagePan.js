import React from "react";

const PagePan = () => {
    return (
        <div>
            <iframe
                src={window.location.origin + "/form/pan"}
                frameBorder="0"
                width="100%"
                style={{ height: "100vh" }}
            ></iframe>
        </div>
    );
};

export default PagePan;
