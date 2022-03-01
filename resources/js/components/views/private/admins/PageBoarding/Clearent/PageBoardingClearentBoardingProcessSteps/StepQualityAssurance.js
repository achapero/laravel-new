import React, { useEffect, useState, useContext } from "react";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import { Form, Button, Alert, Divider } from "antd";
import {
    DeleteFilled,
    DeleteOutlined,
    EditOutlined,
    RightOutlined
} from "@ant-design/icons";
const StepQualityAssurance = ({
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
    const [errorMessage, setErrorMessage] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        if (currentStep == 12) {
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }
        }
        // console.log("@formData", formData);
        if (
            formData.notes &&
            formData.notes.indexOf("Quality Assurance Review") !== -1
        ) {
            let _steps = [...stepsStatuses];
            _steps[12] = {
                ..._steps[12],
                status: "finish"
            };
            setStepsStatuses(_steps);
            console.log("_steps", _steps);
        }
        return () => {};
    }, [currentStep]);

    const reviewApp = target => {
        console.log(target);
        $(target).html("<i className='fa fa-spin fa-circle-o-notch'></i>");
        mutateReview(
            { review: 1, merchantNumber: merchantNumber },
            {
                onSuccess: res => {
                    if (res.success) {
                        $(target).html(
                            "Change Status to Quality Assurance Review"
                        );
                        setErrorMessage([]);
                        setSuccessMessage(
                            "Application Status Changed to Quality Assurance Review!"
                        );
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

    const { mutate: mutateReview, isLoading: isLoadingReview } = useAxiosQuery(
        "POST",
        "api/v1/clearent/submit/submit",
        "submit_review"
    );

    return (
        <div style={{ position: "relative", width: "100%" }}>
            {userdata.role == "Merchant" && <div className="overlay"></div>}
            <h1>Review</h1>
            <Divider></Divider>
            <Button
                type="primary"
                style={{ background: "#0cc2aa", borderColor: "#0cc2aa" }}
                onClick={e => reviewApp(e.target)}
            >
                Change Status to Quality Assurance Review
            </Button>
            <br />
            {formData.notes && formData.notes.indexOf("Quality Assurance Review") !== -1 &&
                <>
                    <Divider />
                    <Button
                        icon={<RightOutlined />}
                        type="primary"
                        onClick={e => setCurrentStep(currentStep + 1)}
                    >
                        Next
                    </Button>
                </>
            }
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

export default StepQualityAssurance;
