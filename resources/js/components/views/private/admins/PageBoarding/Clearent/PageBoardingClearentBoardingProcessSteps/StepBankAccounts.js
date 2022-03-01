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
import StepBankAccountAddBank from "./StepBankAccountAddBank";

const StepBankAccounts = ({
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
        if (currentStep == 5) {
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

    const [showAddBank, setShowAddBank] = useState(false);
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
            setShowAddBank(true);
        }
    };

    const {
        data: dataMerchantBankAccounts,
        isLoading: isLoadingMerchantBankAccounts,
        isFetching: isFetchingMerchantBankAccounts
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/bank/accounts/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_banks_${formData.clearent_boarding.merchantNumber}`,
        res => {
            console.log("clearent_boarding_banks_", res);
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
                            _steps[5] = {
                                ..._steps[5],
                                title: (
                                    <>
                                        Bank Account ({res.data.content.length}
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
        mutate: mutateDeleteBankAccount,
        isLoading: isLoadingDeleteBankAccount
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/bank/delete",
        `clearent_boarding_banks_${formData.clearent_boarding.merchantNumber}`
    );
    const deleteBankAccount = bankAccount => {
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
                bankAccountID: bankAccount.bankAccountID
            };
            mutateDeleteBankAccount(data, {
                onSuccess: res => {
                    console.log("delete bank account", res);
                    if (res.success) {
                        notification.success({
                            message: "Bank Account Successfully Deleted"
                        });
                    }
                }
            });
            // fetchData("POST", "clearent/bank/delete", data).then(res => {
            //     getBankAccounts();
            // });
        }
    };

    const {
        mutate: mutateDeletVoidedCheck,
        isLoading: isLoadingDeleteVoidedCheck
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/document/delete/voidedcheck",
        `clearent_boarding_banks_${formData.clearent_boarding.merchantNumber}`
    );
    const deleteVoidedCheck = (bank, documentId) => {
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
                documentId: documentId,
                bankAccountID: bank.bankAccountID
            };
            mutateDeletVoidedCheck(data, {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "Voided Check Successfully Deleted"
                        });
                    }
                }
            });
            // fetchData(
            //     "POST",
            //     "clearent/document/delete/voidedcheck",
            //     data
            // ).then(res => {
            //     getBankAccounts();
            // });
        }
    };

    const [selectedBankAccount, setSelectedBankAccount] = useState();
    useEffect(() => {
        if (showAddBank == false) {
            setSelectedBankAccount(null);
        }
        return () => {};
    }, [showAddBank]);
    return !showAddBank ? (
        <Card
            loading={
                isLoadingMerchantBankAccounts || isFetchingMerchantBankAccounts
            }
            title={`${
                dataMerchantBankAccounts &&
                dataMerchantBankAccounts.data &&
                dataMerchantBankAccounts.data.content &&
                dataMerchantBankAccounts.data.content.length > 0
                    ? ""
                    : "Please "
            } Add a Bank Account`}
            extra={
                <Button type="primary" onClick={e => toggleShowFormAddBank()}>
                    Add Bank
                </Button>
            }
        >
            {dataMerchantBankAccounts &&
                dataMerchantBankAccounts.data &&
                dataMerchantBankAccounts.data.content &&
                dataMerchantBankAccounts.data.content.length > 0 &&
                dataMerchantBankAccounts.data.content.map((bank, key) => {
                    return (
                        <Card
                            size="small"
                            key={key}
                            title={<>{bank.bankName}</>}
                            extra={
                                <>
                                    <Button
                                        size="small"
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={e => {
                                            if (
                                                formData.clearent_boarding
                                                    .status ==
                                                    "Quality Assurance Review" &&
                                                userdata.role == "Merchant"
                                            ) {
                                                notification.info({
                                                    message:
                                                        'Your application status is on "Quality Assurance Review", if you wish to update your information, please submit a ticket. Thank you'
                                                });
                                            } else {
                                                setSelectedBankAccount(bank);
                                                setShowAddBank(true);
                                            }
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Popconfirm
                                        title="Are you sure you want to delete this Bank Account?"
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => {
                                            deleteBankAccount(bank);
                                        }}
                                    >
                                        <Button
                                            loading={isLoadingDeleteBankAccount}
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
                                    Name on Account: {bank.nameOnAccount}
                                </Col>
                                <Col xs={8}>
                                    Routing Number:{" "}
                                    {"*****" + bank.aba.slice(-4)}
                                </Col>
                                <Col xs={8}>
                                    Account Number: {bank.accountNumber}
                                </Col>
                                <Col xs={8}>
                                    Uses: {bank.hasFees && "Fees, "}
                                    {bank.hasFunds && "Deposits, "}
                                    {bank.hasChargebacks && "Chargebacks"}
                                </Col>
                            </Row>
                            <Divider
                                style={{ marginBottom: 15, marginTop: 15 }}
                            />
                            {dataMerchantBankAccounts &&
                                dataMerchantBankAccounts.voided_checks &&
                                dataMerchantBankAccounts.voided_checks.content
                                    .length > 0 &&
                                dataMerchantBankAccounts.voided_checks.content.map(
                                    (voided_check, key) => {
                                        return (
                                            <Button
                                                type="primary"
                                                size="small"
                                                key={key}
                                                loading={
                                                    isLoadingDeleteVoidedCheck
                                                }
                                                style={{ marginRight: 5 }}
                                                icon={
                                                    <Popconfirm
                                                        title="Are you sure you want to delete this Voided Check?"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onConfirm={e =>
                                                            deleteVoidedCheck(
                                                                bank,
                                                                voided_check.documentId
                                                            )
                                                        }
                                                    >
                                                        <DeleteFilled
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        />
                                                    </Popconfirm>
                                                }
                                            >
                                                {voided_check.fileName}
                                                {voided_check.fileExtension}
                                            </Button>
                                        );
                                    }
                                )}
                        </Card>
                    );
                })}
            {dataMerchantBankAccounts &&
                dataMerchantBankAccounts.data &&
                dataMerchantBankAccounts.data.content &&
                dataMerchantBankAccounts.data.content.length > 0 && (
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
        <StepBankAccountAddBank
            merchantNumber={formData.clearent_boarding.merchantNumber}
            showAddBank={showAddBank}
            setShowAddBank={setShowAddBank}
            selectedBankAccount={selectedBankAccount}
            setSelectedBankAccount={setSelectedBankAccount}
        />
    );
};

export default StepBankAccounts;
