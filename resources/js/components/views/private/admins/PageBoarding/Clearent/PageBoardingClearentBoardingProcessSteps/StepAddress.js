import {
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    notification,
    Progress,
    Row,
    Select,
    Space
} from "antd";
import React, { useEffect, useState } from "react";
import getUserData from "../../../../../../providers/getUserData";
import optionStateCodes from "../../../../../../providers/optionStateCodes";
import optionCountryCodes from "../../../../../../providers/optionCountryCodes";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";

const StepAddress = ({
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
        // console.log("currentStep", currentStep);
        if (currentStep == 2) {
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

    const [requiredFieldsCount, setRequiredFieldsCount] = useState(0);
    const reCountRequired = values => {
        let required_fields_count = 0;
        if (
            values.mail.address.line1 != "" &&
            values.mail.address.line1 != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.mail.address.city != "" &&
            values.mail.address.city != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.mail.address.stateCode != "" &&
            values.mail.address.stateCode != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.mail.address.zip != "" &&
            values.mail.address.zip != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.mail.address.countryCode != "" &&
            values.mail.address.countryCode != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.physical.address.line1 != "" &&
            values.physical.address.line1 != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.physical.address.city != "" &&
            values.physical.address.city != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.physical.address.stateCode != "" &&
            values.physical.address.stateCode != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.physical.address.zip != "" &&
            values.physical.address.zip != undefined
        ) {
            required_fields_count++;
        }
        if (
            values.physical.address.countryCode != "" &&
            values.physical.address.countryCode != undefined
        ) {
            required_fields_count++;
        }
        let _steps = [...stepsStatuses];
        _steps[2] = {
            ..._steps[2],
            title: <>Address ({required_fields_count}/10)</>,
            status: required_fields_count == 10 ? "finish" : "progress"
        };
        setRequiredFieldsCount(required_fields_count);
        setStepsStatuses(_steps);
    };

    const [sameAsPhysical, setSameAsPhysical] = useState(true);

    const {
        mutate: mutateSaveAddressToDB,
        isLoading: isLoadingMutateSaveAddressToDB
    } = useAxiosQuery("POST", "api/v1/clearent/saveAddressDB", "");
    const saveAddressoDB = () => {
        let data = {
            data: form.getFieldsValue(),
            merchantNumber: formData.clearent_boarding.merchantNumber
        };
        console.log("data", data);
        mutateSaveAddressToDB(data, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Address Successfully Saved"
                    });
                }
            }
        });
    };

    const {
        data: dataMerchatAddress,
        isLoading: isLoadingDataMerchantAddress,
        isFetching: isFetchingDataMerchantAddress
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/getAddressDetails/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_address_${formData.clearent_boarding.merchantNumber}`,
        res => {
            // console.log("tabaddress", res);
            if (res.physical.line1 == null && res.mail.line1 == null) {
                // console.log("inputData", inputData);

                let saved = res.saved.physical_address;
                if (saved == null) {
                    let dataAddress = getFormData();
                    let data = {
                        physical: {
                            address: {
                                ...dataAddress
                            }
                        },
                        mail: {
                            address: {
                                ...dataAddress
                            }
                        }
                    };
                    form.setFieldsValue(data);
                    reCountRequired(data);
                } else {
                    let data = JSON.parse(saved);
                    form.setFieldsValue(data);
                    reCountRequired(data);
                }
                // saveCountReq();
            } else {
                let _physical = { address: res.physical };
                let _mail = { address: res.mail };
                let data = { physical: _physical, mail: _mail };
                form.setFieldsValue(data);
                reCountRequired(data);
            }
        }
    );

    const getFormData = () => {
        var zip = "",
            line1 = "",
            stateCode = "",
            countryCode = "",
            city = "";
        inputData.forEach(element => {
            if (
                element.field == "CorporatecStreetAddress" ||
                element.field == "PhysicalAddressOfBusiness" ||
                element.field == "StreetAddress"
            ) {
                line1 = element.value;
            }
            if (
                element.field == "CorporateZipCode" ||
                element.field == "ZipCode"
            ) {
                zip = element.value;
            }
            if (element.field == "CorporateCity" || element.field == "City") {
                city = element.value;
            }
            if (element.field == "CorporateState" || element.field == "State") {
                $("#pstateCode")
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
                            stateCode = val;
                            countryCode = 840;
                        }
                    });
            }
        });
        return { line1, city, stateCode, zip, countryCode };
    };

    const {
        mutate: mutateSaveMerchantAddress,
        isLoading: isLoadingMutateSaveMerchantAddress
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/postAddress",
        `clearent_boarding_address_${formData.clearent_boarding.merchantNumber}`
    );
    const handleSubmitCreateMerchantAddress = values => {
        // btnFormCreateMerchant.current;
        //setSubmitCreateMerchantText(loadingIcon);
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
                ...values,
                merchantNumber: formData.clearent_boarding.merchantNumber
            };

            mutateSaveMerchantAddress(data, {
                onSuccess: res => {
                    if (res.errors.length > 0) {
                        res.errors.map((error, key) => {
                            notification.error({
                                message: error.errorMessage
                            });
                        });
                    } else {
                        saveAddressoDB();
                        if (userdata.role == "Merchant") {
                            setCurrentStep(4);
                        } else {
                            setCurrentStep(3);
                        }
                    }
                }
            });
        }

        // //console.log(data);
    };
    return (
        <Card
            title="Merchant Address"
            extra={
                <Progress
                    style={{ width: "200px" }}
                    percent={(requiredFieldsCount / 10) * 100}
                    type="line"
                />
            }
            loading={isLoadingDataMerchantAddress}
        >
            <Form
                form={form}
                onValuesChange={(changedValue, values) => {
                    // console.log("values", values);
                    let _values = { ...values };
                    if (sameAsPhysical) {
                        _values = {
                            ..._values,
                            mail: {
                                address: {
                                    line1: _values.physical.address.line1,
                                    city: _values.physical.address.city,
                                    stateCode:
                                        _values.physical.address.stateCode,
                                    zip: _values.physical.address.zip,
                                    countryCode:
                                        _values.physical.address.countryCode
                                }
                            }
                        };
                        form.setFieldsValue(_values);
                    }
                    reCountRequired(_values);
                }}
                onFinish={values => {
                    handleSubmitCreateMerchantAddress(values);
                }}
                layout="vertical"
            >
                <h4>Physical Address</h4>
                <Row gutter={12}>
                    <Col xs={24} md={10}>
                        <Form.Item
                            label="Address"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["physical", "address", "line1"]}
                        >
                            <Input placeholder="Line 1" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="City"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["physical", "address", "city"]}
                        >
                            <Input placeholder="City" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="State"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["physical", "address", "stateCode"]}
                        >
                            <Select
                                placeholder="Select State Code"
                                showSearch
                                filterOption={(input, option) =>
                                    option.searchField
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                id="pstateCode"
                            >
                                {optionStateCodes.map((option, key) => {
                                    return (
                                        <Select.Option
                                            value={option.value}
                                            key={key}
                                            searchField={option.label}
                                        >
                                            {option.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={0} md={10}></Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="Zip"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["physical", "address", "zip"]}
                        >
                            <Input placeholder="Zip" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="Country Code"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["physical", "address", "countryCode"]}
                        >
                            <Select
                                placeholder="Select Country Code"
                                showSearch
                                filterOption={(input, option) =>
                                    option.searchField
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {optionCountryCodes.map((option, key) => {
                                    return (
                                        <Select.Option
                                            value={option.value}
                                            key={key}
                                            searchField={option.label}
                                        >
                                            {option.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <h4>Mailing Address</h4>
                <Checkbox
                    checked={sameAsPhysical}
                    onChange={e => setSameAsPhysical(e.target.checked)}
                >
                    (same as Physical Address)
                </Checkbox>
                <Row gutter={12}>
                    <Col xs={24} md={10}>
                        <Form.Item
                            label="Address"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["mail", "address", "line1"]}
                        >
                            <Input placeholder="Line 1" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="City"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["mail", "address", "city"]}
                        >
                            <Input placeholder="City" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="State"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["mail", "address", "stateCode"]}
                        >
                            <Select
                                placeholder="Select State Code"
                                showSearch
                                filterOption={(input, option) =>
                                    option.searchField
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {optionStateCodes.map((option, key) => {
                                    return (
                                        <Select.Option
                                            value={option.value}
                                            key={key}
                                            searchField={option.label}
                                        >
                                            {option.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={0} md={10}></Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="Zip"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["mail", "address", "zip"]}
                        >
                            <Input placeholder="Zip" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={7}>
                        <Form.Item
                            label="Country Code"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                            name={["mail", "address", "countryCode"]}
                        >
                            <Select
                                placeholder="Select Country Code"
                                showSearch
                                filterOption={(input, option) =>
                                    option.searchField
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {optionCountryCodes.map((option, key) => {
                                    return (
                                        <Select.Option
                                            value={option.value}
                                            key={key}
                                            searchField={option.label}
                                        >
                                            {option.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Divider />
            <Space>
                <Button
                    type="primary"
                    onClick={e => saveAddressoDB()}
                    loading={isLoadingMutateSaveAddressToDB}
                >
                    Save
                </Button>
                <Button
                    type="primary"
                    onClick={e => form.submit()}
                    loading={
                        isLoadingMutateSaveMerchantAddress ||
                        isFetchingDataMerchantAddress
                    }
                >
                    {dataMerchatAddress && dataMerchatAddress.physical.line1 ? (
                        <>reValidate</>
                    ) : (
                        <>Save & Proceed</>
                    )}
                </Button>
            </Space>
        </Card>
    );
};

export default StepAddress;
