import {
    Card,
    Col,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Progress,
    Divider,
    Space,
    Button,
    notification
} from "antd";
import React, { useEffect, useState } from "react";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";

const StepSiteSurvey = ({
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
        if (currentStep == 3) {
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

    let requiredFields = ["siteTypeID"];
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
        _steps[3] = {
            ..._steps[3],
            title: <>Site Survey ({required_fields_count}/1)</>,
            status: required_fields_count == 1 ? "finish" : "progress"
        };
        setRequiredFieldsCount(required_fields_count);
        setStepsStatuses(_steps);
    };

    const {
        mutate: mutateSaveSiteSurveyToDB,
        isLoading: isLoadingSaverSiteSurveyToDB,
        isFetching: isFetchingSaverSiteSurveyToDB
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/saveSiteSurveyDB",
        `clearent_boarding_site_survey_${formData.clearent_boarding.merchantNumber}`
    );
    const saveSiteSurveyToDB = e => {
        let data = {
            data: form.getFieldsValue(),
            merchantNumber: formData.clearent_boarding.merchantNumber
        };
        // console.log(data);
        mutateSaveSiteSurveyToDB(data, {
            onSuccess: res => {
                console.log(res);
                notification.success({
                    message: "Site Survey Successfully Saved"
                });
            }
        });
    };

    const {
        data: dataSiteSurvey,
        isLoading: isLoadingDataSiteSurvey
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/getSiteSurveyDetails/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_site_survey_${formData.clearent_boarding.merchantNumber}`,
        res => {
            // console.log("sitesurvey", res);
            if (res.data.validIDVerified == null) {
                let saved = res.saved.site_survey;
                if (saved != null) {
                    saved = JSON.parse(saved);
                    form.setFieldsValue(saved);
                    reCountRequired(saved);
                }
            } else {
                let data = res.data;
                data["siteSurveyConductedInPerson"] =
                    data["siteSurveyConductedInPerson"] == null
                        ? true
                        : data["siteSurveyConductedInPerson"];
                data["validIDVerified"] =
                    data["validIDVerified"] == null
                        ? true
                        : data["validIDVerified"];

                data["agreementAccepted"] =
                    data["agreementAccepted"] == null
                        ? true
                        : data["agreementAccepted"];

                data["inventoryMatchesProductSold"] =
                    data["inventoryMatchesProductSold"] == null
                        ? true
                        : data["inventoryMatchesProductSold"];
                form.setFieldsValue(data);
                reCountRequired(data);
            }
        }
    );

    const {
        mutate: mutateSaveSiteSurvey,
        isLoading: isLoadingMutateSaveSiteSurvey
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/postSiteSurvey",
        `clearent_boarding_site_survey_${formData.clearent_boarding.merchantNumber}`
    );
    const handleSubmitCreateMerchant = values => {
        let data = {
            ...values,
            merchantNumber: formData.clearent_boarding.merchantNumber
        };

        mutateSaveSiteSurvey(data, {
            onSuccess: res => {
                console.log(res);
                if (res.errors.length > 0) {
                    res.errors.map((error, key) => {
                        notification.error({
                            message: error.errorMessage
                        });
                    });
                } else {
                    saveSiteSurveyToDB();
                    setCurrentStep(currentStep + 1);
                }
            }
        });
    };

    return (
        <Card
            title="Site Survey"
            extra={
                <Progress
                    style={{ width: "200px" }}
                    percent={(requiredFieldsCount / 1) * 100}
                    type="line"
                />
            }
            loading={isLoadingDataSiteSurvey}
        >
            <Form
                form={form}
                onValuesChange={(changedValue, values) => {
                    console.log("values", values);
                }}
                onFinish={values => {
                    handleSubmitCreateMerchant(values);
                }}
                layout="vertical"
                initialValues={{
                    siteSurveyConductedInPerson: true,
                    inventoryMatchesProductSold: true,
                    validIDVerified: true,
                    agreementAccepted: true
                }}
            >
                <Row>
                    <Col xs={24}>
                        <Form.Item
                            label="Site Type"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required!"
                                }
                            ]}
                            name="siteTypeID"
                        >
                            <Select
                                style={{ width: "100%" }}
                                placeholder="Please Select Type"
                            >
                                <Select.Option value={1}>Other</Select.Option>
                                <Select.Option value={2}>
                                    Brick & Mortar
                                </Select.Option>
                                <Select.Option value={3}>
                                    Tradeshow
                                </Select.Option>
                                <Select.Option value={4}>
                                    Residence
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label="Merchant Acquisition Type"
                            name="merchantAcquisitionTypeID"
                            initialValue={1}
                        >
                            <Select style={{ width: "100%" }}>
                                <Select.Option value={1}>
                                    Rep called merchant
                                </Select.Option>
                                <Select.Option value={2}>
                                    Merchant called rep
                                </Select.Option>
                                <Select.Option value={3}>
                                    Web lead
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label="Other Site Type Description"
                            name="otherSiteTypeDescription"
                        >
                            <Input placeholder="Other Site Type Description" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} className="text-center">
                        <br />
                        <br />
                        <Form.Item
                            label="Survey Conducted In Person"
                            name="siteSurveyConductedInPerson"
                            className="formItemTextCenter"
                        >
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <br />
                        <br />
                        <Form.Item
                            label="Inventory Matches Product Sold"
                            name="inventoryMatchesProductSold"
                            className="formItemTextCenter"
                        >
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12} className="text-center">
                        <br />
                        <br />
                        <Form.Item
                            label="Valid ID Verified"
                            name="validIDVerified"
                            className="formItemTextCenter"
                        >
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <br />
                        <br />
                        <Form.Item
                            label="(Inventory Matches Product Sold Comments)"
                            name="inventoryMatchesProductSoldComments"
                        >
                            <Input.TextArea rows={4}></Input.TextArea>
                        </Form.Item>
                    </Col>
                    <Col xs={24} className="text-center">
                        <Form.Item
                            label="Agreement Accepted"
                            name="agreementAccepted"
                            className="formItemTextCenter"
                        >
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Divider />
            <Space>
                <Button
                    type="primary"
                    onClick={e => saveSiteSurveyToDB()}
                    loading={isLoadingSaverSiteSurveyToDB}
                >
                    Save
                </Button>
                <Button
                    type="primary"
                    onClick={e => form.submit()}
                    loading={isLoadingMutateSaveSiteSurvey}
                >
                    {dataSiteSurvey && dataSiteSurvey.data.validIDVerified ? (
                        <>reValidate</>
                    ) : (
                        <>Save & Proceed</>
                    )}
                </Button>
            </Space>
        </Card>
    );
};

export default StepSiteSurvey;
