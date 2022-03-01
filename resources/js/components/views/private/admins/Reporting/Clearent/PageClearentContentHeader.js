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
    UserOutlined
} from "@ant-design/icons";

const PageClearentContentHeader = ({
    history,
    merchantNumber,
    merchantDba
}) => {
    const userdatarole = getUserData();
    const [text, setText] = useState("paymentNav");
    const [userdata, setUserData] = useState(["default"]);
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
        data: MerchantList,
        isLoading: isLoadingMerchantList,
        refetch: refetchMerchantList,
        isFetching: isFetchingMerchantList
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/userData?merchantNumber=" + merchantNumber,
        "clearent_merchant_list_contentheader_" + merchantNumber,
        res => {
            if (res.data != "No Promise Account") {
                setUserData(res.data[0]);
                setCardHeaderColor("bg-dark");
            } else {
                setUserData([]);
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
                        {userdata.length != 0 ? (
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
                            className="navIcon"
                            onClick={e => goTo("dashboard")}
                        >
                            <DashboardOutlined />
                            <p className="activeP">Dashboard</p>
                        </div>
                        <div
                            pagename="disputes"
                            className="navIcon"
                            onClick={e => goTo("disputes")}
                        >
                            <ContainerOutlined />
                            <p className="activeP">Disputes</p>
                        </div>
                        <div
                            pagename="cases"
                            className="navIcon"
                            onClick={e => goTo("cases")}
                        >
                            <ReadOutlined />
                            <p className="activeP">Cases</p>
                        </div>
                        <div
                            pagename="deposits"
                            className="navIcon"
                            onClick={e => goTo("deposits")}
                        >
                            <CreditCardOutlined />
                            <p className="activeP">Bank Deposits</p>
                        </div>
                        <div
                            pagename="transactions"
                            className="navIcon"
                            onClick={e => goTo("transactions")}
                        >
                            <ReloadOutlined />
                            <p className="activeP">Transactions</p>
                        </div>
                        <div
                            pagename="edit"
                            className="navIcon"
                            onClick={e => goTo("edit")}
                        >
                            <UserOutlined />
                            <p className="activeP">Edit Merchant</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default PageClearentContentHeader;
