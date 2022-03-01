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
    Modal
} from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../../providers/arrayColumn";
import { number_format } from "../../../../../providers/number_format";
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
const PagePaysafeBatchDetailModal = ({
    showTransactionsModal,
    toggleTransactionsModal,
    transactionList,
    setShowTransactionsModal
}) => {
    return (
        <>
            <Modal
                visible={showTransactionsModal}
                onCancel={() => {
                    setShowTransactionsModal(false);
                }}
                width={850}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowTransactionsModal(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Transactions"
            >
                <Row>
                    <Col md={24}>
                        <div className="table-responsive">
                            <Table
                                rowKey={record => record.id}
                                dataSource={
                                    transactionList.length != 0 &&
                                    transactionList
                                }
                                pagination={{ pageSize: 50 }}
                            >
                                <Table.Column
                                    dataIndex="reference_code"
                                    key="reference_code"
                                    title="Reference Code"
                                />
                                <Table.Column
                                    dataIndex="transaction_type"
                                    key="transaction_type"
                                    title="Transaction Type"
                                />
                                <Table.Column
                                    dataIndex="cashier"
                                    key="cashier"
                                    title="Cashier"
                                />
                                <Table.Column
                                    dataIndex="processed_date"
                                    key="processed_date"
                                    title="Processed Date"
                                    render={(text, record) => {
                                        return record.processed_date
                                            ? moment(
                                                  record.processed_date
                                              ).format("YYYY-MM-DD hh:mm:ss A")
                                            : "Not Processed";
                                    }}
                                />
                                <Table.Column
                                    dataIndex="amount"
                                    key="amount"
                                    title="Amount"
                                    render={(text, record) => {
                                        return `$${parseFloat(
                                            record.amount
                                        ).toFixed(2)}`;
                                    }}
                                />
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PagePaysafeBatchDetailModal;
