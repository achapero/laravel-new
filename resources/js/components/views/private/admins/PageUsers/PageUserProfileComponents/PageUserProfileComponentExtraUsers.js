import React from "react";
import { Link, useHistory } from "react-router-dom";
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
    Space,
    Modal,
    Form
} from "antd";

import {
    CheckOutlined,
    CloseOutlined,
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined
} from "@ant-design/icons";

import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import ButtonGroup from "antd/es/button/button-group";
import { useState, useEffect } from "react";

export default function PageUserProfileComponentExtraUsers({ user_id }) {
    let history = useHistory();
    const [pageFiltersExtraUser, setPageFiltersExtraUser] = React.useState({
        currentPage: 1,
        search: "",
        sortField: "",
        sortOrder: ""
    });

    React.useEffect(() => {
        refetchExtraUsers();
        return () => {};
    }, [pageFiltersExtraUser]);

    // for table
    const {
        data: dataExtraUsers,
        isLoading: isLoadingTblExtraUser,
        refetch: refetchExtraUsers,
        isFetching: isFetchingTblUser
    } = useAxiosQuery(
        "GET",
        `api/v1/extra_user?user_id=${user_id}page=${pageFiltersExtraUser.currentPage}&search=${pageFiltersExtraUser.search}&sort_field=${pageFiltersExtraUser.sortField}&sort_order=${pageFiltersExtraUser.sortOrder}`,
        "extra_users_table"
    );

    // for delete
    const {
        mutate: mutateDeleteExtraUser,
        isLoading: isLoadingDeleteExtraUser
    } = useAxiosQuery("DELETE", "api/v1/extra_user", "extra_users_table");

    // for delete button
    const handleDeleteExtraUser = record => {
        mutateDeleteExtraUser(record, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "User Successfully Deleted"
                    });
                }
            }
        });
    };

    const handleTblChangeExtraUser = (pagination, filters, sorter) => {
        setPageFiltersExtraUser({
            ...pageFiltersExtraUser,
            currentPage: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order ? sorter.order : ""
        });
    };

    const [showAddNewExtraUser, setShowAddNewExtraUser] = useState({
        visible: false,
        data: null
    });

    const [formNewExtraUser] = Form.useForm();
    useEffect(() => {
        if (showAddNewExtraUser.visible) {
            if (showAddNewExtraUser.data) {
                let data = showAddNewExtraUser.data;
                delete data.password;
                formNewExtraUser.setFieldsValue(data);
                setShowChangePassword(false);
            }
        } else {
            if (formNewExtraUser) {
                formNewExtraUser.resetFields();
                setShowChangePassword(true);
            }
        }
        return () => {};
    }, [showAddNewExtraUser]);

    const {
        mutate: mutateAddExtraUser,
        isLoading: isLoadingAddExtraUser
    } = useAxiosQuery("POST", "api/v1/extra_user", "extra_users_table");
    const {
        mutate: mutateUpdateExtraUser,
        isLoading: isLoadingUpdateExtraUser
    } = useAxiosQuery("UPDATE", "api/v1/extra_user", "extra_users_table");
    const onFinishFormUser = values => {
        if (values.password == values.confirm_password) {
            if (values.id) {
                let data = { ...values, user_id };
                delete data.confirm_password;
                mutateUpdateExtraUser(data, {
                    onSuccess: res => {
                        notification.success({
                            message: "Success",
                            description:
                                "Extra User has been successfully updated!"
                        });
                        setShowAddNewExtraUser({
                            visible: false,
                            data: null
                        });
                        formNewExtraUser.resetFields();
                    },
                    onError: res => {}
                });
            } else {
                mutateAddExtraUser(
                    { ...values, user_id },
                    {
                        onSuccess: res => {
                            notification.success({
                                message: "Success",
                                description:
                                    "Extra User has been successfully added!"
                            });
                            setShowAddNewExtraUser({
                                visible: false,
                                data: null
                            });
                            formNewExtraUser.resetFields();
                        },
                        onError: res => {
                            notification.error({
                                message: "Error",
                                description: "This username is already in used!"
                            });
                        }
                    }
                );
            }
        } else {
            notification.error({
                message: "Error",
                description: "Mismatch password!"
            });
        }
    };

    const handleToggleIsActive = record => {
        mutateUpdateExtraUser({ id: record.id, is_active: !record.is_active });
    };

    const [showChangePassword, setShowChangePassword] = useState(true);
    return (
        <>
            <Modal
                visible={showAddNewExtraUser.visible}
                onCancel={e =>
                    setShowAddNewExtraUser({ visible: false, data: null })
                }
                okText="Submit"
                onOk={e => formNewExtraUser.submit()}
            >
                <Form
                    name="extra_user"
                    layout="vertical"
                    onFinish={onFinishFormUser}
                    form={formNewExtraUser}
                >
                    <Form.Item label="id" name="id" style={{ display: "none" }}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {showAddNewExtraUser.data && (
                        <>
                            {" "}
                            <a
                                onClick={e => {
                                    e.preventDefault();
                                    setShowChangePassword(!showChangePassword);
                                }}
                            >
                                Change Password?
                            </a>
                            <br />
                            <br />
                        </>
                    )}
                    {showChangePassword && (
                        <>
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
                                label="Confirm Password"
                                name="confirm_password"
                                dependencies={["password"]}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: "Please confirm your password!"
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                getFieldValue("password") ===
                                                    value
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    "The two passwords that you entered do not match!"
                                                )
                                            );
                                        }
                                    })
                                ]}
                            >
                                <Input type="password" />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
            <Divider orientation="right" plain>
                <Title level={2}>Extra Users</Title>
            </Divider>
            <Row>
                <Col md={8} xs={24}>
                    <Space>
                        <Button
                            type="primary"
                            onClick={e =>
                                setShowAddNewExtraUser({
                                    visible: true,
                                    data: null
                                })
                            }
                        >
                            Add New Extra User
                        </Button>
                    </Space>
                </Col>
                <Col md={8} sm={0}></Col>
                <Col md={8} sm={24}>
                    <Input.Search
                        placeholder="Global Search"
                        onPressEnter={e =>
                            setPageFiltersExtraUser({
                                ...pageFiltersExtraUser,
                                search: e.target.value
                            })
                        }
                        onSearch={e =>
                            setPageFiltersExtraUser({
                                ...pageFiltersExtraUser,
                                search: e
                            })
                        }
                    />
                </Col>
            </Row>
            <Divider />
            <div className="table-responsive">
                <Table
                    dataSource={dataExtraUsers && dataExtraUsers.data.data}
                    bordered
                    loading={isLoadingTblExtraUser || isFetchingTblUser}
                    rowKey={record => record.id}
                    onChange={handleTblChangeExtraUser}
                    pagination={{
                        total: dataExtraUsers ? dataExtraUsers.data.total : 0,
                        pageSize: dataExtraUsers
                            ? dataExtraUsers.data.per_page
                            : 0,
                        hideOnSinglePage: true,
                        showSizeChanger: false
                    }}
                >
                    <Table.Column
                        title="Username"
                        dataIndex="username"
                        key="username"
                        sorter={(a, b) => a.username - b.username}
                    />

                    <Table.Column
                        title="Is Active"
                        dataIndex="is_active"
                        key="is_active"
                        sorter={(a, b) => a.is_active - b.is_active}
                        render={(text, record) => {
                            if (record.is_active) {
                                return (
                                    <CheckOutlined
                                        style={{ color: "green" }}
                                        onClick={e =>
                                            handleToggleIsActive(record)
                                        }
                                    />
                                );
                            } else {
                                return (
                                    <CloseOutlined
                                        style={{ color: "red" }}
                                        onClick={e =>
                                            handleToggleIsActive(record)
                                        }
                                    />
                                );
                            }
                        }}
                    />
                    <Table.Column
                        align="center"
                        title="Action"
                        key="action"
                        render={(text, record) => {
                            return (
                                <>
                                    <ButtonGroup>
                                        <Button
                                            loading={isLoadingUpdateExtraUser}
                                            type="primary"
                                            title="Edit"
                                            icon={<EditFilled />}
                                            onClick={e =>
                                                setShowAddNewExtraUser({
                                                    visible: true,
                                                    data: record
                                                })
                                            }
                                        ></Button>
                                        <Popconfirm
                                            title="Are you sure you want to delete this User?"
                                            okText="Yes"
                                            cancelText="No"
                                            onConfirm={e =>
                                                handleDeleteExtraUser(record)
                                            }
                                        >
                                            <Button
                                                loading={
                                                    isLoadingDeleteExtraUser
                                                }
                                                type="primary"
                                                danger
                                                title="Delete"
                                                icon={<DeleteFilled />}
                                            ></Button>
                                        </Popconfirm>
                                    </ButtonGroup>
                                </>
                            );
                        }}
                    />
                </Table>
            </div>
        </>
    );
}
