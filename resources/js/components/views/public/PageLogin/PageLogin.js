import React, {useEffect, useState} from "react";

import {
    Layout,
    Card,
    Form,
    Input,
    Button,
    Alert,
    Divider,
    Row,
    Col,
    Modal,
    message,
    notification
} from "antd";
import { UserOutlined, LockOutlined, CloseOutlined } from "@ant-design/icons";

import ally_image from "../../../assets/img/ally_image.png";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import { DragDropContext } from "react-beautiful-dnd";
import { Link, useLocation, useHistory } from "react-router-dom";

const key = "CeliyaProject@2022";
const encryptor = require("simple-encryptor")(key);
export default function PageLogin() {
    let history = useHistory();
    const [errorMessage, setErrorMessage] = useState();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const {
        mutate: mutateLogin,
        isLoading: isLoadingButtonLogin
    } = useAxiosQuery("POST", "api/v1/login", 'login');

    useEffect(() => {
        if (urlParams.get("token")) {
            let token = urlParams.get("token");
            let userdata = JSON.parse(urlParams.get("userdata"));
            userdata.email = userdata.email.replace(" ", "+");

            localStorage.token = encryptor.encrypt(token);
            localStorage.userdata = encryptor.encrypt(userdata);
            location.href = `${window.location.origin}/welcome`;
        }
        return () => {};
    }, []);

    const onFinish = values => {
        setErrorMessage(undefined);
        let data = { email: values.email, password: values.password };
        // console.log(values.password)
        mutateLogin(data, {
            onSuccess: res => {
                if (res.token) {
                    console.log("permission", res);
                    localStorage.token = encryptor.encrypt(res.token);
                    localStorage.userdata = encryptor.encrypt(res.data);
                    if (urlParams.get("redirect")) {
                        location.href = urlParams.get("redirect");
                    } else {
                        location.reload();
                    }
                } else {
                    setErrorMessage("Username or Password is Invalid");
                }
            },
            onError: err => {
                setErrorMessage(err.response.data.error);
                countDownModal(err.response.data.error);
            }
        });
    };

    function countDownModal(message) {
        let secondsToGo = 5;
        const modal = Modal.error({
            title: message
            // content: `This modal will be destroyed after ${secondsToGo} second.`
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            // modal.update({
            //     content: `This modal will be destroyed after ${secondsToGo} second.`
            // });
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
        }, secondsToGo * 1000);
    }

    return (
        <Layout
            className="login-layout"
            style={{ paddingTop: "10vh", background: "#E4E5E6" }}
        >
            <Row style={{ background: "#E4E5E6" }}>
                <Col xs={24} md={6}></Col>
                <Col xs={0} md={12} className="text-center PnTextWelcome">
                    <b>
                        Welcome to {process.env.MIX_APP_NAME}, a self service
                        portal designed to securely
                        <br />
                        communicate and combine all of the knowledge for the
                        most common
                        <br />
                        Point of Sale Softwares and their Merchant Processing
                        Partners.
                    </b>
                </Col>
                <Col xs={24} md={0} className="text-center PnTextWelcome">
                    <b>
                        Welcome to {process.env.MIX_APP_NAME}
                        <br />a self service portal designed to securely
                        <br />
                        communicate and combine all of the knowledge
                        <br />
                        for the most common
                        <br />
                        Point of Sale Softwares and their Merchant Processing
                        Partners.
                    </b>
                </Col>
                <Col xs={24} md={6}></Col>
            </Row>
            <Row>
                <Col xs={24} md={6}></Col>
                <Col xs={24} md={12} style={{ padding: 10 }}>
                    <Card className="card-body-padding-0">
                        <Row className="flexdirection">
                            <Col xs={24} md={12} style={{ padding: 24 }}>
                                <Card.Meta
                                    title={
                                        <Title level={1} style={{ margin: 0 }}>
                                            Login
                                        </Title>
                                    }
                                    description="Sign In to your account"
                                    className="m-b-md"
                                />
                                <Form
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{
                                        email: urlParams.get("un")
                                            ? urlParams
                                                  .get("un")
                                                  .replace(" ", "+")
                                            : urlParams.get("inf_field_Email")
                                            ? urlParams
                                                  .get("inf_field_Email")
                                                  .replace(" ", "+")
                                            : localStorage.email,
                                        password: localStorage.password
                                    }}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Username!"
                                            }
                                        ]}
                                        placeholder="Username"
                                    >
                                        <Input
                                            placeholder="Email"
                                            prefix={
                                                <UserOutlined className="site-form-item-icon" />
                                            }
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Password!"
                                            }
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Password"
                                        />
                                    </Form.Item>

                                    {errorMessage && (
                                        <Alert
                                            style={{ marginBottom: 10 }}
                                            className="mt-10"
                                            type="error"
                                            message={errorMessage}
                                        />
                                    )}

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoadingButtonLogin}
                                        className="login-form-button loginButton "
                                    >
                                        SUBMIT
                                    </Button>

                                    <div className="forgot text-right">
                                        <Button
                                            type="link"
                                            htmlType="button"
                                            className="login-form-button"
                                            size="small"
                                            style={{
                                                fontSize: "16px"
                                            }}
                                            onClick={() => {
                                                window.location.href =
                                                    window.location.origin +
                                                    "/forgotpassword";
                                            }}
                                        >
                                            Forgot Password
                                        </Button>
                                    </div>
                                </Form>
                                {urlParams.get("source") == "adapt" ? (
                                    <Alert
                                        className="loginAdapt"
                                        message="Please contact support@adaptms.com for gift access"
                                        type="error"
                                    />
                                ) : (
                                    <></>
                                )}
                            </Col>
                            <Col
                                xs={24}
                                md={12}
                                style={{
                                    textAlign: "center"
                                }}
                                className="PNcolor"
                            >
                                <h1
                                    className="PNtext"
                                    style={{
                                        color: "white",
                                        marginTop: "30%"
                                    }}
                                >
                                    {process.env.MIX_APP_NAME}
                                </h1>
                                <img
                                    src="/assets/favicon.ico"
                                    alt="Promise Network Logo"
                                    border="0"
                                    width="48"
                                    style={{
                                        display: "block",
                                        width: "48px",
                                        maxWidth: "48px",
                                        minWidth: "48px",
                                        margin: "auto",
                                        marginBottom: "10px"
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} md={6}></Col>
            </Row>
            <Row>
                <Col xs={24} md={6}></Col>
                <Col xs={24} md={12} className="text-center PnTextWelcome">
                    <b>
                        {process.env.MIX_APP_NAME} can only be accessed by
                        invitation and is the most direct link to
                        <br />
                        outstanding support and service.
                    </b>
                    <br />
                    <br />
                    <div>
                        <span>
                            {" "}
                            <a href="https://my.splashtop.com/team_deployment/download/77WP3P75S5SL">
                                Remote Log in
                            </a>
                        </span>
                        <span style={{ marginLeft: 20 }}>
                            <a href="https://merchant.status.tsys.com">
                                TSYS Uptime Status
                            </a>
                        </span>
                        <span style={{ marginLeft: 20 }}>
                            <a
                                href="https://promise.network/giftstatus"
                                target="_blank"
                            >
                                Giftcard Processing Status
                            </a>
                        </span>
                        {/* <span style={{ marginLeft: 20 }}>
                            <a
                                href="https://promise.network/gc/checkbalance"
                                target="_blank"
                            >
                                Giftcard Check Balance
                            </a>
                        </span> */}
                    </div>
                    <div>
                        <span>v2.33</span>
                    </div>
                </Col>
                <Col xs={24} md={6}></Col>
            </Row>
        </Layout>
    );
}
