import {
    Layout, Card, Button, Row, Col, Input, Table, Popconfirm, Divider, notification, Image, Tooltip,
    Drawer, Space, Modal, Form, Select, Checkbox, Typography, DatePicker, Upload
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
import MaskedInput from 'antd-mask-input'

import defaultImage from "../../../../../assets/img/default.png";

const PagePaymentInformation = ({ updateField, mask, mask1 }) => {
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const [form] = Form.useForm();
    const my_location = useLocation();

    return(
        <Form 
            layout="vertical"
            style={{
                width: '100%',
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0
            }}
        >
            <Divider orientation="left"><h1 style={{fontWeight: 'bold'}}>Payment Information</h1></Divider>

            <Row gutter={24}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="Card Number"
                        name="card_number"
                        rules={[{ required: true, message: 'Please input your card number!' }]}
                    >
                        <MaskedInput 
                            mask="1111 1111 1111 1111" 
                            size="large"
                            name="card_number" 
                            placeholder="Card Number"
                            onChange={e => updateField(e, "card")}
                        />
                    </Form.Item>
                </Col>
                
                <Col className="gutter-row" span={6}>
                    <Form.Item
                        label={' '}
                        name="exp_date"
                        rules={[{ required: true, message: 'Please input your card number!' }]}
                    >
                        <MaskedInput 
                            mask="11/11"
                            name="expiry" 
                            size="large"
                            placeholder="MM/YY" 
                            onChange={e => updateField(e, "card")}
                        />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Form.Item
                        label={' '}
                        name="cvc"
                        rules={[{ required: true, message: 'Please input your cvc!' }]}
                    >
                        <MaskedInput 
                            mask="111" 
                            name="cvc" 
                            size="large"
                            placeholder="CVC"
                            onChange={e => updateField(e, "cvc")}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export default PagePaymentInformation;