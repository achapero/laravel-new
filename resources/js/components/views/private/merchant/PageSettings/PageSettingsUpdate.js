import React, { useState, useEffect } from "react";
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
    Popover
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
import ModaEmailChange from "../../admins/PageSettings/ModaEmailChange";
const PageSettingsModal = () => {
    const { TabPane } = Tabs;

    const obj = getUserData();
    const [OldEmail, setOldEmail] = useState(obj.email)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [emailError, setEmailError] = useState(0);
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
            form.setFieldsValue({
                ...res.data
            });

            var str = res.data.image_url;
            var url = str.split("/");

            if (url[0] == "assets") {
                url = window.location.origin + "/" + res.data.image_url;
            } else {
                url = res.data.image_url;
            }
            setOldEmail(res.data.email)
            setSrcImg(url);
            setFileListMerchant([
                {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: url
                }
            ]);
        }
    );

    const [fileListMerchant, setFileListMerchant] = useState([]);

    const onChangeUpload = ({ fileList: newFileList }) => {
        if (newFileList.length == 0) {
            setFileListMerchant(newFileList);
        }
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
        console.log(file);
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
        wrapperCol: { span: 14 }
    };

    const formItemLayoutPassword = {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
    };

    const [form] = Form.useForm();

    const {
        mutate: mutateUpdateSettings,
        isLoading: isLoadingUpdateSettings
    } = useAxiosQuery("UPDATE", `api/v1/users`, `settings_update`);

    const handleSubmit = data => {
        let _data = {
            ...data
        };

        console.log(_data);
        mutateUpdateSettings(
            { id: obj.id, settings: _data, image_url: srcImg },
            {
                onSuccess: res => {
                    console.log(res);
                    notification.success({
                        message: "Profile Updated Successfully"
                    });
                    refetchUserData();
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
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
        console.log(data);
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
                    console.log(err);
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
                                        style={{
                                            width: "100% !important"
                                        }}
                                        listType="picture-card"
                                        fileList={fileListMerchant}
                                        onChange={onChangeUpload}
                                        onPreview={onPreview}
                                        maxCount={1}
                                        customRequest={({
                                            onSuccess,
                                            onError,
                                            file
                                        }) => {
                                            getBase64(file, imageUrl => {
                                                setSrcImg(imageUrl);
                                                setFileListMerchant([
                                                    {
                                                        uid: file.uid,
                                                        name: file.name,
                                                        status: "done",
                                                        url: imageUrl
                                                    }
                                                ]);
                                            });
                                        }}
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

                                        <div style={{ textAlign: "center" }}>
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
                </Row>
            </div>
        </>
    );
};

export default PageSettingsModal;
