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
    Checkbox,
    Typography,
    Menu
} from "antd";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    UserAddOutlined,
    ArrowLeftOutlined,
    MailOutlined,
    PlusOutlined,
    MinusCircleOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";
import PageUserProfileComponentOverviewOwner from "./PageUserProfileComponentOverviewOwner";

const PageUserProfileComponentOverview = ({ Name, user_id, dataUser }) => {
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const [form] = Form.useForm();

    const [FormDatas, setFormDatas] = useState();
    const [FormDatasExtra, setFormDatasExtra] = useState();
    const [ownerFields, setOwnerFields] = useState([]);

    useEffect(() => {
        // setFormDatas({...FormDatas, id: user_id})
        console.log('null', dataUser)
        setFormDatasExtra({
            ...FormDatasExtra,
            // merchant_name: dataUser.data.merchant_name ? dataUser.data.merchant_name : '',
            merchant_number: dataUser.data.merchant_number ? dataUser.data.merchant_number : '',
        })
    }, [dataUser]);

    const {
        mutate: mutateUpdateUser,
        isLoading: isLoadingUpdateUser
    } = useAxiosQuery("UPDATE", "api/v1/users", `edit_user_${user_id}`);

    const onFinishFormUser = value => {
        console.log("form main", FormDatas);
        // console.log("form data", FormDatasExtra);
        // console.log("form data", value.owner);
        mutateUpdateUser(
            {
                id: user_id,
                main: FormDatas,
                extension: FormDatasExtra,
                owner: value.owner
            },
            {
                onSuccess: res => {
                    console.log('onFinishFormUser', res);
                    notification.success({
                        message: "Success",
                        description: "User has been successfully updated!"
                    });
                }
            }
        );
    };

    return (
        <Form
            name="Overview"
            layout="vertical"
            initialValues={{
                ...dataUser.data,
                receive_alerts: dataUser.data.receive_alerts == 1 ? true : false
            }}
            onFinish={onFinishFormUser}
            form={form}
        >
            <Divider orientation="right" plain>
                <Title level={2}>Overview</Title>
            </Divider>
            {console.log('null', dataUser)}
            <Row gutter={24}>
                <Form.Item
                    name="id"
                    className="hide"
                    onChange={e =>
                        setFormDatas({
                            ...FormDatas,
                            preferred_email: e.target.value
                        })
                    }
                >
                    <Input name="id" />
                </Form.Item>

                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item label="Email" name="email">
                        <Input name="email" disabled />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item
                        label="Preferred Email"
                        name="preferred_email"
                        rules={[
                            { type: 'email', message: 'Please input a valid email' }
                        ]}
                    >
                        <Input
                            name="preferred_email"
                            placeholder="Preferred Email"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    preferred_email: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={12}>
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
                        <Input
                            name="name"
                            placeholder="Full Name"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    name: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
                {dataUser.data.role != 'Merchant' && (
                    <Col className="gutter-row" xs={24} md={12}>
                        <Form.Item
                            label={" "}
                            valuePropName="checked"
                            name="receive_alerts"
                        >
                            <Checkbox
                                onChange={e =>
                                    setFormDatas({
                                        ...FormDatas,
                                        receive_alerts: e.target.checked == true ? 1 : 0
                                    })
                                }
                            >
                                Receive Ticket Alerts
                            </Checkbox>
                        </Form.Item>
                    </Col>
                )}
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item
                        label="Merchant Name"
                        name="merchant_name"
                    >
                        <Input
                            name="merchant_name"
                            placeholder="Merchant Name"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    merchant_name: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item
                        label="Merchant Number"
                        name="merchant_number"
                    >
                        <Input
                            name="merchant_number"
                            placeholder="Merchant Number"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    merchant_number: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item
                        label="Percentage of Ownership"
                        name="percentage_of_ownership"
                    >
                        <Input
                            name="percentage_of_ownership"
                            placeholder="Percentage of Ownership"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    percentage_of_ownership: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item
                        label="SSN last 4 digits"
                        name="ssn_last_4_digits"
                    >
                        <Input
                            name="ssn_last_4_digits"
                            placeholder="SSN last 4 digits"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    ssn_last_4_digits: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <PageUserProfileComponentOverviewOwner
                ownerFields={ownerFields}
                setOwnerFields={setOwnerFields}
                form={form}
            />
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item label="Location Address" name="address">
                        <Input
                            name="address"
                            placeholder="Location Address"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    address: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item label="Owner Address" name="owner_address">
                        <Input
                            name="owner_address"
                            placeholder="Owner Address"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    owner_address: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: "Please select your role!"
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            name="role"
                            onChange={e =>
                                setFormDatas({ ...FormDatas, role: e })
                            }
                            placeholder="Please select your role"
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
                </Col>

                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: "Please select your status!"
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            name="status"
                            onChange={e =>
                                setFormDatas({ ...FormDatas, status: e })
                            }
                            placeholder="Please select your status"
                        >
                            <Option value="Active">Active</Option>
                            <Option value="Inactive">Inactive</Option>
                            <Option value="Inquiry">Inquiry</Option>
                            <Option value="Invited">Invited</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item label="Website" name="website">
                        <Input
                            name="website"
                            placeholder="Website"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    website: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item
                        label="Location Phone Number"
                        name="phone_number"
                    >
                        <Input
                            name="phone_number"
                            placeholder="Location Phone Number"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    phone_number: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item
                        label="Cell Phone Number"
                        name="other_phone_number"
                    >
                        <Input
                            name="other_phone_number"
                            placeholder="Cell Phone Number"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    other_phone_number: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item
                        label="Clearent VT un"
                        name="virtual_terminal_un"
                    >
                        <Input
                            name="virtual_terminal_un"
                            placeholder="Clearent VT un"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    virtual_terminal_un: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item
                        label="Clearent VT pw"
                        name="virtual_terminal_pw"
                    >
                        <Input
                            name="virtual_terminal_pw"
                            placeholder="Clearent VT pw"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    virtual_terminal_pw: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item label="Industry" name="industry">
                        <Input
                            name="industry"
                            placeholder="Industry"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    industry: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item
                        label="ISO / Agent / Reseller"
                        name="iso_agent_reseller"
                    >
                        <Input
                            name="iso_agent_reseller"
                            placeholder="ISO / Agent / Reseller"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    iso_agent_reseller: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item label="Type" name="type">
                        <Input
                            name="type"
                            placeholder="Type"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    type: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item label="Billing Address" name="billing_address">
                        <Input
                            name="billing_address"
                            placeholder="Billing Address"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    billing_address: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item label="IRS Name" name="irs_name">
                        <Input
                            name="irs_name"
                            placeholder="IRS Name"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    irs_name: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>

                <Col className="gutter-row" xs={24} md={6}>
                    <Form.Item label="TIN" name="tin">
                        <Input
                            name="tin"
                            placeholder="TIN"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    tin: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={12}>
                    <Form.Item label="Shipping Address" name="shipping_address">
                        <Input
                            name="shipping_address"
                            placeholder="Shipping Address"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    shipping_address: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col className="gutter-row" xs={24} md={24}>
                    <Form.Item label="Description" name="description">
                        <TextArea
                            rows={8}
                            name="description"
                            placeholder="Description"
                            onChange={e =>
                                setFormDatasExtra({
                                    ...FormDatasExtra,
                                    description: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Col>
            </Row>
            <div style={{ float: "left ", fontSize: "12px" }}>
                <b>Date Modified</b>:{" "}
                {dataUser.data.date_modified_by
                    ? moment(dataUser.data.updated_at).format("LLLL") +
                      " By " +
                      dataUser.data.date_modified_by
                    : "not updated yet"}
            </div>
            <br></br>
            <div style={{ float: "left ", fontSize: "12px" }}>
                <b>Date Registered</b>:{" "}
                {dataUser.data.date_entered_by
                    ? moment(dataUser.data.created_at).format("LLLL") +
                      " By " +
                      dataUser.data.date_entered_by
                    : moment(dataUser.data.created_at).format("LLLL") +
                      " By " +
                      Name}
            </div>{" "}
            <Row gutter={24}>
                <Col className="gutter-row text-right" xs={24} md={24}>
                    <Space>

                            <Popconfirm
                                title="Are you sure you want to update your changes?"
                                onConfirm={e => form.submit() }
                                okText="Confirm"
                                cancelText="Cancel"
                            >
                                <Button
                                    key="orverview_submit"
                                    type="primary"
                                    style={{
                                        background: "#d48806",
                                        border: "1px solid #d48806"
                                    }}
                                >
                                    Update Details
                                </Button>
                            </Popconfirm>
                    </Space>
                </Col>
            </Row>
        </Form>
    );
};

export default PageUserProfileComponentOverview;
