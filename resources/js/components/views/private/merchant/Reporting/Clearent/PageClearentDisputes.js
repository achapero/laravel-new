import React, { useState, useEffect, useRef } from "react";
import { Card, div, Row, Col, Input, Button, Table, Divider } from "antd";
import ContentHeader from "./PageClearentContentHeader";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
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
import moment from "moment";
import { CSVLink } from "react-csv";
const PageClearentDisputes = ({ history, match }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [disputesList, setDisputesList] = useState([]);
    const userdata = getUserData();

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Clearent Disputes - " + moment().format("YYYY-MM-DD");

    const {
        data: mutateGetDisputes,
        isLoading: isLoadingGetDisputes,
        refetch: refetchGetDisputes,
        isFetching: isFetchingGetDisputes
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/disputes/" + match.params.merchant_number,
        "table_clearent_disputes_" + match.params.merchant_number,
        res => {
            // setDisputesList(res.data.merchantDisputes);
            // let array_get = [];
            // res.data.merchantDisputes.map((value, key) => {
            //     array_get.push({
            //     });
            // });
            // setCsvData(array_get);
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
                Clearent Disputes
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
                "Card Number Masked",
                "DBA Name",
                "Dispute Type",
                "Type",
                "Original Tran Ref No",
                "Processing Date Time",
                "Processor Name",
                "Reason Code",
                "Pending Settle ment Date",
                "Resolved Date",
                "Billing Adjustment Date",
                "Settlement Amount",
                "Settlement Date",
                "Source Processing Date Time",
                "Transaction Amount",
                "Transaction Date Time"
            ]
        ];
        const data = csvData.map(elt => []);

        let content = {
            startY: 80,
            head: headers
            // body: data
        };

        doc.html(htmlToConvert, {
            callback: function(doc) {
                doc.autoTable(content);
                doc.save(ExportFileName + ".pdf");
            }
        });
    };

    // useEffect(() => {
    //     return () => {};
    // }, [dataTableInfo]);

    // const [dataTableInfo, setDataTableInfo] = useState({
    //     filter_value: "",
    //     page_number: 1,
    //     page_size: "100",
    //     column:
    //         localStorage.account_clearent_disputes_table_sort_column == null
    //             ? localStorage.account_clearent_disputes_table_sort_column
    //             : "merchantNumber",
    //     order:
    //         localStorage.account_clearent_disputes_table_sort_order == null
    //             ? localStorage.account_clearent_disputes_table_sort_order
    //             : "asc"
    // });

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_account_clearent_disputes_table
            ? JSON.parse(
                  localStorage.column_settings_account_clearent_disputes_table
              )
            : [
                  { title: "Card Number Masked", show: true },
                  { title: "DBA Name", show: true },
                  {
                      title: "Dispute Type",
                      show: true
                  },
                  {
                      title: "Type",
                      show: true
                  },

                  { title: "Original Tran Ref No", show: true },
                  { title: "Processing Date Time", show: true },
                  { title: "Processor Name", show: true },
                  { title: "Reason Code", show: true },
                  { title: "Pending Settle ment Date", show: true },
                  { title: "Resolved Date", show: true },
                  { title: "Billing Adjustment Date", show: true },
                  { title: "Settlement Amount", show: true },
                  { title: "Settlement Date", show: true },
                  { title: "Source Processing Date Time", show: true },
                  { title: "Transaction Amount", show: true },
                  { title: "Transaction Date Time", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_clearent_disputes_table_sort_column) {
            if (
                localStorage.account_clearent_disputes_table_sort_column ==
                column
            ) {
                return (
                    localStorage.account_clearent_disputes_table_sort_order +
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
    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         setDataTableInfo({
    //             ...dataTableInfo,
    //             filter_value: searchText,
    //             page_number: 1
    //         });
    //     }, 500);
    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [searchText]);

    return (
        <div
            className=""
            id="clearentDisputes"
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
                        <Card title="Disputes" bordered={false}>
                            <Row>
                                <Col md={8} xs={0}></Col>
                                <Col md={8} sm={0}></Col>
                                <Col md={8} sm={24}>
                                    <div style={{ display: "flex" }}>
                                        {" "}
                                        <Input.Search
                                            placeholder="Global Search"
                                            onSearch={e =>
                                                setDataTableInfo({
                                                    ...dataTableInfo,
                                                    filter_value: e,
                                                    page_number: 1
                                                })
                                            }
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
                                            // loading={isLoadingDeleteUser}

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
                                    // loading={
                                    //     isLoadingGetDisputes ||
                                    //     isFetchingGetDisputes
                                    // }
                                    rowKey={record => record.id}
                                    dataSource={
                                        disputesList.length != 0
                                            ? disputesList.data.data
                                            : []
                                    }
                                    // pagination={{
                                    //     pageSize: dataTableInfo.page_size,
                                    //     current:
                                    //         List.length != 0
                                    //             ? List.data.current_page
                                    //             : 1,
                                    //     showSizeChanger: true,
                                    //     total:
                                    //         List.length != 0
                                    //             ? List.data.total
                                    //             : 1,

                                    //     showTotal: (total, range) =>
                                    //         `${range[0]}-${range[1]} of ${total} items`,

                                    //     pageSizeOptions: [100, 200]
                                    // }}
                                    // onChange={(
                                    //     pagination,
                                    //     filters,
                                    //     sorter,
                                    //     extra
                                    // ) => {
                                    //     setDataTableInfo({
                                    //         ...dataTableInfo,
                                    //         page_number: pagination.current,
                                    //         page_size: pagination.pageSize,
                                    //         column: sorter.columnKey,
                                    //         order: sorter.order
                                    //             ? sorter.order.replace(
                                    //                   "end",
                                    //                   ""
                                    //               )
                                    //             : null
                                    //     });

                                    //     localStorage.account_clearent_disputes_table_sort_column =
                                    //         sorter.columnKey;
                                    //     localStorage.account_clearent_disputes_table_sort_order = sorter.order
                                    //         ? sorter.order.replace("end", "")
                                    //         : null;

                                    // let array_get = [];
                                    // extra.currentDataSource.map((value, key) => {
                                    //     array_get.push({

                                    //     });
                                    // });
                                    // setCsvData(array_get);

                                    // }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Card Number Masked"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="cardNumberMasked"
                                            key="cardNumberMasked"
                                            title="Card Number Masked"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "cardNumberMasked"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Dispute Type"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="disputeType"
                                            key="disputeType"
                                            title="Dispute Type"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "disputeType"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Original Tran Ref No"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="originalTranRefNo"
                                            key="originalTranRefNo"
                                            title="Original Tran Ref No"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "originalTranRefNo"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Processing Date Time"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="processingDateTime"
                                            title="Processing Date Time"
                                            key="processingDateTime"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "processingDateTime"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Processor Name"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="processorName"
                                            key="processorName"
                                            title="Processor Name"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "processorName"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Reason Code"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="reasonCodeDescription"
                                            key="reasonCodeDescription"
                                            title="Reason Code"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "reasonCodeDescription"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p =>
                                            p.title ==
                                            "Pending Settle ment Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="pendingSettlementDate"
                                            key="pendingSettlementDate"
                                            title="Pending Settle ment Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "pendingSettlementDate"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Resolved Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="resolvedDate"
                                            key="resolvedDate"
                                            title="Resolved Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "resolvedDate"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p =>
                                            p.title == "Billing Adjustment Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="billingAdjustmentDate"
                                            key="billingAdjustmentDate"
                                            title="Billing Adjustment Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "billingAdjustmentDate"
                                            )}
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Settlement Amount"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="settlementAmount"
                                            key="settlementAmount"
                                            title="Settlement Amount"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "settlementAmount"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Settlement Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="settlementDate"
                                            key="settlementDate"
                                            title="Settlement Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "settlementDate"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p =>
                                            p.title ==
                                            "Source Processing Date Time"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="sourceProcessingDateTime"
                                            key="sourceProcessingDateTime"
                                            title="Source Processing Date Time"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "sourceProcessingDateTime"
                                            )}
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transaction Amount"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="transactionAmount"
                                            key="transactionAmount"
                                            title="Transaction Amount"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "transactionAmount"
                                            )}
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transaction Date Time"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="transactionDateTime"
                                            key="transactionDateTime"
                                            title="Transaction Date Time"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "transactionDateTimes"
                                            )}
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
                            localStorageKey="column_settings_account_clearent_disputes_table"
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default PageClearentDisputes;
