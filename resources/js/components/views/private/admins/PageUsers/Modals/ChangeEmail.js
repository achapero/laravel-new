import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    Row,
    Col,
    Button,
    Table,
    Input,
    Divider,
    Popconfirm,
    notification,
    Modal,
    Typography,
    Upload,
    Space,
    Form,
    Tabs,
    Layout
} from "antd";
import { ViewAs } from "../../../../../providers/viewAs";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../providers/getUserData";
import {
    UserOutlined,
    BookOutlined,
    BuildOutlined,
    TeamOutlined,
    MenuOutlined,
    CloseOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";
import moment from "moment";
export default function ChangeEmail({
    modalChangeEmail,
    setModalChangeEmail,
    userProfileData
}) {
    const formItemLayoutPassword = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
    };
    const {
        mutate: mutateUpdateEmail,
        isLoading: isLoadingUpdateEmail
    } = useAxiosQuery(
        "POST",
        `api/v1/profile_update_email`,
        `profile_update_email`
    );

    const handleSubmitPass = data => {
        console.log(data);
        if (data.password == data.confirm) {
            mutateUpdateEmail(data, {
                onSuccess: res => {
                    console.log(res)
                    if (res.success == false) {
                        notification.error({
                            message: res.message
                        });
                    } else {
                        setModalChangeEmail(false);
                        notification.success({
                            message: "Email Updated Successfully"
                        }); 
                    }
                },
                onError: err => {
                    console.log(err);
                }
            });
        } else {
            notification.error({
                message: "Current Password didn't match"
            });
        }
    };

    const handleCancel = () => {
        setModalChangeEmail(false);
    };

    // useEffect(() => {
    //     if(!modalChangeEmail){
    //         setModalChangeEmail(false);
    //     }
    // }, [modalChangeEmail])

    return (
        <>
            <Modal
                visible={modalChangeEmail}
                onCancel={handleCancel}
                footer={null} 
                width={400}
                title={"Change Email"}
            >
                <div style={{width: '100%'}}>
                    <Form
                        // {...formItemLayoutPassword}
                        layout={"vertical"}
                        onFinish={handleSubmitPass}
                        initialValues={{
                            id: userProfileData.id
                        }}
                    >
                        <Row gutter={24} className="hide">
                            <Col className="gutter-row" span={24}>
                                <Form.Item name="id">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col className="gutter-row" span={24}>
                                <Form.Item
                                    name="password"
                                    label="Email" 
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your email"
                                        },
                                        {
                                            type: "email",
                                            message:
                                                "The input is not valid email"
                                        }
                                    ]}
                                    hasFeedback
                                >
                                    <Input style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col className="gutter-row" span={24}>
                                <Form.Item
                                    name="confirm"
                                    label="Confirm Email"
                                    dependencies={["password"]}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input your email"
                                        },
                                        {
                                            type: "email",
                                            message:
                                                "The input is not valid email"
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (
                                                    !value ||
                                                    getFieldValue("password") === value
                                                ) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error(
                                                        "Email that you entered do not match!"
                                                    )
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <Input style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{ textAlign: "right" }}>
                            {" "}
                            <Button
                                style={{ width: "30%" }}
                                type="primary"
                                htmlType="submit"
                                loading={isLoadingUpdateEmail}
                            >
                                Save
                            </Button>{" "}
                        </div>
                    </Form>
                </div>
            </Modal>
        </>
    );
}
