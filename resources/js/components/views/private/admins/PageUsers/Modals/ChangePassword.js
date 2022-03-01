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
export default function ChangePassword({
    modalChangePassword,
    setModalChangePassword,
    userProfileData
}) {
    const formItemLayoutPassword = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 }
    };
    const {
        mutate: mutateUpdatePass,
        isLoading: isLoadingUpdatePass
    } = useAxiosQuery(
        "UPDATE",
        `api/v1/users/${userProfileData.id}/updatePasswordFromProfile`,
        `by_profile_password_update`
    );

    const handleSubmitPass = data => {
        console.log(data);
        mutateUpdatePass(
            {
                password: data.password
            },
            {
                onSuccess: res => {
                    if (res.success == false) {
                        notification.error({
                            message: "Current Password didn't match"
                        });
                    } else {
                        if (res.message != "") {
                            notification.error({
                                message: res.message
                            });
                        } else {
                            setModalChangePassword(false);
                            notification.success({
                                message: "Password Updated Successfully"
                            });
                        }
                    }
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };
    const handleCancel = () => {
        setModalChangePassword(false);
    };
    return (
        <>
            <Modal
                title={null}
                visible={modalChangePassword}
                // onCancel={() => setModalChangePassword(true)}
                onCancel={handleCancel}
                footer={null} 
                width={400}
                title={"Change Password"}
            >
                <div>
                    <Form
                        {...formItemLayoutPassword}
                        layout={"horizontal"}
                        onFinish={handleSubmitPass}
                    >
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password"
                                },
                                {
                                    min: 6,
                                    message:
                                        "Password must be minimum 6 characters."
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: "Please confirm your password"
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
                                                "Password that you entered do not match!"
                                            )
                                        );
                                    }
                                })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <div style={{ textAlign: "right" }}>
                            {" "}
                            <Button
                                style={{ width: "30%" }}
                                type="primary"
                                htmlType="submit"
                                loading={isLoadingUpdatePass}
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
