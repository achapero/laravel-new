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

const PageMarketPlaceSectionDrawer = ({ history }) => {
    const downloadSoundPack = () => {
        FileSaver.saveAs(
            window.location.origin +
                "/assets/pdf/2020-POSP-Clientron-Flyer.pdf",
            "2020-POSP-Clientron-Flyer.pdf"
        );

        // //console.log(res);
    };

    return (
        <>
            <div id="section-cashdrawers">
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
                            Cash Drawer
                        </Title>
                    </div>
                    <div style={{ padding: "15px" }}>
                        <Row className=" flex-column-reverse  flex-lg-row padding-cashdrawer-row">
                            <Col xs={24} md={24} lg={14}>
                                <Row>
                                    <Col xs={24} md={24} lg={14}>
                                        {" "}
                                        <div>
                                            &#8226; 16” x 16”, 5 Bill slots, 8
                                            Coin slots{" "}
                                        </div>
                                        <div>&#8226; Black, Aluminum</div>
                                        <div>&#8226; 1 Year Warranty</div>
                                        <div>
                                            &#8226; Stackable with extra cable
                                            (maximum two)
                                        </div>
                                    </Col>
                                    <Col xs={24} md={24} lg={10}>
                                        <div className="text-break">
                                            <div>1 Device</div>
                                            <div>$139 MSRP</div>
                                            <div>$30 Shipping</div>
                                            <div
                                                style={{
                                                    color: "#20a8d8",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                $179 Total
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={8}>
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/cashdrawer-image1.png"
                                    }
                                    style={{
                                        width: "100%"
                                    }}
                                ></img>
                            </Col>
                            <Col></Col>
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
                                        "/marketplace/printers"
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

export default PageMarketPlaceSectionDrawer;
