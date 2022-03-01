import { Alert, Button, Divider, Modal } from "antd";
import React, { useEffect, useState } from "react";

const StepPricingModalCalendly = ({
    showModalCalendly,
    toggleShowModalCalendly,
    merchantNumber
}) => {
    useEffect(() => {
        return () => {};
    }, []);
    const [showSuccess, setShowSuccess] = useState(false);
    const signOut = e => {
        setShowSuccess(true);
        setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userdata");
            window.location.href = window.location.origin + "/login";
            localStorage.setItem("calendly_app_" + merchantNumber, 1);
        }, 5000);
    };

    let calendly_app = localStorage["calendly_app_" + merchantNumber];
    return (
        <Modal
            title="Pricing will be set during your signing appointment"
            visible={showModalCalendly}
            onCancel={e => toggleShowModalCalendly(false)}
            okText="Schedule Appointment"
            onOk={e => signOut()}
            okButtonProps={{ className: !calendly_app ? "" : "hide" }}
            width={"70%"}
        >
            {!calendly_app ? (
                <iframe
                    src="https://calendly.com/pospayaja/60min?month=2021-02"
                    style={{ minWidth: "100%", height: 900 }}
                    frameBorder="0"
                ></iframe>
            ) : (
                <Alert
                    type="success"
                    className="text-center"
                    description="Our records show you've already scheduled your signing
                appointment. Please check your email for confirmation"
                ></Alert>
            )}
            {showSuccess && (
                <Alert
                    type="success"
                    className="text-center"
                    description="Your next step is your signing appointment. Look for the
                confirmation email. You are now being logged out"
                ></Alert>
            )}
            <Divider />
        </Modal>
    );
};

export default StepPricingModalCalendly;
