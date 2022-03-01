import {
    Card, Button, Row, Col, Input, Select, Typography, Alert, Image
} from "antd";
import {
    DeleteFilled,
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment} from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";
import { values } from "lodash";

import PageBillingAddress from "./PageGiftCardCheckoutCoponent/PageBillingAddress";
import PageChooseShipping from "./PageGiftCardCheckoutCoponent/PageChooseShipping";
import PagePaymentInformation from "./PageGiftCardCheckoutCoponent/PagePaymentInformation";
import PageTotalAmount from "./PageGiftCardCheckoutCoponent/PageTotalAmount";
import GiftCardCheckoutSuccess from "./PageGiftCardCheckoutCoponent/GiftCardCheckoutSuccess";

import cardImage from "../../../../assets/img/card.png";
import secureImage from "../../../../assets/img/badge-secure.png"
import privacyImage from "../../../../assets/img/badge-privacy.png"


const PageGiftCardCheckout = ({match})=> {
    let auth_username = match.params.auth_username;
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const my_location = useLocation();

    const [data, setData] = useState({
        auth_username: "",
        card: {
            card_number: "",
            exp_date: "",
            cvv: ""
        },
        billTo: {
            first_name: "",
            last_name: "",
            company: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "United States"
        },
        shipTo: {
            first_name: "",
            last_name: "",
            company: "",
            address: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            phone_number: "",
            fax_number: ""
        },
        customer: {
            email: ""
        },
        amount: "",
        message: "",
        cc_email: ""
    });

    const [dataImage, setDataImage] = useState("");
    const [dataGCImage, setDataGCImage] = useState("");
    const [dataMerchantName, setDataMerchantName] = useState("");
    const [successPage, setSuccessPage] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const { data: dataAuthNet, isLoading: isLoadingAuthNezt, refetch: refetchAuthNet } = useAxiosQuery(
        `GET`,
        `api/v1/auth_net_merchants?auth_username=${auth_username}`,
        `auth_net_merchants_auth_username_${auth_username}`,
        res => {
            if(res.success){
                console.log(res)
                setData({
                    ...data,
                    auth_username: res.data.auth_username,
                    cc_email: res.data.merchant_cc_email
                        ? res.data.merchant_cc_email
                        : "nocc"
                });
                setDataImage(res.data.merchant_logo);
                setDataGCImage(res.data.merchant_gc_logo);
                setDataMerchantName(res.data.merchant_name);
            }
        }
    )

    const [shipOtherAddress, setShipOtherAddres] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const openShipOther = () => {
        if (shipOtherAddress == false) {
            setData({
                ...data,
                shipTo: {
                    ...data.billTo
                }
            });
        }
        setShipOtherAddres(!shipOtherAddress);
    };

    const [completeOrderLoading, setCompleteOrderLoading] = useState(false);

    const updateField = (e, field) => {
        if (field == "billTo") {
            if (shipOtherAddress == false) {
                setData({
                    ...data,
                    billTo: {
                        ...data.billTo,
                        [e.target.name]: e.target.value
                    },
                    shipTo: {
                        ...data.shipTo,
                        [e.target.name]: e.target.value
                    }
                });
            } else {
                setData({
                    ...data,
                    billTo: {
                        ...data.billTo,
                        [e.target.name]: e.target.value
                    },
                    shipTo: {
                        first_name: "",
                        last_name: "",
                        company: "",
                        address: "",
                        city: "",
                        state: "",
                        zip: "",
                        country: "",
                        phone_number: "",
                        fax_number: ""
                    }
                });
            }
        }
        if (field == "customer") {
            setData({
                ...data,
                customer: {
                    ...data.customer,
                    [e.target.name]: e.target.value
                }
            });
        }
        if (field == "shipTo") {
            setData({
                ...data,
                shipTo: {
                    ...data.shipTo,
                    [e.target.name]: e.target.value
                }
            });
        }
        if (field == "card") {
            setData({
                ...data,
                card: {
                    ...data.card,
                    [e.target.name]: e.target.value
                }
            });
        }
        if (field == "amount" || field == "message") {
            setData({
                ...data,
                [e.target.name]: e.target.value
            });
        }
    };

    const [customIsOpen, setCustomIsOpen] = useState(false);

    const checkRadioCustom = e => {
        setCustomIsOpen(!customIsOpen);
    };

    const [optionState, setOptionState] = useState();
    const checkRadio = e => {
        setOptionState(e.target.value);
        if (e.target.value == "custom") {
            setCustomIsOpen(true);
        } else {
            setData({
                ...data,
                amount: e.target.value
            });
            setCustomIsOpen(false);
        }
    };

    const digit = /[0-9,*]/;
    const mask = [digit, digit, "/", digit, digit];
    const mask1 = [
        digit,
        digit,
        "/",
        digit,
        digit,
        " ",
        " ",
        digit,
        digit,
        digit,
        digit
    ];

    const sumitData = e => {
        if (e) {
            e.preventDefault();
        }
        setShowLoading(true);
        mutatePayment(data, {
            onSuccess: res => {
                if (res.success) {
                    console.log('res.success', res)
                    setShowLoading(false);
                    setSuccessPage(true);
                    setErrorMessage("");
                } else {
                    console.log('res.error', res)
                    setErrorMessage(res.data);
                    setShowLoading(false);
                }
            },
            onError: res => {
                setShowLoading(false);
                setErrorMessage(
                    "  Complete order error, please contact Administrator"
                );
            }
        })
    }

    const { mutate: mutatePayment, isLoading: isLoadingPayment } = useAxiosQuery(
        `POST`,
        `api/v1/giftcard_payments`,
        `auth_net_merchants_auth_username_${auth_username}`,
    )

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 'auto',
                background: "transparent"
            }}
        >
            <Row gutter={24}>
                <Col className="gutter-row" span={16} offset={4}>
                    <Card bordered={false}>
                        {successPage == true ? (
                            <GiftCardCheckoutSuccess
                                data={data}
                                dataMerchantName={dataMerchantName}
                            />
                        ):(
                            <Row gutter={24}>
                                <Col className="gutter-row" span={16}>
                                    <Row gutter={24}>
                                        <PageBillingAddress
                                            updateField={updateField}
                                            data={data}
                                            shipOtherAddress={shipOtherAddress}
                                            openShipOther={openShipOther}
                                        />
                                    </Row>

                                    <Row gutter={24}>
                                        <PageChooseShipping/>
                                    </Row>

                                    <Row gutter={24}>
                                        <PagePaymentInformation
                                            updateField={updateField}
                                            mask={mask}
                                            mask1={mask1}
                                        />
                                    </Row>

                                    <Row gutter={24}>
                                        <Col span={16} offset={4}>
                                            {errorMessage != "" && (
                                                // <Alert
                                                //     color="danger"
                                                //     className="mt-4"
                                                // >
                                                //     {errorMessage}
                                                // </Alert>
                                                <Alert
                                                    message={errorMessage}
                                                    type="error"
                                                    showIcon
                                                />
                                            )}
                                        </Col>
                                    </Row><br/>
                                    <Row gutter={24}>
                                        <Col span={16} offset={4} style={{textAlign: 'center'}}>
                                            <Button
                                                color="primary"
                                                size="lg"
                                                type="submit"
                                                disabled={completeOrderLoading}
                                                onClick={sumitData}
                                                style={{
                                                    height: "70px",
                                                    fontSize: "25px",
                                                    width: "100%",
                                                    backgroundColor:"#20a8d8",
                                                    color: 'white'
                                                }}
                                            >
                                                {showLoading ? (
                                                    <i
                                                        className="fa fa-spin fa-circle-o-notch overlay-loading"
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "21px",
                                                            left: "0",
                                                            right: "0"
                                                        }}
                                                    ></i>
                                                ) : (
                                                    <div>
                                                        {" "}
                                                        Complete Order{" "}
                                                        <i className="fa fa-arrow-circle-right"></i>
                                                    </div>
                                                )}
                                            </Button>
                                            <img src={window.location.origin +""+ cardImage}></img>
                                            <br></br>
                                            <p className="text-center">100% safe & secure</p>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col className="gutter-row" span={8}>
                                    <Row gutter={24} style={{padding: '10px'}}>
                                        <PageTotalAmount
                                            updateField={updateField}
                                            data={data}
                                            checkRadio={checkRadio}
                                            customIsOpen={customIsOpen}
                                            dataGCImage={dataGCImage}
                                            optionState={optionState}
                                        />
                                    </Row>
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <div
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: "center",
                                                    justifyContent: 'center',
                                                }}
                                            >

                                                <Image
                                                    width={100}
                                                    src={window.location.origin +""+ secureImage}
                                                    preview={false}
                                                    />
                                                <Image
                                                    src={window.location.origin +""+ privacyImage}
                                                    width={100}
                                                    preview={false}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )}
                    </Card>
                </Col>
            </Row>
        </Content>
    )
}

export default PageGiftCardCheckout;
