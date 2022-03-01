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

const PageClearentBankDeposit = ({ history, match }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [bankDepositList, setBankDepositList] = useState([]);
    const [bankDepositListSearch, setBankDepositListSearch] = useState([]);
    const userdata = getUserData();

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Clearent Bank Deposits - " + moment().format("YYYY-MM-DD");
    const {
        data: dataGetBankDeposit,
        isLoading: isLoadingGetBankDeposit,
        refetch: refetchGetBankDeposit,
        isFetching: isFetchingGetBankDeposit
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/deposits/" + match.params.merchant_number,
        "table_clearent_bankDeposit_" + match.params.merchant_number,
        res => {
            setBankDepositList(res.data.merchantBankDeposits);
            setBankDepositListSearch(res.data.merchantBankDeposits);

            let array_get = [];
            res.data.merchantBankDeposits.map((value, key) => {
                array_get.push({
                    "Account Number": value.accountNumberMasked,
                    Amount: value.amount,
                    "Creation Day of Week": value.creationDayOfWeek
                        ? moment(value.creationDayOfWeek).format("YYYY-MM-DD")
                        : "",
                    "Transaction Request Time": value.fRDateTime
                        ? moment(value.fRDateTime).format("YYYY-MM-DD")
                        : "",
                    "Expected Funding Date": value.expectedFundingDate
                        ? moment(value.expectedFundingDate).format("YYYY-MM-DD")
                        : "",

                    "Event Type": value.fundingEventTypeName,
                    "Funding Type": value.fundingType,
                    "Settlement Date": value.settlementDate
                        ? moment(value.settlementDate).format("YYYY-MM-DD")
                        : ""
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
                Clearent Bank Deposits
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
                "Account Number",
                "Amount",
                "Creation Day of Week",
                "Expected Funding Date",
                "Transaction Request Time",
                "Event Type",
                "Funding Type",
                "Settlement Date"
            ]
        ];
        const data = csvData.map(elt => [
            elt["Account Number"],
            elt["Amount"],
            elt["Creation Day of Week"],
            elt["Expected Funding Date"],
            elt["Transaction Request Time"],
            elt["Event Type"],
            elt["Funding Type"],
            elt["Settlement Date"]
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
        data: localStorage.column_settings_account_clearent_bankDeposit_table
            ? JSON.parse(
                  localStorage.column_settings_account_clearent_bankDeposit_table
              )
            : [
                  { title: "Account Number", show: true },
                  { title: "Amount", show: true },
                  {
                      title: "Creation Day of Week",
                      show: true
                  },
                  {
                      title: "Expected Funding Date",
                      show: true
                  },

                  { title: "Transaction Request Time", show: true },
                  { title: "Event Type", show: true },
                  { title: "Funding Type", show: true },
                  { title: "Settlement Date", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_clearent_bankDeposit_table_sort_column) {
            if (
                localStorage.account_clearent_bankDeposit_table_sort_column ==
                column
            ) {
                return (
                    localStorage.account_clearent_bankDeposit_table_sort_order +
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
            setBankDepositList(bankDepositListSearch);
        } else {
            const filteredData = bankDepositList.filter(
                entry =>
                    entry.amount.includes(searchText) ||
                    entry.accountNumberMasked.includes(searchText) ||
                    entry.creationDayOfWeek.includes(searchText) ||
                    entry.expectedFundingDate.includes(searchText) ||
                    entry.fRDateTime.includes(searchText) ||
                    entry.fundingEventTypeName.includes(searchText) ||
                    entry.fundingType.includes(searchText) ||
                    entry.settlementDate.includes(searchText)
            );
            setBankDepositList(filteredData);
        }
    }, [searchText]);

    useEffect(() => {
        let array_get = [];
        bankDepositList.map((value, key) => {
            array_get.push({
                "Account Number": value.accountNumberMasked,
                Amount: value.amount,
                "Creation Day of Week": value.creationDayOfWeek
                    ? moment(value.creationDayOfWeek).format("YYYY-MM-DD")
                    : "",
                "Transaction Request Time": value.fRDateTime
                    ? moment(value.fRDateTime).format("YYYY-MM-DD")
                    : "",
                "Expected Funding Date": value.expectedFundingDate
                    ? moment(value.expectedFundingDate).format("YYYY-MM-DD")
                    : "",

                "Event Type": value.fundingEventTypeName,
                "Funding Type": value.fundingType,
                "Settlement Date": value.settlementDate
                    ? moment(value.settlementDate).format("YYYY-MM-DD")
                    : ""
            });
        });
        setCsvData(array_get);
    }, [bankDepositList]);

    return (
        <div
            className=""
            id="clearentBankDeposit"
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
                        <Card title="Bank Deposit" bordered={false}>
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
                                        isLoadingGetBankDeposit ||
                                        isFetchingGetBankDeposit
                                    }
                                    rowKey={record => record.id}
                                    dataSource={
                                        bankDepositList.length != 0
                                            ? bankDepositList
                                            : []
                                    }
                                    onChange={(
                                        pagination,
                                        filters,
                                        sorter,
                                        extra
                                    ) => {
                                        console.log(filters);
                                    }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Account Number"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="accountNumberMasked"
                                            key="accountNumberMasked"
                                            title="Account Number"
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Amount"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="amount"
                                            key="amount"
                                            title="Amount"
                                            sorter={(a, b) =>
                                                a.amount - b.amount
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Creation Day of Week"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="creationDayOfWeek"
                                            key="creationDayOfWeek"
                                            title="Creation Day of Week"
                                            sorter={(a, b) =>
                                                a.creationDayOfWeek.localeCompare(
                                                    b.creationDayOfWeek
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Expected Funding Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="expectedFundingDate"
                                            title="Expected Funding Date"
                                            key="expectedFundingDate"
                                            render={(text, record) => {
                                                return moment(
                                                    record.expectedFundingDate
                                                ).format("ll");
                                            }}
                                            sorter={(a, b) =>
                                                a.expectedFundingDate.localeCompare(
                                                    b.expectedFundingDate
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p =>
                                            p.title ==
                                            "Transaction Request Time"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="fRDateTime"
                                            key="fRDateTime"
                                            title="Transaction Request Time"
                                            render={(text, record) => {
                                                return moment(
                                                    record.fRDateTime
                                                ).format("ll");
                                            }}
                                            sorter={(a, b) =>
                                                a.fRDateTime.localeCompare(
                                                    b.fRDateTime
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Event Type"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="fundingEventTypeName"
                                            key="fundingEventTypeName"
                                            title="Event Type"
                                            sorter={(a, b) =>
                                                a.fundingEventTypeName.localeCompare(
                                                    b.fundingEventTypeName
                                                )
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Funding Type"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="fundingType"
                                            key="fundingType"
                                            title="Funding Type"
                                            sorter={(a, b) =>
                                                a.fundingType.localeCompare(
                                                    b.fundingType
                                                )
                                            }
                                        />
                                    )}
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
                                </Table>
                            </div>
                        </Card>{" "}
                        <TableColumnSettings
                            showTableColumnSettings={showTableColumnSettings}
                            setShowTableColumnSettings={
                                setShowTableColumnSettings
                            }
                            localStorageKey="column_settings_account_clearent_bankDeposit_table"
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default PageClearentBankDeposit;
