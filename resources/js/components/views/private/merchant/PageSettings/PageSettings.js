import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    Modal,
    Form,
    Table,
    notification,
    message,
    Typography
} from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    LogoutOutlined,
    SettingOutlined,
    EditOutlined
} from "@ant-design/icons";

import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";

import { Link } from "react-router-dom";
const PageSettings = ({ history }) => {
    const [loginData, setLoginData] = useState({
        email: "",
        preferred_email: "",
        name: "",
        phone_number: "",
        address: "",
        role: "",
        image_url: "",
        id: 0
    });

    const [userdata, setuserData] = useState({});
    const [img, setImg] = useState("");
    const [imgUpload, setImgUpload] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [submitButtonText, setSubmitButtonText] = useState("Update Details");
    const [text, setText] = useState("Change Password");
    const [showPass, setShowPass] = useState(false);
    const [success, setSuccess] = useState(false);
    const obj = getUserData();

    const {
        data: dataUserData,
        isLoading: isLoadingDataUserData,
        refetch: refetchUserData,
        isFetching: isFetchingUserData
    } = useAxiosQuery(
        "GET",
        `api/v1/users/${obj.id}`,
        "setting_user_data",
        res => {
            
            setLoginData(res.data);
            setImg(res.data.image_url);
        }
    );

    return (
        <div
            style={{
                padding: "24px 16px"
            }}
        >
            <Row className="justify-content-center" id="settingview">
                <Col md={6}></Col>
                <Col md={12}>
                    <Card className="p-4">
                        <div>
                            <Row gutter={16}>
                                <Col xs={24} md={10}>
                                    <div
                                        className="text-center border-right-settings"
                                        style={{
                                            borderRight: "1px solid gray"
                                        }}
                                    >
                                        <img
                                            style={{
                                                width: "120px",
                                                height: "120px",
                                                borderRadius: "50%"
                                            }}
                                            src={img}
                                        />
                                        <Typography.Title level={3}>
                                            {loginData.role}{" "}
                                        </Typography.Title>
                                        <p className="text-muted">
                                            {loginData.status}
                                        </p>
                                    </div>
                                </Col>
                                <Col
                                    xs={24}
                                    md={14}
                                    className="profiledatasettings"
                                >
                                    <div style={{ lineHeight: "1" }}>
                                        <p className="text-muted">
                                            Email : <b> {loginData.email} </b>
                                        </p>
                                        <p className="text-muted">
                                            Name: <b>{loginData.name} </b>
                                        </p>
                                        <p className="text-muted">
                                            Phone Number:{" "}
                                            <b>{loginData.phone_number}</b>
                                        </p>
                                        <p className="text-muted">
                                            Address:{" "}
                                            <b> {loginData.address} </b>
                                        </p>

                                        <Button
                                            type="primary"
                                            onClick={e => {
                                                // if ( record.role == "Advisor" ) {
                                                //     history.push(
                                                //         `/advisor/edit/${record.id}`
                                                //     );
                                                // } else {
                                                // }
                                                history.push(
                                                    `/settings/update`
                                                );
                                            }}
                                            icon={<EditOutlined />}
                                            style={{
                                                width: "100%",
                                                marginTop: "40px"
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </div>

                                    <br></br>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>
                <Col md={6}></Col>
            </Row>
            
        </div>
    );
};

export default PageSettings;
