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
    AppstoreOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";
import getCheckPermission from "../../../../providers/getCheckPermission";
const MerchantProfile = ({ permission }) => {
    const [formData, setFormData] = useState();
    const userdata = getUserData();

    const {
        data: dataMyProfile,
        isLoading: isLoadingMyProfile,
        refetch: refetchMyProfile,
        isFetching: isFetchingTblMyProfile
    } = useAxiosQuery(
        "GET",
        `api/v1/users/${userdata.id}`,
        "get_my_profile",
        res => {
            setFormData(res.data);
            setTimeout(() => getCheckPermission(permission), 1000);
        }
    );

    const handleRequestInfoChange = () => {
        window.location.href = "/tickets/add?subject=Request info change";
    };

    return (
        <div
            style={{
                padding: "24px 16px"
            }}
        >
            <Card title={"Profile"}>
                <div>
                    {formData && (
                        <>
                            <form method="POST"></form>
                            <Row gutter={16}>
                                <Col xs={24} md={6}>
                                    <div>
                                        <div htmlFor="email-input">Email</div>
                                        <Input
                                            disabled
                                            required
                                            type="email"
                                            name="email"
                                            placeholder="Enter Email"
                                            autoComplete="email"
                                            disabled={true}
                                            value={formData.email}
                                        />
                                    </div>
                                </Col>

                                <Col xs={24} md={6}>
                                    <div>
                                        <div htmlFor="text-input">
                                            Full Name
                                        </div>
                                        <Input
                                            disabled
                                            required
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={6}>
                                    {" "}
                                    <div>
                                        <div htmlFor="text-input">
                                            Merchant Name
                                        </div>
                                        <Input
                                            disabled
                                            type="text"
                                            name="merchant_name"
                                            placeholder="Merchant Name"
                                            autoComplete="merchant_name"
                                            value={
                                                formData.merchant_name
                                                    ? formData.merchant_name
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={6}>
                                    {" "}
                                    <div>
                                        <div htmlFor="text-input">
                                            Merchant Number
                                        </div>
                                        <Input
                                            disabled
                                            type="number"
                                            name="merchant_number"
                                            placeholder="Merchant Number"
                                            autoComplete="merchant_number"
                                            value={
                                                formData.merchant_number
                                                    ? formData.merchant_number
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={6}>
                                    {" "}
                                    <div>
                                        <div htmlFor="text-input">
                                            Percentage of Ownership
                                        </div>
                                        <Input
                                            disabled
                                            type="number"
                                            name="percentage_of_ownership"
                                            placeholder="Percentage of Ownership"
                                            autoComplete="percentage_of_ownership"
                                            value={
                                                formData.percentage_of_ownership
                                                    ? formData.percentage_of_ownership
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={6}>
                                    {" "}
                                    <div>
                                        <div htmlFor="text-input">
                                            SSN last 4 digits
                                        </div>
                                        <Input
                                            disabled
                                            type="number"
                                            name="ssn_last_4_digits"
                                            placeholder="SSN last 4 digits"
                                            autoComplete="ssn_last_4_digits"
                                            value={
                                                formData.ssn_last_4_digits
                                                    ? formData.ssn_last_4_digits
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div>
                                        <div htmlFor="text-input">
                                            Location Address
                                        </div>
                                        <Input
                                            disabled
                                            type="text"
                                            name="address"
                                            placeholder="Location Address"
                                            autoComplete="address"
                                            value={
                                                formData.address
                                                    ? formData.address
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={6}>
                                    <div>
                                        <div htmlFor="text-input">
                                            Location Phone Number
                                        </div>
                                        <Input
                                            disabled
                                            type="text"
                                            name="phone_number"
                                            placeholder="Location Phone Number"
                                            autoComplete="phone_number"
                                            value={
                                                formData.phone_number
                                                    ? formData.phone_number
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={6}>
                                    <div>
                                        <div htmlFor="text-input">
                                            Cell Phone Number
                                        </div>
                                        <Input
                                            disabled
                                            type="text"
                                            name="other_phone_number"
                                            placeholder="Cell Phone Number"
                                            autoComplete="other_phone_number"
                                            value={
                                                formData.other_phone_number
                                                    ? formData.other_phone_number
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={6}>
                                    <div>
                                        <div htmlFor="text-input">IRS Name</div>
                                        <Input
                                            disabled
                                            type="text"
                                            name="irs_name"
                                            placeholder="IRS Name"
                                            autoComplete="irs_name"
                                            value={
                                                formData.irs_name
                                                    ? formData.irs_name
                                                    : ""
                                            }
                                        />
                                    </div>{" "}
                                </Col>
                                <Col xs={24} md={6}>
                                    <div>
                                        <div htmlFor="text-input">TIN</div>
                                        <Input
                                            disabled
                                            type="number"
                                            name="tin"
                                            placeholder="TIN"
                                            autoComplete="tin"
                                            value={
                                                formData.tin ? formData.tin : ""
                                            }
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <div>
                                        <div htmlFor="text-input">
                                            DDA Number
                                        </div>
                                        <Input
                                            disabled
                                            type="text"
                                            name="dda_number"
                                            placeholder="DDA Number"
                                            autoComplete="dda_number"
                                            value={
                                                formData.dda_number
                                                    ? formData.dda_number
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div>
                                        <div htmlFor="text-input">
                                            Routing Number
                                        </div>
                                        <Input
                                            disabled
                                            type="number"
                                            name="routing_number"
                                            placeholder="Routing Number"
                                            autoComplete="routing_number"
                                            value={
                                                formData.routing_number
                                                    ? formData.routing_number
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div>
                                        <div htmlFor="text-input">
                                            Credit Decision Date
                                        </div>
                                        <Input
                                            disabled
                                            type="date"
                                            name="credit_decision_date"
                                            placeholder="Credit Decision Date"
                                            autoComplete="credit_decision_date"
                                            value={
                                                formData.credit_decision_date
                                                    ? formData.credit_decision_date
                                                    : ""
                                            }
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <br></br>
                            <Button
                                type="primary"
                                onClick={e => handleRequestInfoChange()}
                                className="pull-right"
                                name="request_change_info"
                            >
                                Request info change
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default MerchantProfile;
