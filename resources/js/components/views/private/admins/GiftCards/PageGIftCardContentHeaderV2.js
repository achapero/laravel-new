import React, { useState, useEffect, useRef } from "react";
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
    DatePicker,
    Modal,
    Menu
} from "antd";
import { Link } from "react-router-dom";
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
    UserOutlined,
    ShoppingCartOutlined,
    TableOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

const PageGIftCardContentHeaderV2 = ({ giftId, history }) => {
    const { SubMenu } = Menu;

    const activeRoute = routeName => {
        let pathname = history.location.pathname;
        pathname = pathname.split("/");
        pathname = pathname[pathname.length - 1];
        return pathname === routeName ? "ant-menu-item-selected" : "";
    };

    return (
        <>
            <Menu
                style={{
                    minWidth: "250px",
                    textAlign: "left",
                    background: "#313339",
                    color: "#fff"
                }}
                mode="vertical"
                className="GCHeader"
            >
                <Menu.Item
                    key="dashboard"
                    className={activeRoute("dashboard")}
                    icon={<DashboardOutlined />}
                    style={{ color: "white" }}
                >
                    <Link
                        to={`/gc/gift-cards/${giftId}/dashboard`}
                        style={{ color: "white" }}
                    >
                        Dashboard
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="card-management"
                    className={activeRoute("card-management")}
                    icon={<CreditCardOutlined />}
                    style={{ color: "white" }}
                >
                    <Link
                        to={`/gc/gift-cards/${giftId}/card-management`}
                        style={{ color: "white" }}
                    >
                        Card Management
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="terminal-management"
                    className={activeRoute("terminal-management")}
                    icon={<ShoppingCartOutlined />}
                    style={{ color: "white" }}
                >
                    <Link
                        to={`/gc/gift-cards/${giftId}/terminal-management`}
                        style={{ color: "white" }}
                    >
                        Terminal Management
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="reports"
                    className={activeRoute("reports")}
                    icon={<TableOutlined />}
                    style={{ color: "white" }}
                >
                    <Link
                        to={`/gc/gift-cards/${giftId}/reports`}
                        style={{ color: "white" }}
                    >
                        Reports
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="data-management"
                    className={activeRoute("data-management")}
                    icon={<TableOutlined />}
                    style={{ color: "white" }}
                >
                    <Link
                        to={`/gc/gift-cards/${giftId}/data-management`}
                        style={{ color: "white" }}
                    >
                        Data Management
                    </Link>
                </Menu.Item>
                <Menu.Item
                    key="account-settings"
                    className={activeRoute("account-settings")}
                    icon={<SettingOutlined />}
                    style={{ color: "white" }}
                >
                    <Link
                        to={`/gc/gift-cards/${giftId}/account-settings`}
                        style={{ color: "white" }}
                    >
                        Account Settings
                    </Link>
                </Menu.Item>

                {/* <Menu.Item
                    key="logs"
                    className={activeRoute("logs")}
                    icon={<UnorderedListOutlined />}
                    style={{ color: "white" }}
                >
                    <Link
                        to={`/gc/gift-cards/${giftId}/logs`}
                        style={{ color: "white" }}
                    >
                        Logs
                    </Link>
                </Menu.Item> */}
            </Menu>
        </>
    );
};
export default PageGIftCardContentHeaderV2;
