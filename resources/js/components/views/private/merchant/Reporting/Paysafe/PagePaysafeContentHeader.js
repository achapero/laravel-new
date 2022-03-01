import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../providers/getUserData";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    DashboardOutlined,
    ContainerOutlined,
    ReadOutlined,
    CreditCardOutlined,
    ReloadOutlined,
    UserOutlined,
    DollarCircleOutlined,
    ExclamationCircleOutlined,
    FolderOpenOutlined
} from "@ant-design/icons";

const PagePaysafeContentHeader = ({ history, merchantNumber, merchantDba }) => {
    const userdatarole = getUserData();
    const [text, setText] = useState("paymentNav");
    const [userdata, setUserData] = useState();
    const [cardHeaderColor, setCardHeaderColor] = useState("hide");
    const click = () => {
        if (text == "paymentNav") {
            setText("responsive");
        } else {
            setText("paymentNav");
        }
    };
    const goTo = to => {
        let location = window.location;
        let pathname = location.pathname;

        pathname = pathname.split("/");
        pathname = pathname.slice(0, 5);
        pathname = pathname.join("/");

        history.push(`${pathname}/${to}`);
    };

    const {
        data: dataGetMerchantNumber,
        isLoading: isLoadingGetMerchantNumber,
        refetch: refetchGetMerchantNumber,
        isFetching: isFetchingGetMerchantNumber
    } = useAxiosQuery(
        "GET",
        "api/v1/paysafe/accounts/getMerhcantNumber/validated",
        "paysafe_get_merchant_number_validated",
        res => {
            let val;
            res.data.forEach(element => {
                if (merchantNumber == element.merchant_number) {
                    val = "validated";
                }
            });
            if (val != "validated") {
                history.push("/404");
            }
        }
    );

    const {
        data: MerchantList,
        isLoading: isLoadingMerchantList,
        refetch: refetchMerchantList,
        isFetching: isFetchingMerchantList
    } = useAxiosQuery(
        "GET",
        "api/v1/paysafe/userData?merchantNumber=" + merchantNumber,
        "paysafe_merchant_list_contentheader_" + merchantNumber,
        res => {
            if (res.data != "No Promise Account") {
                setUserData(res.data);
                setCardHeaderColor("bg-dark");
            } else {
                setUserData(null);
                setCardHeaderColor("bg-danger");
            }
        }
    );

    useEffect(() => {
        let location = window.location;
        let pathname = location.pathname;

        pathname = pathname.split("/");
        let page = pathname[pathname.length - 1];
        if ($(`[pagename="${page}"]`).length > 0) {
            $(`[pagename="${page}"]`).addClass("active");
        } else {
            $(`[pagename="dashboard"]`).addClass("active");
        }
        return () => {};
    }, []);

    return (
        <div style={{ background: "white" }}>
            <Row className="" id="contentheader">
                <Col xs={24} md={24}>
                    <div
                        className={cardHeaderColor}
                        style={{
                            paddingTop: " 0.3rem",
                            paddingBottom: "0.3rem",
                            color: "white"
                        }}
                    >
                        {userdata ? (
                            <Row>
                                <Col md={2}>
                                    <div
                                        className="text-center"
                                        style={{
                                            borderRight: "1px solid gray"
                                        }}
                                    >
                                        <img
                                            style={{ width: "40px" }}
                                            src={userdata.image_url}
                                        />
                                    </div>
                                </Col>
                                <Col md={14}>
                                    <Row>
                                        <Col md={24}>
                                            <div style={{ marginTop: "7px" }}>
                                                <span
                                                    style={{
                                                        marginLeft: "10px"
                                                    }}
                                                >
                                                    {" "}
                                                    <UserOutlined />
                                                </span>
                                                <span> {userdata.email}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        ) : (
                            <Typography.Title
                                level={4}
                                style={{ color: "red", marginLeft: "10px" }}
                            >
                                No Promise Network Account
                            </Typography.Title>
                        )}
                    </div>
                    <div>
                        {cardHeaderColor != "hide" && (
                            <p className="paymentBars" onClick={e => click(e)}>
                                <i className="fa fa-bars"></i>
                            </p>
                        )}
                    </div>
                    <div className={text}>
                        <div
                            pagename="dashboard"
                            className="navIconPaymentSafe"
                            onClick={e => goTo("dashboard")}
                        >
                            <DashboardOutlined />
                            <p className="activeP">Dashboard</p>
                        </div>
                        <div
                            pagename="batches"
                            className="navIconPaymentSafe"
                            onClick={e => goTo("batches")}
                        >
                            <CreditCardOutlined />
                            <p className="activeP">Batches</p>
                        </div>
                        <div
                            pagename="deposits"
                            className="navIconPaymentSafe"
                            onClick={e => goTo("deposits")}
                        >
                            <DollarCircleOutlined />
                            <p className="activeP">Deposit</p>
                        </div>
                        <div
                            pagename="monthly-transaction"
                            className="navIconPaymentSafe"
                            onClick={e => goTo("monthly-transaction")}
                        >
                            <ReloadOutlined />
                            <p className="activeP">Monthly Transaction</p>
                        </div>
                        {/* <div
                            pagename="statements"
                            className="navIconPaymentSafe"
                        >
                            <i className="fa fa-paper-plane"></i>
                            <p className="activeP">statements</p>
                        </div> */}
                        <div
                            pagename="chargebacks"
                            className="navIconPaymentSafe"
                            onClick={e => goTo("chargebacks")}
                        >
                            <ExclamationCircleOutlined />
                            <p className="activeP">Chargebacks</p>
                        </div>
                        <div
                            pagename="retrievals"
                            className="navIconPaymentSafe"
                            onClick={e => goTo("retrievals")}
                        >
                            <ExclamationCircleOutlined />
                            <p className="activeP">Retrievals</p>
                        </div>

                        {userdata && (
                            <div
                                pagename="files"
                                className="navIconPaymentSafe"
                                onClick={e =>
                                    history.push(
                                        "/files?email=" + userdata.email
                                    )
                                }
                            >
                                <FolderOpenOutlined />
                                <p className="activeP">Files</p>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PagePaysafeContentHeader;
