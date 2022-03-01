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

import checkoutImage from "../../../../../assets/img/checkout.png";

const PageChooseShipping = () => {
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
            <Divider orientation="left"><h1 style={{fontWeight: 'bold'}}>Choose Shipping</h1></Divider>
            <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                    <p
                        style={{
                            fontSize: "17px",
                            color: "#339966",
                            fontWeight: "bolder"
                        }}
                    >
                        *Free Shipping
                    </p>
                </Col>
            </Row>
        </Form>
    )
}


export default PageChooseShipping;