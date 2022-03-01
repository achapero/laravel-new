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
    notification,
    Checkbox
} from "antd";
import { MaskedInput } from "antd-mask-input";
import React, { useEffect, useState } from "react";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";

const StepTaxpayer = ({
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
        if (
            formData.clearent_boarding.status == "Quality Assurance Review" &&
            userdata.role == "Merchant"
        ) {
            $("input").attr("disabled", true);
        }
        return () => {};
    }, []);
    useEffect(() => {
        // console.log("currentStep", currentStep);
        if (currentStep == 4) {
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }

            refetchTaxpayer();
        }
        return () => {};
    }, [currentStep]);

    let requiredFields = ["tin"];
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
        _steps[4] = {
            ..._steps[4],
            title: (
                <>
                    Taxpayer ({required_fields_count}/
                    {dataTaxpayer && dataTaxpayer.clearent_boardings.merchant
                        ? dataTaxpayer &&
                          dataTaxpayer.clearent_boardings.merchant &&
                          JSON.parse(dataTaxpayer.clearent_boardings.merchant)
                              .companyTypeId == 1
                            ? 1
                            : 2
                        : 1}
                    )
                </>
            ),
            status: required_fields_count == 1 ? "finish" : "progress"
        };
        setRequiredFieldsCount(required_fields_count);
        setStepsStatuses(_steps);
    };

    const {
        mutate: mutateSaveTaxpayerToDB,
        isLoading: isLoadingSaverTaxpayerToDB,
        isFetching: isFetchingSaverTaxpayerToDB
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/saveTaxpayerDB",
        `clearent_boarding_taxpayer_${formData.clearent_boarding.merchantNumber}`
    );
    const saveTaxpayerToDB = (taxPayer = null) => {
        let data = {
            data: taxPayer ? taxPayer : form.getFieldsValue(),
            merchantNumber: formData.clearent_boarding.merchantNumber
        };
        console.log("taxpapery", data);
        mutateSaveTaxpayerToDB(data, {
            onSuccess: res => {
                console.log(res);
                notification.success({
                    message: "Tax Payer Successfully Saved"
                });
            }
        });
    };

    const {
        data: dataTaxpayer,
        isLoading: isLoadingDataTaxpayer,
        isFetching: isFetchingDataTaxpayer,
        refetch: refetchTaxpayer
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/getTaxpayerDetails/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_taxpayer_${formData.clearent_boarding.merchantNumber}`,
        res => {
            console.log("res", res);
            if (res.data.tin == null) {
                var legalFirstName = "",
                    legalLastName = "",
                    tin = "",
                    businessLegalName = "",
                    email = formData.email;
                var stateIncorporatedCode;
                //match form field to merhcant form field

                inputData.forEach(element => {
                    if (element.field == "State") {
                        $("#stateIncorporatedCode")
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
                                    stateIncorporatedCode = val;
                                }
                            });
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
                        legalFirstName = firstName1;
                        legalLastName = lastName1;
                    }
                    if (element.field == "TaxId") {
                        tin = element.value;
                    }
                    if (element.field == "LegalBusinessName") {
                        businessLegalName = element.value;
                    } else {
                        let merchantDbaName =
                            typeof res.data === "object"
                                ? ""
                                : JSON.parse(
                                      res.data.clearent_boarding.merchant
                                  );

                        businessLegalName =
                            merchantDbaName.dbaName && merchantDbaName != ""
                                ? merchantDbaName
                                : "";
                    }
                });

                let saved = res.saved.tax_payer;

                if (saved == null) {
                    let data = {
                        legalFirstName: legalFirstName,
                        legalLastName: legalLastName,
                        tin: tin,
                        businessLegalName: businessLegalName,
                        stateIncorporatedCode: stateIncorporatedCode
                    };
                    form.setFieldsValue(data);
                    reCountRequired(data);
                } else {
                    let data = JSON.parse(saved);
                    form.setFieldsValue(data);
                    reCountRequired(data);
                }
            } else {
                form.setFieldsValue(res.data);
                reCountRequired(res.data);
                if (
                    formData.clearent_boarding.status ==
                        "Quality Assurance Review" &&
                    userdata.role == "Merchant"
                ) {
                    $("input").attr("disabled", true);
                }
            }
        }
    );

    const {
        mutate: mutateSaveTaxpayer,
        isLoading: isLoadingMutateSaveTaxpayer
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/postTaxpayer",
        `clearent_boarding_taxpayer_${formData.clearent_boarding.merchantNumber}`
    );

    const handleSubmitCreateMerchantTaxpayer = values => {
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

            mutateSaveTaxpayer(data, {
                onSuccess: res => {
                    console.log(res);
                    if (res.errors.length > 0) {
                        res.errors.map((error, key) => {
                            notification.error({
                                message: error.errorMessage
                            });
                        });
                    } else {
                        saveTaxpayerToDB(data);
                        setCurrentStep(currentStep + 1);
                    }
                }
            });
        }
    };

    const [businessDbaSame, setBusinessDbaSame] = useState(false);

    useEffect(() => {
        if (businessDbaSame) {
            console.log(
                "JSON.parse(dataTaxpayer.clearent_boardings.merchant)",
                JSON.parse(dataTaxpayer.clearent_boardings.merchant)
            );

            let merchantTab = JSON.parse(
                dataTaxpayer.clearent_boardings.merchant
            );

            form.setFieldsValue({ businessLegalName: merchantTab.dbaName });
        }
        return () => {};
    }, [businessDbaSame]);

    return (
        <Card
            title="Taxpayer"
            extra={
                <Progress
                    style={{ width: "200px" }}
                    percent={
                        (requiredFieldsCount /
                            (dataTaxpayer &&
                            dataTaxpayer.clearent_boardings.merchant &&
                            JSON.parse(dataTaxpayer.clearent_boardings.merchant)
                                .companyTypeId == 1
                                ? 1
                                : 2)) *
                        100
                    }
                    type="line"
                />
            }
            loading={isLoadingDataTaxpayer || isFetchingDataTaxpayer}
        >
            <Form
                form={form}
                onValuesChange={(changedValue, values) => {
                    console.log("values", values);
                }}
                onFinish={values => {
                    handleSubmitCreateMerchantTaxpayer(values);
                }}
                layout="vertical"
                // initialValues={{
                //     siteSurveyConductedInPerson: true,
                //     inventoryMatchesProductSold: true,
                //     validIDVerified: true,
                //     agreementAccepted: true
                // }}
            >
                {dataTaxpayer &&
                    dataTaxpayer.clearent_boardings.merchant &&
                    JSON.parse(dataTaxpayer.clearent_boardings.merchant)
                        .companyTypeId != 1 && (
                        <Checkbox
                            checked={businessDbaSame}
                            onChange={e => setBusinessDbaSame(e.target.checked)}
                        >
                            Business Legal Name and DBA name are the same
                        </Checkbox>
                    )}

                <Row gutter={12}>
                    {dataTaxpayer &&
                        dataTaxpayer.clearent_boardings.merchant &&
                        JSON.parse(dataTaxpayer.clearent_boardings.merchant)
                            .companyTypeId == 1 && (
                            <>
                                <Col xs={6}>
                                    <Form.Item
                                        label="Legal First Name"
                                        name="legalFirstName"
                                    >
                                        <Input placeholder="Legal First Name" />
                                    </Form.Item>
                                </Col>
                                <Col xs={6}>
                                    <Form.Item
                                        label="Legal Last Name"
                                        name="legalLastName"
                                    >
                                        <Input placeholder="Legal last Name" />
                                    </Form.Item>
                                </Col>
                            </>
                        )}
                    {dataTaxpayer &&
                        dataTaxpayer.clearent_boardings.merchant &&
                        JSON.parse(dataTaxpayer.clearent_boardings.merchant)
                            .companyTypeId != 1 && (
                            <Col xs={12}>
                                <Form.Item
                                    label="Business Legal Name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "This field is required!"
                                        }
                                    ]}
                                    name="businessLegalName"
                                >
                                    <Input placeholder="Business Legal Name" />
                                </Form.Item>
                            </Col>
                        )}

                    <Col xs={6}>
                        <Form.Item
                            label="Tin"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required!"
                                }
                            ]}
                            name="tin"
                        >
                            {/* <Input placeholder="Tin" /> */}
                            <MaskedInput placeholder="tin" mask="11-1111111" />
                        </Form.Item>
                    </Col>

                    <Col xs={6}>
                        <Form.Item
                            label="State Incorporated Code"
                            name="stateIncorporatedCode"
                        >
                            <Select
                                placeholder="Select State Code"
                                id="stateIncorporatedCode"
                                style={{ width: "100%" }}
                                showSearch
                                filterOption={(input, option) =>
                                    option.search_value
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Select.Option
                                    search_value="Alabama (AL)"
                                    value="AL"
                                >
                                    Alabama (AL)
                                </Select.Option>
                                <Select.Option
                                    search_value="Alaska (AK)"
                                    value="AK"
                                >
                                    Alaska (AK)
                                </Select.Option>
                                <Select.Option
                                    search_value="Arizona (AZ)"
                                    value="AZ"
                                >
                                    Arizona (AZ)
                                </Select.Option>
                                <Select.Option
                                    search_value="Arkansas (AR)"
                                    value="AR"
                                >
                                    Arkansas (AR)
                                </Select.Option>
                                <Select.Option
                                    search_value="California (CA)"
                                    value="CA"
                                >
                                    California (CA)
                                </Select.Option>
                                <Select.Option
                                    search_value="Colorado (CO)"
                                    value="CO"
                                >
                                    Colorado (CO)
                                </Select.Option>
                                <Select.Option
                                    search_value="Connecticut (CT)"
                                    value="CT"
                                >
                                    Connecticut (CT)
                                </Select.Option>
                                <Select.Option
                                    search_value="Delaware (DE)"
                                    value="DE"
                                >
                                    Delaware (DE)
                                </Select.Option>
                                <Select.Option
                                    search_value="District of Columbia (DC)"
                                    value="DC"
                                >
                                    District of Columbia (DC)
                                </Select.Option>
                                <Select.Option
                                    search_value="Florida (FL)"
                                    value="FL"
                                >
                                    Florida (FL)
                                </Select.Option>
                                <Select.Option
                                    search_value="Georgia (GA)"
                                    value="GA"
                                >
                                    Georgia (GA)
                                </Select.Option>
                                <Select.Option
                                    search_value="Hawaii (HI)"
                                    value="HI"
                                >
                                    Hawaii (HI)
                                </Select.Option>
                                <Select.Option
                                    search_value="Idaho (ID)"
                                    value="ID"
                                >
                                    Idaho (ID)
                                </Select.Option>
                                <Select.Option
                                    search_value="Illinois (IL)"
                                    value="IL"
                                >
                                    Illinois (IL)
                                </Select.Option>
                                <Select.Option
                                    search_value="Indiana (IN)"
                                    value="IN"
                                >
                                    Indiana (IN)
                                </Select.Option>
                                <Select.Option
                                    search_value="Iowa (IA)"
                                    value="IA"
                                >
                                    Iowa (IA)
                                </Select.Option>
                                <Select.Option
                                    search_value="Kansas (KS)"
                                    value="KS"
                                >
                                    Kansas (KS)
                                </Select.Option>
                                <Select.Option
                                    search_value="Kentucky (KY)"
                                    value="KY"
                                >
                                    Kentucky (KY)
                                </Select.Option>
                                <Select.Option
                                    search_value="Louisiana (LA)"
                                    value="LA"
                                >
                                    Louisiana (LA)
                                </Select.Option>
                                <Select.Option
                                    search_value="Maine (ME)"
                                    value="ME"
                                >
                                    Maine (ME)
                                </Select.Option>
                                <Select.Option
                                    search_value="Maryland (MD)"
                                    value="MD"
                                >
                                    Maryland (MD)
                                </Select.Option>
                                <Select.Option
                                    search_value="Massachusetts (MA)"
                                    value="MA"
                                >
                                    Massachusetts (MA)
                                </Select.Option>
                                <Select.Option
                                    search_value="Michigan (MI)"
                                    value="MI"
                                >
                                    Michigan (MI)
                                </Select.Option>
                                <Select.Option
                                    search_value="Minnesota (MN)"
                                    value="MN"
                                >
                                    Minnesota (MN)
                                </Select.Option>
                                <Select.Option
                                    search_value="Mississippi (MS)"
                                    value="MS"
                                >
                                    Mississippi (MS)
                                </Select.Option>
                                <Select.Option
                                    search_value="Missouri (MO)"
                                    value="MO"
                                >
                                    Missouri (MO)
                                </Select.Option>
                                <Select.Option
                                    search_value="Montana (MT)"
                                    value="MT"
                                >
                                    Montana (MT)
                                </Select.Option>
                                <Select.Option
                                    search_value="Nebraska (NE)"
                                    value="NE"
                                >
                                    Nebraska (NE)
                                </Select.Option>
                                <Select.Option
                                    search_value="Nevada (NV)"
                                    value="NV"
                                >
                                    Nevada (NV)
                                </Select.Option>
                                <Select.Option
                                    search_value="New Hampshire (NH)"
                                    value="NH"
                                >
                                    New Hampshire (NH)
                                </Select.Option>
                                <Select.Option
                                    search_value="New Jersey (NJ)"
                                    value="NJ"
                                >
                                    New Jersey (NJ)
                                </Select.Option>
                                <Select.Option
                                    search_value="New Mexico (NM)"
                                    value="NM"
                                >
                                    New Mexico (NM)
                                </Select.Option>
                                <Select.Option
                                    search_value="New York (NY)"
                                    value="NY"
                                >
                                    New York (NY)
                                </Select.Option>
                                <Select.Option
                                    search_value="North Carolina (NC)"
                                    value="NC"
                                >
                                    North Carolina (NC)
                                </Select.Option>
                                <Select.Option
                                    search_value="North Dakota (ND)"
                                    value="ND"
                                >
                                    North Dakota (ND)
                                </Select.Option>
                                <Select.Option
                                    search_value="Ohio (OH)"
                                    value="OH"
                                >
                                    Ohio (OH)
                                </Select.Option>
                                <Select.Option
                                    search_value="Oklahoma (OK)"
                                    value="OK"
                                >
                                    Oklahoma (OK)
                                </Select.Option>
                                <Select.Option
                                    search_value="Oregon (OR)"
                                    value="OR"
                                >
                                    Oregon (OR)
                                </Select.Option>
                                <Select.Option
                                    search_value="Palau (PW)"
                                    value="PW"
                                >
                                    Palau (PW)
                                </Select.Option>
                                <Select.Option
                                    search_value="Pennsylvania (PA)"
                                    value="PA"
                                >
                                    Pennsylvania (PA)
                                </Select.Option>
                                <Select.Option
                                    search_value="Rhode Island (RI)"
                                    value="RI"
                                >
                                    Rhode Island (RI)
                                </Select.Option>
                                <Select.Option
                                    search_value="South Carolina (SC)"
                                    value="SC"
                                >
                                    South Carolina (SC)
                                </Select.Option>
                                <Select.Option
                                    search_value="South Dakota (SD)"
                                    value="SD"
                                >
                                    South Dakota (SD)
                                </Select.Option>
                                <Select.Option
                                    search_value="Tennessee (TN)"
                                    value="TN"
                                >
                                    Tennessee (TN)
                                </Select.Option>
                                <Select.Option
                                    search_value="Texas (TX)"
                                    value="TX"
                                >
                                    Texas (TX)
                                </Select.Option>
                                <Select.Option
                                    search_value="Utah (UT)"
                                    value="UT"
                                >
                                    Utah (UT)
                                </Select.Option>
                                <Select.Option
                                    search_value="Vermont (VT)"
                                    value="VT"
                                >
                                    Vermont (VT)
                                </Select.Option>
                                <Select.Option
                                    search_value="Virginia (VA)"
                                    value="VA"
                                >
                                    Virginia (VA)
                                </Select.Option>
                                <Select.Option
                                    search_value="Washington (WA)"
                                    value="WA"
                                >
                                    Washington (WA)
                                </Select.Option>
                                <Select.Option
                                    search_value="West Virginia (WV)"
                                    value="WV"
                                >
                                    West Virginia (WV)
                                </Select.Option>
                                <Select.Option
                                    search_value="Wisconsin (WI)"
                                    value="WI"
                                >
                                    Wisconsin (WI)
                                </Select.Option>
                                <Select.Option
                                    search_value="Wyoming (WY)"
                                    value="WY"
                                >
                                    Wyoming (WY)
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Divider />
            <Space>
                <Button
                    type="primary"
                    onClick={e => saveTaxpayerToDB()}
                    loading={
                        isLoadingSaverTaxpayerToDB ||
                        isFetchingSaverTaxpayerToDB
                    }
                >
                    Save
                </Button>
                <Button
                    type="primary"
                    onClick={e => form.submit()}
                    loading={isLoadingMutateSaveTaxpayer}
                >
                    {dataTaxpayer && dataTaxpayer.data.tin ? (
                        <>reValidate</>
                    ) : (
                        <>Save & Proceed</>
                    )}
                </Button>
            </Space>
        </Card>
    );
};

export default StepTaxpayer;
