import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Table,
    Input,
    Divider,
    Popconfirm,
    notification,
    Modal,
    Typography
} from "antd";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../../../providers/arrayColumn";
import { number_format } from "../../../../../../providers/number_format";
import moment from "moment";
import { CSVLink } from "react-csv";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined
} from "@ant-design/icons";
const PagePaysafeDepositDetailAllModal = ({
    toggleModalDepositAllDetail,
    setShowModalDepositAllDetail,
    merchant_number,
    depositModalAllRecord,
    showModalDepositAllDetail
}) => {
    return (
        <>
            <Modal
                visible={showModalDepositAllDetail}
                onCancel={() => {
                    setShowModalDepositAllDetail(false);
                }}
                width={850}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowModalDepositAllDetail(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Deposits Detail"
            >
                <Row>
                    <Col md={24}>
                        <div
                            style={{
                                backgroundColor: "#20a8d8",
                                padding: "5px",
                                fontSize: "15px",
                                fontWeight: "bold",
                                color: "white"
                            }}
                        >
                            ACH LISTING
                        </div>
                        {depositModalAllRecord && (
                            <table
                                className="depositModalTableRight"
                                style={{ width: "100%" }}
                            >
                                <tr style={{ fontWeight: "bold" }}>
                                    <td>Merchant Number</td>
                                    <td>Ach Date</td>
                                    <td>Transmission Date</td>
                                    <td>Trace Number</td>
                                    <td>DDA Amount</td>
                                    <td>TR Amount</td>
                                    <td>Amount</td>
                                </tr>

                                <tr>
                                    <td>
                                        {depositModalAllRecord.merchant_number}
                                    </td>
                                    <td>
                                        {moment(
                                            depositModalAllRecord.ach_date
                                        ).format("L")}
                                    </td>
                                    <td>
                                        {moment(
                                            depositModalAllRecord.transmission_date
                                        ).format("L")}
                                    </td>
                                    <td>
                                        {depositModalAllRecord.trace_number}
                                    </td>
                                    <td>{depositModalAllRecord.dda_number}</td>
                                    <td>{depositModalAllRecord.tr_number}</td>
                                    <td>${depositModalAllRecord.amount}</td>
                                </tr>
                            </table>
                        )}
                    </Col>
                </Row>
                <br />
                <Row gutter={8}>
                    <Col md={10}>
                        <div
                            style={{
                                backgroundColor: "#20a8d8",
                                padding: "5px",
                                fontSize: "15px",
                                fontWeight: "bold",
                                color: "white"
                            }}
                        >
                            Batches and Adjustment
                        </div>

                        <table
                            className="depositModalTableRight"
                            style={{ width: "100%" }}
                        >
                            <tr style={{ width: "100%" }}>
                                <td>Date</td>
                                <td>Description</td>
                                <td>Amount</td>
                            </tr>

                            <tr>
                                <td>---</td>
                                <td>---</td>
                                <td>---</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Batch Total:</td>
                                <td>---</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    Batches and Adjustments <br></br> Total:
                                    <br></br>
                                </td>
                                <td>---</td>
                            </tr>
                            <br></br>
                        </table>
                    </Col>
                    <Col md={14}>
                        <div
                            style={{
                                backgroundColor: "#20a8d8",
                                padding: "5px",
                                fontSize: "15px",
                                fontWeight: "bold",
                                color: "white"
                            }}
                        >
                            Deposit Reconciliation
                        </div>

                        <table
                            className="depositModalTableRight"
                            style={{ width: "100%" }}
                        >
                            <tr>
                                <td>---</td>
                                <td>Batches and Adjustment Total</td>
                            </tr>
                            <tr>
                                <td>---</td>
                                <td>Discount/Interchange</td>
                            </tr>
                            <tr>
                                <td>---</td>
                                <td>Net Deposit</td>
                            </tr>
                            <tr>
                                <td>---</td>
                                <td>Non-Settled (Amex ESA)</td>
                            </tr>
                            <tr>
                                <td>
                                    {" "}
                                    <h4>---</h4>
                                </td>
                                <td>
                                    <Typography.Title level={5}>
                                        Net Total ACH Activity to Merchant
                                    </Typography.Title>
                                </td>
                            </tr>
                        </table>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PagePaysafeDepositDetailAllModal;
