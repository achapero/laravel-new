import React, { useState, useEffect, useRef } from "react";
import { Card, div, Row, Col, Input, Button, Table, Divider } from "antd";
import ContentHeader from "./PageClearentContentHeader";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
import { CSVLink } from "react-csv";
import moment from "moment";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    DashboardOutlined,
    ContainerOutlined,
    ReadOutlined,
    CreditCardOutlined,
    ReloadOutlined,
    UserOutlined
} from "@ant-design/icons";
const PageClearentEdit = ({ history, match }) => {
    return (
        <div
            className=""
            id="clearentEdit"
            style={{
                padding: "24px 16px"
            }}
        >
            <ContentHeader
                history={history}
                merchantNumber={match.params.merchant_number}
            />
            <div
                style={{ position: "relative", width: "100%", top: "20px" }}
            ></div>
        </div>
    );
};
export default PageClearentEdit;
