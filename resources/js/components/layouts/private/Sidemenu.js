import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Drawer, Button, Divider } from "antd";

export default function Sidemenu({
    history,
    state,
}) {
    const { SubMenu } = Menu;

    return (
        <>
            <Layout.Sider
                trigger={null}
                collapsible={false}
                collapsed={state.collapsed}
                className="sidemenuDark"
                key="desktop"
                style={{
                    height: "100vh",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0
                }}
            >
                <div className="sideMenuLogo">
                    <b style={{ color: "#20a8d8" }}>
                        {process.env.MIX_APP_NAME}
                    </b>
                </div>

                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    defaultOpenKeys={['dashboard']}
                >
                    <Menu.Item
                        key="dashboard"
                    >
                        <Link
                            to="/dashboard"
                        >
                            Dashboard
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        key="profiles"
                    >
                        <Link
                            to="/profiles"
                        >
                            Profiles
                        </Link>
                    </Menu.Item>
                </Menu>

            </Layout.Sider>
        </>
    );
}
