import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
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
    DatePicker
} from "antd";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
import PagePaysafeBatchDetailModal from "./Modals/PagePaysafeBatchDetailModal";
import { number_format } from "../../../../../providers/number_format";
import ContentHeader from "./PagePaysafeContentHeader";
import { CSVLink } from "react-csv";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    PrinterOutlined
} from "@ant-design/icons";

import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

import CustomTableTitle from "../../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

const PagePaysafeBatches = ({ history, match }) => {
    const { RangePicker } = DatePicker;
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "20",
        column: localStorage.account_paysafe_batches_table_sort_column,
        order: localStorage.account_paysafe_batches_table_sort_order,
        drange: [
            moment()
                .subtract(1, "month")
                .format("YYYY-MM-DD"),
            moment().format("YYYY-MM-DD")
        ]
    });

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Paysafe Batches- " + moment().format("YYYY-MM-DD");

    const {
        mutate: mutateBatches,
        isLoading: isLoadingBatches
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/batch/filtered",
        "batches_merchant_list"
    );

    useEffect(() => {
        console.log("@dataTableInfo", dataTableInfo);
        localStorage.account_paysafe_batches_table_sort_column =
            dataTableInfo.column;
        localStorage.account_paysafe_batches_table_sort_order =
            dataTableInfo.order;

        getBatchesList();

        return () => {};
    }, [dataTableInfo]);

    const getBatchesList = () => {
        mutateBatches(
            { ...dataTableInfo, merchant_number: match.params.merchant_number },
            {
                onSuccess: res => {
                    console.log(res);
                    setList(res);

                    let array_get = [];
                    res.data.data.map((value, key) => {
                        array_get.push({
                            "Merchant Number": value.merchant_number,
                            "Batch Number": value.batch_number,
                            "Closed Date": value.closed_date,
                            "Batch Date": value.batch_date,
                            "Net Items": value.net_items,
                            "Batch Amount": value.batch_amount
                        });
                    });

                    setCsvData(array_get);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_account_paysafe_batches_table
            ? JSON.parse(
                  localStorage.column_settings_account_paysafe_batches_table
              )
            : [
                  { title: "Merchant Number", show: true },
                  {
                      title: "Batch Number",

                      show: true
                  },
                  {
                      title: "Closed Date",

                      show: true
                  },

                  { title: "Batch Date", show: true },
                  { title: "Net Items", show: true },
                  { title: "Batch Amount", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_paysafe_batches_table_sort_column) {
            if (
                localStorage.account_paysafe_batches_table_sort_column == column
            ) {
                return (
                    localStorage.account_paysafe_batches_table_sort_order +
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
        const timeoutId = setTimeout(() => {
            setDataTableInfo({
                ...dataTableInfo,
                filter_value: searchText,
                page_number: 1
            });
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchText]);

    const [selectedBatchNumber, setSelectedBatchNumber] = useState();
    const [selectedMerchantNumber, setSelectedMerchantNumber] = useState();
    const [showModalBatchDetails, setShowModalBatchDetails] = useState(false);

    const toggleModalBatchDetails = (batch_number, merchant_number) => {
        setSelectedBatchNumber(batch_number);
        setSelectedMerchantNumber(merchant_number);
        setShowModalBatchDetails(!showModalBatchDetails);
    };

    const {
        mutate: mutateGetBatchList,
        isLoading: isLoadingGetBatchList
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/batch/bulkinsert",
        "paysafe_get_merchant_list"
    );

    const handleGetBatchesList = e => {
        mutateGetBatchList(
            { merchant_number: match.params.merchant_number },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Batches Data Updated"
                    });
                    getBatchesList();
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

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
                PaySafe Bathces
            </h1>
        </div>
    );

    const exportPDF = () => {
        const htmlToConvert = renderToString(<HeaderReport />);
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape "; // portrait or landscape

        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);

        const headers = [
            [
                "Merchant Number",
                "Batch Number",
                "Closed Date",
                "Batch Date",
                "Net Items",
                "Batch Amount"
            ]
        ];
        const data = csvData.map(elt => [
            elt["Merchant Number"],
            elt["Batch Number"],
            elt["Closed Date"],
            elt["Batch Date"],
            elt["Net Items"],
            elt["Batch Amount"]
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

    useEffect(() => {
        let col_sizes = localStorage.batches_table_col_sizes
            ? JSON.parse(localStorage.batches_table_col_sizes)
            : null;
        // console.log("col_sizes", col_sizes);
        if (col_sizes) {
            Object.keys(col_sizes).map((title, key) => {
                // console.log($("table th:contains(" + title + ")"));
                // console.log(title, Object.values(col_sizes)[key]);
                $("table th:contains(" + title + ")").attr(
                    "width",
                    parseInt(Object.values(col_sizes)[key])
                );
            });
        }
        return () => {};
    }, []);

    useEffect(() => {
        if (!localStorage.batches_table_col_sizes) {
            var a = {
                "Merchant Number": 169,
                "Batch Number": 146,
                "Closed Date": 133,
                "Batch Date": 126,
                "Net Items": 117,
                "Batch Amount": 422
            };

            localStorage.setItem("batches_table_col_sizes", JSON.stringify(a));

            $(`table th:nth-child(1)`).prop("width", 169);
            $(`table th:nth-child(2)`).prop("width", 146);
            $(`table th:nth-child(3)`).prop("width", 133);
            $(`table th:nth-child(4)`).prop("width", 126);
            $(`table th:nth-child(5)`).prop("width", 117);
            $(`table th:nth-child(6)`).prop("width", 422);
        }

        return () => {};
    }, []);

    return (
        <div
            className=""
            id="paysafeBatches"
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
                        <Card
                            title="Batches List"
                            bordered={false}
                            extra={
                                <Button
                                    type="primary"
                                    title="Upload"
                                    icon={<ReloadOutlined />}
                                    loading={isLoadingGetBatchList}
                                    onClick={e => handleGetBatchesList()}
                                >
                                    Refresh Batch List
                                </Button>
                            }
                        >
                            <Row>
                                <Col md={8} xs={0}>
                                    {/* {console.log(moment().format("YYYY-MM-DD"))} */}
                                    <RangePicker
                                        format={"YYYY-MM-DD"}
                                        defaultValue={[
                                            moment().subtract(1, "month"),
                                            moment()
                                        ]}
                                        onChange={(value, dateString) => {
                                            setDataTableInfo({
                                                ...dataTableInfo,
                                                drange: dateString
                                            });
                                        }}
                                    />
                                </Col>
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
                                <ResizableAntdTable
                                    scroll={{ x: "fit-content" }}
                                    loading={isLoadingBatches}
                                    rowKey={record => record.id}
                                    dataSource={
                                        List.length != 0 ? List.data.data : []
                                    }
                                    pagination={{
                                        pageSize: dataTableInfo.page_size,
                                        current:
                                            List.length != 0
                                                ? List.data.current_page
                                                : 1,
                                        showSizeChanger: true,
                                        total:
                                            List.length != 0
                                                ? List.data.total
                                                : 1,

                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} of ${total} items`,

                                        pageSizeOptions: [20, 50, 100, 200]
                                    }}
                                    onChange={(
                                        pagination,
                                        filters,
                                        sorter,
                                        extra
                                    ) => {
                                        setDataTableInfo({
                                            ...dataTableInfo,
                                            page_number: pagination.current,
                                            page_size: pagination.pageSize

                                            // column: sorter.columnKey,
                                            // order: sorter.order
                                            //     ? sorter.order.replace(
                                            //           "end",
                                            //           ""
                                            //       )
                                            //     : null
                                        });

                                        // localStorage.account_paysafe_batches_table_sort_column =
                                        //     sorter.columnKey;
                                        // localStorage.account_paysafe_batches_table_sort_order = sorter.order
                                        //     ? sorter.order.replace("end", "")
                                        //     : null;

                                        let array_get = [];
                                        extra.currentDataSource.map(
                                            (value, key) => {
                                                array_get.push({
                                                    "Merchant Number":
                                                        value.merchant_number,
                                                    "Batch Number":
                                                        value.batch_number,
                                                    "Closed Date":
                                                        value.closed_date,
                                                    "Batch Date":
                                                        value.batch_date,
                                                    "Net Items":
                                                        value.net_items,
                                                    "Batch Amount":
                                                        value.batch_amount
                                                });
                                            }
                                        );

                                        setCsvData(array_get);
                                    }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Merchant Number"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="merchant_number"
                                            key="merchant_number"
                                            title={
                                                <CustomTableTitle
                                                    title="Merchant Number"
                                                    dataIndex="merchant_number"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="batches_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_batches_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_batches_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Batch Number"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="batch_number"
                                            key="batch_number"
                                            title={
                                                <CustomTableTitle
                                                    title="Batch Number"
                                                    dataIndex="batch_number"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="batches_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_batches_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_batches_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            render={(text, record) => {
                                                return (
                                                    <a
                                                        href="#"
                                                        className="nodecor"
                                                        onClick={e =>
                                                            toggleModalBatchDetails(
                                                                record.batch_number,
                                                                record.merchant_number
                                                            )
                                                        }
                                                    >
                                                        {record.batch_number}
                                                    </a>
                                                );
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Closed Date"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="closed_date"
                                            key="closed_date"
                                            title={
                                                <CustomTableTitle
                                                    title="Closed Date"
                                                    dataIndex="closed_date"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="batches_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_batches_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_batches_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            // render={(text, record) => {
                                            //     return moment(
                                            //         record.closed_date
                                            //     ).format("L");
                                            // }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Batch Date"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="batch_date"
                                            key="batch_date"
                                            title={
                                                <CustomTableTitle
                                                    title="Batch Date"
                                                    dataIndex="batch_date"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="batches_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_batches_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_batches_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            render={(text, record) => {
                                                return moment(
                                                    record.batch_date
                                                ).format("L");
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Net Items"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="net_items"
                                            key="net_items"
                                            title={
                                                <CustomTableTitle
                                                    title="Net Items"
                                                    dataIndex="net_items"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="batches_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_batches_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_batches_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Batch Amount"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="batch_amount"
                                            key="batch_amount"
                                            title={
                                                <CustomTableTitle
                                                    title="Batch Amount"
                                                    dataIndex="batch_amount"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="batches_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_batches_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_batches_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            render={(text, record) => {
                                                return (
                                                    <>
                                                        $
                                                        {number_format(
                                                            record.batch_amount,
                                                            2
                                                        )}
                                                    </>
                                                );
                                            }}
                                        />
                                    )}
                                </ResizableAntdTable>
                            </div>
                        </Card>{" "}
                        <TableColumnSettings
                            showTableColumnSettings={showTableColumnSettings}
                            setShowTableColumnSettings={
                                setShowTableColumnSettings
                            }
                            localStorageKey="column_settings_account_paysafe_batches_table"
                        />
                    </Col>
                </Row>
                <PagePaysafeBatchDetailModal
                    showModalBatchDetails={showModalBatchDetails}
                    setShowModalBatchDetails={setShowModalBatchDetails}
                    toggleModalBatchDetails={toggleModalBatchDetails}
                    batch_number={selectedBatchNumber}
                    merchant_number={match.params.merchant_number}
                />
            </div>
        </div>
    );
};

export default PagePaysafeBatches;
