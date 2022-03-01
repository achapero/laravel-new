import {
    Layout, Card, Button, Row, Col, Input, Table, Popconfirm, Divider, notification, Image, Tooltip,
    Drawer, Space, Modal, Form, Select, Checkbox, Typography, DatePicker, Upload, Radio , Label, InputNumber
} from "antd";
import {
    DeleteFilled, EditFilled, PlusCircleOutlined, FileExcelOutlined, SettingOutlined, EyeOutlined, UsergroupDeleteOutlined,
    UserAddOutlined, ArrowLeftOutlined, UploadOutlined, PlusOutlined, LoadingOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment} from "react";
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
import ImgCrop from 'antd-img-crop';

import checkoutImage from "../../../../../assets/img/checkout.png";
import defaultImage from "../../../../../assets/img/default.png";

const PageTotalAmount = ({updateField, data, checkRadio, customIsOpen, dataGCImage, optionState}) => {
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const [form] = Form.useForm();
    const my_location = useLocation();

    return(
        <div
            style={{
                width: '100%',
                border: "2px solid #eaeaea",
                marginTop: "20px",
                padding: '10px',
                display: 'flex',
                justifyContent: 'center'
            }}
        >
            <div style={{ width: '100%', textAlign: "center" }}>
                {/*<Row gutter={24}>
                    <Col span={24}  style={{ }}>
                        <img
                            className="secure-checkout-img-total"
                            style={{width: '150px'}}
                            src={
                                window.location.origin + defaultImage
                            }
                        ></img>
                    </Col>
                </Row>*/}
                <Row gutter={24}>
                    <Col span={24}>
                        <img
                            className="margin-top-total-amount"
                            src={
                                dataGCImage == ""
                                    ? window.location.origin +
                                    "/assets/images/gitf-card.png"
                                    : `${window.location.origin}/${dataGCImage}`
                            }
                            style={{
                                width: "75%",
                                marginTop: 20,
                                marginBottom: 20
                            }}
                        ></img>{" "}
                        <p
                            style={{
                                textDecoration: "underline"
                            }}
                        >
                            Total Payment
                        </p>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <h2>Gift Card</h2>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={24}>
                        <Radio.Group onChange={e => checkRadio(e)} value={optionState}>
                            <Space direction="vertical">
                                <Radio name="amount" value='25'>$25</Radio>
                                <Radio name="amount" value='50'>$50</Radio>
                                <Radio name="amount" value='100'>$100</Radio>
                                <Radio name="amount" value='custom'>custom</Radio>
                            </Space>
                        </Radio.Group>
                    </Col>
                </Row>

                <br/>
                <Row gutter={24}>
                    {customIsOpen && (
                        <Col span={24}>
                            <InputNumber
                                size="large"
                                name="amount"
                                placeholder="amount"
                                style={{
                                    textAlign: "center",
                                    width: "60%",
                                    margin: "auto"
                                }}
                                onChange={e => updateField({target: {name: 'amount', value: e}}, "amount")}
                            />
                        </Col>
                    )}
                </Row>

                <br/>
                <Row gutter={24}>
                    <Col span={12}>
                        <p
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            Total
                        </p>
                    </Col>
                    <Col span={12}>
                        <p
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            ${data.amount == 0 ? "0" : data.amount}
                        </p>
                    </Col>
                </Row>

                <br/>
                <Row gutter={24}>
                    <Col span={24} style={{textAlign: 'left'}}>
                        <p>
                            Add a special message{" "}
                            <span style={{ color: "grey" }}>(optional)</span>
                        </p>
                        <TextArea
                            style={{width: '100%'}}
                            name="message"
                            onChange={e => updateField(e, "message")}
                        />
                    </Col>
                </Row>

            </div>
        </div>
    )
}

export default PageTotalAmount;
