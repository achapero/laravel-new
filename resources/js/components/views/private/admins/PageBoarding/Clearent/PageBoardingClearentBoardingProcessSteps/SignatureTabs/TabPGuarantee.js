import React, { useEffect, useState } from "react";
import {
    Form,
    notification,
    Button,
    Modal,
    List,
    Typography,
    Divider,
    Collapse,
    Checkbox,
    Row,
    Col,
    Card
} from "antd";

import { LeftOutlined, CheckCircleOutlined } from "@ant-design/icons";

const TabPGuarantee = ({
    termsAndConditions,
    signatureTabs,
    setSignatureTabs,
    merchantNumber,
    handleUpdatePdf
}) => {
    const [onBottom, setOnBottom] = useState(false);

    const handleScroll = e => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight;
        if (bottom) {
            setOnBottom(true);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            <Row gutter={24}>
                <Col className="gutter-row" span={12}>
                    Personal Guarantee
                    <span
                        style={{
                            position: "relative",
                            top: "3px",
                            marginLeft: "10px"
                        }}
                    >
                        {signatureTabs.pGuarantee.isSigned ? (
                            <CheckCircleOutlined style={{ fontSize: 18 }} />
                        ) : (
                            <LeftOutlined style={{ fontSize: 18 }} />
                        )}
                    </span>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Button
                        className="pull-right"
                        type="primary"
                        onClick={e =>
                            setSignatureTabs({
                                ...signatureTabs,
                                pGuarantee: {
                                    ...signatureTabs.pGuarantee,
                                    isOpen: !signatureTabs.pGuarantee.isOpen
                                }
                            })
                        }
                        size="small"
                    >
                        {signatureTabs.pGuarantee.isOpen ? (
                            <span>
                                <i className="fa fa-eye-slash"></i> Hide
                            </span>
                        ) : (
                            <span>
                                <i className="fa fa-eye"></i> View
                            </span>
                        )}
                    </Button>
                </Col>
            </Row>
            {signatureTabs.pGuarantee.isOpen && (
                <Row gutter={24}>
                    <Col className="gutter-row" span={24}>
                        <div
                            className="text-center"
                            style={{ marginTop: "20px" }}
                        >
                            <Checkbox
                                checked={signatureTabs.pGuarantee.isSigned}
                                onClick={e => {
                                    setSignatureTabs({
                                        ...signatureTabs,
                                        pGuarantee: {
                                            ...signatureTabs.pGuarantee,
                                            isOpen: false,
                                            isSigned: true
                                        },
                                        w9: {
                                            ...signatureTabs.w9,
                                            isOpen: true
                                        }
                                    });
                                }}
                            >
                                {" "}
                                By clicking the submit button, you acknowledge
                                that you have read, <br></br>
                                understood and agree to the statements set forth
                                above.
                            </Checkbox>
                        </div>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default TabPGuarantee;
