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

const TabBDisclosure = ({
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
                    Bank Disclosure
                    <span
                        style={{
                            position: "relative",
                            top: "3px",
                            marginLeft: "10px"
                        }}
                    >
                        {signatureTabs.bDisclosure.isSigned ? (
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
                                bDisclosure: {
                                    ...signatureTabs.bDisclosure,
                                    isOpen: !signatureTabs.bDisclosure.isOpen
                                }
                            })
                        }
                        size="small"
                    >
                        {signatureTabs.bDisclosure.isOpen ? (
                            <span>
                                <i className="fa fa-eye-slash"></i> Hide
                            </span>
                        ) : (
                            <span>
                                <i className="fa fa-eye"></i> View
                            </span>
                        )}
                    </Button>
                    <Button
                        type="primary"
                        className="pull-right mr-1"
                        onClick={e => handleUpdatePdf(3)}
                        size="small"
                        style={{ marginRight: "5px" }}
                    >
                        <i
                            className="fa fa-download"
                            style={{ marginRight: 5 }}
                        ></i>{" "}
                        Download
                    </Button>
                </Col>
            </Row>
            {signatureTabs.bDisclosure.isOpen && (
                <Row gutter={24}>
                    <Col className="gutter-row" span={24}>
                        <div
                            style={{
                                maxHeight: "400px",
                                overflow: "auto",
                                marginTop: "20px"
                            }}
                            onScroll={e => handleScroll(e)}
                        >
                            <p
                                dangerouslySetInnerHTML={{
                                    __html:
                                        termsAndConditions.content &&
                                        termsAndConditions.content.find(
                                            p => p.typeID == 3
                                        ).text
                                }}
                            ></p>
                        </div>
                        <br></br>

                        <div className="text-center">
                            <Checkbox
                                checked={signatureTabs.bDisclosure.isSigned}
                                onClick={e => {
                                    setSignatureTabs({
                                        ...signatureTabs,
                                        bDisclosure: {
                                            ...signatureTabs.bDisclosure,
                                            isOpen: false,
                                            isSigned: true
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

export default TabBDisclosure;
