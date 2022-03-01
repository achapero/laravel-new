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

const TabEsign = ({
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
        <div style={{ width: "100%", height: "auto" }}>
            <Row gutter={24}>
                <Col className="gutter-row" span={12}>
                    Electronic Signatures and Records Disclosure
                    <span
                        style={{
                            position: "relative",
                            top: "3px",
                            marginLeft: "10px"
                        }}
                    >
                        {signatureTabs.eSign.isSigned ? (
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
                                eSign: {
                                    ...signatureTabs.eSign,
                                    isOpen: !signatureTabs.eSign.isOpen
                                }
                            })
                        }
                        size="small"
                    >
                        {signatureTabs.eSign.isOpen ? (
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
                        size="small"
                        onClick={e => handleUpdatePdf(8)}
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
            {signatureTabs.eSign.isOpen && (
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
                                            p => p.typeID == 8
                                        ).text
                                }}
                            ></p>
                        </div>
                        <br></br>

                        {onBottom && (
                            <div className="text-center">
                                <Checkbox
                                    checked={signatureTabs.eSign.isSigned}
                                    onClick={e => {
                                        setSignatureTabs({
                                            ...signatureTabs,
                                            eSign: {
                                                ...signatureTabs.eSign,
                                                isOpen: false,
                                                isSigned: true
                                            },
                                            mAccept: {
                                                ...signatureTabs.mAccept,
                                                isOpen: true
                                            }
                                        });
                                    }}
                                >
                                    {" "}
                                    By clicking the submit button, you
                                    acknowledge that you have read, <br></br>
                                    understood and agree to the statements set
                                    forth above.
                                </Checkbox>
                            </div>
                        )}
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default TabEsign;
