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
    Progress,
    Slider,
    Radio,
    Upload
} from "antd";
import React, { useEffect, useState } from "react";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../../providers/getUserData";
import { CheckOutlined, UploadOutlined } from "@ant-design/icons";

const StepProfile = ({
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
        if (currentStep == 1) {
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

    let requiredFields = [
        "annualVolume",
        "averageTicket",
        "highTicket",
        "returnRefundPolicy",
        "productsSold"
    ];
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
        let _steps = [...stepsStatuses];
        _steps[1] = {
            ..._steps[1],
            title: <>Profile ({required_fields_count}/5)</>,
            status: required_fields_count == 5 ? "finish" : "progress"
        };
        setRequiredFieldsCount(required_fields_count);
        setStepsStatuses(_steps);
    };

    const {
        data: dataMccCodes,
        isLoading: isLoadingDataMccCodes
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/salesprofile?getMcc=1",
        "mcc_codes",
        res => {
            // console.log("mcc_codes", res);
        }
    );

    const normFile = e => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const [salesProfileData, setSalesProfileData] = useState({
        merchantNumber: formData.clearent_boarding.merchantNumber,
        isECommerce: false,
        mccCode: "5812",
        cardPresentPercentage: 100,
        returnRefundPolicy: "",
        productsSold: "",
        previouslyAcceptedPaymentCards: false,
        previouslyTerminatedOrIdentifiedByRiskMonitoring: false,
        currentlyOpenForBusiness: true,
        annualVolume: 0,
        averageTicket: 0,
        ownsProduct: true,
        ordersProduct: true,
        sellsFirearms: false,
        sellsFirearmAccessories: false,
        futureDeliveryTypeID: 0,
        futureDeliveryPercentage: 0,
        otherDeliveryType: "",
        cardBrands: [1, 4, 5],
        highTicket: 0,
        futureDelivery: false,
        cardPresentPercentage: 100
    });

    const {
        mutate: mutateSaveSalesProfileToDB,
        isLoading: isLoadingSaveSalesProfileToDB
    } = useAxiosQuery("POST", "api/v1/clearent/saveSalesProfileDB", "");

    const saveSalesProfileToDB = () => {
        let data = {
            data: salesProfileData,
            merchantNumber: salesProfileData.merchantNumber
        };
        console.log("data", data);
        mutateSaveSalesProfileToDB(data, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Profile Data Successfully Saved"
                    });
                }
            }
        });
    };
    useEffect(() => {
        console.log(
            "dataClearentBoardingSalesProfile",
            dataClearentBoardingSalesProfile
        );
        return () => {};
    }, [dataClearentBoardingSalesProfile]);
    const {
        data: dataClearentBoardingSalesProfile,
        isLoading: isLoadingDataClearentBoardingSalesProfile,
        refetch: refetchClearentBoardingSalesProfile,
        isFetching: isFetchingDataClearentBoardingSalesProfile
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/salesprofile/" +
            formData.clearent_boarding.merchantNumber,
        `clearent_boarding_sales_profile_${formData.clearent_boarding.merchantNumber}`,
        res => {
            console.log("salesprofile", res);
            if (res.success) {
                if (res.data.mccCode) {
                    form.setFieldsValue({
                        ...res.data,
                        futureDelivery: res.data.futureDeliveryPercentage > 0
                    });
                    setSalesProfileData({
                        ...salesProfileData,
                        ...res.data,
                        futureDelivery: res.data.futureDeliveryPercentage > 0
                    });
                    if (res.data.isECommerce == false) {
                        form.setFieldsValue({
                            rangeCardNotPresent: 0,
                            cardPresentPercentage: 100
                        });
                    } else {
                        form.setFieldsValue({
                            rangeCardNotPresent: 100,
                            cardPresentPercentage: 0
                        });
                    }
                    reCountRequired(res.data);
                } else {
                    if (res.saved.sales_profile) {
                        let data = JSON.parse(res.saved.sales_profile);

                        setSalesProfileData({
                            ...salesProfileData,
                            ...data
                        });
                        form.setFieldsValue(data);
                        reCountRequired(data);
                    }
                }
            }
        }
    );

    const {
        mutate: mutateUpdateClearentMerchantSalesProfile,
        isLoading: isLoadingMutateUpdateClearentMerchantSalesProfile,
        isSuccess: isSuccessMutateUpdateClearentMerchantSalesProfile
    } = useAxiosQuery(
        "UPDATE",
        `api/v1/clearent/salesprofile/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_sales_profile_${formData.clearent_boarding.merchantNumber}`
    );

    const {
        mutate: mutateUploadClearentMerchantMotoQuestionaire,
        isLoading: isLoadingMutateUploadClearentMerchantMotoQuestionaire,
        isSuccess: isSuccessMutateUploadClearentMerchantMotoQuestionaire
    } = useAxiosQuery("POST_FILE", `api/v1/clearent/document/upload`);

    useEffect(() => {
        // if (salesProfileData.isECommerce) {
        //     form.setFieldsValue({
        //         ...salesProfileData,
        //         rangeCardNotPresent: 100,
        //         cardPresentPercentage: 0
        //     });
        // } else {
        //     form.setFieldsValue({
        //         ...salesProfileData,
        //         cardPresentPercentage: 100,
        //         rangeCardNotPresent: 0
        //     });
        // }
        return () => {};
    }, [salesProfileData]);
    return (
        <Form
            layout="vertical"
            form={form}
            initialValues={salesProfileData}
            onValuesChange={(changedValue, values) => {
                let formChangedValue = { ...changedValue };
                // console.log("changedValue", changedValue);
                if (values.isECommerce != salesProfileData.isECommerce) {
                    if (values.isECommerce) {
                        formChangedValue = {
                            ...formChangedValue,
                            rangeCardNotPresent: 100,
                            cardPresentPercentage: 0
                        };
                    } else {
                        formChangedValue = {
                            ...formChangedValue,
                            cardPresentPercentage: 100,
                            rangeCardNotPresent: 0
                        };
                    }
                }

                if (
                    values.rangeCardNotPresent !=
                    salesProfileData.rangeCardNotPresent
                ) {
                    formChangedValue = {
                        ...formChangedValue,
                        rangeCardNotPresent: values.rangeCardNotPresent,
                        cardPresentPercentage: 100 - values.rangeCardNotPresent
                    };
                }

                if (
                    values.cardPresentPercentage !=
                    salesProfileData.cardPresentPercentage
                ) {
                    formChangedValue = {
                        ...formChangedValue,
                        cardPresentPercentage: values.cardPresentPercentage,
                        rangeCardNotPresent: 100 - values.cardPresentPercentage
                    };
                }

                form.setFieldsValue(formChangedValue);
                setSalesProfileData({
                    ...salesProfileData,
                    ...formChangedValue
                });
                reCountRequired(values);
            }}
            onFinish={values => {
                reCountRequired(values);
                let data = { ...salesProfileData };
                // console.log("data", data);
                mutateUpdateClearentMerchantSalesProfile(data, {
                    onSuccess: res => {
                        // console.log(
                        //     "mutateUpdateClearentMerchantSalesProfile",
                        //     res
                        // );
                        if (res.errors) {
                            if (res.errors.length > 0) {
                                res.errors.map((error, key) => {
                                    notification.error({
                                        message: error.errorMessage
                                    });
                                });
                            }
                        } else {
                            saveSalesProfileToDB();
                            // refetchClearentBoardingSalesProfile();
                            setCurrentStep(currentStep + 1);
                        }
                    }
                });
            }}
        >
            <Card
                title="Profile"
                loading={isLoadingDataClearentBoardingSalesProfile}
                extra={
                    <Progress
                        style={{ width: "200px" }}
                        percent={(requiredFieldsCount / 5) * 100}
                        type="line"
                    />
                }
            >
                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Annual Volume"
                            name="annualVolume"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Average Ticket"
                            name="averageTicket"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="High Ticket"
                            name="highTicket"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Card
                title="Sales Profile"
                loading={isLoadingDataClearentBoardingSalesProfile}
            >
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={`Card Present(${
                                salesProfileData.cardPresentPercentage
                                    ? salesProfileData.cardPresentPercentage
                                    : 0
                            }%)`}
                            name="cardPresentPercentage"
                        >
                            <Slider />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label={`Card Not Present(${
                                salesProfileData.rangeCardNotPresent
                                    ? salesProfileData.rangeCardNotPresent
                                    : 0
                            }%)`}
                            name="rangeCardNotPresent"
                        >
                            <Slider />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item label="ECOMM" name="isECommerce">
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {salesProfileData.isECommerce == true && (
                            <Upload
                                name="logo"
                                accept=".pdf,.jpeg"
                                // action={false}
                                showUploadList={false}
                                customRequest={({
                                    onSuccess,
                                    onError,
                                    file
                                }) => {
                                    let data = new FormData();
                                    data.append("file", file);
                                    data.append("category", 29);
                                    data.append(
                                        "merchantNumber",
                                        formData.clearent_boarding
                                            .merchantNumber
                                    );
                                    mutateUploadClearentMerchantMotoQuestionaire(
                                        data,
                                        {
                                            onSuccess: res => {
                                                // console.log("res upload", res);
                                                if (res.data) {
                                                    onSuccess();
                                                    notification.success({
                                                        message:
                                                            "Moto Questionnaire Uploaded"
                                                    });
                                                } else {
                                                    notification.error({
                                                        message:
                                                            "Upload Failed, Please try again..."
                                                    });
                                                }
                                            },
                                            onError: err => {
                                                onError();
                                            }
                                        }
                                    );
                                }}
                                listType="picture"
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    loading={
                                        isLoadingMutateUploadClearentMerchantMotoQuestionaire
                                    }
                                >
                                    Upload Moto Questionnaire{" "}
                                    {isSuccessMutateUploadClearentMerchantMotoQuestionaire && (
                                        <CheckOutlined />
                                    )}
                                </Button>
                            </Upload>
                        )}
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label="Future Delivery?"
                            name="futureDelivery"
                        >
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {salesProfileData.futureDelivery == true && (
                            <Row gutter={12}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Percentage of Future Delivery?"
                                        name="futureDeliveryPercentage"
                                    >
                                        {/* <Input type="number" max={100} /> */}
                                        <InputNumber
                                            max={100}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label={<></>}
                                        name="futureDeliveryTypeID"
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>1-7 Days</Radio>
                                            <Radio value={2}>8-14 Days</Radio>
                                            <Radio value={3}>Other</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label={<></>}
                                        name="otherDeliveryType"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>
            </Card>
            <Card
                title="Merchant Profile"
                loading={isLoadingDataClearentBoardingSalesProfile}
            >
                <Row gutter={12}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Return/refund Policy"
                            name="returnRefundPolicy"
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
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="Products/Services Sold"
                            name="productsSold"
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
                    <Col xs={24} md={8}>
                        <Form.Item
                            label="MCC Code"
                            name="mccCode"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}
                        >
                            <Select style={{ width: "100%" }}>
                                {dataMccCodes &&
                                    dataMccCodes.data.content.map(
                                        (mccCode, key) => {
                                            return (
                                                <Select.Option
                                                    key={key}
                                                    value={mccCode.mccCode}
                                                >
                                                    {mccCode.mccDescription} (
                                                    {mccCode.mccCode})
                                                </Select.Option>
                                            );
                                        }
                                    )}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
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
                    onClick={e => saveSalesProfileToDB()}
                    loading={isLoadingSaveSalesProfileToDB}
                >
                    Save
                </Button>
                <Button
                    type="primary"
                    onClick={e => form.submit()}
                    loading={
                        isLoadingMutateUpdateClearentMerchantSalesProfile ||
                        isFetchingDataClearentBoardingSalesProfile
                    }
                >
                    {dataClearentBoardingSalesProfile &&
                    dataClearentBoardingSalesProfile.data.mccCode ? (
                        <>reValidate</>
                    ) : (
                        <>Save & Proceed</>
                    )}
                </Button>
            </Space>
        </Form>
    );
};

export default StepProfile;
