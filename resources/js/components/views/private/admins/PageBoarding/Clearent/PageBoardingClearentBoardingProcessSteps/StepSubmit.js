import React, { useEffect, useState, useContext } from "react";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import { Form, Button, Alert, Divider, notification } from "antd";
const StepSubmit = ({
    formData,
    inputData,
    stepsStatuses,
    setStepsStatuses,
    currentStep,
    setCurrentStep
}) => {
    const [form] = Form.useForm();
    let userdata = getUserData();
    const merchantNumber = formData.clearent_boarding.merchantNumber;
    const clearent_boarding = formData.clearent_boarding;
    const [errorMessage, setErrorMessage] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        if (currentStep == 13) {
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }
        }

        if (
            formData.notes &&
            formData.notes.indexOf("Clearent Application Submitted") !== -1
        ) {
            let _steps = [...stepsStatuses];
            _steps[13] = {
                ..._steps[13],
                status: "finish"
            };
            setStepsStatuses(_steps);
            console.log("_steps", _steps);
        }
        return () => {};
    }, [currentStep]);

    const submitApp = () => {
        mutateSubmit(
            { merchantNumber: merchantNumber },
            {
                onSuccess: res => {
                    if (res.success) {
                        if (res.data) {
                            if (res.data.errors) {
                                console.log("res.data.errors", res.data.errors);
                                if (res.data.errors.length > 0) {
                                    res.data.errors.map((error, key) => {
                                        notification.error({
                                            message: error.errorMessage
                                        });
                                    });
                                }
                            } else {
                                setErrorMessage([]);
                                setSuccessMessage("Application Submitted!");
                            }
                        } else {
                            setErrorMessage([]);
                            setSuccessMessage("Application Submitted!");
                        }
                    }
                },
                onError: error => {
                    $(target).html("Change Status to Quality Assurance Review");
                    setSuccessMessage(false);
                    setErrorMessage(error);
                }
            }
        );
    };

    const { mutate: mutateSubmit, isLoading: isLoadingSubmit } = useAxiosQuery(
        "POST",
        "api/v1/clearent/submit",
        "submited"
    );

    return (
        <div style={{ position: "relative", width: "100%" }}>
            {userdata.role == "Merchant" && <div className="overlay"></div>}
            {(clearent_boarding.status == "Boarded" ||
                clearent_boarding.status == "Shipped") && (
                <div className="overlay text-center">
                    <i
                        className="fa fa-check"
                        style={{ marginTop: 35, fontSize: 35, color: "green" }}
                    ></i>
                </div>
            )}
            <h1>Submit</h1>
            <Divider></Divider>
            <Button
                type="primary"
                style={{ background: "#0cc2aa", borderColor: "#0cc2aa" }}
                onClick={e => submitApp()}
                loading={isLoadingSubmit}
                disabled={
                    clearent_boarding.status == "Boarded" ||
                    clearent_boarding.status == "Shipped"
                }
            >
                Submit Application
            </Button>
            <br />
            <br />
            <div className="text-center">
                {errorMessage.length !== 0 && (
                    <Alert message={errorMessage.message} type="error" />
                )}
                {successMessage && (
                    <Alert message={successMessage} type="success" />
                )}
            </div>
        </div>
    );
};

export default StepSubmit;
