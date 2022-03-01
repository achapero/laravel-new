import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Input,
    Table,
    Popconfirm,
    Divider,
    notification,
    Image,
    Tooltip,
    Drawer,
    Space,
    Modal,
    Form,
    Select,
    Checkbox
} from "antd";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { error } from "jquery";

const ModalUserAddNew = ({ showModalAddNew, setShowModalAddNew }) => {
    const {
        mutate: mutateAddUser,
        isLoading: isLoadingAddFile
    } = useAxiosQuery("POST", "api/v1/users", "users_table");

    const { Option } = Select;

    const [showCompany, setShowCompany] = useState(false);
    const updateField = e => {
        if (e == "Merchant") {
            setShowCompany(true);
        } else {
            setShowCompany(false);
        }
    };

    const [form] = Form.useForm();
    const [ClearField, setClearField] = useState();
    const onFinishFormUser = values => {
        if (values.password == values.confirm_password) {
            mutateAddUser(values, {
                onSuccess: res => {
                    notification.success({
                        message: "Success",
                        description: "User has been successfully added!"
                    });
                    setShowModalAddNew(false);
                    form.resetFields()
                },
                onError: res => {
                    notification.error({
                        message: "Error",
                        description: "This email is already in used!"
                    });
                }
            });
        } else {
            notification.error({
                message: "Error",
                description: "Mismatch password!"
            });
        }
    };

    const cancel = () => {
        form.resetFields();
        setShowModalAddNew(false);
    };

    return (
        <Modal
            visible={showModalAddNew}
            className="modal-md"
            onCancel={cancel}
            title="Profile Details"
            width={500}
            footer={[
                <Button key="cancel" onClick={cancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoadingAddFile}
                    onClick={() => {
                        form.submit();
                    }}
                >
                    Submit
                </Button>
            ]}
        >
            <Form
                name="basic"
                layout="vertical"
                onFinish={onFinishFormUser}
                form={form}
            >
                <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your full name!"
                        }
                    ]}
                >
                    <Input name="name" />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: 'email', message: 'Please input a valid email' }
                    ]}
                >
                    <Input name="email" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!"
                        }
                    ]}
                >
                    <Input.Password name="password" />
                </Form.Item>

                <Form.Item
                    label="Comfirm Password"
                    name="confirm_password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your confirm password!"
                        }
                    ]}
                >
                    <Input.Password name="confirm_password" />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[
                        { required: true, message: "Please input your role!" }
                    ]}
                >
                    <Select
                        tyle={{ width: "100%" }}
                        onChange={e => updateField(e)}
                        name="role"
                    >
                        <Option value="Super Admin">Super Admin</Option>
                        <Option value="Admin">Admin</Option>
                        <Option value="Manager">Manager</Option>
                        <Option value="Merchant">Merchant</Option>
                        <Option value="PAN Admin">PAN Admin</Option>
                        <Option value="Merchant: Tickets Only">Merchant: Tickets Only</Option>
                        <Option value="Gift Only">Gift Only</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                        { required: true, message: "Please input your status!" }
                    ]}
                >
                    <Select style={{ width: "100%" }} name="status">
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                        <Option value="Inquiry">Inquiry</Option>
                        <Option value="Invited">Invited</Option>
                    </Select>
                </Form.Item>

                {showCompany == true && (
                    <Row gutter={24}>
                        <Col className="gutter-row" span={16}>
                            <Form.Item
                                label="Merchant Name"
                                name="company"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please input your merchant name!"
                                    }
                                ]}
                            >
                                <Input name="company" />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Form.Item name="requestMID">
                                <Checkbox
                                    style={{ marginTop: "35px" }}
                                    name="requestMID"
                                >
                                    Request MID
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                )}
            </Form>
        </Modal>
    );
};
export default ModalUserAddNew;
