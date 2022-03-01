import React from "react";
import { Link, useHistory } from "react-router-dom";
import {
    Layout,
    Card,
    Row,
    Col,
    Button,
    Form,
    Input,
    Select,
    InputNumber,
    Space,
    DatePicker,
    Divider,
    notification
} from "antd";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import notificationErrors from "../../../../providers/notificationErrors";

import { ArrowLeftOutlined } from "@ant-design/icons";

const PageUserAddNew = () => {
    let history = useHistory();
    const {
        mutate: mutateAddNewUser,
        isLoading: isLoadingAddNewUser
    } = useAxiosQuery("POST", "api/v1/users", "users_table");

    const onFinish = values => {
        console.log(values);
        if (values.password == values.confirm_password) {
            mutateAddNewUser(values, {
                onSuccess: res => {
                    notification.success({
                        message: "User Successfully Created"
                    });

                    history.push("/users");
                },
                onError: err => {
                    console.log(err);
                    notificationErrors(err);
                }
            });
        } else {
            notification.error({ message: "Confirm Password mismatch" });
        }
    };

    return (
        <Layout.Content
            className="site-layout-background"
            style={{ margin: "24px 16px 0", minHeight: 280 }}
        >
            <Card
                title="Add User"
                bordered={false}
                extra={
                    <Link to="/users">
                        <Button type="primary">
                            <ArrowLeftOutlined /> Back to list
                        </Button>
                    </Link>
                }
            >
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item name="id" className="hide">
                        <Input name="id" />
                    </Form.Item>

                    <Row gutter={12}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    {
                                        required: true,
                                        min: 2,
                                        message:
                                            "First Name must be at least 2 characters"
                                    }
                                ]}
                            >
                                <Input name="firstname" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Email Address is Invalid"
                                    }
                                ]}
                            >
                                <Input name="email" type="email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item name="phone" label="Phone">
                                <Input name="phone" type="phone" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[
                                    {
                                        required: true,
                                        message: "Select Role"
                                    }
                                ]}
                            >
                                <Select style={{ width: "100%" }}>
                                    <Select.Option value="Admin">
                                        Admin
                                    </Select.Option>
                                    <Select.Option value="Advisor">
                                        Advisor
                                    </Select.Option>
                                    <Select.Option value="Client">
                                        Client
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Input Password"
                                    }
                                ]}
                            >
                                <Input.Password type="password" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="confirm_password"
                                label="Confirm Password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Input Confirm Password"
                                    }
                                ]}
                            >
                                <Input.Password type="password" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoadingAddNewUser}
                    >
                        Submit
                    </Button>
                </Form>
            </Card>
        </Layout.Content>
    );
};

export default PageUserAddNew;
