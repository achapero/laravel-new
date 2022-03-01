import React, { useState, useEffect } from "react";
import {
    Card, Row, Col, Button, Table, Input, Divider, Popconfirm, notification, Modal, Typography, Upload, Space, Form, Tabs, Popover, Alert,
} from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../providers/arrayColumn";
import { number_format } from "../../../../providers/number_format";
import moment from "moment";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import getUserData from "../../../../providers/getUserData";

import ModaEmailChange from "./ModaEmailChange";

const PageSettingsModal = () => {

    const { TabPane } = Tabs;
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    const obj = getUserData();
    const [OldEmail, setOldEmail] = useState(obj.email)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [emailError, setEmailError] = useState(0);

    const [fileListMerchant, setFileListMerchant] = useState([]);
    const {
        data: dataUserData,
        isLoading: isLoadingDataUserData,
        refetch: refetchUserData,
        isFetching: isFetchingDataBoardingTable
    } = useAxiosQuery(
        "GET",
        `api/v1/users/${obj.id}`,
        "setting_user_data",
        res => {
            // console.clear();
            form.setFieldsValue({
                ...res.data
            });
            // console.log("image_url", window.location.origin + "/storage/" + res.data.upload)
            setOldEmail(res.data.email)
            setSrcImg(window.location.origin + "/storage/" + res.data.upload);

            let avatarImage = res.data.upload  ? res.data.upload.split("/") : "";
            setFileListMerchant([
                {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    // url: window.location.origin + "/storage/" + res.data.upload
                    url:
                        avatarImage[0] == "https:"
                            ? res.data.upload
                            : res.data.upload ?
                                window.location.origin +"/storage/"+ res.data.upload :
                                window.location.origin +"/images/default.png"
                }
            ]);

        }
    );


    const onChangeUpload = ({ fileList: newFileList }) => {
        setFileListMerchant(newFileList);
        var _file = newFileList;
        _file[0].status = "done";
        // console.log(_file)
        // setFileListMerchant(_file);
        // if (newFileList.length == 0) {
        // }
    };

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    const [srcImg, setSrcImg] = useState("");
    const [previewImage, setPreviewImage] = useState();
    const [previewTitle, setPreviewTitle] = useState();
    const [previewVisible, setPreviewVisible] = useState(false);

    const onPreview = async file => {
        // console.log(file);
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        setPreviewImage(src);
        setPreviewTitle(file.name);
        setPreviewVisible(true);
    };

    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    const formItemLayoutPassword = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };

    const [form] = Form.useForm();

    const {
        mutate: mutateUpdateSettings,
        isLoading: isLoadingUpdateSettings
    } = useAxiosQuery("POST", `api/v1/users/profileUpdate`, `setting_user_data`);

    // const handleSubmit = data => {
    const handleSubmit = value => {
        // let _data = {
        //     ...data
        // };

        // console.log(_data);
        // console.log({ id: obj.id, settings: _data, image_url: srcImg });
        // console.log(obj);
        // console.log(fileListMerchant)
        const data = new FormData();
        data.append("id", obj.id);
        data.append("address", value.address);
        data.append("email", value.email);
        data.append("name", value.name);
        data.append("phone_number", value.phone_number);
        data.append("preferred_email", value.preferred_email);
        if (fileListMerchant.length !== 0) {
            if(fileListMerchant[0].uid != '-1') {
                data.append(
                    "image_url",
                    fileListMerchant[0].originFileObj,
                    fileListMerchant[0].name
                );
            }
        }
        // console.log(value)
        mutateUpdateSettings(data, {
            onSuccess: res => {
                console.log('res', res);
                // localStorage.profile_image = res.user.upload
                localStorage.setItem('profile_image', res.user.upload)
                notification.success({
                    message: "Profile Updated Successfully"
                });
                refetchUserData();
            },
            onError: err => {
                // console.log(err);
            }
        });
    };

    const {
        mutate: mutateUpdatePass,
        isLoading: isLoadingUpdatePass
    } = useAxiosQuery(
        "UPDATE",
        `api/v1/users/${obj.id}/updatePassword`,
        `settings_password_update`
    );

    const handleSubmitPass = data => {
        // console.log(data);
        mutateUpdatePass(
            {
                cur_password: data.current_password,
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
                            notification.success({
                                message: "Password Updated Successfully"
                            });
                            refetchUserData();
                        }
                    }
                },
                onError: err => {
                    // console.log(err);
                }
            }
        );
    };



    return (
        <>
            <div
                style={{
                    padding: "24px 16px"
                }}
            >
                <Row className="justify-content-center" id="settingview">
                    <Col md={6}></Col>
                    <Col md={12}>
                        <Card
                            title="Update Profile"
                            extra={
                                <Link to="/settings">
                                    <Button type="primary">
                                        <ArrowLeftOutlined /> Back
                                    </Button>
                                </Link>
                            }
                        >
                            <div style={{ textAlign: "center" }}>
                                <ImgCrop rotate>
                                    <Upload
                                        style={{width: "100% !important"}}
                                        listType="picture-card"
                                        fileList={fileListMerchant}
                                        onChange={onChangeUpload}
                                        onPreview={onPreview}
                                        maxCount={1}
                                        action={false}
                                        customRequest={false}
                                    >
                                        {fileListMerchant.length < 1 &&
                                            "+ Upload"}
                                    </Upload>
                                </ImgCrop>
                            </div>
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Details" key="1">
                                    <Form
                                        {...formItemLayout}
                                        layout={"horizontal"}
                                        form={form}
                                        onFinish={handleSubmit}
                                    >
                                        <Form.Item label="Email" name="email">
                                            <Input
                                                placeholder="Email"
                                                type="text"
                                                style={{ width: "100%" }}
                                                disabled
                                            />
                                        </Form.Item>
                                        <Form.Item label="Name" name="name">
                                            <Input
                                                placeholder="Name"
                                                type="text"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Phone #"
                                            name="phone_number"
                                        >
                                            <Input
                                                placeholder="Phone #"
                                                type="text"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Address"
                                            name="address"
                                        >
                                            <Input
                                                placeholder="Address"
                                                type="text"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Preferred Email"
                                            name="preferred_email"
                                        >
                                            <Input
                                                placeholder="Preferred Email"
                                                type="text"
                                                style={{ width: "100%" }}
                                            />
                                        </Form.Item>

                                        <div style={{ textAlign: "right" }}>
                                            {" "}
                                            <Button
                                                style={{
                                                    width: "30%",
                                                    background: '#389e0d',
                                                    borderColor: '#389e0d'
                                                }}
                                                type="primary"
                                                onClick={e => setIsModalVisible(true)}
                                            >
                                                Change Email
                                            </Button>
                                            {" "}
                                            <Button
                                                style={{ width: "30%" }}
                                                type="primary"
                                                htmlType="submit"
                                                loading={
                                                    isLoadingUpdateSettings
                                                }
                                            >
                                                Save
                                            </Button>{" "}
                                        </div>
                                    </Form>
                                </TabPane>
                                <TabPane tab="Password" key="2">
                                    <Form
                                        {...formItemLayoutPassword}
                                        layout={"horizontal"}
                                        onFinish={handleSubmitPass}
                                    >
                                        <Form.Item
                                            name="current_password"
                                            label="Current Password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your current password"
                                                }
                                            ]}
                                            hasFeedback
                                        >
                                            <Input.Password />
                                        </Form.Item>

                                        <Form.Item
                                            name="password"
                                            label="Password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input your password"
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
                                                    message:
                                                        "Please confirm your password"
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (
                                                            !value ||
                                                            getFieldValue(
                                                                "password"
                                                            ) === value
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
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                    <Col md={6}></Col>
                </Row>
            </div>

            <ModaEmailChange
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                emailError={emailError}
                setEmailError={setEmailError}
                OldEmail={OldEmail}
                setOldEmail={setOldEmail}
            />

            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
            >
                <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};

export default PageSettingsModal;
