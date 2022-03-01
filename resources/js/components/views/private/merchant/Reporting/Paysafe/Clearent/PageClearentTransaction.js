import React, { useState, useEffect, useRef } from "react";
import { Card, div, Row, Col, Input, Button, Table, Divider } from "antd";
import ContentHeader from "./PageClearentContentHeader";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
import { CSVLink } from "react-csv";
import moment from "moment";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    DashboardOutlined,
    ContainerOutlined,
    ReadOutlined,
    CreditCardOutlined,
    ReloadOutlined,
    UserOutlined,
    PrinterOutlined
} from "@ant-design/icons";
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PageClearentTransaction = ({ history, match }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [transactionList, setTransactionList] = useState([]);
    const [transactionListSearch, setTransactionListSearch] = useState([]);
    const userdata = getUserData();

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Clearent Transactions - " + moment().format("YYYY-MM-DD");

    const {
        data: dataGetTransaction,
        isLoading: isLoadingGetTransaction,
        refetch: refetchGetTransaction,
        isFetching: isFetchingGetTransaction
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/transactions/" + match.params.merchant_number,
        "table_clearent_transaction_" + match.params.merchant_number,
        res => {
            setTransactionList(res.data.merchantTransactions);
            setTransactionListSearch(res.data.merchantTransactions);
            console.log(res.data.merchantTransactions);
            let array_get = [];
            res.data.merchantBankDeposits.map((value, key) => {
                array_get.push({
                    "Settlement Date": value.settlementDate
                        ? moment(value.settlementDate).format("YYYY-MM-DD")
                        : "",
                    "Transation Date": value.transactionDate
                        ? moment(value.transactionDate).format("YYYY-MM-DD")
                        : "",
                    "Batch Number": value.batchNumber,
                    "Batch Received Date Time": value.batchReceivedDateTime
                        ? moment(value.batchReceivedDateTime).format(
                              "YYYY-MM-DD"
                          )
                        : "",
                    "Card Network": value.cardNetworkDescription,
                    "Card Number": value.cardNumberMasked,
                    "Acquirer Reference Number": value.acquirerReferenceNumber,
                    "Transaction Identifier": value.transactionIdentifier,
                    "Authorization Amount": value.authorizationAmount,
                    "Transaction Amount": value.transactionAmount,
                    "Interchange Fee": value.interchangeFee,
                    "Interchange Rate": value.interchangeRate,
                    "Interchange Amount": value.interchangeAmount,
                    "Qualification Level": value.qualificationLevelDescription,
                    "Capture Type": value.captureTypeDescription,
                    "Account Name": value.accountName,
                    "Order ID": value.orderID,
                    "Approval Code": value.approvalCode,
                    Invoice: value.invoice
                });
            });
            setCsvData(array_get);
        }
    );

    const HeaderReport = () => (
        <div
            style={{
                position: "relative",
                padding: 20,
                width: "600px",
                textAlign: "center",
                bordered: "1px"
            }}
        >
            <h1
                style={{ fontSize: "15px", width: "100%", textAlign: "center" }}
            >
                Clearent Transactions
            </h1>
        </div>
    );

    const exportPDF = () => {
        const htmlToConvert = renderToString(<HeaderReport />);
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);

        const headers = [
            [
                "Settlement Date",
                "Transation Date",
                "Batch Number",
                "Batch Received Date Time",
                "Card Network",
                "Card Number",
                "Acquirer Reference Number",
                "Transaction Identifier",
                "Authorization Amount",
                "Transaction Amount",
                "Interchange Fee",
                "Interchange Rate",
                "Interchange Amount",
                "Qualification Level",
                "Capture Type",
                "Account Name",
                "Order ID",
                "Approval Code",
                "Invoice"
            ]
        ];
        const data = csvData.map(elt => [
            elt["Settlement Date"],
            elt["Transation Date"],
            elt["Batch Number"],
            elt["Batch Received Date Time"],
            elt["Card Network"],
            elt["Card Number"],
            elt["Acquirer Reference Number"],
            elt["Transaction Identifier"],
            elt["Authorization Amount"],
            elt["Transaction Amount"],
            elt["Interchange Fee"],
            elt["Interchange Rate"],
            elt["Interchange Amount"],
            elt["Qualification Level"],
            elt["Capture Type"],
            elt["Account Name"],
            elt["Order ID"],
            elt["Approval Code"],
            elt["Invoice"]
        ]);

        let content = {
            startY: 80,
            head: headers,
            body: data
        };

        doc.html(htmlToConvert, {
            callback: function(doc) {
                doc.autoTable(content);
                doc.save(ExportFileName + ".pdf");
            }
        });
    };

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_account_clearent_transaction_table
            ? JSON.parse(
                  localStorage.column_settings_account_clearent_transaction_table
              )
            : [
                  { title: "Settlement Date", show: true },
                  { title: "Transation Date", show: true },
                  { title: "Batch Number", show: true },
                  { title: "Batch Received Date Time", show: true },
                  { title: "Card Network", show: true },
                  { title: "Card Number", show: true },
                  { title: "Acquirer Reference Number", show: true },
                  { title: "Transaction Identifier", show: true },
                  { title: "Authorization Amount", show: true },
                  { title: "Transaction Amount", show: true },
                  { title: "Interchange Fee", show: true },
                  { title: "Interchange Rate", show: true },
                  { title: "Interchange Amount", show: true },
                  { title: "Qualification Level", show: true },
                  { title: "Capture Type", show: true },
                  { title: "Account Name", show: true },
                  { title: "Order ID", show: true },
                  { title: "Approval Code", show: true },
                  { title: "Invoice", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_clearent_transaction_table_sort_column) {
            if (
                localStorage.account_clearent_transaction_table_sort_column ==
                column
            ) {
                return (
                    localStorage.account_clearent_transaction_table_sort_order +
                    "end"
                );
            }
        }

        return null;
    };

    const OpenSettings = () => {
        setShowTableColumnSettings({
            ...showTableColumnSettings,
            show: true
        });
    };

    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        if (searchText == "") {
            setTransactionList(transactionListSearch);
        } else {
            const filteredData = transactionList.filter(
                entry =>
                    entry.settlementDate.includes(searchText) ||
                    entry.transactionDate.includes(searchText) ||
                    entry.batchReceivedDateTime.includes(searchText) ||
                    entry.cardNetworkDescription.includes(searchText) ||
                    entry.cardNumberMasked.includes(searchText) ||
                    entry.acquirerReferenceNumber.includes(searchText) ||
                    entry.transactionIdentifier.includes(searchText) ||
                    entry.authorizationAmount.includes(searchText) ||
                    entry.transactionAmount.includes(searchText) ||
                    entry.interchangeFee.includes(searchText) ||
                    entry.interchangeRate.includes(searchText) ||
                    entry.interchangeAmount.includes(searchText) ||
                    entry.qualificationLevelDescription.includes(searchText) ||
                    entry.captureTypeDescription.includes(searchText) ||
                    entry.accountName.includes(searchText) ||
                    entry.orderID.includes(searchText) ||
                    entry.approvalCode.includes(searchText) ||
                    entry.invoice.includes(searchText)
            );
            setTransactionList(filteredData);
        }
    }, [searchText]);

    useEffect(() => {
        let array_get = [];
        transactionList.map((value, key) => {
            array_get.push({
                "Settlement Date": value.settlementDate
                    ? moment(value.settlementDate).format("YYYY-MM-DD")
                    : "",
                "Transation Date": value.transactionDate
                    ? moment(value.transactionDate).format("YYYY-MM-DD")
                    : "",
                "Batch Number": value.batchNumber,
                "Batch Received Date Time": value.batchReceivedDateTime
                    ? moment(value.batchReceivedDateTime).format("YYYY-MM-DD")
                    : "",
                "Card Network": value.cardNetworkDescription,
                "Card Number": value.cardNumberMasked,
                "Acquirer Reference Number": value.acquirerReferenceNumber,
                "Transaction Identifier": value.transactionIdentifier,
                "Authorization Amount": value.authorizationAmount,
                "Transaction Amount": value.transactionAmount,
                "Interchange Fee": value.interchangeFee,
                "Interchange Rate": value.interchangeRate,
                "Interchange Amount": value.interchangeAmount,
                "Qualification Level": value.qualificationLevelDescription,
                "Capture Type": value.captureTypeDescription,
                "Account Name": value.accountName,
                "Order ID": value.orderID,
                "Approval Code": value.approvalCode,
                Invoice: value.invoice
            });
        });
        setCsvData(array_get);
    }, [transactionList]);

    return (
        <div
            className=""
            id="clearentTransaction"
            style={{
                padding: "24px 16px"
            }}
        >
            <ContentHeader
                history={history}
                merchantNumber={match.params.merchant_number}
            />
            <div style={{ position: "relative", width: "100%", top: "20px" }}>
                <Row>
                    <Col md={24}>
                        <Card title="Transactions" bordered={false}>
                            <Row>
                                <Col md={8} xs={0}></Col>
                                <Col md={8} sm={0}></Col>
                                <Col md={8} sm={24}>
                                    <div style={{ display: "flex" }}>
                                        {" "}
                                        <Input.Search
                                            placeholder="Global Search"
                                            onChange={e =>
                                                setSearchText(e.target.value)
                                            }
                                        />
                                        <CSVLink
                                            data={csvData}
                                            filename={ExportFileName + ".csv"}
                                        >
                                            <Button
                                                icon={<FileExcelOutlined />}
                                            ></Button>
                                        </CSVLink>
                                        <Button
                                            icon={<PrinterOutlined />}
                                            onClick={() => exportPDF()}
                                        ></Button>
                                        <Button
                                            icon={<SettingOutlined />}
                                            style={{ marginLeft: "5px" }}
                                            onClick={() => OpenSettings()}
                                        ></Button>
                                    </div>
                                </Col>
                            </Row>
                            <Divider />

                            <div className="table-responsive">
                                <Table
                                    loading={
                                        isLoadingGetTransaction ||
                                        isFetchingGetTransaction
                                    }
                                    rowKey={record => record.id}
                                    dataSource={
                                        transactionList.length != 0
                                            ? transactionList
                                            : []
                                    }
                                    onChange={(
                                        pagination,
                                        filters,
                                        sorter,
                                        extra
                                    ) => {}}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Settlement Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="settlementDate"
                                            key="settlementDate"
                                            title="Settlement Date"
                                            render={(text, record) => {
                                                return moment(
                                                    record.settlementDate
                                                ).format("ll");
                                            }}
                                            sorter={(a, b) =>
                                                a.settlementDate.localeCompare(
                                                    b.settlementDate
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transation Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="transactionDate"
                                            key="transactionDate"
                                            title="Transation Date"
                                            render={(text, record) => {
                                                return moment(
                                                    record.transactionDate
                                                ).format("ll");
                                            }}
                                            sorter={(a, b) =>
                                                a.transactionDate.localeCompare(
                                                    b.transactionDate
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Batch Number"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="batchNumber"
                                            key="batchNumber"
                                            title="Batch Number"
                                            sorter={(a, b) =>
                                                a.batchNumber - b.batchNumber
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p =>
                                            p.title ==
                                            "Batch Received Date Time"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="batchReceivedDateTime"
                                            key="batchReceivedDateTime"
                                            title="Batch Received Date Time"
                                            render={(text, record) => {
                                                return moment(
                                                    record.batchReceivedDateTime
                                                ).format("lll");
                                            }}
                                            sorter={(a, b) =>
                                                a.batchReceivedDateTime.localeCompare(
                                                    b.batchReceivedDateTime
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Card Network"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="cardNetworkDescription"
                                            key="cardNetworkDescription"
                                            title="Card Network"
                                            sorter={(a, b) =>
                                                a.cardNetworkDescription.localeCompare(
                                                    b.cardNetworkDescription
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Card Number"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="cardNumberMasked"
                                            key="cardNumberMasked"
                                            title="Card Number"
                                            sorter={(a, b) =>
                                                a.cardNumberMasked.localeCompare(
                                                    b.cardNumberMasked
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p =>
                                            p.title ==
                                            "Acquirer Reference Number"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="acquirerReferenceNumber"
                                            key="acquirerReferenceNumber"
                                            title="Acquirer Reference Number"
                                            sorter={(a, b) =>
                                                a.acquirerReferenceNumber -
                                                b.acquirerReferenceNumber
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transaction Identifier"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="transactionIdentifier"
                                            key="transactionIdentifier"
                                            title="Transaction Identifier"
                                            sorter={(a, b) =>
                                                a.transactionIdentifier.localeCompare(
                                                    b.transactionIdentifier
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Authorization Amount"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="authorizationAmount"
                                            key="authorizationAmount"
                                            title="Authorization Amount"
                                            sorter={(a, b) =>
                                                a.authorizationAmount -
                                                b.authorizationAmount
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transaction Amount"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="transactionAmount"
                                            key="transactionAmount"
                                            title="Transaction Amount"
                                            sorter={(a, b) =>
                                                a.transactionAmount -
                                                b.transactionAmount
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Interchange Fee"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="interchangeFee"
                                            key="interchangeFee"
                                            title="Interchange Fee"
                                            sorter={(a, b) =>
                                                a.interchangeFee -
                                                b.interchangeFee
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Interchange Rate"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="interchangeRate"
                                            key="interchangeRate"
                                            title="Interchange Rate"
                                            sorter={(a, b) =>
                                                a.interchangeRate -
                                                b.interchangeRate
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Interchange Amount"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="interchangeAmount"
                                            key="interchangeAmount"
                                            title="Interchange Amount"
                                            sorter={(a, b) =>
                                                a.interchangeAmount -
                                                b.interchangeAmount
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Qualification Level"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="qualificationLevelDescription"
                                            key="qualificationLevelDescription"
                                            title="Qualification Level"
                                            sorter={(a, b) =>
                                                a.qualificationLevelDescription.localeCompare(
                                                    b.qualificationLevelDescription
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Capture Type"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="captureTypeDescription"
                                            key="captureTypeDescription"
                                            title="Capture Type"
                                            sorter={(a, b) =>
                                                a.captureTypeDescription.localeCompare(
                                                    b.captureTypeDescription
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Account Name"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="accountName"
                                            key="accountName"
                                            title="Account Name"
                                            sorter={(a, b) =>
                                                a.accountName.localeCompare(
                                                    b.accountName
                                                )
                                            }
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Order ID"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="orderID"
                                            key="orderID"
                                            title="Order ID"
                                            sorter={(a, b) =>
                                                a.orderID - b.orderID
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Approval Code"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="approvalCode"
                                            key="approvalCode"
                                            title="Approval Code"
                                            sorter={(a, b) =>
                                                a.approvalCode - b.approvalCode
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Invoice"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="invoice"
                                            key="invoice"
                                            title="Invoice"
                                            sorter={(a, b) =>
                                                a.invoice - b.invoice
                                            }
                                        />
                                    )}
                                </Table>
                            </div>
                        </Card>{" "}
                        <TableColumnSettings
                            showTableColumnSettings={showTableColumnSettings}
                            setShowTableColumnSettings={
                                setShowTableColumnSettings
                            }
                            localStorageKey="column_settings_account_clearent_transaction_table"
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default PageClearentTransaction;
