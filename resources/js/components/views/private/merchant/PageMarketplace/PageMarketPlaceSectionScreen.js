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

const PageMarketPlaceSectionScreen = ({ history }) => {
    const downloadSoundPack = () => {
        FileSaver.saveAs(
            window.location.origin +
                "/assets/pdf/2020-POSP-Touch-Dynamic-Flyer.pdf",
            "2020-POSP-Touch-Dynamic-Flyer.pdf"
        );

        // //console.log(res);
    };
    const downloadSoundPack1 = () => {
        FileSaver.saveAs(
            window.location.origin +
                "/assets/pdf/2020-POSP-Clientron-Flyer.pdf",
            "2020-POSP-Clientron-Flyer.pdf"
        );
    };
    const downloadSoundPack2 = () => {
        FileSaver.saveAs(
            window.location.origin + "/assets/pdf/2020-POSP-Dell-Flyer.pdf",
            "2020-POSP-Dell-Flyer.pdf"
        );
        // //console.log(res);
    };

    return (
        <>
            <div id="section-screens">
                <Card style={{ width: "80%", margin: "auto" }}>
                    <div
                        style={{
                            backgroundColor: "#A52A2A",
                            color: "white",
                            padding: "2px"
                        }}
                    >
                        <span className="print-pdf-class">
                            <Button
                                style={{
                                    backgroundColor: "#A52A2A",
                                    color: "white"
                                }}
                                onClick={e => downloadSoundPack1()}
                            >
                                <i className="fa fa-print" aria-hidden="true"></i>{" "}
                                Print Pdf
                            </Button>
                        </span>
                        <Title style={{ textAlign: "center", color: "white" }}>
                            Clientron Computers
                        </Title>
                    </div>

                    <div>
                        <Row className="row flex-column-reverse  flex-lg-row">
                            <Col xs={24} md={24} lg={14}>
                                <Row className="padding-screen-row">
                                    <Col xs={24} md={24} lg={12}>
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: "bold",
                                                    marginBottom: "10px",
                                                    color: "#A52A2A"
                                                }}
                                            >
                                                Clientron i5
                                            </div>
                                            <div>
                                                CPU i5-7200U 3.10 GHz, 15.6”
                                                LCD, Projected Capacitive Touch,
                                                True Flat, 8 GB Ram, M2 128 SSD,
                                                W10 IoT, 64 Bit, Aluminum Base,
                                                Power Supply, Fanless, 3 year
                                                warranty
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xs={24} md={24} lg={12}>
                                        <div
                                            style={{ marginBottom: "20px" }}
                                        ></div>
                                        <div>1 Device</div>
                                        <div>$1449 MSRP</div>
                                        <div>$45 Shipping</div>
                                        <div
                                            style={{
                                                color: "#A52A2A",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            $1494 Total
                                        </div>
                                    </Col>
                                </Row>
                                <Row
                                    className="padding-screen-row"
                                    style={{
                                        backgroundColor: "#cccccc"
                                    }}
                                >
                                    <Col xs={24} md={24} lg={12}>
                                        <div
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                                marginBottom: "10px",
                                                color: "#A52A2A"
                                            }}
                                        >
                                            Clientron i3
                                        </div>
                                        <div>
                                            CPU i3-7100U 2.40 GHz, 15.6” LCD,
                                            Projected Capacitive Touch, True
                                            Flat, 8 GB Ram, M2 128 SSD, W10 IoT,
                                            64 Bit, Aluminum Base, Power Supply,
                                            Fanless, 3 year warranty
                                        </div>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <div
                                            style={{ marginBottom: "20px" }}
                                        ></div>
                                        <div>1 Device</div>
                                        <div>$1249 MSRP</div>
                                        <div>$45 Shipping</div>
                                        <div
                                            style={{
                                                color: "#A52A2A",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            $1294 Total
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="padding-screen-row">
                                    <Col xs={24} md={24} lg={12}>
                                        <div
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                                marginBottom: "10px",
                                                color: "#A52A2A"
                                            }}
                                        >
                                            Clientron J4125
                                        </div>
                                        <div>
                                            CPU J4125 Quad-Core 2.0Ghz, 15.6”
                                            LCD, Projected Capacitive Touch,
                                            True Flat, 8 GB Ram, M2 128 SSD, W10
                                            IoT, 64 Bit, Aluminum Base, Power
                                            Supply, Fanless, 3 year warranty
                                        </div>
                                    </Col>
                                    <Col xs={24} md={24} lg={12}>
                                        <div
                                            style={{ marginBottom: "20px" }}
                                        ></div>
                                        <div>1 Device</div>
                                        <div>$1049 MSRP</div>
                                        <div>$45 Shipping</div>
                                        <div
                                            style={{
                                                color: "#A52A2A",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            $1094 Total
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <div>
                                    {" "}
                                    <img
                                        src={
                                            window.location.origin +
                                            "/assets/images/screen-image2.png"
                                        }
                                        style={{
                                            width: "100%",
                                            marginTop: "60px"
                                        }}
                                    ></img>
                                </div>
                                <div
                                    style={{
                                        color: "#A52A2A",
                                        textAlign: "center"
                                    }}
                                >
                                    {" "}
                                    <div style={{ fontSize: "15px" }}>
                                        {" "}
                                        INDUSTRIAL COMPUTERS
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: "bolder",
                                            fontSize: "15px"
                                        }}
                                    >
                                        LAST 7 YEARS ON AVERAGE
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row
                            // style={{
                            //     borderTop: "1px solid #b2b2b2",
                            //     borderBottom: "1px solid #b2b2b2"
                            // }}
                            gutter={4}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    marginTop: "30px"
                                }}
                            >
                                <Title>Instant Replacement Services</Title>
                            </div>
                            <Col xs={24} md={24} lg={4}></Col>
                            <Col xs={24} md={24} lg={8}>
                                <br></br>

                                <div
                                    style={{
                                        backgroundColor: "#20a8d8",
                                        padding: "15px",
                                        paddingLeft: "30px",
                                        color: "white"
                                    }}
                                >
                                    <div>
                                        <Title
                                            level={5}
                                            style={{ color: "white" }}
                                        >
                                            Instant Replacement Service - Next
                                            Day
                                        </Title>
                                    </div>
                                    <div>&#8226; Computer Replacement</div>
                                    <div>&#8226; Next Day Exchange</div>
                                    <div>&#8226; Includes Shipping</div>
                                    <div>&#8226; Upon signed Agreement</div>
                                    <div>&#8226; Up to 36 month coverage</div>
                                    <br></br>
                                    <div>
                                        <Title
                                            level={2}
                                            style={{ color: "white" }}
                                        >
                                            $14 / month
                                        </Title>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <Title
                                            level={4}
                                            style={{ color: "white" }}
                                        >
                                            for up to 36 Months
                                        </Title>
                                    </div>
                                </div>
                            </Col>
                            {/* <Col></Col> */}
                            <Col xs={24} md={24} lg={8}>
                                <br></br>

                                <div
                                    style={{
                                        backgroundColor: "#20a8d8",
                                        padding: "15px",
                                        paddingLeft: "30px",
                                        color: "white"
                                    }}
                                >
                                    <div>
                                        <Title
                                            level={5}
                                            style={{ color: "white" }}
                                        >
                                            Instant Replacement Service - Ground
                                        </Title>
                                    </div>
                                    <div>&#8226; Computer Replacement</div>
                                    <div>&#8226;Ground Exchange</div>
                                    <div>&#8226; Includes Shipping</div>
                                    <div>&#8226; Upon signed Agreement</div>
                                    <div>&#8226; Up to 36 month coverage</div>
                                    <br></br>
                                    <div>
                                        <Title
                                            level={2}
                                            style={{ color: "white" }}
                                        >
                                            $11 / month
                                        </Title>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <Title
                                            level={4}
                                            style={{ color: "white" }}
                                        >
                                            for up to 36 Months
                                        </Title>
                                    </div>
                                </div>
                                <br></br>
                            </Col>
                            <Col xs={24} md={24} lg={4}></Col>
                        </Row>
                    </div>
                </Card>
                <Card style={{ width: "80%", margin: "auto" }}>
                    <div
                        style={{
                            padding: "5px",
                            backgroundColor: "#A52A2A",
                            color: "white"
                        }}
                    >
                        <span className="print-pdf-class">
                            <Button
                                style={{
                                    backgroundColor: "#A52A2A",
                                    color: "white"
                                }}
                                onClick={e => downloadSoundPack2()}
                            >
                                <i className="fa fa-print" aria-hidden="true"></i>{" "}
                                Print Pdf
                            </Button>
                        </span>
                        <Title style={{ textAlign: "center", color: "white" }}>
                            Dell High Performance Premium Business Desktops
                        </Title>
                    </div>

                    <div style={{ padding: "15px" }}>
                        <Row className="row flex-column-reverse  flex-lg-row">
                            <Col xs={24} md={24} lg={14}>
                                <div
                                    style={{
                                        fontSize: "17px",
                                        marginTop: "30px",
                                        marginLeft: "20px"
                                    }}
                                >
                                    <div>
                                        <h3>Intel Core Quad-Core i5-2400</h3>
                                    </div>
                                    <div>
                                        - 3.1GHz (Turbo up to 3.4GHz) 6MB Cache
                                    </div>
                                    <div>
                                        - 8GB DDR3 Memory (Can add up 16GB)
                                    </div>
                                    <div>- 1TB 7200 rpm Hard Drive</div>
                                    <div>
                                        - Port: 10 x USB ports, 1 x RJ-45
                                        Gigabit Ethernet port, 1 x VGA port, 1 x
                                        serial port
                                    </div>
                                    <div>
                                        - Windows 10 Pro, Black/Grey, Power Cord
                                    </div>
                                    <div>
                                        - Does not come with Mouse, Keyboard,
                                        Monitor
                                    </div>
                                    <div>- Ideal for a Server</div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <div>
                                    {" "}
                                    <img
                                        src={
                                            window.location.origin +
                                            "/assets/images/screen-image3.png"
                                        }
                                        style={{
                                            width: "100%"
                                        }}
                                    ></img>
                                </div>
                            </Col>
                        </Row>

                        <Row
                            className="padding-screen-row"
                            style={{
                                backgroundColor: "#cccccc"
                            }}
                        >
                            <Col xs={24} md={24} lg={4}>
                                <div style={{ fontSize: "15px" }}>
                                    {" "}
                                    <div>1 Device</div>
                                    <div>$369 MSRP</div>
                                    <div>$30 Shipping</div>
                                    <div
                                        style={{
                                            color: "#A52A2A",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        $1394 Total
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <div style={{ fontSize: "15px" }}>
                                    <div>
                                        <h4>
                                            Additional 8GB DDR3 Memory $79.99
                                        </h4>
                                    </div>
                                    <div>
                                        Let Point of Success transfer your
                                        database, starting at $89 per hour
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={24} lg={10}>
                                <div
                                    style={{
                                        color: "#A52A2A",
                                        textAlign: "center"
                                    }}
                                >
                                    <div style={{ fontSize: "20px" }}>
                                        {" "}
                                        INDUSTRIAL COMPUTERS
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: "bolder",
                                            fontSize: "20px"
                                        }}
                                    >
                                        LAST 7 YEARS ON AVERAGE
                                    </div>
                                    <div style={{ color: "black" }}>
                                        Image to reflect Point of Success
                                        Programs Only
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <br></br>
                        <br></br>
                        <Row
                            style={
                                {
                                    // borderTop: "1px solid #b2b2b2",
                                    // borderBottom: "1px solid #b2b2b2"
                                }
                            }
                            gutter={4}
                        >
                            <div
                                style={{
                                    display: "inline",
                                    fontSize: "11px",
                                    paddingLeft: "60px",
                                    paddingRight: "60px"
                                }}
                            >
                                <span style={{ fontWeight: "bold" }}>
                                    Disclaimer:
                                </span>
                                <span>
                                    All computers are renewed. The picture does
                                    not represent the computer that will arrive.
                                    Renewed computers may have small scratches
                                    or dents. We do not guarantee your touch
                                    screen monitor will work as each
                                    manufacturer is different. Remote setup of
                                    the PC onsite is not part of the pricing.
                                    Please purchase our instance Replacement
                                    Service if you are not an IT person, this
                                    will ensure you are always running without
                                    issue.
                                </span>
                            </div>
                            <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    marginTop: "30px"
                                }}
                            >
                                <Title> Instant Replacement Services</Title>{" "}
                            </div>
                            <Col xs={24} md={24} lg={4}></Col>
                            <Col xs={24} md={24} lg={8}>
                                <br></br>

                                <div
                                    style={{
                                        backgroundColor: "#20a8d8",
                                        padding: "15px",
                                        paddingLeft: "30px",
                                        color: "white"
                                    }}
                                >
                                    <div>
                                        <Title
                                            level={5}
                                            style={{ color: "white" }}
                                        >
                                            Instant Replacement Service - Next
                                            Day
                                        </Title>
                                    </div>
                                    <div>&#8226; Computer Replacement</div>
                                    <div>&#8226; Next Day Exchange</div>
                                    <div>&#8226; Includes Shipping</div>
                                    <div>&#8226; Upon signed Agreement</div>
                                    <div>&#8226; Up to 36 month coverage</div>
                                    <br></br>
                                    <div>
                                        <Title
                                            level={2}
                                            style={{ color: "white" }}
                                        >
                                            $14 / month
                                        </Title>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <Title
                                            level={4}
                                            style={{ color: "white" }}
                                        >
                                            for up to 36 Months
                                        </Title>
                                    </div>
                                </div>
                            </Col>
                            {/* <Col></Col> */}
                            <Col xs={24} md={24} lg={8}>
                                <br></br>

                                <div
                                    style={{
                                        backgroundColor: "#20a8d8",
                                        padding: "15px",
                                        paddingLeft: "30px",
                                        color: "white"
                                    }}
                                >
                                    <div>
                                        <Title
                                            level={5}
                                            style={{ color: "white" }}
                                        >
                                            Instant Replacement Service - Ground
                                        </Title>
                                    </div>
                                    <div>&#8226; Computer Replacement</div>
                                    <div>&#8226;Ground Exchange</div>
                                    <div>&#8226; Includes Shipping</div>
                                    <div>&#8226; Upon signed Agreement</div>
                                    <div>&#8226; Up to 36 month coverage</div>
                                    <br></br>
                                    <div>
                                        <Title
                                            level={2}
                                            style={{ color: "white" }}
                                        >
                                            $11 / month
                                        </Title>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <Title
                                            level={4}
                                            style={{ color: "white" }}
                                        >
                                            for up to 36 Months
                                        </Title>
                                    </div>
                                </div>
                                <br></br>
                            </Col>
                            <Col xs={24} md={24} lg={4}></Col>
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
                                        "/marketplace/cash-drawers"
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

export default PageMarketPlaceSectionScreen;
