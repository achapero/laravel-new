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
    DatePicker,
    Upload
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
    UploadOutlined,
    PlusOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import queryString from "query-string";
import { Content } from "antd/lib/layout/layout";
import moment, { isMoment } from "moment";
import ButtonGroup from "antd/es/button/button-group";
import Search from "antd/lib/input/Search";
import { CSVLink } from "react-csv";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
import { values } from "lodash";
import ImgCrop from "antd-img-crop";

import defaultImage from "../../../../../assets/img/default.png";

const PageUserProfileComponentAutNet = ({ user_id, dataUser }) => {
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const [form] = Form.useForm();
    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);

    const [fileListMerchantCard, setFileListMerchantCard] = useState([]);
    const [fileListMerchant, setFileListMerchant] = useState([]);

    const [fileMerchantCard, setFileMerchantCard] = useState(false);
    const [fileMerchant, setFileMerchant] = useState(false);
    const [Link, setLink] = useState();
    const [dataTable, setDataTable] = useState([]);
    const {
        data: dataAuth,
        isLoading: isLoadingAuth,
        refetch: refetchAuth
    } = useAxiosQuery(
        `GET`,
        `api/v1/auth_net_merchants/getUserbyId/getUserbyId?user_id=${user_id}`,
        `auth_net_merchants_getUserbyId_${user_id}`,
        res => {
            if (res.success) {
                // console.clear()
                console.log("auth_net_merchants_getUserbyId_", res.data);
                // console.log('merchant_gc_logo', res.data.merchant_gc_logo)
                // console.log(window.location.origin+'/'+res.data.merchant_logo)
                // console.log("@auth_net_merchants_getUserbyId", user_id);
                if(res.data) {
                    setDataTable(res.data ? res.data : []);
                    setLink(res.data ? res.data.auth_username : []);
                    setFileListMerchant([
                        {
                            uid: "-1",
                            // name: res.data.merchant_logo,
                            status: "done",
                            url: res.data.merchant_logo
                                ? window.location.origin + "/storage/" + res.data.merchant_logo
                                : window.location.origin + "/images/default.png",
                            error: true
                        }
                    ]);
                    setFileListMerchantCard([
                        {
                            uid: "-1",
                            // name: res.data.merchant_gc_logo,
                            status: "done",
                            url: res.data.merchant_gc_logo
                                ? window.location.origin + "/storage/" + res.data.merchant_gc_logo
                                : window.location.origin + "/images/default.png"
                        }
                    ]);
                }
            }
        }
    );

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

    const handleCancel = () => {
        setPreviewVisible(false);
        setPreviewTitle("");
    };

    const onChangeImageMerchantCardLogo = ({ fileList: newFileList }) => {
        var _file = newFileList;
        _file[0].status = "done";
        setFileListMerchantCard(_file);
        setFileMerchantCard(true);
    };

    const onChangeImageMerchantLogo = ({ fileList: newFileList }) => {
        var _file = newFileList;
        _file[0].status = "done";
        setFileListMerchant(_file);
        setFileMerchant(true);
    };

    const {
        mutate: mututaUpdateAuth,
        isLoading: isLoadingUpdateAuth
    } = useAxiosQuery(
        `POST`,
        `api/v1/auth_net_merchants`,
        `auth_net_merchants_getUserbyId_${user_id}`
    );

    const onFinishForm = values => {
        const data = new FormData();
        data.append("id", values.id);
        data.append("user_id", user_id);
        data.append("auth_username", values.auth_username);
        data.append("login_id", values.login_id);
        data.append("merchant_cc_email", values.merchant_cc_email);
        data.append("merchant_email", values.merchant_email);
        data.append("merchant_name", values.merchant_name);
        data.append("trans_key", values.trans_key);

        // console.log('fileListMerchantCard', fileListMerchantCard)
        // console.log('fileListMerchant', fileListMerchant)
        if (fileListMerchantCard.length !== 0) {
            if(fileListMerchantCard[0].uid != '-1') {
                data.append(
                    "merchant_gc_logo",
                    fileListMerchantCard[0].originFileObj,
                    fileListMerchantCard[0].name
                );
            }
        }
        if (fileListMerchant.length !== 0) {
            if(fileListMerchant[0].uid != '-1') {
                data.append(
                    "merchant_g_logo",
                    fileListMerchant[0].originFileObj,
                    fileListMerchant[0].name
                );
            }
        }
        // if (fileMerchantCard == true) {
        //     console.log("fileListMerchantCard");
        //     data.append("merchant_gc_size", fileListMerchantCard[0].size);
        //     data.append("merchant_gc_name", fileListMerchantCard[0].name);
        //     data.append("merchant_gc_logo", fileListMerchantCard[0].thumbUrl);
        // }
        // if (fileMerchant == true) {
        //     console.log("fileListMerchant");
        //     data.append("merchant_g_size", fileListMerchant[0].size);
        //     data.append("merchant_g_name", fileListMerchant[0].name);
        //     data.append("merchant_g_logo", fileListMerchant[0].thumbUrl);
        // }
        setFileMerchantCard(false);
        setFileMerchant(false);
        mututaUpdateAuth(data, {
            onSuccess: res => {
                notification.success({
                    message: "Success",
                    description: "AuthNet Info has been successfully save!"
                });
            }
        });
    };

    return (
        <div>
            {dataAuth && (
                <Form
                    name="AuthNet"
                    layout="vertical"
                    initialValues={dataAuth.data}
                    onFinish={onFinishForm}
                    form={form}
                >
                    <Divider orientation="right" plain>
                        <Title level={2}>AuthNet</Title>
                    </Divider>

                    <Form.Item label="id" name="id" className="hide">
                        <Input name="id" />
                    </Form.Item>

                    <Form.Item label="user_id" name="user_id" className="hide">
                        <Input
                            name="user_id"
                            // defaultValue={user_id}
                        />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} md={12}>
                            <Form.Item label="Email" name="merchant_email">
                                <Input
                                    name="merchant_email"
                                    placeholder="Email"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={24} md={12}>
                            <Form.Item
                                label="Merchant Name"
                                name="merchant_name"
                            >
                                <Input
                                    name="merchant_name"
                                    placeholder="Merchant Name"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} md={12}>
                            <Form.Item
                                label="Cc Email"
                                name="merchant_cc_email"
                            >
                                <Input
                                    name="merchant_cc_email"
                                    placeholder="Cc Email"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={24} md={6}>
                            <Form.Item label="Log-in ID" name="login_id">
                                <Input.Password
                                    name="login_id"
                                    placeholder="Log-in ID"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={24} md={6}>
                            <Form.Item label="Trans Key" name="trans_key">
                                <Input.Password
                                    name="trans_key"
                                    placeholder="Trans Key"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col className="gutter-row" xs={24} md={12}>
                            <Form.Item
                                label="Shortcode"
                                name="auth_username"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your shortcode!"
                                    }
                                ]}
                            >
                                <Input
                                    name="auth_username"
                                    placeholder="Shortcode"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col
                            className="gutter-row"
                            xs={24}
                            md={12}
                            align="center"
                        >
                            <Divider>Merchant Card Gift Logo</Divider>
                            <div className="mcgl" style={{ width: "200px" }}>
                                <ImgCrop rotate>
                                    <Upload
                                        style={{ width: "100%!important" }}
                                        listType="picture-card"
                                        fileList={fileListMerchantCard}
                                        onChange={onChangeImageMerchantCardLogo}
                                        onPreview={onPreview}
                                        showUploadList={{
                                            showRemoveIcon: false
                                        }}
                                        maxCount={1}
                                    >
                                        {fileListMerchantCard.length < 5 &&
                                            "+ Upload"}
                                    </Upload>
                                </ImgCrop>
                            </div>
                        </Col>

                        <Col
                            className="gutter-row"
                            xs={24}
                            md={12}
                            align="center"
                        >
                            <Divider>Merchant Logo</Divider>
                            <div className="ml" style={{ width: "200px" }}>
                                <ImgCrop rotate>
                                    <Upload
                                        style={{ width: "100%!important" }}
                                        listType="picture-card"
                                        fileList={fileListMerchant}
                                        onChange={onChangeImageMerchantLogo}
                                        showUploadList={{
                                            showRemoveIcon: false
                                        }}
                                        onPreview={onPreview}
                                        maxCount={1}
                                    >
                                        {fileListMerchant.length < 5 &&
                                            "+ Upload"}
                                    </Upload>
                                </ImgCrop>
                            </div>
                        </Col>
                    </Row>
                    <Modal
                        visible={previewVisible}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <img
                            alt="example"
                            style={{ width: "100%" }}
                            src={previewImage}
                        />
                    </Modal>

                    <div className="text-center">
                        <br />
                        <br />
                        <br />
                        <a
                            href={`${
                                window.location.origin
                            }/giftcard-checkout/${Link ? Link : ""}`}
                        >
                            Live Link
                        </a>
                    </div>

                    <Divider />
                    <Row gutter={24}>
                        <Col className="gutter-row text-right" xs={24} md={24}>
                            <Space>
                                <Button
                                    key="orverview_submit"
                                    type="primary"
                                    style={{
                                        background: "#d48806",
                                        border: "1px solid #d48806"
                                    }}
                                    onClick={() => {
                                        form.submit();
                                    }}
                                    loading={isLoadingUpdateAuth}
                                >
                                    Save AuthNet Info
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            )}
        </div>
    );
};

export default PageUserProfileComponentAutNet;
