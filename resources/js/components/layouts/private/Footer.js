import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    Layout,
    Tooltip,
    Spin
} from "antd";
import {
    UserOutlined,
    BookOutlined,
    BuildOutlined,
    TeamOutlined,
    MenuOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import moment from "moment";
import getUserData from "../../providers/getUserData";
export default function Footer() {
    let userdata = getUserData();

    return (
        <Layout.Footer style={{ textAlign: "center", display: "inline" }}>
            <div> {process.env.MIX_APP_NAME} ©2022 v1.0</div>
        </Layout.Footer>
    );
}
