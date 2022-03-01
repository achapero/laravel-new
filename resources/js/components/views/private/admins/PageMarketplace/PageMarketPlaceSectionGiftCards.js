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

const PageMarketPlaceSectionGiftCards = ({ history }) => {
    const downloadSoundPack = () => {
        FileSaver.saveAs(
            window.location.origin +
                "/assets/pdf/2020-POSP-Gift-Card-Flyer.pdf",
            "2020-POSP-Gift-Card-Flyer.pdf"
        );

        // //console.log(res);
    };

    return (
        <>
            <div id="section-giftcards">
                <Card
                    style={{ width: "80%", margin: "auto", fontSize: "17px" }}
                >
                    {/* <div style={{ position: "absolute", right: "0" }}>
                        <img
                            src={
                                window.location.origin +
                                "/assets/images/giftcard-header.png"
                            }
                            style={{
                                width: "20%"
                            }}
                        ></img>
                    </div> */}
                    <div
                        style={{
                            padding: "2px",
                            backgroundColor: "#4dbd74",
                            color: "white"
                        }}
                    >
                        <span className="print-pdf-class">
                            <Button
                                style={{
                                    backgroundColor: "#4dbd74",
                                    color: "white"
                                }}
                                onClick={e => downloadSoundPack()}
                            >
                                <i className="fa fa-print" aria-hidden="true"></i>{" "}
                                Print Pdf
                            </Button>
                        </span>
                        <Title style={{ textAlign: "center", color: "white" }}>
                            Gift Cards
                        </Title>
                    </div>
                    <div style={{ padding: "15px" }}>
                        <Row className="padding-giftcard-row " gutter={4}>
                            <Col xs={24} md={24} lg={16}>
                                <Row className=" ">
                                    <Col xs={24} md={24} lg={6}>
                                        <img
                                            src={
                                                window.location.origin +
                                                "/assets/images/giftcard-image1.png"
                                            }
                                            style={{
                                                width: "100%"
                                            }}
                                        ></img>
                                    </Col>
                                    <Col xs={24} md={24} lg={18}>
                                        <Row>
                                            <Col>
                                                <div
                                                    className="div-center"
                                                    style={{
                                                        padding: "6px",
                                                        backgroundColor:
                                                            "#4dbd74",
                                                        width: "180px",
                                                        color: "white",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    Stock Gift Cards
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
                                                    Stock Gift Cards are shipped
                                                    with what is available in
                                                    our inventory, we can not
                                                    guarantee one card design or
                                                    the other.
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row className="divider-border">
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",
                                                        marginTop: "10px",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    100 Cards
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    $0.75/card
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    $10 Shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    $85 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24} lg={6}>
                                        <img
                                            src={
                                                window.location.origin +
                                                "/assets/images/giftcard-image2.png"
                                            }
                                            style={{
                                                width: "100%"
                                            }}
                                        ></img>
                                        <img
                                            src={
                                                window.location.origin +
                                                "/assets/images/giftcard-image3.png"
                                            }
                                            style={{
                                                width: "100%"
                                            }}
                                        ></img>
                                    </Col>
                                    <Col xs={24} md={24} lg={18}>
                                        <Row>
                                            <Col>
                                                <div
                                                    className="div-center"
                                                    style={{
                                                        padding: "6px",
                                                        backgroundColor:
                                                            "#4dbd74",
                                                        width: "180px",
                                                        color: "white",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    Custom Gift Cards
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
                                                    Stock Gift Cards are shipped
                                                    with what is available in
                                                    our inventory, we can not
                                                    guarantee one card design or
                                                    the other.
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",
                                                        marginTop: "10px",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    100 Cards
                                                </p>
                                            </Col>

                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    $10 Shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    $266.00 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",

                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    250 cards
                                                </p>
                                            </Col>

                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $10 Shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $371.00 MSRP
                                                </p>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",

                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    500 cards
                                                </p>
                                            </Col>

                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $17 shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $403.00 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",

                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    1000 cards
                                                </p>
                                            </Col>

                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $25 shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $661.00 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",

                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    2500 cards
                                                </p>
                                            </Col>

                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $40 shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $1326.00 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",

                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    5000 cards
                                                </p>
                                            </Col>

                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $60 shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={8}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $2296.00 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <br></br>
                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    CUSTOM SLEEVES AND GIFT CARD
                                                    RACK AVAILABLE
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    ask your Success
                                                    representative if
                                                    interested.
                                                </div>
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col>
                                                <div
                                                    className="div-center"
                                                    style={{
                                                        padding: "6px",
                                                        backgroundColor:
                                                            "#4dbd74",
                                                        width: "250px",
                                                        color: "white",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    Reorders of Existing designs
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",
                                                        marginTop: "20px",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    250 cards
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "20px"
                                                    }}
                                                >
                                                    $325 cards
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "20px"
                                                    }}
                                                >
                                                    $10 Shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px",
                                                        marginTop: "20px"
                                                    }}
                                                >
                                                    $335 MSR
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",

                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    500 cards
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $325 cards
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $17 shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $367 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontWeight: "bold",
                                                        color: "#4dbd74",

                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    1000 cards
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $600 cards
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $25 shipping
                                                </p>
                                            </Col>
                                            <Col xs={24} md={24} lg={6}>
                                                <p
                                                    style={{
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    $625 MSRP
                                                </p>
                                            </Col>
                                        </Row>
                                        <br></br>
                                    </Col>
                                </Row>
                            </Col>
                            <Col
                                xs={24}
                                md={24}
                                lg={8}
                                style={{ fontSize: "18px" }}
                            >
                                <div
                                    style={{
                                        padding: "15px",
                                        backgroundColor: " #4dbd74",
                                        color: "white"
                                    }}
                                >
                                    {" "}
                                    35% OFF ALL GIFT CARD BALANCES ARE NEVER
                                    USED, this means selling more gift cards is
                                    your best advertising and your most
                                    profitable.
                                </div>
                                <br></br>
                                <div
                                    style={{
                                        padding: "15px",
                                        border: "1px solid #4dbd74 ",
                                        color: "#4dbd74 "
                                    }}
                                >
                                    {" "}
                                    Use gift cards for more than patron
                                    purchases, load them with $5 and hand them
                                    out to VIP patrons as surprises or to hotel
                                    front desk to promote your business more,
                                    the plastic cards only advertise your
                                    location!
                                </div>
                            </Col>
                        </Row>
                        <Row className="padding-giftcard-row ">
                            <Col xs={24} md={24} lg={4}></Col>
                            <Col
                                xs={24}
                                md={24}
                                lg={16}
                                style={{ fontSize: "13px" }}
                            >
                                The Point of Success Gift Card Service is
                                included when using POSPay Processing. If you
                                are interested in saving money over your gift
                                card current service inquire with a Success
                                representative. They will ask for your username
                                and password to your current service in order to
                                view the liability report and see if it can be
                                transferred without cost to you, in most cases
                                this is possible. Remember, the Point of Success
                                Gift Card Service allows you to retain your data
                                at no cost, we firmly believe that your gift
                                card information should be yours for the life of
                                the relationship
                            </Col>
                            <Col xs={24} md={24} lg={4}></Col>
                        </Row>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default PageMarketPlaceSectionGiftCards;
