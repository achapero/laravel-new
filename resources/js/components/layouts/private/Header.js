import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Layout, Menu, Popover, Badge, Row, Col, Image } from "antd";
import {
    LogoutOutlined,
    SettingOutlined,
    SolutionOutlined,
    BellOutlined
} from "@ant-design/icons";

import getUserData from "../../providers/getUserData";
import useAxiosQuery from "../../providers/useAxiosQuery";

export default function Header({ state, toggle }) {
    let history = useHistory();
    const userdata = getUserData();

    useEffect(() => {
        // console.log("@header user", userdata);
        // socketio.on("message", message => {
        //     refetchNotif();
        // });
        return () => {};
    }, []);


    const handleLogout = e => {
        mutateLogout(
            { user_id: userdata.id },
            {
                onSuccess: res => {
                    if (res.success) {
                        if (e) {
                            e.preventDefault();
                        }
                        localStorage.viewas = false;
                        localStorage.removeItem("token");
                        localStorage.removeItem("userdata");
                        localStorage.removeItem("viewas");
                        location.href = window.location.origin;
                    }
                }
            }
        );
    };

    const { mutate: mutateLogout, isLoading: isLoadingLogout } = useAxiosQuery(
        "POST",
        "api/v1/logout",
        "logout"
    );


    return (
        <Layout.Header
            className="site-layout-background"
            style={{
                padding: 0,
                position: "fixed",
                zIndex: 99,
                width: "100%",
                boxShadow: "0px 0px 11px 0px rgba(105 107 112 / 60%)"
            }}
        >
            <Row gutter={24}>
                <Col xs={12} md={12}>
                </Col>
                <Col
                    xs={12}
                    md={12}
                    style={{ marginLeft: "-200px" }}
                    className="mobileLeft"
                >
                    <Menu
                        mode="horizontal"
                        style={{
                            float: "right",
                            marginLeft: "-500px",
                            borderBottom: "none"
                        }}
                    >
                        <Menu.SubMenu
                            key="user_activity"
                            title={
                                <SolutionOutlined
                                    style={{ fontSize: "22px" }}
                                />
                            }
                        >
                            asdasd
                        </Menu.SubMenu>

                        <Menu.SubMenu
                            key="notification"
                            title={
                                <Badge count={1}>
                                    <BellOutlined
                                        style={{ fontSize: "22px" }}
                                    />
                                </Badge>
                            }
                        >
                            asd
                        </Menu.SubMenu>

                        <Menu.SubMenu
                            key="img"
                            title={
                                <img
                                    src={window.location.origin +"/images/default.png"}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        marginBottom: "7px"
                                    }}
                                />
                            }
                        >
                            <Menu.Item
                                key="settings"
                                icon={<SettingOutlined />}
                            >
                                <Link to="/settings">Settings</Link>
                            </Menu.Item>
                            <Menu.Item icon={<LogoutOutlined />} key="/logout">
                                <Link
                                    to="#"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Col>
            </Row>
        </Layout.Header>
    );
}
