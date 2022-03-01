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
// import PagePaysafeDepositDetailModal from "./PagePaysafeDepositDetailModal";
import ContentHeader from "./PagePaysafeContentHeader";
import { number_format } from "../../../../../providers/number_format";
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
const PagePaysafeMonthlyTransactions = ({ history, match }) => {
    const { RangePicker } = DatePicker;
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "20",
        column: localStorage.account_paysafe_transactions_table_sort_column,
        order: localStorage.account_paysafe_transactions_table_sort_order,
        start_date: moment().format("YYYY-MM")
    });

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    const {
        mutate: mutateTransactions,
        isLoading: isLoadingTransactions
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/money_transaction/filtered",
        "transactions_merchant_list"
    );

    useEffect(() => {
        console.log("@dataTableInfo", dataTableInfo);
        localStorage.account_paysafe_transactions_table_sort_column =
            dataTableInfo.column;
        localStorage.account_paysafe_transactions_table_sort_order =
            dataTableInfo.order;
        getTransactionsList();

        return () => {};
    }, [dataTableInfo]);

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Paysafe Transaction- " + moment().format("YYYY-MM-DD");

    const getTransactionsList = () => {
        mutateTransactions(
            { ...dataTableInfo, merchant_number: match.params.merchant_number },
            {
                onSuccess: res => {
                    console.log(res);
                    setList(res);

                    let array_get = [];
                    res.data.data.map((value, key) => {
                        array_get.push({
                            "Merchant Number": value.option,
                            "Batch Number": value.option,
                            "Card Number": value.option,
                            Transaction: value.option,
                            Amount: value.option,
                            "Transaction Type": value.option,
                            "Entry Mode": value.option,
                            "Card Type": value.option
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
                PaySafe Depostis
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
                "Card Number",
                "Transaction",
                "Amount",
                "Transaction Type",
                "Entry Mode",
                "Card Type"
            ]
        ];
        const data = csvData.map(elt => [
            elt["Merchant Number"],
            elt["Batch Number"],
            elt["Card Number"],
            elt["Transaction"],
            elt["Amount"],
            elt["Transaction Type"],
            elt["Entry Mode"],
            elt["Card Type"]
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
        data: localStorage.column_settings_account_paysafe_transactions_table
            ? JSON.parse(
                  localStorage.column_settings_account_paysafe_transactions_table
              )
            : [
                  {
                      title: "Merchant Number",
                      show: true
                  },
                  {
                      title: "Batch Number",
                      show: true
                  },

                  { title: "Card Number", show: true },
                  { title: "Transaction", show: true },
                  { title: "Amount", show: true },
                  { title: "Transaction Type", show: true },
                  { title: "Entry Mode", show: true },
                  { title: "Card Type", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_paysafe_transactions_table_sort_column) {
            if (
                localStorage.account_paysafe_transactions_table_sort_column ==
                column
            ) {
                return (
                    localStorage.account_paysafe_transactions_table_sort_order +
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

    const [selectedDepositNumber, setSelectedDepositNumber] = useState();
    const [selectedMerchantNumber, setSelectedMerchantNumber] = useState();
    const [showModalDepositDetails, setShowModalDepositDetails] = useState(
        false
    );

    const {
        mutate: mutateGetDepositList,
        isLoading: isLoadingGetDepositList
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/money_transaction/bulkinsert",
        "paysafe_get_merchant_list"
    );

    const handleGetTransactionsList = e => {
        mutateGetDepositList(
            {},
            {
                onSuccess: res => {
                    notification.success({
                        message: "Transactions Data Updated"
                    });
                    getTransactionsList();
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    useEffect(() => {
        let col_sizes = localStorage.transaction_table_col_sizes
            ? JSON.parse(localStorage.transaction_table_col_sizes)
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
        if (!localStorage.transaction_table_col_sizes) {
            var a = {
                "Merchant Number": 166,
                "Batch Number": 139,
                "Card Number": 136,
                Transaction: 131,
                Amount: 108,
                "Transaction Type": 153,
                "Entry Mode": 123,
                "Card Type": 116
            };

            localStorage.setItem(
                "transaction_table_col_sizes",
                JSON.stringify(a)
            );

            $(`table th:nth-child(1)`).prop("width", 166);
            $(`table th:nth-child(2)`).prop("width", 139);
            $(`table th:nth-child(3)`).prop("width", 136);
            $(`table th:nth-child(4)`).prop("width", 131);
            $(`table th:nth-child(5)`).prop("width", 108);
            $(`table th:nth-child(6)`).prop("width", 153);
            $(`table th:nth-child(7)`).prop("width", 123);
            $(`table th:nth-child(8)`).prop("width", 116);
        }

        return () => {};
    }, []);

    return (
        <div
            className=""
            id="paysafeTransactions"
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
                            title="Transactions List"
                            bordered={false}
                            extra={
                                <Button
                                    type="primary"
                                    title="Upload"
                                    icon={<ReloadOutlined />}
                                    loading={isLoadingGetDepositList}
                                    onClick={e => handleGetTransactionsList()}
                                >
                                    Refresh Transaction List
                                </Button>
                            }
                        >
                            <Row>
                                <Col md={8} xs={0}>
                                    {/* {console.log(moment().format("YYYY-MM-DD"))} */}
                                    <DatePicker
                                        defaultValue={moment()}
                                        onChange={(value, dateString) => {
                                            setDataTableInfo({
                                                ...dataTableInfo,
                                                start_date: dateString
                                            });
                                        }}
                                        picker="month"
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
                                    loading={isLoadingTransactions}
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

                                        // localStorage.account_paysafe_transactions_table_sort_column =
                                        //     sorter.columnKey;
                                        // localStorage.account_paysafe_transactions_table_sort_order = sorter.order
                                        //     ? sorter.order.replace("end", "")
                                        //     : null;

                                        let array_get = [];
                                        extra.currentDataSource.map(
                                            (value, key) => {
                                                array_get.push({
                                                    "Merchant Number":
                                                        value.option,
                                                    "Batch Number":
                                                        value.option,
                                                    "Card Number": value.option,
                                                    Transaction: value.option,
                                                    Amount: value.option,
                                                    "Transaction Type":
                                                        value.option,
                                                    "Entry Mode": value.option,
                                                    "Card Type": value.option
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
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
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
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Card Number"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="card_number"
                                            key="card_number"
                                            title={
                                                <CustomTableTitle
                                                    title="Card Number"
                                                    dataIndex="card_number"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transaction"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="transaction_date"
                                            key="transaction_date"
                                            title={
                                                <CustomTableTitle
                                                    title="Transaction"
                                                    dataIndex="transaction_date"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            render={(text, record) => {
                                                return moment(
                                                    record.transmission_date
                                                ).format("L");
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Amount"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="amount"
                                            key="amount"
                                            title={
                                                <CustomTableTitle
                                                    title="Amount"
                                                    dataIndex="amount"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
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
                                                            record.amount,
                                                            2
                                                        )}
                                                    </>
                                                );
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transaction Type"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="transaction_type"
                                            key="transaction_type"
                                            title={
                                                <CustomTableTitle
                                                    title="Transaction Type"
                                                    dataIndex="transaction_type"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Entry Mode"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="entry_mode"
                                            key="entry_mode"
                                            title={
                                                <CustomTableTitle
                                                    title="Entry Mode"
                                                    dataIndex="entry_mode"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Card Type"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="card_type"
                                            key="card_type"
                                            title={
                                                <CustomTableTitle
                                                    title="Card Type"
                                                    dataIndex="card_type"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="transaction_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_transactions_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_transactions_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
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
                            localStorageKey="column_settings_account_paysafe_transactions_table"
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PagePaysafeMonthlyTransactions;
