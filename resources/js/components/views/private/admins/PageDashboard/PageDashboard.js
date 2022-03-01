import React from "react";
import { Card, Col, Layout, Row } from "antd";
import Title from "antd/lib/typography/Title";
import { CheckOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";

const { Content } = Layout;

export default function PageDashboard({ history }) {
    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            <Card
                title="Dashboard"
            >
                <h1>Hellow World</h1>
            </Card>
        </Content>
    );
}
