import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Table,
    Popconfirm,
    Divider,
    notification,
    Image,
    Tooltip,
    Drawer,
    Space,
    Select,
    Alert,
    Form,
    Modal,
    Button
} from "antd";
import { Content } from "antd/lib/layout/layout";

const FormThankyou = () => {
    return (
        <div className="app flex-row align-items-center pointofsuccess">
            <Content
                className="site-layout-background"
                style={{
                    margin: "24px 16px",
                    minHeight: 280,
                    background: "transparent"
                }}
            >
                <Row gutter={24}>
                    <Col span={8} offset={8}>
                        <Card className="text-center">
                            <h1>
                                {" "}
                                Thank you for this PAN Submission, it usually
                                takes the process up to 24 hrs, please check
                                back then
                            </h1>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </div>
    );
};

export default FormThankyou;
