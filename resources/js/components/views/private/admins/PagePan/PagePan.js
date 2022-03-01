import React from "react";

const PagePan = () => {
    return (
        <div>
            <iframe
                src={window.location.origin + "/form/pan"}
                frameBorder="0"
                width="100%"
                scrolling="no"
                style={{ height: "800px", overflow: 'hidden' }}
            ></iframe>
        </div>
    );
};

export default PagePan;
