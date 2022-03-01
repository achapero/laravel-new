import { Button, Col, message, Row, Steps } from "antd";
import React, { useEffect, useState } from "react";
import StepAddress from "./PageBoardingClearentBoardingProcessSteps/StepAddress";
import StepBankAccounts from "./PageBoardingClearentBoardingProcessSteps/StepBankAccounts";
import StepBusinessContacts from "./PageBoardingClearentBoardingProcessSteps/StepBusinessContacts";
import StepDocuments from "./PageBoardingClearentBoardingProcessSteps/StepDocuments";
import StepEquipments from "./PageBoardingClearentBoardingProcessSteps/StepEquipments";
import StepMerchant from "./PageBoardingClearentBoardingProcessSteps/StepMerchant";
import StepOwnershipDisclosure from "./PageBoardingClearentBoardingProcessSteps/StepOwnershipDisclosure";
import StepPricing from "./PageBoardingClearentBoardingProcessSteps/StepPricing";
import StepProfile from "./PageBoardingClearentBoardingProcessSteps/StepProfile";
import StepSignatures from "./PageBoardingClearentBoardingProcessSteps/StepSignatures";
import StepSiteSurvey from "./PageBoardingClearentBoardingProcessSteps/StepSiteSurvey";
import StepTaxpayer from "./PageBoardingClearentBoardingProcessSteps/StepTaxpayer";
import StepQualityAssurance from "./PageBoardingClearentBoardingProcessSteps/StepQualityAssurance";
import StepSubmit from "./PageBoardingClearentBoardingProcessSteps/StepSubmit";
import getUserData from "../../../../../providers/getUserData";
const { Step } = Steps;
const PageBoardingClearentBoardingProcess = ({ formData, inputData }) => {
    let userdata = getUserData();
    const [currentStep, setCurrentStep] = useState(0);
    const [stepsStatuses, setStepsStatuses] = useState([
        {
            title: <>Merchant (0/4)</>,
            raw_title: "Merchant",
            status:
                formData.notes &&
                formData.notes.indexOf("Merchant Details Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Profile (0/5)</>,
            raw_title: "Profile",
            status:
                formData.notes &&
                formData.notes.indexOf("Sales Profile Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Address (0/10)</>,
            raw_title: "Address",
            status:
                formData.notes &&
                formData.notes.indexOf("Physical Address Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Site Survey (0/1)</>,
            raw_title: "Site Survey",
            status:
                formData.notes &&
                formData.notes.indexOf("Site Survey Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Taxpayer (0/1)</>,
            raw_title: "Taxpayer",
            status:
                formData.notes &&
                formData.notes.indexOf("Tax Payer Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Bank Account (0/~)</>,
            raw_title: "Bank Account",
            status: "wait"
        },
        {
            title: <>Business Contact (0/~)</>,
            raw_title: "Business Contact",
            status:
                formData.notes &&
                formData.notes.indexOf("Business Contact Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Ownership Disclosure (0/1)</>,
            raw_title: "Ownership Disclosure",
            status:
                formData.notes &&
                formData.notes.indexOf("Ownership Disclosure Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Documents (0/~)</>,
            raw_title: "Documents",
            status: "wait"
        },
        {
            title: <>Equipment (0/~)</>,
            raw_title: "Equipment",
            status:
                formData.notes &&
                formData.notes.indexOf("Equipment Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Pricing (0/1)</>,
            raw_title: "Pricing",
            status:
                formData.notes &&
                formData.notes.indexOf("Pricing Submitted") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: <>Signatures (0/5)</>,
            raw_title: "Signatures",
            status:
                formData.notes &&
                formData.notes.indexOf("Signatures Uploaded") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: "Quality Assurance Review",
            status:
                formData.notes &&
                formData.notes.indexOf("Quality Assurance Review") !== -1
                    ? "finish"
                    : "wait"
        },
        {
            title: "Submit",
            status:
                formData.notes &&
                formData.notes.indexOf("Clearent Application Submitted") !== -1
                    ? "finish"
                    : "wait"
        }
    ]);

    // useEffect(() => {
    //     // console.log("currentStep", currentStep);
    //     let _stepsStatuses = [...stepsStatuses];

    //     _stepsStatuses[currentStep].status = "progress";
    //     setStepsStatuses(_stepsStatuses);

    //     return () => {};
    // }, [currentStep]);

    // useEffect(() => {
    //     // console.log("stepsStatuses", stepsStatuses);
    //     let _stepsStatuses = [...stepsStatuses];
    //     let _steps = [...steps];
    //     _steps.map((step, key) => {
    //         let _status = _stepsStatuses[key].status;
    //         let _title = _stepsStatuses[key].title;
    //         step.status = _status;
    //         step.title = _title;
    //     });

    //     setSteps(_steps);
    //     return () => {};
    // }, [stepsStatuses]);
    const next = () => {
        setCurrentStep(currentStep + 1);
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleChangeStep = currentStep => {
        setCurrentStep(currentStep);
    };

    return (
        <>
            <Row>
                <Col xs={24} md={24} className="stepsBoarding">
                    <Steps
                        current={currentStep}
                        onChange={e => handleChangeStep(e)}
                        progressDot={userdata.role == "Merchant" ? true : false}
                        style={{ marginBottom: 10 }}
                        className="stepsBoardingBreak"
                    >
                        {stepsStatuses.map((item, key) => {
                            let disabled = false;
                            if (key == 10 || key == 11) {
                                disabled = true;
                                let finished = stepsStatuses.filter(
                                    p => p.status == "finish"
                                );
                                // console.log("finished", finished);
                                if (finished.length >= 10) {
                                    disabled = false;
                                }
                            }
                            let merchants = [0, 2, 4, 5, 6, 7, 8, 10, 11];
                            let hide = false;
                            if (userdata.role == "Merchant") {
                                if (!merchants.includes(key)) {
                                    hide = true;
                                }

                                if (key == 10) {
                                    let count = 0;
                                    for (
                                        let index = 0;
                                        index < merchants.length;
                                        index++
                                    ) {
                                        if (
                                            stepsStatuses[index].status ==
                                            "finish"
                                        ) {
                                            count++;
                                        }
                                    }
                                    disabled = true;
                                    if (count >= 7) {
                                        disabled = false;
                                    }
                                }
                                if (key == 11) {
                                    let count = 0;
                                    for (
                                        let index = 0;
                                        index < merchants.length;
                                        index++
                                    ) {
                                        if (
                                            stepsStatuses[index].status ==
                                            "finish"
                                        ) {
                                            count++;
                                        }
                                    }
                                    disabled = true;
                                    if (
                                        count >= 7 &&
                                        stepsStatuses[10].status == "finish"
                                    ) {
                                        disabled = false;
                                    }
                                }
                            }

                            // console.log("item.raw_title", item.raw_title);
                            // console.log("item.status", item.status);
                            return (
                                <Step
                                    key={item.title}
                                    title={item.title}
                                    status={item.status}
                                    disabled={disabled}
                                    style={{ display: hide ? "none" : "" }}
                                />
                            );
                        })}
                    </Steps>
                </Col>
                <Col xs={24} md={24} style={{ marginTop: "20px" }}>
                    <div className="steps-content">
                        <div className={currentStep == 0 ? "" : "hide"}>
                            <StepMerchant
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 1 ? "" : "hide"}>
                            <StepProfile
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 2 ? "" : "hide"}>
                            <StepAddress
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 3 ? "" : "hide"}>
                            <StepSiteSurvey
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 4 ? "" : "hide"}>
                            <StepTaxpayer
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 5 ? "" : "hide"}>
                            <StepBankAccounts
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 6 ? "" : "hide"}>
                            <StepBusinessContacts
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 7 ? "" : "hide"}>
                            <StepOwnershipDisclosure
                                merchantNumber={
                                    formData.clearent_boarding.merchantNumber
                                }
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 8 ? "" : "hide"}>
                            <StepDocuments
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 9 ? "" : "hide"}>
                            <StepEquipments
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 10 ? "" : "hide"}>
                            <StepPricing
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 11 ? "" : "hide"}>
                            <StepSignatures
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 12 ? "" : "hide"}>
                            <StepQualityAssurance
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                        <div className={currentStep == 13 ? "" : "hide"}>
                            <StepSubmit
                                formData={formData}
                                inputData={inputData}
                                stepsStatuses={stepsStatuses}
                                setStepsStatuses={setStepsStatuses}
                                currentStep={currentStep}
                                setCurrentStep={setCurrentStep}
                            />
                        </div>
                    </div>
                    {/* <div className="steps-action">
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={() =>
                                    message.success("Processing complete!")
                                }
                            >
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button
                                style={{ margin: "0 8px" }}
                                onClick={() => prev()}
                            >
                                Previous
                            </Button>
                        )}
                </div> */}
                </Col>
            </Row>
        </>
    );
};

export default PageBoardingClearentBoardingProcess;
