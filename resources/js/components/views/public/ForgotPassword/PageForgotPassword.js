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
    notification
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import ally_image from "../../../assets/img/ally_image.png";
import React, { Component, useState, useEffect } from "react";
import useAxiosQuery from "../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import moment from "moment";
import { Content } from "antd/lib/layout/layout";

const key = "PromiseNetwork@2021";
const encryptor = require("simple-encryptor")(key);
export default function PageForgotPassword() {
    const [errorMessage, setErrorMessage] = useState();
    const [submitButtonText, setSubmitButtonText] = useState("Send");
    const [forgotDataEmail, setForgotDataEmail] = useState("");
    const [display, setDisplay] = useState(true);

    const updateField = e => {
        setForgotDataEmail(e.target.value);
    };

    const {
        mutate: mutateForgotPassword,
        isLoading: isLoadingButtonForgotPassword
    } = useAxiosQuery("POST", "api/v1/forgotpassword");

    React.useEffect(() => {
        return () => {};
    }, []);

    const onFinish = values => {
        setErrorMessage(undefined);

        mutateForgotPassword(forgotDataEmail, {
            onSuccess: res => {
                if (res.success) {
                    setErrorMessage(res.data);
                    setDisplay(!display);
                    console.log(res);
                }
            },
            onError: err => {
                notification.error({
                    message: err.response.data.error
                });
            }
        });
    };

    return (
        <div className="app flex-row align-items-center pointofsuccess forminputs">
            <Content
                className="site-layout-background"
                style={{
                    margin: "24px 16px",
                    minHeight: 280,
                    background: "transparent"
                }}
            >
                <br />
                <br />
                <br />
                <br />
                <Row gutter={24}>
                    <Col xs={0} md={9}></Col>
                    <Col xs={24} md={6}>
                        {!display && (
                            <Card>
                                <div>
                                    <p>Please check your email</p>
                                    <Alert
                                        style={{ textAlign: "center" }}
                                        message="Email Sent !"
                                        type="success"
                                    />
                                </div>
                            </Card>
                        )}
                        {display && (
                            <Card className="mx-4">
                                <Form
                                    method="POST"
                                    onFinish={e => onFinish(e)}
                                    style={{
                                        maxWidth: "600px",
                                        paddingTop: "15px",
                                        paddingBottom: "15px",
                                        margin: "auto",
                                        textAlign: "center"
                                    }}
                                >
                                    <h2>Forgot Password</h2>

                                    <p className="text-muted">
                                        Please Enter Email
                                    </p>

                                    <Input
                                        size="large"
                                        required
                                        type="text"
                                        placeholder="Email"
                                        autoComplete="email"
                                        name="email"
                                        onChange={e =>
                                            setForgotDataEmail({
                                                ...forgotDataEmail,
                                                email: e.target.value
                                            })
                                        }
                                    />

                                    <Button
                                        // color="success"
                                        size="large"
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoadingButtonForgotPassword}
                                        style={{
                                            marginTop: "10px",
                                            width: "50%",
                                            background:
                                                process.env.MIX_APP_NAME ==
                                                "Promise Network"
                                                    ? "#3cb4ca"
                                                    : process.env
                                                          .MIX_NAV_BG_COLOR
                                        }}
                                    >
                                        {submitButtonText}
                                    </Button>
                                </Form>
                            </Card>
                        )}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col xs={0} md={9}></Col>
                    <Col xs={24} md={6} className="text-center">
                        <b>
                            {process.env.MIX_APP_NAME} can only be accessed by
                            invitation and is the most direct link to
                            <br />
                            outstanding support and service.
                        </b>
                        <br />
                        <br />
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
                        </div>
                    </Col>
                    <Col xs={24} md={6}></Col>
                </Row>
            </Content>
        </div>
    );
}
