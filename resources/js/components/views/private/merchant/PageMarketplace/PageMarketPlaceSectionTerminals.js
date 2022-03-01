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
                "/assets/pdf/2020-POSP-Credit-Card-Flyer.pdf",
            "2020-POSP-Credit-Card-Flyer.pdf"
        );

        // //console.log(res);
    };
    return (
        <>
            <div id="section-terminals">
                <Card
                    style={{ width: "80%", margin: "auto", fontSize: "17px" }}
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
                            Credit Card Terminals{" "}
                        </Title>
                    </div>
                    <div style={{ padding: "15px" }}>
                        <Row className="padding-terminal-row  ">
                            <Col xs={24} md={24} lg={24}>
                                <p style={{ fontSize: "13px" }}>
                                    All VX terminals are contactless and are
                                    able to accept Apple Pay and Google Pay as
                                    well as other mobile wallets.
                                </p>
                            </Col>
                        </Row>
                        <Row className="padding-terminal-row  ">
                            <Col xs={24} md={24} lg={4}>
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/terminal-image1.png"
                                    }
                                    style={{
                                        width: "70%"
                                    }}
                                ></img>
                            </Col>
                            <Col xs={24} md={24} lg={16}>
                                <Row>
                                    <Col>
                                        <div
                                            className="div-center"
                                            style={{
                                                padding: "6px",
                                                backgroundColor: "#20a8d8",
                                                width: "180px",
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            VX805 - EMV Pin Pad{" "}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            The VX805 comes with a USB cord that
                                            is powered by the computer and no
                                            extra cords are needed.
                                        </p>
                                    </Col>
                                </Row>
                                <Row className="divider-border">
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontWeight: "bold",
                                                color: "#20a8d8",
                                                marginTop: "10px",
                                                fontSize: "13px"
                                            }}
                                        >
                                            1 Device
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $199 MSRP
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $20 Shipping
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "bold",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $219 Total
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={4}></Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={4}></Col>
                        </Row>
                        <Row className="padding-terminal-row ">
                            <Col xs={24} md={24} lg={4}>
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/terminal-image2.png"
                                    }
                                    style={{
                                        width: "100%"
                                    }}
                                ></img>
                            </Col>
                            <Col xs={24} md={24} lg={16}>
                                <Row>
                                    <Col>
                                        <div
                                            className="div-center"
                                            style={{
                                                padding: "6px",
                                                backgroundColor: "#20a8d8",
                                                width: "240px",
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            VX520 - EMV Backup terminal
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            This terminal is a fantastic backup
                                            solution if the internet fails, it
                                            has the option for a dial-up using
                                            your phone line.
                                        </p>
                                    </Col>
                                </Row>
                                <Row className="divider-border">
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontWeight: "bold",
                                                color: "#20a8d8",
                                                marginTop: "10px",
                                                fontSize: "13px"
                                            }}
                                        >
                                            1 Device
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $199 MSRP
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $20 Shipping
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "bold",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $219 Total
                                        </p>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Col>
                            <Col xs={12} md={12} lg={2}></Col>
                        </Row>
                        <Row className="padding-terminal-row  ">
                            <Col xs={24} md={24} lg={4}>
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/terminal-image3.png"
                                    }
                                    style={{
                                        width: "95%"
                                    }}
                                ></img>
                            </Col>
                            <Col xs={24} md={24} lg={16}>
                                <Row>
                                    <Col>
                                        <div
                                            className="div-center"
                                            style={{
                                                padding: "6px",
                                                backgroundColor: "#20a8d8",
                                                width: "240px",
                                                color: "white",
                                                textAlign: "center"
                                            }}
                                        >
                                            VX680 - 3G/LTE EMV Wireless
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            This terminal uses 3G/LTE services
                                            with Apriva, the cost is $25 per
                                            month, per terminal and will show on
                                            your merchant statement.
                                        </p>
                                    </Col>
                                </Row>
                                <Row className="divider-border">
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontWeight: "bold",
                                                color: "#20a8d8",
                                                marginTop: "10px",
                                                fontSize: "13px"
                                            }}
                                        >
                                            1 Device
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $299 MSRP
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $20 Shipping
                                        </p>
                                    </Col>
                                    <Col xs={24} md={24} lg={6}>
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "bold",
                                                marginTop: "10px"
                                            }}
                                        >
                                            $319 Total
                                        </p>
                                    </Col>
                                    <Col></Col>
                                </Row>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row className="padding-terminal-row">
                            <Col>
                                <p
                                    style={{
                                        fontSize: "18px",
                                        color: "#20a8d8",
                                        fontWeight: "bolder"
                                    }}
                                >
                                    How processing works between the banks and
                                    the POS
                                </p>
                            </Col>
                        </Row>
                        <Row className="padding-terminal-row">
                            <Col xs={24} md={24} lg={14}>
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/images/terminal-image4.png"
                                    }
                                    style={{
                                        width: "100%"
                                    }}
                                ></img>
                            </Col>
                            <Col xs={24} md={24} lg={8}>
                                <div
                                    style={{
                                        fontSize: "13px",
                                        backgroundColor: "#20a8d8",
                                        padding: "10px",
                                        color: "white",
                                        marginTop: "15px"
                                    }}
                                >
                                    The VX line by Verifone all come with a One
                                    (1) year warranty. Shipping is not included.
                                    All of these devices work for tip acceptance
                                    and the VX680 can be taken anywhere a driver
                                    goes for delivery
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={2}></Col>
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
                                        "/marketplace/gift-cards"
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
