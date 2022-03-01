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

const PageClearentCase = ({ history, match }) => {
    const [showLoading, setShowLoading] = useState(false);
    const [caseList, setCaseList] = useState([]);
    const userdata = getUserData();

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Clearent Case - " + moment().format("YYYY-MM-DD");

    const {
        data: mutateGetCases,
        isLoading: isLoadingGetCases,
        refetch: refetchGetGetCases,
        isFetching: isFetchingGetCases
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/cases/" + match.params.merchant_number,
        "table_clearent_cases_" + match.params.merchant_number,
        res => {
            // setCaseList(res.data.merchantCases);
            // let array_get = [];
            // res.data.merchantCases.map((value, key) => {
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
                Clearent Case
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
                "Case Number",
                "Created Date",
                "Reason",
                "Case Category",
                "Description"
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

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_account_clearent_cases_table
            ? JSON.parse(
                  localStorage.column_settings_account_clearent_cases_table
              )
            : [
                  { title: "Case Number", show: true },
                  { title: "Created Date", show: true },
                  {
                      title: "Closed Date",
                      show: true
                  },
                  {
                      title: "Reason",
                      show: true
                  },

                  { title: "Case Category", show: true },
                  { title: "Description", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_clearent_cases_table_sort_column) {
            if (
                localStorage.account_clearent_cases_table_sort_column == column
            ) {
                return (
                    localStorage.account_clearent_cases_table_sort_order + "end"
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
            id="clearentCases"
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
                        <Card title="Cases" bordered={false}>
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
                                    //     isLoadingGetCases || isFetchingGetCases
                                    // }
                                    rowKey={record => record.id}
                                    dataSource={
                                        caseList.length != 0
                                            ? caseList.data.data
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

                                    //     localStorage.account_clearent_cases_table_sort_column =
                                    //         sorter.columnKey;
                                    //     localStorage.account_clearent_cases_table_sort_order = sorter.order
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
                                        p => p.title == "Case Number"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="caseNumber"
                                            key="caseNumber"
                                            title="Case Number"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "caseNumber"
                                            )}
                                            defaultSortOrder={checkIfDefault(
                                                "caseNumber"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Created Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="createdDate"
                                            key="createdDate"
                                            title="Created Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "createdDate"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Closed Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="closedDate"
                                            key="closedDate"
                                            title="Closed Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "closedDate"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Reason"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="reason"
                                            title="Reason"
                                            key="reason"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "Reason"
                                            )}
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Case Category"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="caseCategory"
                                            key="caseCategory"
                                            title="Case Category"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "caseCategory"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Description"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="description"
                                            key="description"
                                            title="Description"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "description"
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
                            localStorageKey="column_settings_account_clearent_cases_table"
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default PageClearentCase;
