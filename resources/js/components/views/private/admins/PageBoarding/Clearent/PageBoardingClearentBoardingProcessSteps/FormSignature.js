import React, { useEffect, useState, useContext } from "react";
import {
    Form,
    notification,
    Button,
    Modal,
    List,
    Typography,
    Divider,
    Collapse,
    Checkbox,
    Row,
    Col,
    Card,
    Space,
    Alert
} from "antd";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import Context from "../../../../../../providers/context";

const FormSignature = ({
    sourceTypes,
    formSignatureData,
    setFormSignatureData,
    merchantNumber,
    submittedData,
    changeToReview,
    stepsStatuses,
    setStepsStatuses,
    currentStep,
    setCurrentStep,
    formData,
}) => {
    const { state, dispatch } = useContext(Context);
    const userdata = getUserData();

    const [errorMessage, setErrorMessage] = useState([]);
    const [successMessage, setSuccessMessage] = useState(false);
    const [successMessageSaved, setSuccessMessageSaved] = useState(false);
    const [showLoadingSave, setShowLoadingSave] = useState("Save");

    useEffect(() => {
        if (
            formSignatureData &&
            formSignatureData.content[0].businessContactId
        ) {
        } else {
            mutateGetSignatureDB(
                { merchantNumber: merchantNumber },
                {
                    onSuccess: res => {
                        if (res.success) {
                            let saved = res.saved[0].signature;
                            if (saved != null) {
                                setFormSignatureData(saved);
                                console.log(
                                    "mutateGetSignatureDB",
                                    JSON.parse(saved)
                                );
                            }
                        }
                    }
                }
            );
            console.log("userdata", userdata.role);
        }

        return () => {};
    }, []);

    const {
        mutate: mutateGetSignatureDB,
        isLoading: isLoadingGetSignatureDB
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/getSignatureDB",
        "clearent_getSignatureDB"
    );

    const UpdateField = (e, index) => {
        let _formSignatureData = formSignatureData;

        if (e.target.name == "signatureSourceTypeId") {
            _formSignatureData.content[index][e.target.name] = parseInt(
                e.target.value
            );
        } else {
            _formSignatureData.content[index][e.target.name] =
                e.target.value == "true" ? true : false;
        }

        setFormSignatureData({ ..._formSignatureData });
    };

    const saveToDB = e => {
        let data = formSignatureData;
        let a = {
            merchantNumber: merchantNumber,
            data: data
        };
        setShowLoadingSave(loadingIcon);
        mutateSaveSignatureDB(a, {
            onSuccess: res => {
                if (res.success) {
                    setShowLoadingSave("Save");
                    setSuccessMessageSaved(true);
                    setErrorMessage([]);
                    setSuccessMessage(false);
                }
            }
        });
    };

    const {
        mutate: mutateSaveSignatureDB,
        isLoading: isLoadingSaveSignatureDB
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/saveSignatureDB",
        "clearent_saveSignatureDB"
    );

    const handleUploadSignature = target => {
        if (
            submittedData.clearent_boarding.status ==
                "Quality Assurance Review" &&
            userdata.role == "Merchant"
        ) {
            notification.error({
                message: "Alert",
                description:
                    'Your application status is on "Quality Assurance Review", if you wish to update your information, please submit a ticket. Thank you'
            });
        } else {
            $(target).html('<i className="fa fa-spin fa-circle-o-notch"></i>');
            setErrorMessage([]);
            let data = {
                merchantNumber: merchantNumber,
                signatures: formSignatureData
            };
            console.log("@data", data);
            mutateSignature(data, {
                onSuccess: res => {
                    if (res.success) {
                        console.log(res);
                        setErrorMessage([]);

                        if (userdata.role == "Merchant") {
                            changeToReview();
                            $(target).html("Update Clearent Signature");
                        } else if (res.data.errors) {
                            if (res.data.errors.length > 0) {
                                setSuccessMessage(
                                    res.data.errors[0].errorMessage
                                );
                                $(target).html("Update Clearent Signature");
                            }
                        } else {
                            setSuccessMessage("Signature Uploaded!");
                            setFormSignatureData(res.data);
                            $(target).html("Update Clearent Signature");
                        }

                        let _steps = [...stepsStatuses];
                        _steps[11] = {
                            ..._steps[11],
                            title: "Signatures (5/5)",
                            status: "finish"
                        };
                        setStepsStatuses(_steps);
                    }
                },
                onError: err => {
                    setErrorMessage(res.data.errors);
                    setSuccessMessage(false);
                    setSuccessMessageSaved(false);
                }
            });
        }
    };

    const {
        mutate: mutateSignature,
        isLoading: isLoadingSignature
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/signature",
        "clearent_signature"
    );

    const [TARTGET, setTARTGET] = useState();
    const [checkboxAccept, setCheckboxAccept] = useState(false);

    const handleSubmitSignature = target => {
        $(target).html(
            "Submitting Signatures <i className='fa fa-spin fa-circle-o-notch'></i>"
        );
        setTARTGET(target);
        if (checkboxAccept == true) {
            refetchGetClearentSignature();
        }
    };

    const {
        data: dataGetClearentSignature,
        isLoading: isLoadingGetClearentSignature,
        refetch: refetchGetClearentSignature
    } = useAxiosQuery(
        `GET_MANUAL`,
        `api/v1/clearent/signature/submit/${merchantNumber}`,
        `clearent_signature_data`,
        res => {
            if (res.success) {
                console.log("refetchGetClearentSignature", res);
                // if (res.data.errors) {
                //     // setErrorMessage(res.data.errors);
                //     setErrorMessage([]);
                //     setSuccessMessage("Signature Submitted!");
                // } else {
                //     // setFormSignatureData({ ...res.data });
                // }
                notification.success({ message: "Signature Submitted!" });
                setErrorMessage([]);
                setSuccessMessage("Signature Submitted!");
                $(TARTGET).html("Submit Signatures");
            }
        }
    );

    return (
        <div style={{ width: "100%" }}>
            <br></br>
            <div className="text-center">
                {errorMessage.length !== 0 && (
                    <div>
                        {errorMessage.map((error, index) => {
                            return (
                                <Alert
                                    message={error.errorMessage}
                                    type="error"
                                />
                            );
                        })}
                    </div>
                )}
                {successMessage && (
                    <Alert message={successMessage} type="info" />
                )}
                {successMessageSaved === true && (
                    <Alert
                        message="Sales Profile Saved Sucessfully !"
                        type="success"
                    />
                )}
            </div>
            <br />
            <br />
            <Button
                type="primary"
                onClick={e => handleUploadSignature(e.target)}
            >
                {formSignatureData &&
                formSignatureData.content[0].businessContactId
                    ? "Update Clearent Signature"
                    : "Upload to Clearent Signatures"}
            </Button>
            {formSignatureData && formSignatureData.content[0].businessContactId ? (
                <Row gutter={24}>
                    <Col className="gutter-row" span={24} style={{marginTop: 15}}>
                        <Checkbox
                            checked={checkboxAccept}
                            onClick={e => {
                                if (e.target.checked) {
                                    setCheckboxAccept(true);
                                } else {
                                    setCheckboxAccept(false);
                                }
                            }}
                        >
                            {" "}
                            By clicking the submit button, you acknowledge
                            that you have read, understood and
                            agree to the terms and conditions set forth
                            above.
                        </Checkbox>
                    </Col>
                    <Col className="gutter-row" span={24} style={{marginTop: 15}}>
                        <Space>
                            <Button
                                type="danger"
                                onClick={e => handleSubmitSignature(e.target)}
                                disabled={!checkboxAccept}
                            >
                                Submit Signature
                            </Button>
                            {formSignatureData && (
                                <>
                                    {formSignatureData.content[0].businessContactId ? (
                                        <Button
                                            block={true}
                                            type="primary"
                                            style={{width: '200px'}}
                                            onClick={e => {
                                                if ( formData.clearent_boarding.status == "Quality Assurance Review" && userdata.role == "Merchant" ) {
                                                    notification.info({
                                                        message: "Alert",
                                                        description:
                                                            'Your application status is on "Quality Assurance Review", if you wish to update your information, please submit a ticket. Thank you'
                                                    });
                                                } else {
                                                    if ( userdata.role == "Merchant" ) {
                                                        refetchGetToReview();
                                                    } else {
                                                        let _steps = [...stepsStatuses];
                                                        _steps[11] = {
                                                            ..._steps[11],
                                                            title: "Signatures (5/5)",
                                                            status: "finish"
                                                        };
                                                        setStepsStatuses(_steps);
                                                        setCurrentStep(userdata.role == "Merchant" ? 11 : currentStep + 1)
                                                    }
                                                }
                                            }}
                                        >
                                            {userdata.role == "Merchant" ? "Finish" : "Next"}
                                        </Button>
                                    ) : (  "" )}
                                </>
                            )}
                        </Space>
                    </Col>
                    <Col className="gutter-row" md={4} style={{marginTop: 15}}>
                    </Col>
                </Row>
            ) : ( "" )}
            {/*<div className="text-center">
                <br></br>
                {userdata.role != "Merchant" && ""}
                <div>
                    <br></br>
                </div>
            </div>
            <Row style={{ textAlign: "left" }}>
                <Col md="3"></Col>
                <Col md="3"></Col>
            </Row>*/}
        </div>
    );
};

export default FormSignature;
