import {
    Card,
    Col,
    Form,
    Input,
    Row,
    Select,
    Button,
    Space,
    Divider,
    Checkbox,
    notification,
    InputNumber,
    Alert,
    Progress
} from "antd";
import React, { useEffect, useState } from "react";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../../providers/getUserData";

const StepMerchant = ({
    formData,
    inputData,
    stepsStatuses,
    setStepsStatuses,
    currentStep,
    setCurrentStep
}) => {
    let userdata = getUserData();
    let nextStep = userdata.role == "Merchant" ? 2 : currentStep + 1;
    const [form] = Form.useForm();
    useEffect(() => {
        if (currentStep == 0) {
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

    useEffect(() => {
        // console.log("inputData", inputData);
        // console.log("formData", formData);
        if (
            formData.clearent_boarding.status == "Quality Assurance Review" &&
            userdata.role == "Merchant"
        ) {
            $("input").attr("disabled", true);
            $("select").attr("disabled", true);
            $("textarea").attr("disabled", true);
        }
        return () => {};
    }, [formData]);

    const {
        data: dataCompanyTypes,
        isLoading: isLoadingDataCompanyTypes
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/getCompanyTypes",
        "company_types",
        res => {}
    );

    let requiredFields = ["dbaName", "emailAddress", "companyTypeId"];
    const [requiredFieldsCount, setRequiredFieldsCount] = useState(0);

    const reCountRequired = values => {
        let required_fields_count = 0;
        requiredFields.forEach(requiredField => {
            if (
                values[requiredField] != "" &&
                values[requiredField] != undefined
            ) {
                required_fields_count++;
            }
        });
        if (
            values.phones[0].phoneNumber != "" &&
            values.phones[0].phoneNumber != undefined
        ) {
            required_fields_count++;
        }
        let _steps = [...stepsStatuses];
        _steps[currentStep] = {
            ..._steps[currentStep],
            title: <>Merchant ({required_fields_count}/4)</>,
            status: required_fields_count == 4 ? "finish" : "progress"
        };
        setRequiredFieldsCount(required_fields_count);
        setStepsStatuses(_steps);
    };

    const [merchantDataUpdate, setMerchantDataUpdate] = useState({
        acceptsPaperStatements: false,
        acceptsPaperTaxForms: false,
        businessID: "",
        hierarchyNodeKey: "",
        isChainMerchant: false,
        merchantNumber: ""
    });
    const {
        data: dataClearentBoardingMerchant,
        isLoading: isLoadingDataClearentBoardingMerchant
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/getMerchantDetails/" +
            formData.clearent_boarding.merchantNumber,
        `clearent_boarding_merchant_${formData.clearent_boarding.merchantNumber}`,
        res => {
            // console.log("formData.clearent_boarding.merchantNumber", res);
            if (res.success) {
                if (res.data.errors) {
                    if (res.saved) {
                        let data = JSON.parse(res.saved.merchant);
                        // console.log("data", data);

                        form.setFieldsValue(data);
                        reCountRequired(data);
                    } else {
                        let data = getInputData();
                        form.setFieldsValue(data);
                        reCountRequired(data);
                    }
                    if (userdata.role == "Merchant") {
                        notification.info({
                            message:
                                "Please fill out the merchant application here. The last page will take you to a calendar to setup your signing appointment"
                        });
                        // Swal.fire({
                        //     title:
                        //         "Please fill out the merchant application here. The last page will take you to a calendar to setup your signing appointment",
                        //     icon: "info"
                        // });
                    }
                } else {
                    form.setFieldsValue(res.data);
                    setMerchantDataUpdate({
                        acceptsPaperStatements: res.data.acceptsPaperStatements,
                        acceptsPaperTaxForms: res.data.acceptsPaperTaxForms,
                        businessID: res.data.businessID,
                        hierarchyNodeKey: res.data.hierarchyNodeKey,
                        isChainMerchant: res.data.isChainMerchant,
                        merchantNumber: res.data.merchantNumber
                    });
                    reCountRequired(res.data);
                }
            }
        }
    );

    const getInputData = () => {
        var email = "",
            dbaName = "",
            dbaName = "",
            companyTypeId = null,
            areaCode = "",
            phoneNumber = "";

        email = formData.email;

        //match form field to merhcant form field
        inputData.forEach(element => {
            if (
                element.field == "DBAname" ||
                element.field == "DBAofBusiness" ||
                element.field == "DbaName" ||
                element.field == "DbaOfBusiness"
            ) {
                dbaName = element.value;
            }
            // if (element.field == "TypeOfOwnership") {
            //     companyTypeId = element.value;
            // }
            if (element.field == "TypeOfOwnership") {
                if (element.value == "Soleproprietorship") {
                    companyTypeId = 1;
                }
                if (element.value == "Partnership") {
                    companyTypeId = 2;
                }
                if (element.value == "LLC") {
                    companyTypeId = 4;
                }
                if (element.value == "Non-profit") {
                    companyTypeId = 8;
                }
                if (element.value == "Corporation") {
                    companyTypeId = 10;
                }
            }
            if (
                element.field == "CoporatePhoneNumber" ||
                element.field == "NumberOwnerDirectPhone"
            ) {
                var a = element.value;
                var res = a.replace(/[^a-zA-Z0-9]/g, "");
                var area = res.slice(0, 3);
                var phone = res.slice(3, 11);
                areaCode = area;
                phoneNumber = phone;
                //console.log(res);
            }
        });
        let data = {
            emailAddress: email,
            dbaName: dbaName,
            companyTypeId: companyTypeId,
            phones: [
                {
                    areaCode: areaCode,
                    phoneNumber: phoneNumber
                }
            ]
        };
        return data;
    };

    const {
        mutate: mutateSaveMerchantToDB,
        isLoading: isLoadingSaveMerchantToDB
    } = useAxiosQuery("POST", "api/v1/clearent/saveMerchantDB", "");

    const saveMerchantToDB = () => {
        let form_data = form.getFieldsValue();
        form_data.phones[0].phoneTypeCodeID = 1;
        form_data.phones[1].phoneTypeCodeID = 2;
        form_data.phones[2].phoneTypeCodeID = 3;
        form_data.phones[3].phoneTypeCodeID = 5;
        form_data.phones[4].phoneTypeCodeID = 4;

        form_data.phones[0].areaCode = form_data.phones[0].areaCode
            ? form_data.phones[0].areaCode
            : "";
        form_data.phones[1].areaCode = form_data.phones[1].areaCode
            ? form_data.phones[1].areaCode
            : "";
        form_data.phones[2].areaCode = form_data.phones[2].areaCode
            ? form_data.phones[2].areaCode
            : "";
        form_data.phones[3].areaCode = form_data.phones[3].areaCode
            ? form_data.phones[3].areaCode
            : "";
        form_data.phones[4].areaCode = form_data.phones[4].areaCode
            ? form_data.phones[4].areaCode
            : "";

        form_data.phones[0].phoneNumber = form_data.phones[0].phoneNumber
            ? form_data.phones[0].phoneNumber
            : "";
        form_data.phones[1].phoneNumber = form_data.phones[1].phoneNumber
            ? form_data.phones[1].phoneNumber
            : "";
        form_data.phones[2].phoneNumber = form_data.phones[2].phoneNumber
            ? form_data.phones[2].phoneNumber
            : "";
        form_data.phones[3].phoneNumber = form_data.phones[3].phoneNumber
            ? form_data.phones[3].phoneNumber
            : "";
        form_data.phones[4].phoneNumber = form_data.phones[4].phoneNumber
            ? form_data.phones[4].phoneNumber
            : "";

        let data = {
            data: form_data,
            merchantNumber: formData.clearent_boarding.merchantNumber
        };
        // console.log("data", data);
        mutateSaveMerchantToDB(data, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Merchant Data Successfully Saved"
                    });
                }
            }
        });
    };

    const {
        mutate: mutateCreateClearentMerchant,
        isLoading: isLoadingMutateCreateClearentMerchant,
        isSuccess: isSuccessMutateCreateClearentMerchant
    } = useAxiosQuery("POST", "api/v1/clearent/postMerchant");
    const {
        mutate: mutateUpdateClearentMerchant,
        isLoading: isLoadingMutateUpdateClearentMerchant,
        isSuccess: isSuccessMutateUpdateClearentMerchant
    } = useAxiosQuery("POST", "api/v1/clearent/updateDetails");

    return (
        <Card
            title="Merchant"
            loading={isLoadingDataClearentBoardingMerchant}
            extra={
                <Progress
                    style={{ width: "200px" }}
                    percent={(requiredFieldsCount / 4) * 100}
                    type="line"
                />
            }
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={values => {
                    reCountRequired(values);
                    let form_data = values;
                    form_data.phones[0].phoneTypeCodeID = 1;
                    form_data.phones[1].phoneTypeCodeID = 2;
                    form_data.phones[2].phoneTypeCodeID = 3;
                    form_data.phones[3].phoneTypeCodeID = 5;
                    form_data.phones[4].phoneTypeCodeID = 4;

                    form_data.phones[0].areaCode = form_data.phones[0].areaCode
                        ? form_data.phones[0].areaCode
                        : "";
                    form_data.phones[1].areaCode = form_data.phones[1].areaCode
                        ? form_data.phones[1].areaCode
                        : "";
                    form_data.phones[2].areaCode = form_data.phones[2].areaCode
                        ? form_data.phones[2].areaCode
                        : "";
                    form_data.phones[3].areaCode = form_data.phones[3].areaCode
                        ? form_data.phones[3].areaCode
                        : "";
                    form_data.phones[4].areaCode = form_data.phones[4].areaCode
                        ? form_data.phones[4].areaCode
                        : "";

                    form_data.phones[0].phoneNumber = form_data.phones[0]
                        .phoneNumber
                        ? form_data.phones[0].phoneNumber
                        : "";
                    form_data.phones[1].phoneNumber = form_data.phones[1]
                        .phoneNumber
                        ? form_data.phones[1].phoneNumber
                        : "";
                    form_data.phones[2].phoneNumber = form_data.phones[2]
                        .phoneNumber
                        ? form_data.phones[2].phoneNumber
                        : "";
                    form_data.phones[3].phoneNumber = form_data.phones[3]
                        .phoneNumber
                        ? form_data.phones[3].phoneNumber
                        : "";
                    form_data.phones[4].phoneNumber = form_data.phones[4]
                        .phoneNumber
                        ? form_data.phones[4].phoneNumber
                        : "";
                    let data = {
                        ...form_data,
                        merchantNumber:
                            formData.clearent_boarding.merchantNumber
                    };

                    if (merchantDataUpdate.hierarchyNodeKey == "") {
                        mutateCreateClearentMerchant(data, {
                            onSuccess: res => {
                                if (res.errors) {
                                    if (res.errors.length > 0) {
                                        res.errors.map((error, key) => {
                                            notification.error({
                                                message: error.errorMessage
                                            });
                                        });
                                    } else {
                                        saveMerchantToDB();
                                        // console.log(res);
                                        setMerchantDataUpdate({
                                            acceptsPaperStatements:
                                                res.response
                                                    .acceptsPaperStatements,
                                            acceptsPaperTaxForms:
                                                res.response
                                                    .acceptsPaperTaxForms,
                                            businessID: res.response.businessID,
                                            hierarchyNodeKey:
                                                res.response.hierarchyNodeKey,
                                            isChainMerchant:
                                                res.response.isChainMerchant,
                                            merchantNumber:
                                                res.response.merchantNumber
                                        });
                                        setCurrentStep(nextStep);
                                    }
                                }
                            }
                        });
                    } else {
                        if (
                            formData.clearent_boarding.status ==
                                "Quality Assurance Review" &&
                            userdata.role == "Merchant"
                        ) {
                            notification.info({
                                message:
                                    'Your application status is on "Quality Assurance Review", if you wish to update your information, please submit a ticket. Thank you'
                            });
                        } else {
                            let _data = data;
                            _data = { ...data, ...merchantDataUpdate };
                            mutateUpdateClearentMerchant(_data, {
                                onSuccess: res => {
                                    if (res.errors) {
                                        if (res.errors.length > 0) {
                                            res.errors.map((error, key) => {
                                                notification.error({
                                                    message: error.errorMessage
                                                });
                                            });
                                        } else {
                                            saveMerchantToDB();
                                            // console.log(res);
                                            setCurrentStep(nextStep);
                                        }
                                    }
                                }
                            });
                        }
                    }
                }}
                onValuesChange={(changedValues, values) => {
                    // console.log("values", values);
                    reCountRequired(values);
                }}
            >
                <Row gutter={12}>
                    <Col xs={24} md={18}>
                        <Form.Item
                            label="DBA Name"
                            name="dbaName"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                        >
                            <Input type="text" placeholder="DBA Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Email Address"
                            name="emailAddress"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                        >
                            <Input type="email" placeholder="Email Address" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                        <Form.Item
                            label="Company Type"
                            name="companyTypeId"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                        >
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Please Select Company Type"
                                loading={isLoadingDataCompanyTypes}
                            >
                                {dataCompanyTypes &&
                                    dataCompanyTypes.data.content.map(
                                        (company_type, key) => {
                                            return (
                                                <Select.Option
                                                    value={company_type.id}
                                                    key={key}
                                                >
                                                    {company_type.description}
                                                </Select.Option>
                                            );
                                        }
                                    )}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={18}>
                        <Form.Item label="Website" name="webSite">
                            <Input type="text" placeholder="Website" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Row style={{ height: "45px" }}>
                            <Col xs={24} md={2} style={{ lineHeight: 2.2 }}>
                                Cell <span style={{ color: "red" }}>*</span>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={[`phones`, 0, "areaCode"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Area Code"
                                        maxLength={3}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={[`phones`, 0, "phoneNumber"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Phone Number"
                                        maxLength={8}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ height: "45px" }}>
                            <Col xs={24} md={2} style={{ lineHeight: 2.2 }}>
                                Fax
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 1, "areaCode"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Area Code"
                                        maxLength={3}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 1, "phoneNumber"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Phone Number"
                                        maxLength={8}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ height: "45px" }}>
                            <Col xs={24} md={2} style={{ lineHeight: 2.2 }}>
                                Home
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 2, "areaCode"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Area Code"
                                        maxLength={3}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 2, "phoneNumber"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Phone Number"
                                        maxLength={8}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ height: "45px" }}>
                            <Col xs={24} md={2} style={{ lineHeight: 2.2 }}>
                                Work
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 4, "areaCode"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Area Code"
                                        maxLength={3}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 4, "phoneNumber"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Phone Number"
                                        maxLength={8}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ height: "45px" }}>
                            <Col xs={24} md={2} style={{ lineHeight: 2.2 }}>
                                Other
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 3, "areaCode"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Area Code"
                                        maxLength={3}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name={["phones", 3, "phoneNumber"]}>
                                    <Input
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Phone Number"
                                        maxLength={8}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="text-center">Seasonal Schedule</div>
                        <Row>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={["seasonalSchedule", "january"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        January
                                    </Checkbox>
                                </Form.Item>{" "}
                                <Form.Item
                                    name={["seasonalSchedule", "februrary"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        February
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "march"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        March
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "april"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        April
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "may"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        May
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "june"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        June
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name={["seasonalSchedule", "july"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        July
                                    </Checkbox>
                                </Form.Item>{" "}
                                <Form.Item
                                    name={["seasonalSchedule", "august"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        August
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "september"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        September
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "october"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        October
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "november"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        November
                                    </Checkbox>
                                </Form.Item>
                                <Form.Item
                                    name={["seasonalSchedule", "december"]}
                                    valuePropName="checked"
                                    initialValue={true}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Checkbox defaultChecked={true}>
                                        December
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Divider />
                {/* {isSuccessMutateCreateClearentMerchant && (
                    <div className="text-center" style={{ marginBottom: 15 }}>
                        <Alert
                            message={<>Merchant Validated Successfully !</>}
                            type="success"
                        />
                    </div>
                )} */}
                <Space>
                    <Button
                        type="primary"
                        onClick={e => saveMerchantToDB()}
                        loading={isLoadingSaveMerchantToDB}
                    >
                        Save
                    </Button>
                    <Button
                        type="primary"
                        onClick={e => form.submit()}
                        loading={
                            isLoadingMutateCreateClearentMerchant ||
                            isLoadingMutateUpdateClearentMerchant
                        }
                    >
                        {dataClearentBoardingMerchant &&
                        dataClearentBoardingMerchant.data.errors ? (
                            <>Save & Proceed</>
                        ) : (
                            <>reValidate</>
                        )}
                    </Button>
                </Space>
            </Form>
        </Card>
    );
};

export default StepMerchant;
