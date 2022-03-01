import React, { useEffect, useState, useContext } from "react";
import {
    Form,
    notification,
    Button,
    Modal,
    List,
    Space,
    Divider,
    Collapse,
    Skeleton,
    Row,
    Col
} from "antd";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import Context from "../../../../../../providers/context";
import defaultFormSignatureData from "./SignatureTabs/defaultFormSignatureData";
import TabEsign from "./SignatureTabs/TabEsign";
import TabMAcceptance from "./SignatureTabs/TabMAcceptance";
import TabPGuarantee from "./SignatureTabs/TabPGuarantee";
import TabW9 from "./SignatureTabs/TabW9";
import TabBDisclosure from "./SignatureTabs/TabBDisclosure";

import FormSignature from "./FormSignature";

const StepSignatures = ({
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
    const { Panel } = Collapse;
    const { state, dispatch } = useContext(Context);

    const [showLoading, setShowLoading] = useState(false);
    const [docSignatures, setDocSignatures] = useState([]);
    const [signatureSections, setSignatureSections] = useState([]);
    const [sourceTypes, setSourceTypes] = useState([]);
    const [showTableSignature, setShowTableSignature] = useState(false);
    const [formSignatureData, setFormSignatureData] = useState();

    useEffect(() => {
        if (currentStep == 11) {
            console.log('stepsStatuses[currentStep].status', stepsStatuses[currentStep].status)
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }  
            if (formData) {
                console.log("@formData", formData);
                refetchGetSignature();
            }
            if (showLoading == false && initialState) {
                setModalShow(true);
            }
        }
        return () => {};
    }, [currentStep]);

    const [termsAndConditions, setTermsAndConditions] = useState();

    const {
        data: dataGetSignature,
        isLoading: isLoadingGetSignature,
        refetch: refetchGetSignature
    } = useAxiosQuery(
        // `GET_MANUAL`,
        `GET`,
        "api/v1/clearent/signature/" +
            formData.email +
            "_merchantNumber=" +
            merchantNumber,
        `get_signature`,
        res => {
            if (res.success) {
                console.log("@api/v1/clearent/signature/", res);
                setShowTableSignature(true);
                setSignatureSections(res.signatureSections.content);
                setSourceTypes(res.sourceTypes.content);
                setDocSignatures(res.docs);
                setTermsAndConditions(res.terms);

                if ( res.signatures.content && res.signatures.content.length > 0 ) {
                    setFormSignatureData(res.signatures);
                    let _steps = [...stepsStatuses];
                    _steps[11] = {
                        ..._steps[11],
                        title: "Signatures (5/5)",
                        status: "finish"
                    };
                    setStepsStatuses(_steps);
                    console.log("setFormSignatureData 1", res.signatures);
                } else {
                    let timeStamp = "";
                    let ip_address = "";
                    if (res.docs.length > 0) {
                        //console.log(res.docs);
                        timeStamp = res.docs[res.docs.length - 1].updated_date;
                        ip_address = res.docs[res.docs.length - 1].ip_address;
                    }

                    let _defaultFormSignatureData = defaultFormSignatureData;
                    _defaultFormSignatureData.content.map((data, key) => {
                        data.ipAddress = ip_address;
                        data.timestamp = timeStamp;
                        data.signatureSourceTypeId = 2;
                    });
                    setFormSignatureData(_defaultFormSignatureData);
                    console.log( "setFormSignatureData 2", _defaultFormSignatureData
                    );
                    
                } 
                setShowLoading(false);
            }
        }
    );

    useEffect(() => {
        if (formSignatureData) {
            // console.log("formSignatureData", formSignatureData.content[0]);
            if (formSignatureData.content[0].businessContactId) {
                // saveDispatCountReq(5, "tab_signature", true);
                setInitialState(false);
                setModalShow(false);
            }
        }
        return () => {};
    }, [formSignatureData]);

    const [updatePdfDisabled, setUpdatePdfDisabled] = useState(false);

    const handleUpdatePdf = typeNumber => {
        console.log("@typeNumber", typeNumber);
        // fetchData("POST", "clearent/signature/pdf", {
        //     merchantNumber: merchantNumber,
        //     email: formData.email,
        //     typeNumber: typeNumber
        // }).then(res => {
        //     window.open(res.data);

        //     setTimeout(() => {
        //         fetchData(
        //             "DELETE",
        //             "clearent/signature/" +
        //                 merchantNumber +
        //                 "?typeNumber=" +
        //                 typeNumber
        //         ).then(res => {
        //         });
        //     }, 1000);
        // });

        mutateUpdatePdf(
            {
                merchantNumber: merchantNumber,
                email: formData.email,
                typeNumber: typeNumber
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        window.open(res.data);
                        // console.log('mutateUpdatePdf',res.data)
                        mutateDELETE(
                            { id: merchantNumber, typeNumber: typeNumber },
                            {
                                onSuccess: res => {}
                            }
                        );
                    }
                },
                onError: err => {}
            }
        );
    };

    const { mutate: mutateDELETE, isLoading: isLoadingDELETE } = useAxiosQuery(
        "DELETE",
        `api/v1/clearent/signature`,
        "handleDELETE"
    );

    const {
        mutate: mutateUpdatePdf,
        isLoading: isLoadingUpdatePdf
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/signature/pdf",
        "handleUpdatePdf"
    );

    const [signatureTabs, setSignatureTabs] = useState({
        eSign: {
            isOpen: true,
            isSigned: false
        },
        mAccept: {
            isOpen: false,
            isSigned: false
        },
        pGuarantee: {
            isOpen: false,
            isSigned: false
        },
        w9: {
            isOpen: false,
            isSigned: false
        },
        bDisclosure: {
            isOpen: false,
            isSigned: false
        }
    });

    const [showSubmitToClearent, setShowSubmitToClearent] = useState(false);

    useEffect(() => {
        if (
            signatureTabs.eSign.isSigned &&
            signatureTabs.mAccept.isSigned &&
            signatureTabs.pGuarantee.isSigned &&
            signatureTabs.w9.isSigned &&
            signatureTabs.bDisclosure.isSigned
        ) {
            setShowSubmitToClearent(true);
        }
        let count_tab_signature = parseInt($("#count_tab_signature").html());
        if (
            signatureTabs.eSign.isSigned ||
            signatureTabs.mAccept.isSigned ||
            signatureTabs.pGuarantee.isSigned ||
            signatureTabs.w9.isSigned ||
            signatureTabs.bDisclosure.isSigned
        ) {
            //console.log("wew");
            $("#count_tab_signature").html(
                count_tab_signature < 5
                    ? count_tab_signature + 1
                    : count_tab_signature
            );
        } else {
            $("#count_tab_signature").html(
                count_tab_signature != 0
                    ? count_tab_signature - 1
                    : count_tab_signature
            );
        }
        return () => {};
    }, [signatureTabs]);

    useEffect(() => {
        if (
            formSignatureData &&
            formSignatureData.content[0].businessContactId
        ) {
            setSignatureTabs({
                eSign: {
                    isOpen: false,
                    isSigned: true
                },
                mAccept: {
                    isOpen: false,
                    isSigned: true
                },
                pGuarantee: {
                    isOpen: false,
                    isSigned: true
                },
                w9: {
                    isOpen: false,
                    isSigned: true
                },
                bDisclosure: {
                    isOpen: false,
                    isSigned: true
                }
            });
        }
        return () => {};
    }, [formSignatureData]);

    const [initialState, setInitialState] = useState(true);

    const btn = (
        <Button
            type="primary"
            size="small"
            onClick={() => notification.close(key)}
        >
            Confirm
        </Button>
    );
    const key = `open${Date.now()}`;
    const close = () => {
        location.reload();
    };
    const {
        data: dataGetToReview,
        isLoading: isLoadingGetToReview,
        refetch: refetchGetToReview
    } = useAxiosQuery(
        `GET_MANUAL`,
        `api/v1/clearent/submit?review=1&merchantNumber=${merchantNumber}`,
        `get_to_review`,
        res => {
            if (res.success) {
                notification.open({
                    message: "Aler",
                    description:
                        "Thank you! Your application is being checked for quality assurance. Your representative will be in touch shortly.",
                    duration: 0,
                    btn,
                    key,
                    onClose: close
                });
            }
        }
    );

    const [ModalShow, setModalShow] = useState(false);

    const handleOk = () => {
        setModalShow(false);
    };

    const handleCancel = () => {
        setModalShow(false);
    };

    function callback(key) {
        console.log(key);
    }

    return dataGetSignature ? (
        <div id="tabSignatures">
            <div style={{ position: "relative", width: "100%" }}>
                {showLoading && (
                    <div className="overlay">
                        <i className="fa fa-spin fa-circle-o-notch overlay-loading"></i>
                    </div>
                )}
                <Modal
                    title={false}
                    visible={ModalShow}
                    width={700}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={false}
                >
                    <h4>Electronic Signatures Ackowledgement</h4>
                    By checking <b>Agree & Continue</b>, you are consenting to
                    the use of your electronic signature in lieu of an original
                    signature on paper. You have the right to request that you
                    sign a paper copy (for your records) in addition to this
                    electronic version. Promise Network does not maintain paper
                    copies of this agreement. <br></br>
                    <br></br>After consent, you may, upon written request obtain
                    a paper copy of an electronic record for your signature. No
                    fee will be charged for such copy and no special hardware or
                    software is required to view it. Your agreement to use an
                    electronic signature with us for any documents will continue
                    until such time as you notify us in writing that you no
                    longer wish to use an electronic signature. There is no
                    penalty for withdrawing your consent.<br></br>
                    <br></br> You should always make sure that we have a current
                    email address in order to contact you regarding any changes,
                    if necessary.
                    <div className="text-center mt-3">
                        <Button
                            color="primary"
                            onClick={e => {
                                setInitialState(false);
                                setModalShow(false);
                            }}
                        >
                            Agree & Continue
                        </Button>
                    </div>
                </Modal>

                <h4>Signatures</h4>
                <p>
                    "Scroll to the bottom of each section and click the box to
                    agree, then move to the next section"
                </p>
                <br />
                <List size="large" bordered>
                    <List.Item>
                        {dataGetSignature && termsAndConditions && (
                            <TabEsign
                                handleUpdatePdf={handleUpdatePdf}
                                termsAndConditions={termsAndConditions}
                                signatureTabs={signatureTabs}
                                setSignatureTabs={setSignatureTabs}
                                merchantNumber={merchantNumber}
                            />
                        )}
                    </List.Item>
                    <List.Item>
                        {dataGetSignature && termsAndConditions && (
                            <TabMAcceptance
                                handleUpdatePdf={handleUpdatePdf}
                                termsAndConditions={termsAndConditions}
                                signatureTabs={signatureTabs}
                                setSignatureTabs={setSignatureTabs}
                                merchantNumber={merchantNumber}
                            />
                        )}
                    </List.Item>
                    <List.Item>
                        {dataGetSignature && termsAndConditions && (
                            <TabPGuarantee
                                handleUpdatePdf={handleUpdatePdf}
                                termsAndConditions={termsAndConditions}
                                signatureTabs={signatureTabs}
                                setSignatureTabs={setSignatureTabs}
                                merchantNumber={merchantNumber}
                            />
                        )}
                    </List.Item>
                    <List.Item>
                        {dataGetSignature && termsAndConditions && (
                            <TabW9
                                handleUpdatePdf={handleUpdatePdf}
                                termsAndConditions={termsAndConditions}
                                signatureTabs={signatureTabs}
                                setSignatureTabs={setSignatureTabs}
                                merchantNumber={merchantNumber}
                            />
                        )}
                    </List.Item>
                    <List.Item>
                        {dataGetSignature && termsAndConditions && (
                            <TabBDisclosure
                                handleUpdatePdf={handleUpdatePdf}
                                termsAndConditions={termsAndConditions}
                                signatureTabs={signatureTabs}
                                setSignatureTabs={setSignatureTabs}
                                merchantNumber={merchantNumber}
                            />
                        )}
                    </List.Item>
                </List>
                {showSubmitToClearent && showTableSignature && (
                    <FormSignature
                        sourceTypes={sourceTypes}
                        formSignatureData={formSignatureData}
                        setFormSignatureData={setFormSignatureData}
                        merchantNumber={merchantNumber}
                        handleUpdatePdf={handleUpdatePdf}
                        submittedData={formData}
                        changeToReview={refetchGetToReview}
                        stepsStatuses={stepsStatuses}
                        setStepsStatuses={setStepsStatuses}
                        setCurrentStep={setCurrentStep}
                        currentStep={currentStep}
                        formData={formData}
                    />
                )}
                {/*<Col className="gutter-row" md={4}></Col>*/}
                {/*<Row gutter={24} style={{ marginTop: "50px" }}>
                    <Col className="gutter-row" md={4}>
                        {formSignatureData && (
                            <>
                                {formSignatureData.content[0].businessContactId ? (
                                    <Button
                                        block={true}
                                        type="warning"
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
                    </Col>
                </Row>*/}
            </div>
        </div>
    ) : (
        <Skeleton active={true} width={100} />
    );
};

export default StepSignatures;
