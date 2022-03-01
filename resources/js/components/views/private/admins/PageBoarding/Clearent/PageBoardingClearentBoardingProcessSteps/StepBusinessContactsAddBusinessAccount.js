import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    notification,
    Radio,
    Row,
    Space,
    Select
} from "antd";
import React, { useEffect, useState } from "react";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import FileSaver from "file-saver";
import { MaskedInput } from "antd-mask-input";
import optionCountryCodes from "../../../../../../providers/optionCountryCodes";
import optionStateCodes from "../../../../../../providers/optionStateCodes";
const StepBusinessContactAddBusinessAccount = ({
    formData,
    inputData,
    merchantNumber,
    showAddBusinessContact,
    setShowAddBusnessContact,
    selectedBusinessContact,
    setSelectedBusinessContact,
    businessContacts
}) => {
    useEffect(() => {
        console.log("inputData", inputData);
        return () => {};
    }, [inputData]);
    const [form] = Form.useForm();

    const {
        mutate: mutateSaveBusinessContact,
        isLoading: isLoadingMutateSaveBusinessContact
    } = useAxiosQuery("POST", "api/v1/clearent/saveBusinessContactDB");
    const saveBusinessContactToDB = () => {
        let data = form.getFieldsValue();
        let ssn = data["contact"]["ssn"];
        data["contact"]["ssn"] = ssn.replace(/-/g, "");
        data["merchantNumber"] = merchantNumber;

        let _data = {
            data: data,
            merchantNumber: merchantNumber
        };

        console.log("data", _data);
        mutateSaveBusinessContact(_data, {
            onSuccess: res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Bank Successfully Saved"
                    });
                }
            }
        });
    };

    const parseDate = dob => {
        if (dob) {
            let date = new Date(dob);
            let newdate = date.toISOString().slice(0, 10);
            return newdate;
        }
    };
    const {
        data: dataGetSavedBusinessContact,
        isLoading: isLoadingGetSavedBankDB
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/getSavedBusinessContact/${merchantNumber}`,
        `clearent_boarding_saved_business_contact_${merchantNumber}`,
        res => {
            // console.log(res);
            if (selectedBusinessContact) {
                form.setFieldsValue(selectedBusinessContact);
                form.setFieldsValue({
                    contact: {
                        dateOfBirth: parseDate(
                            selectedBusinessContact.contact.dateOfBirth
                        )
                    }
                });
                setBusinessContactDetails({
                    ...businessContactDetails,
                    ...selectedBusinessContact
                });
            } else {
                if (res.saved == null) {
                    let inputData = getInputData();
                    form.setFieldsValue({
                        ...inputData,
                        emailAddress: formData.email
                    });
                    console.log("inputData", inputData);
                    setBusinessContactDetails({
                        ...businessContactDetails,
                        ...inputData
                    });
                } else {
                    if (res.saved.business_contact) {
                        console.log("res.saved", res.saved.business_contact);
                        let data = JSON.parse(res.saved.business_contact);
                        data.contact.ssn == null
                            ? (data.contact.ssn = "")
                            : (data.contact.ssn = data.contact.ssn);
                        form.setFieldsValue(data);
                        form.setFieldsValue({
                            contact: {
                                dateOfBirth: parseDate(data.contact.dateOfBirth)
                            }
                        });
                        console.log("data", data);
                        setBusinessContactDetails({
                            ...businessContactDetails,
                            ...data
                        });
                    }
                }
            }
        }
    );

    const getInputData = () => {
        let _inputData = {
            ...businessContactDetails,
            emailAddress: formData.email
        };
        inputData.forEach(element => {
            if (element.field == "State") {
                $("#stateCode")
                    .find("option")
                    .each(function() {
                        let text = $(this)
                            .text()
                            .toLowerCase()
                            .split(" (");

                        let fieldText = element.value
                            .toLowerCase()
                            .replace(/\s/g, "");

                        if (fieldText == text[0]) {
                            let val = $(this).val();
                            _inputData.contact.address.stateCode = val;
                            _inputData.contact.address.countryCode = 840;
                        }
                    });
            }
            if (
                element.field == "CorporatecStreetAddress" ||
                element.field == "PhysicalAddressOfBusiness" ||
                element.field == "StreetAddress"
            ) {
                _inputData.contact.address.line1 = element.value;
            }

            if (
                element.field == "CorporateZipCode" ||
                element.field == "Zipcode"
            ) {
                _inputData.contact.address.zip = element.value;
            }
            if (element.field == "SocialSecurityNumber") {
                _inputData.contact.ssn = element.value;
            }
            if (element.field == "DateOfBirth") {
                _inputData.contact.dateOfBirth = element.value;
            }

            if (element.field == "Title") {
                _inputData.contact.title = element.value;
            }
            if (element.field == "City") {
                _inputData.contact.address.city = element.value;
            }
            if (
                element.field == "FullNameOfOwner" ||
                element.field == "ControllerOwnerorGuarantor"
            ) {
                var firstName1 = element.value
                    .split(" ")
                    .slice(0, -1)
                    .join(" ");
                var lastName1 = element.value
                    .split(" ")
                    .slice(-1)
                    .join(" ");
                _inputData.contact.firstName = firstName1;
                _inputData.contact.lastName = lastName1;
            }

            if (
                element.field == "CoporatePhoneNumber" ||
                element.field == "NumberOwnerDirectPhone"
            ) {
                var a = element.value;
                var res = a.replace(/[^a-zA-Z0-9]/g, "");
                var area = res.slice(0, 3);
                var phone = res.slice(3, 11);
                _inputData.phoneNumbers[0].areaCode = area;
                _inputData.phoneNumbers[0].phoneNumber = phone;
                //console.log(res);
            }
        });
        return _inputData;
    };

    const {
        mutate: mutateCreateBusinessContact,
        isLoading: isLoadingMutateCreateBusinessContact
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/postBusiness",
        `clearent_boarding_business_${merchantNumber}`
    );
    const {
        mutate: mutateUpdateBusinessContact,
        isLoading: isLoadingMutateUpdateBusinessContact
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/updateDetails",
        `clearent_boarding_business_${merchantNumber}`
    );
    const handleSubmitCreateBusinessContact = () => {
        let data = { ...businessContactDetails };
        let ssn = data["contact"]["ssn"];
        data["contact"]["ssn"] = ssn.replace(/-/g, "");
        let _data = {
            ...data,
            merchantNumber: merchantNumber
        };
        delete _data.contactTypesForm;

        console.log("_data", _data);
        if (_data.businessContactId == 0 || _data.businessContactId == null) {
            delete _data.businessContactId;
            mutateCreateBusinessContact(_data, {
                onSuccess: res => {
                    if (res.success) {
                        if (res.errors) {
                            if (res.errors.length > 0) {
                                res.errors.map((error, key) => {
                                    notification.error({
                                        message: error.errorMessage
                                    });
                                });
                            } else {
                                // setBusinessContactDetails({
                                //     ...businessContactDetails
                                //     // bankAccountID: res.data.bankAccountID
                                // });
                                saveBusinessContactToDB();
                                setShowAddBusnessContact(false);
                            }
                        }
                    }
                }
            });
        } else {
            mutateUpdateBusinessContact(_data, {
                onSuccess: res => {
                    if (res.success) {
                        if (res.errors) {
                            if (res.errors.length > 0) {
                                res.errors.map((error, key) => {
                                    notification.error({
                                        message: error.errorMessage
                                    });
                                });
                            } else {
                                setBusinessContactDetails({
                                    ...businessContactDetails,
                                    bankAccountID: res.data.bankAccountID
                                });
                                saveBusinessContactToDB();
                                setShowAddBusnessContact(false);
                            }
                        }
                    }
                }
            });
        }
    };

    const [businessContactDetails, setBusinessContactDetails] = useState({
        businessContactId: selectedBusinessContact
            ? selectedBusinessContact.businessContactId
            : null,
        contact: {
            firstName: "",
            lastName: "",
            ssn: "",
            dateOfBirth: "",
            countryOfCitizenshipCode: "",
            address: {
                line1: "",
                line2: "",
                line3: "",
                city: "",
                stateCode: null,
                zip: "",
                countryCode: null
            }
        },
        ownershipAmount: 100,
        emailAddress: formData.email,
        title: "",
        phoneNumbers: [
            {
                phoneTypeCodeID: "1",
                areaCode: "",
                phoneNumber: "",
                extension: ""
            }
        ],
        contactTypes: [
            {
                contactTypeID: 1
            },
            {
                contactTypeID: 2
            },
            {
                contactTypeID: 3
            }
        ],
        isCompassUser: true,
        isAuthorizedToPurchase: true
    });

    const [sameContactEmail, setSameContactEmail] = useState(false);

    useEffect(() => {
        let emailAddress = businessContactDetails.emailAddress;
        let same = false;
        businessContacts.map((businessContact, key) => {
            // console.log(emailAddress, businessContact.emailAddress);
            if (emailAddress == businessContact.emailAddress) {
                same = true;
            }
        });
        console.log("businessContactDetails", businessContactDetails);

        setSameContactEmail(same);
        return () => {};
    }, [businessContactDetails]);
    return (
        <>
            <Card
                title="Add a Business Contact"
                extra={
                    <Button
                        type="ghost"
                        onClick={e => setShowAddBusnessContact(false)}
                    >
                        Back to List
                    </Button>
                }
                loading={isLoadingGetSavedBankDB}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={values => {
                        handleSubmitCreateBusinessContact();
                    }}
                    onValuesChange={(changedValue, values) => {
                        console.log("values", values);
                        console.log("changedValue", changedValue);

                        let data = { ...values };
                        if (changedValue.contactTypesForm) {
                            let _contactTypes = [];
                            changedValue.contactTypesForm.forEach(
                                contactTypeValues => {
                                    _contactTypes.push({
                                        contactType: contactTypeValues
                                    });
                                }
                            );
                            data = { ...data, contactTypes: _contactTypes };
                        }

                        setBusinessContactDetails({
                            ...businessContactDetails,
                            ...data
                        });
                    }}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={18}>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item
                                label={
                                    <>
                                        Ownership{" "}
                                        {businessContactDetails.ownershipAmount}
                                        %
                                    </>
                                }
                                name="ownershipAmount"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <InputNumber
                                    style={{ width: "100%" }}
                                    max={100}
                                    placeholder="Ownership % (0-100)"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={10}>
                            <Form.Item
                                label="Firstname"
                                name={["contact", "firstName"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={10}>
                            <Form.Item
                                label="Lastname"
                                name={["contact", "lastName"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={4}>
                            <Form.Item
                                label="SSN"
                                name={["contact", "ssn"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <MaskedInput mask="111-11-1111" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={18}>
                            {sameContactEmail && (
                                <small style={{ color: "red" }}>
                                    Owner emails match. If you want a different
                                    email listed for each individual owner
                                    please modify
                                </small>
                            )}
                            <Form.Item
                                label="Email Address"
                                name="emailAddress"
                                initialValue={formData.email}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input type="email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item
                                label="Date of Birth"
                                name={["contact", "dateOfBirth"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input type="date" placeholder="mm/dd/yyyy" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    <Row gutter={12}>
                        <Col xs={24} md={14}>
                            <Form.Item
                                label="Address"
                                name={["contact", "address", "line1"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                            <Form.Item
                                label="City"
                                name={["contact", "address", "city"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                            <Form.Item
                                label="Zip"
                                name={["contact", "address", "zip"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={14}>
                            <Form.Item
                                label="Country Citizenship Code"
                                name={["contact", "countryOfCitizenshipCode"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Select placeholder="Select Country Citizenship Code">
                                    {optionCountryCodes.map((option, key) => {
                                        return (
                                            <Select.Option
                                                value={option.value}
                                                key={key}
                                            >
                                                {option.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                            <Form.Item
                                label="State Code"
                                name={["contact", "address", "stateCode"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Select placeholder="Select State Code">
                                    {optionStateCodes.map((option, key) => {
                                        return (
                                            <Select.Option
                                                value={option.value}
                                                key={key}
                                            >
                                                {option.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={5}>
                            <Form.Item
                                label="Country Code"
                                name={["contact", "address", "countryCode"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Select placeholder="Select Country Code">
                                    {optionCountryCodes.map((option, key) => {
                                        return (
                                            <Select.Option
                                                value={option.value}
                                                key={key}
                                            >
                                                {option.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Phone Type"
                                name={["phoneNumbers", 0, "phoneTypeCodeID"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                                initialValue={"1"}
                            >
                                <Select placeholder="Select Phone Type">
                                    <Select.Option value="1">
                                        Cell
                                    </Select.Option>
                                    <Select.Option value="2">Fax</Select.Option>
                                    <Select.Option value="3">
                                        Home
                                    </Select.Option>
                                    <Select.Option value="4">
                                        Other
                                    </Select.Option>
                                    <Select.Option value="5">
                                        Work
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Area Code"
                                name={["phoneNumbers", 0, "areaCode"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <MaskedInput mask="111" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Phone Number"
                                name={["phoneNumbers", 0, "phoneNumber"]}
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <MaskedInput mask="1111111" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider />
                    Contact Types
                    <Row gutter={12}>
                        <Col xs={24}>
                            <Form.Item
                                name={"contactTypesForm"}
                                initialValue={[1, 2, 3]}
                            >
                                <Select mode="multiple">
                                    <Select.Option value={1}>
                                        Signer
                                    </Select.Option>
                                    <Select.Option value={2}>
                                        Owner
                                    </Select.Option>
                                    <Select.Option value={3}>
                                        General Contact
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* <Col xs={3}>
                            <Form.Item
                                name={["contactTypes", 0, "contactTypeID"]}
                            >
                                <Checkbox value="1">Signer</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col xs={3}>
                            <Form.Item
                                name={["contactTypes", 1, "contactTypeID"]}
                            >
                                <Checkbox value="2">Owner</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col xs={5}>
                            <Form.Item
                                name={["contactTypes", 2, "contactTypeID"]}
                            >
                                <Checkbox value="3">General Contact</Checkbox>
                            </Form.Item>
                        </Col> */}
                    </Row>
                </Form>{" "}
                <Divider />
                <Space>
                    <Button
                        type="primary"
                        onClick={e => saveBusinessContactToDB()}
                        loading={isLoadingMutateSaveBusinessContact}
                    >
                        Save
                    </Button>
                    <Button
                        type="primary"
                        onClick={e => form.submit()}
                        loading={
                            isLoadingMutateCreateBusinessContact ||
                            isLoadingMutateUpdateBusinessContact
                        }
                        disabled={
                            businessContactDetails.contact.ssn &&
                            businessContactDetails.contact.ssn.indexOf("*") !==
                                -1
                                ? true
                                : false
                        }
                    >
                        {/* {dataTaxpayer && dataTaxpayer.data.tin ? (
                        <>reValidate</>
                    ) : ( */}
                        <>Save & Proceed</>
                        {/* )} */}
                    </Button>
                </Space>
            </Card>
        </>
    );
};

export default StepBusinessContactAddBusinessAccount;
