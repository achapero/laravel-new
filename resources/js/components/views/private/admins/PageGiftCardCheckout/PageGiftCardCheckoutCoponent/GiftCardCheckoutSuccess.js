import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Form,
    InputGroupAddon,
    InputGroupText,
    InputGroup
} from "reactstrap";
import moment from "moment";
const GiftCardCheckoutSuccess = ({ data, dataMerchantName }) => {
    return (
        <div className="GiftCardCheckout" style={{ overflow: "hidden" }}>
            <Row style={{ padding: "20px" }}>
                <Col md={3}></Col>
                <Col md={6}>
                    <Card
                        style={{
                            marginTop: "20px",
                            paddingTop: "50px",
                            paddingBottom: "50px",
                            paddingRight: "20px",
                            paddingLeft: "20px",
                            fontSize: "16px"
                        }}
                    >
                        <Row>
                            <Col>
                                <h1 style={{ fontWeight: "bolder" }}>
                                    New Gift Card Purchase
                                </h1>
                                <br></br>
                                <p style={{ fontSize: "14px" }}>
                                    {moment().format("LLL")}
                                </p>
                                <br></br>
                                <p>
                                    Here is a summary of the recent order. If
                                    you have any questions or concerns about the
                                    order, please contact us.
                                </p>
                            </Col>
                        </Row>
                        <br></br>
                        <Row>
                            <Col>
                                <table
                                    style={{
                                        width: "100%"
                                    }}
                                    className="table-gift-success"
                                >
                                    <tbody>
                                        <tr>
                                            <th style={{ width: "60%" }}>
                                                Product
                                            </th>
                                            <th>Amount</th>
                                        </tr>
                                        <tr>
                                            <td style={{ width: "60%" }}>
                                                {" "}
                                                {dataMerchantName} Gift Card
                                            </td>
                                            <td>${data.amount}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ width: "60%" }}>
                                                {" "}
                                                Total
                                            </td>
                                            <td>${data.amount}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <br></br>
                        <br></br>
                        <Row>
                            <Col style={{ fontWeight: "bold" }}>
                                Customer Details
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                Name:{" "}
                                {data.billTo.first_name +
                                    " " +
                                    data.billTo.last_name}{" "}
                            </Col>
                        </Row>
                        <Row>
                            <Col>Email: {data.customer.email} </Col>
                        </Row>
                        <br></br>
                        <br></br>
                        <Row>
                            <Col>
                                <p style={{ fontWeight: "bold" }}>
                                    Delivery Address
                                </p>
                                <p>
                                    {data.shipTo.first_name}{" "}
                                    {data.shipTo.last_name} <br></br>
                                    {data.shipTo.address} <br></br>
                                    {data.shipTo.city} , {data.shipTo.state}
                                    {data.shipTo.zip}
                                </p>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col md={3}></Col>
            </Row>
        </div>
    );
};

export default GiftCardCheckoutSuccess;
