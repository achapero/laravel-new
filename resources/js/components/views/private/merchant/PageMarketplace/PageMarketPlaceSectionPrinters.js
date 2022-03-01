import React, { useState, useEffect } from "react";
import FileSaver from "file-saver";
import {
    Card,
    Row,
    Col,
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Table,
    Button,
    Typography
} from "antd";
import { userInfo } from "os";

const { Title } = Typography;

const PageMarketPlaceSectionPrinters = ({ history }) => {
    const downloadSoundPack = () => {
        FileSaver.saveAs(
            window.location.origin +
                "/assets/pdf/2020-POSP-Touch-Dynamic-Flyer.pdf",
            "2020-POSP-Touch-Dynamic-Flyer.pdf"
        );

        // //console.log(res);
    };

    return (
        <>
            <div id="section-printers">
                <Card
                    style={{ width: "80%", margin: "auto", fontSize: "15px" }}
                >
                    <div
                        style={{
                            padding: "2px",
                            backgroundColor: "#20a8d8",
                            color: "white"
                        }}
                    >
                        <span className="print-pdf-class">
                            <Button
                                style={{
                                    backgroundColor: "#20a8d8",
                                    color: "white"
                                }}
                                onClick={e => downloadSoundPack()}
                            >
                                <i className="fa fa-print" aria-hidden="true"></i>{" "}
                                Print Pdf
                            </Button>
                        </span>
                        <Title style={{ textAlign: "center", color: "white" }}>
                            Printers
                        </Title>
                    </div>
                    <div style={{ padding: "15px" }}>
                        <Row className="row flex-column-reverse  flex-lg-row padding-printer-row">
                            <Col xs={24} md={24} lg={14}>
                                <Row>
                                    <Col>
                                        <div
                                            style={{
                                                fontSize: "17px",
                                                fontWeight: "bold",
                                                marginBottom: "10px",
                                                color: "#20a8d8"
                                            }}
                                        >
                                            Epson M30 Receipt Printer (LAN)
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={24} md={24} lg={12}>
                                        {" "}
                                        <div>&#8226; 3” Thermal </div>
                                        <div>&#8226; Black, LAN</div>
                                        <div>&#8226; 2 Year Warranty</div>
                                        <div>&#8226; Power Supply</div>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <div className="text-break">
                                            <div>1 Device</div>
                                            <div>$359 MSRP</div>
                                            <div>$30 Shipping</div>
                                            <div
                                                style={{
                                                    color: "#20a8d8",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                $389 Total
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                {" "}
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/printer-image1.png"
                                    }
                                    style={{
                                        width: "40%"
                                    }}
                                ></img>
                            </Col>
                        </Row>
                        <Row
                            className="row flex-column-reverse  flex-lg-row padding-printer-row"
                            style={{
                                backgroundColor: "#cccccc"
                            }}
                        >
                            <Col xs={24} md={24} lg={14}>
                                <Row>
                                    <Col>
                                        <div
                                            style={{
                                                fontSize: "17px",
                                                fontWeight: "bold",
                                                marginBottom: "10px",
                                                color: "#20a8d8"
                                            }}
                                        >
                                            Epson U220B Impact Printer (LAN)
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={24} md={24} lg={12}>
                                        {" "}
                                        <div>&#8226; Impact Printer </div>
                                        <div>&#8226; Black, LAN</div>
                                        <div>&#8226; 2 Year Warranty </div>
                                        <div>&#8226; Power Supply</div>
                                        <div>&#8226; Used for Kitchen/Bar</div>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <div className="text-break">
                                            <div>1 Device</div>
                                            <div>$359 MSRP</div>
                                            <div>$30 Shipping</div>
                                            <div
                                                style={{
                                                    color: "#20a8d8",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                $389 Total
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/printer-image2.png"
                                    }
                                    style={{
                                        width: "40%"
                                    }}
                                ></img>
                            </Col>
                        </Row>
                        <Row className="row flex-column-reverse  flex-lg-row padding-printer-row">
                            <Col xs={24} md={24} lg={14}>
                                <Row>
                                    <Col>
                                        <div
                                            style={{
                                                fontSize: "17px",
                                                fontWeight: "bold",
                                                marginBottom: "10px",
                                                color: "#20a8d8"
                                            }}
                                        >
                                            Epson TM-T20 Receipt Printer (LAN)
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col xs={24} md={24} lg={12}>
                                        {" "}
                                        <div>&#8226; 3” Thermal </div>
                                        <div>&#8226; Black, LAN</div>
                                        <div>&#8226; 2 Year Warranty</div>
                                        <div>&#8226; Power Supply</div>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <div className="text-break">
                                            <div>1 Device</div>
                                            <div>$359 MSRP</div>
                                            <div>$30 Shipping</div>
                                            <div
                                                style={{
                                                    color: "#20a8d8",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                $389 Total
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/printer-image3.png"
                                    }
                                    style={{
                                        width: "40%"
                                    }}
                                ></img>
                            </Col>
                        </Row>
                        <br></br>
                        <br></br>
                        <Row>
                            <Col xs={24} md={24} lg={24}>
                                <div
                                    style={{
                                        color: "#20a8d8",
                                        textAlign: "right"
                                    }}
                                >
                                    <div style={{ fontSize: "20px" }}>
                                        {" "}
                                        EPSON PRINTERS
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: "bolder",
                                            fontSize: "20px"
                                        }}
                                    >
                                        LAST 7 YEARS ON AVERAGE
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col
                                style={{
                                    textAlign: "right",
                                    textDecoration: "underline",
                                    fontSize: "13px"
                                }}
                            >
                                <a
                                    href={
                                        window.location.origin +
                                        "/marketplace/terminals"
                                    }
                                >
                                    Next page {">>"}
                                </a>
                            </Col>
                        </Row> */}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default PageMarketPlaceSectionPrinters;
