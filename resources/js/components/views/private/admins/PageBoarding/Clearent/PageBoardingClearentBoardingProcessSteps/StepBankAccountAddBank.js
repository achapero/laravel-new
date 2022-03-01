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
    Space
} from "antd";
import React, { useEffect, useState } from "react";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
import FileSaver from "file-saver";
const StepBankAccountAddBank = ({
    merchantNumber,
    showAddBank,
    setShowAddBank,
    selectedBankAccount,
    setSelectedBankAccount
}) => {
    const [form] = Form.useForm();

    const {
        mutate: mutateSaveBankToDB,
        isLoading: isLoadingMutateSaveBankToDB
    } = useAxiosQuery("POST", "api/v1/clearent/saveBankDB");
    const saveBankToDB = () => {
        let data = form.getFieldsValue();
        data["merchantNumber"] = merchantNumber;

        if (data.bankAccountTypeID == 1 || data.bankAccountTypeID == 2) {
            data["isNameSameAsLegalOrDBAName"] = true;
        } else {
            data["isNameSameAsLegalOrDBAName"] = false;
        }
        let _data = {
            data: data,
            merchantNumber: merchantNumber
        };

        console.log("data", _data);
        mutateSaveBankToDB(_data, {
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

    const {
        mutate: mutateGetSavedBankDB,
        isLoading: isLoadingGetSavedBankDB
    } = useAxiosQuery("POST", `api/v1/clearent/getBankDB`);
    const [merchantData, setMerchantData] = useState();
    const [taxpayerData, setTaxpayer] = useState();
    // const [bankDBData, setbankDBData] = useState();
    useEffect(() => {
        mutateGetSavedBankDB(
            { merchantNumber },
            {
                onSuccess: res => {
                    console.log("mutateGetSavedBankDB", res);

                    if (selectedBankAccount) {
                        console.log("selectedBankAccount", selectedBankAccount);
                        setBankAccountDetails({ ...selectedBankAccount });
                        form.setFieldsValue(selectedBankAccount);
                    } else {
                        if (res.saved) {
                            if (res.saved.bank_account) {
                                form.setFieldsValue(
                                    JSON.parse(res.saved.bank_account)
                                );
                                setBankAccountDetails(
                                    JSON.parse(res.saved.bank_account)
                                );
                            }
                        }
                    }
                    // setbankDBData(JSON.parse(res.saved.bank_account));
                    setMerchantData(JSON.parse(res.merchant.merchant));
                    setTaxpayer(JSON.parse(res.merchant.tax_payer));
                }
            }
        );

        return () => {};
    }, []);

    useEffect(() => {
        console.log("bankAccountDetails", bankAccountDetails);
        return () => {};
    }, [bankAccountDetails]);

    const {
        mutate: mutateCreateBank,
        isLoading: isLoadingMutateCreateBank
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/clearent/postBank",
        `clearent_boarding_banks_${merchantNumber}`
    );
    const handleSubmitCreateBank = (e, withUpload = false) => {
        if (e) {
            e.preventDefault();
        }
        let data = { ...bankAccountDetails };
        data["merchantNumber"] = merchantNumber;

        if (data.bankAccountTypeID == 1 || data.bankAccountTypeID == 2) {
            data["isNameSameAsLegalOrDBAName"] = true;
        } else {
            data["isNameSameAsLegalOrDBAName"] = false;
        }
        console.log("data", data);
        htmlToImage
            .toPng(document.getElementById("bankCheck"), {
                quality: 0.95
            })
            .then(function(dataUrl) {
                const pdf = new jsPDF();
                pdf.addImage(dataUrl, "PNG", 0, 0);
                // pdf.save("test.png");
                let BankCheck = pdf.output("blob");

                let formData = new FormData();
                Object.keys(data).map((val, key) => {
                    formData.append(val, data[val]);
                });
                formData.append("voidedCheck", BankCheck);

                console.log("formData", formData);
                mutateCreateBank(formData, {
                    onSuccess: res => {
                        if (res.success) {
                            if (res.data.errors) {
                                if (res.data.errors.length > 0) {
                                    res.data.errors.map((error, key) => {
                                        notification.error({
                                            message: error.errorMessage
                                        });
                                    });
                                }
                            } else {
                                setBankAccountDetails({
                                    ...bankAccountDetails,
                                    bankAccountID: res.data.bankAccountID
                                });
                                saveBankToDB();
                                setShowAddBank(false);
                            }
                        }
                    }
                });
            });
        //console.log(data);
    };

    const [bankAccountDetails, setBankAccountDetails] = useState({
        bankName: "",
        nameOnAccount: "",
        bankAccountTypeID: null,
        bankAccountNameTypeID: null,
        aba: "",
        accountNumber: "",
        hasFees: true,
        hasFunds: true,
        hasChargebacks: true
    });

    useEffect(() => {
        console.log("bankAccountDetails", bankAccountDetails);
        return () => {};
    }, [bankAccountDetails]);

    const downloadBankCheck = () => {
        htmlToImage
            .toPng(document.getElementById("bankCheck"), {
                quality: 0.95
            })
            .then(function(dataUrl) {
                const pdf = new jsPDF();
                pdf.addImage(dataUrl, "PNG", 0, 0);
                // pdf.save("test.png");
                let BankCheck = pdf.output("blob");
                let merchantName = bankAccountDetails.nameOnAccount.replace(
                    / /g,
                    "_"
                );
                let merchantNumberlast5 = merchantNumber.slice(-5);
                FileSaver.saveAs(
                    BankCheck,
                    merchantName +
                        "_" +
                        merchantNumberlast5 +
                        "_VoidedCheck.pdf"
                );
            });
    };
    return (
        <>
            <FormAddBankCheck bankAccountDetails={bankAccountDetails} />
            <Card
                title="Add a Bank Account"
                extra={
                    <Button type="ghost" onClick={e => setShowAddBank(false)}>
                        Back to List
                    </Button>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={values => {
                        handleSubmitCreateBank();
                    }}
                    onValuesChange={(changedValue, values) => {
                        if (changedValue.bankAccountTypeID) {
                            if (changedValue.bankAccountTypeID == 1) {
                                let nameOnAccount = "";
                                if (taxpayerData.businessLegalName) {
                                    nameOnAccount =
                                        taxpayerData.businessLegalName;
                                } else {
                                    nameOnAccount =
                                        taxpayerData.legalFirstName +
                                        " " +
                                        taxpayerData.legalLastName;
                                }
                                form.setFieldsValue({
                                    nameOnAccount: nameOnAccount
                                });
                            }
                            if (changedValue.bankAccountTypeID == 2) {
                                console.log(merchantData.dbaName);
                                form.setFieldsValue({
                                    nameOnAccount: merchantData.dbaName
                                });
                            }
                        }
                        console.log("valueschange", bankAccountDetails, values);
                        setBankAccountDetails({
                            ...bankAccountDetails,
                            ...values
                        });
                    }}
                >
                    <Row gutter={12}>
                        <Col xs={24}>
                            <Form.Item
                                label="Bank Name"
                                name="bankName"
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
                        <Col xs={24}>
                            <Form.Item
                                label="Is the Merchant's account under Legal Name or DBA?"
                                name="bankAccountTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}>Legal Name</Radio>
                                    <Radio value={2}>DBA</Radio>
                                    <Radio value={3}>Other</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Name on Account"
                                name="nameOnAccount"
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Routing Number"
                                name="aba"
                                rules={[
                                    {
                                        pattern: /^(?:\d*)$/,
                                        message:
                                            "Routing Number should contain just number"
                                    },
                                    {
                                        max: 9,
                                        message:
                                            "Routing Number should be less than 9 character"
                                    }
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Account Number"
                                name="accountNumber"
                                rules={[
                                    {
                                        pattern: /^(?:\d*)$/,
                                        message:
                                            "Account Number should contain just number"
                                    },
                                    {
                                        max: 12,
                                        message:
                                            "Account Number should be less than 12 character"
                                    }
                                ]}
                            >
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                label="Account Type"
                                name="bankAccountNameTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    }
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}>Checking</Radio>
                                    <Radio value={2}>Savings</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            Account Use (all options must be accounted for by
                            the merchant's bank account(s)):
                            <Row>
                                <Col xs={3}>
                                    <Form.Item
                                        label=""
                                        name="hasFunds"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Checkbox>Deposit</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col xs={3}>
                                    <Form.Item
                                        label=""
                                        name="hasFees"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Checkbox>Fees</Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col xs={3}>
                                    <Form.Item
                                        label=""
                                        name="hasChargebacks"
                                        valuePropName="checked"
                                        initialValue={true}
                                    >
                                        <Checkbox>Chargebacks</Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>{" "}
                <Divider />
                <Space>
                    <Button
                        type="primary"
                        onClick={e => saveBankToDB()}
                        loading={isLoadingMutateSaveBankToDB}
                    >
                        Save
                    </Button>
                    <Button
                        type="primary"
                        onClick={e => form.submit()}
                        loading={isLoadingMutateCreateBank}
                        disabled={
                            bankAccountDetails.accountNumber &&
                            bankAccountDetails.accountNumber.indexOf("*") === -1
                                ? false
                                : true
                        }
                    >
                        {/* {dataTaxpayer && dataTaxpayer.data.tin ? (
                        <>reValidate</>
                    ) : ( */}
                        <>Save & Proceed</>
                        {/* )} */}
                    </Button>
                    {bankAccountDetails.accountNumber &&
                        bankAccountDetails.accountNumber.indexOf("*") ===
                            -1 && (
                            <Button
                                type="primary"
                                onClick={e => downloadBankCheck()}
                            >
                                Generate Bank Check
                            </Button>
                        )}
                </Space>
            </Card>
        </>
    );
};

export default StepBankAccountAddBank;

const FormAddBankCheck = ({ bankAccountDetails }) => {
    return (
        <div
            style={{
                backgroundImage:
                    "url(" +
                    `${window.location.origin}/images/voidedcheck.png` +
                    ")",
                backgroundRepeat: "no-repeat",
                height: 295,
                width: 668,
                backgroundSize: "contain",
                fontWeight: "700",
                fontFamily: "Orbitron",
                position: "absolute",
                zIndex: -99
            }}
            id="bankCheck"
        >
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <span style={{ fontSize: 19, marginLeft: 30 }}>
                {bankAccountDetails.nameOnAccount}
            </span>
            <br />
            <br />
            <br />
            <span style={{ fontSize: 19, marginLeft: 46 }}>
                {bankAccountDetails.aba}
            </span>
            <span style={{ fontSize: 19, marginLeft: 50 }}>
                {bankAccountDetails.accountNumber}
            </span>
        </div>
    );
};
