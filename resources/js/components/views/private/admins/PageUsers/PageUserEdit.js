import React, { useEffect, useState, useRef, Component, Fragment} from "react";
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

import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";

const PageUserEdit = ({ match }) => {
    let history = useHistory();
    let user_id = match.params.id;
    const { TextArea } = Input;
    const [data, setData] = useState()

    const {
        data: dataUser,
        isLoading: isLoadingDataUser,
        isFetching: isFetchingDataUser
    } = useAxiosQuery(
        "GET",
        `api/v1/users/${user_id}`,
        `edit_user_${user_id}`,
        res => {
            if(res.success){
                setData({ ... data, id: user_id, from: "PageUserEdit"})
            }
        }
    );


    const {
        mutate: mutateEditUser,
        isLoading: isLoadingEditUser
    } = useAxiosQuery("UPDATE", `api/v1/users`, "users_table");

    const onFinish = values => {
        console.log('@',data);
        if (values.password || values.confirm_password) {
            if (values.password == values.confirm_password) {
                mutateEditUser(data, {
                    onSuccess: res => {
                        notification.success({
                            message: "User Successfully Updated"
                        });
                        console.log(res);
                    },
                    onError: err => {
                        console.log(err);
                        notificationErrors(err);
                    }
                });
            } else {
                notification.error({ message: "Confirm Password mismatch" });
            }
        } else {
            mutateEditUser(data, {
                onSuccess: res => {
                    notification.success({
                        message: "User Successfully Updated"
                    });
                    console.log(res);
                },
                onError: err => {
                    console.log(err);
                    notificationErrors(err);
                }
            });
        }
    };

    return (
        <Layout.Content
            className="site-layout-background"
            style={{ margin: "24px 16px 0", minHeight: 280 }}
        >
            <Card
                title="Edit User"
                bordered={false}
                extra={
                    <Link to="/users">
                        <Button type="primary">
                            <ArrowLeftOutlined /> Back to list
                        </Button>
                    </Link>
                }
            >
                {isLoadingDataUser || isFetchingDataUser ? (
                    <LoadingOutlined spin />
                ) : (
                    <Form
                        onFinish={onFinish}
                        initialValues={dataUser.data}
                        layout="vertical"
                    >
                        <Form.Item name="id" className="hide">
                            <Input name="id"  onChange={e => setData({...data, id:e.target.value})}/>
                        </Form.Item>

                        <Row gutter={12}>
                            {/*<Col xs={24} md={6}>
                                <Form.Item name="contact_id" label="Contact Id">
                                    <Input name="contact_id" />
                                </Form.Item>
                            </Col>*/}
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
                                    <Input name="name"  onChange={e => setData({...data, name:e.target.value})}/>
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
                                    <Input name="email" onChange={e => setData({...data, email:e.target.value})}/>
                                </Form.Item>
                            </Col>
                            {/*<Col xs={24} md={8}>
                                <Form.Item name="phone_number" label="Phone">
                                    <Input name="phone_number" onChange={e => setData({...data, phone_number:e.target.value})}/>
                                </Form.Item>
                            </Col>*/}
                        </Row>
                        <Row gutter={12}>
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
                                    <Select style={{ width: "100%" }} onChange={e => setData({...data, role:e})}>
                                        <Select.Option value="Super Admin">
                                            Super Admin
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
                                <Form.Item name="password" label="Password">
                                    <Input.Password type="password" onChange={e => setData({...data, password:e.target.value})}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="confirm_password"
                                    label="Confirm Password"
                                >
                                    <Input.Password type="password" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider />

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isLoadingEditUser}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Card>
        </Layout.Content>
    );
};

export default PageUserEdit;
