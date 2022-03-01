import {
    DeleteFilled,
    DeleteOutlined,
    EditOutlined,
    RightOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    notification,
    Popconfirm,
    Row,
    Space
} from "antd";
import React, { useEffect, useState } from "react";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import StepBusinessContactsAddBusinessAccount from "./StepBusinessContactsAddBusinessAccount";

const StepBusinessContacts = ({
    formData,
    inputData,
    stepsStatuses,
    setStepsStatuses,
    currentStep,
    setCurrentStep
}) => {
    let userdata = getUserData();
    const [form] = Form.useForm();

    useEffect(() => {
        if (currentStep == 6) {
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }
        }
        return () => {};
    }, [currentStep]);

    const [showAddBusinessContact, setShowAddBusnessContact] = useState(false);
    const toggleShowFormAddBank = () => {
        if (
            formData.clearent_boarding.status == "Quality Assurance Review" &&
            userdata.role == "Merchant"
        ) {
            notification.info({
                message:
                    'Your application status is on "Quality Assurance Review", if you wish to update your information, please submit a ticket. Thank you'
            });
        } else {
            setShowAddBusnessContact(true);
        }
    };

    const {
        data: dataMerchantBusinessContacts,
        isLoading: isLoadingMerchantBusinessContacts,
        isFetching: isFetchingMerchantBusinessContacts
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/getBusinessDetails/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_business_${formData.clearent_boarding.merchantNumber}`,
        res => {
            console.log("clearent_boarding_business_", res);
            if (res.success) {
                if (res.data) {
                    if (res.data.errors) {
                    } else {
                        console.log(
                            "res.data.content.length",
                            res.data.content.length
                        );
                        if (res.data.content.length > 0) {
                            let _steps = [...stepsStatuses];
                            _steps[6] = {
                                ..._steps[6],
                                title: (
                                    <>
                                        Business Contact (
                                        {res.data.content.length}
                                        /~)
                                    </>
                                ),
                                status:
                                    res.data.content.length > 0
                                        ? "finish"
                                        : "progress"
                            };
                            setStepsStatuses(_steps);
                        }
                    }
                }
            }
        }
    );

    const {
        mutate: mutateBusinessContacts,
        isLoading: isLoadingBusinessContacts
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/business/delete",
        `clearent_boarding_business_${formData.clearent_boarding.merchantNumber}`
    );
    const deleteBusinessContact = businessContact => {
        if (
            formData.clearent_boarding.status == "Quality Assurance Review" &&
            userdata.role == "Merchant"
        ) {
            notification.info({
                message:
                    'Your application status is on "Quality Assurance Review", if you wish to update your information, please submit a ticket. Thank you'
            });
        } else {
            let data = {
                merchantNumber: formData.clearent_boarding.merchantNumber,
                businessContactId: businessContact.businessContactId
            };
            mutateBusinessContacts(data, {
                onSuccess: res => {
                    console.log("delete business", res);
                    if (res.success) {
                        notification.success({
                            message: "Business Contact Successfully Deleted"
                        });
                    }
                }
            });
            // fetchData("POST", "clearent/bank/delete", data).then(res => {
            //     getBankAccounts();
            // });
        }
    };

    const [selectedBusinessContact, setSelectedBusinessContact] = useState();
    useEffect(() => {
        if (showAddBusinessContact == false) {
            setSelectedBusinessContact(null);
        }
        return () => {};
    }, [showAddBusinessContact]);

    const getPhoneNumbers = business_contact => {
        let phone_numbers = [];
        business_contact.phoneNumbers.map((phone, key) => {
            phone_numbers.push(phone.areaCode + " " + phone.phoneNumber);
        });

        return phone_numbers.join(", ");
    };
    const getContactTypes = business_contact => {
        let contactTypesConstants = ["Signer", "Owner", "General Contact"];
        let contact_types = [];
        business_contact.contactTypes.map((type, key) => {
            contact_types.push(contactTypesConstants[type.contactTypeID - 1]);
        });
        return contact_types.join(",");
    };
    return !showAddBusinessContact ? (
        <Card
            loading={
                isLoadingMerchantBusinessContacts ||
                isFetchingMerchantBusinessContacts
            }
            title={`${
                dataMerchantBusinessContacts &&
                dataMerchantBusinessContacts.data &&
                dataMerchantBusinessContacts.data.content &&
                dataMerchantBusinessContacts.data.content.length > 0
                    ? ""
                    : "Please "
            } Add a Business Contact`}
            extra={
                <Button type="primary" onClick={e => toggleShowFormAddBank()}>
                    Add Business Contact
                </Button>
            }
        >
            <small style={{ color: "red" }}>
                All owners with at least 25% ownership must be included
            </small>
            {dataMerchantBusinessContacts &&
                dataMerchantBusinessContacts.data &&
                dataMerchantBusinessContacts.data.content &&
                dataMerchantBusinessContacts.data.content.length > 0 &&
                dataMerchantBusinessContacts.data.content.map(
                    (business_contact, key) => {
                        return (
                            <Card
                                style={{ marginBottom: 10, marginTop: 10 }}
                                size="small"
                                key={key}
                                title={
                                    <>
                                        Title: {business_contact.title} (
                                        {business_contact.ownershipAmount}%)
                                    </>
                                }
                                extra={
                                    <>
                                        <Button
                                            size="small"
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={e => {
                                                setSelectedBusinessContact(
                                                    business_contact
                                                );
                                                setShowAddBusnessContact(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Popconfirm
                                            title="Are you sure you want to delete this Business Contact?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={() => {
                                                deleteBusinessContact(
                                                    business_contact
                                                );
                                            }}
                                        >
                                            <Button
                                                loading={
                                                    isLoadingBusinessContacts
                                                }
                                                size="small"
                                                type="primary"
                                                danger
                                                icon={<DeleteOutlined />}
                                            >
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    </>
                                }
                            >
                                <Row>
                                    <Col xs={24}>
                                        Name:{" "}
                                        {business_contact.contact.firstName}{" "}
                                        {business_contact.contact.lastName}
                                    </Col>
                                    <Col xs={8}>
                                        Email Address:{" "}
                                        {business_contact.emailAddress}
                                    </Col>
                                    <Col xs={8}>
                                        Phone Number:{" "}
                                        {business_contact.phoneNumbers.length >
                                            1 && "s"}
                                        : {getPhoneNumbers(business_contact)}
                                    </Col>
                                    <Col xs={8}>
                                        Contact Types:{" "}
                                        {getContactTypes(business_contact)}
                                    </Col>
                                </Row>
                            </Card>
                        );
                    }
                )}

            {dataMerchantBusinessContacts &&
                dataMerchantBusinessContacts.data &&
                dataMerchantBusinessContacts.data.content &&
                dataMerchantBusinessContacts.data.content.length > 0 && (
                    <>
                        <Divider />
                        <Button
                            style={{ float: "right" }}
                            icon={<RightOutlined />}
                            type="primary"
                            onClick={e => setCurrentStep(currentStep + 1)}
                        >
                            Next
                        </Button>
                    </>
                )}
        </Card>
    ) : (
        <StepBusinessContactsAddBusinessAccount
            formData={formData}
            inputData={inputData}
            merchantNumber={formData.clearent_boarding.merchantNumber}
            showAddBusinessContact={showAddBusinessContact}
            setShowAddBusnessContact={setShowAddBusnessContact}
            selectedBusinessContact={selectedBusinessContact}
            setSelectedBusinessContact={setSelectedBusinessContact}
            businessContacts={
                dataMerchantBusinessContacts &&
                dataMerchantBusinessContacts.data &&
                dataMerchantBusinessContacts.data.content
                    ? dataMerchantBusinessContacts.data.content
                    : []
            }
        />
    );
};

export default StepBusinessContacts;
