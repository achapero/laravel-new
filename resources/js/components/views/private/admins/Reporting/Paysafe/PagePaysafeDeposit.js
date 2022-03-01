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
import PagePaysafeDepositDetailAllModal from "./Modals/PagePaysafeDepositDetailAllModal";
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

const PagePaysafeDeposit = ({ history, match }) => {
    const { RangePicker } = DatePicker;
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "20",
        column: localStorage.account_paysafe_deposits_table_sort_column,
        order: localStorage.account_paysafe_deposits_table_sort_order,
        drange: [
            moment()
                .subtract(1, "month")
                .format("YYYY-MM-DD"),
            moment().format("YYYY-MM-DD")
        ]
    });

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    const {
        mutate: mutateDeposits,
        isLoading: isLoadingDeposits
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/deposit/filtered",
        "deposits_merchant_list"
    );

    useEffect(() => {
        console.log("@dataTableInfo", dataTableInfo);
        localStorage.account_paysafe_deposits_table_sort_column =
            dataTableInfo.column;
        localStorage.account_paysafe_deposits_table_sort_order =
            dataTableInfo.order;
        getDepositsList();

        return () => {};
    }, [dataTableInfo]);

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Paysafe Deposit- " + moment().format("YYYY-MM-DD");

    const getDepositsList = () => {
        mutateDeposits(
            { ...dataTableInfo, merchant_number: match.params.merchant_number },
            {
                onSuccess: res => {
                    console.log(res);
                    setList(res);
                    let array_get = [];
                    res.data.data.map((value, key) => {
                        array_get.push({
                            "Merchant Number": value.merchant_number,
                            "Ach Date": value.ach_date,
                            "Transmission Date": value.transmission_date,
                            "Trace Number": value.trace_number,
                            "DDA Amount": value.dda_number,
                            "TR Amount": value.tr_number,
                            Amount: value.amount
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
                "Ach Date",
                "Transmission Date",
                "Trace Number",
                "DDA Amount",
                "TR Amount",
                "Amount"
            ]
        ];
        const data = csvData.map(elt => [
            elt["Merchant Number"],
            elt["Ach Date"],
            elt["Transmission Date"],
            elt["Trace Number"],
            elt["DDA Amount"],
            elt["TR Amount"],
            elt["Amount"]
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
        data: localStorage.column_settings_account_paysafe_deposits_table
            ? JSON.parse(
                  localStorage.column_settings_account_paysafe_deposits_table
              )
            : [
                  { title: "Detail", show: true },
                  {
                      title: "Merchant Number",
                      show: true
                  },
                  {
                      title: "Ach Date",
                      show: true
                  },

                  { title: "Transmission Date", show: true },
                  { title: "Trace Number", show: true },
                  { title: "DDA Amount", show: true },
                  { title: "TR Amount", show: true },
                  { title: "Amount", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_paysafe_deposits_table_sort_column) {
            if (
                localStorage.account_paysafe_deposits_table_sort_column ==
                column
            ) {
                return (
                    localStorage.account_paysafe_deposits_table_sort_order +
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
        "api/v1/paysafe/deposit/bulkinsert",
        "paysafe_get_merchant_list"
    );

    const handleGetDepositsList = e => {
        mutateGetDepositList(
            { merchant_number: match.params.merchant_number },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Deposits Data Updated"
                    });
                    getDepositsList();
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const [showModalDepositAllDetail, setShowModalDepositAllDetail] = useState(
        false
    );
    const [depositModalAllRecord, setDepositModalAllRecord] = useState();

    const toggleModalDepositAllDetail = record => {
        setShowModalDepositAllDetail(!showModalDepositAllDetail);
        setDepositModalAllRecord(record);
        console.log(record);
    };

    useEffect(() => {
        let col_sizes = localStorage.deposit_table_col_sizes
            ? JSON.parse(localStorage.deposit_table_col_sizes)
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
        if (!localStorage.deposit_table_col_sizes) {
            var a = {
                Detail: 88,
                "Merchant Number": 171,
                "Ach Date": 116,
                "Transmission Date": 168,
                "Trace Number": 142,
                "DDA Amount": 130,
                "TR Amount": 127,
                Amount: 132
            };

            localStorage.setItem("deposit_table_col_sizes", JSON.stringify(a));

            $(`table th:nth-child(1)`).prop("width", 88);
            $(`table th:nth-child(2)`).prop("width", 171);
            $(`table th:nth-child(3)`).prop("width", 116);
            $(`table th:nth-child(4)`).prop("width", 168);
            $(`table th:nth-child(5)`).prop("width", 142);
            $(`table th:nth-child(6)`).prop("width", 130);
            $(`table th:nth-child(7)`).prop("width", 127);
            $(`table th:nth-child(8)`).prop("width", 132);
        }

        return () => {};
    }, []);

    return (
        <div
            className=""
            id="paysafeDeposits"
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
                            title="Deposits List"
                            bordered={false}
                            extra={
                                <Button
                                    type="primary"
                                    title="Upload"
                                    icon={<ReloadOutlined />}
                                    loading={isLoadingGetDepositList}
                                    onClick={e => handleGetDepositsList()}
                                >
                                    Refresh Deposit List
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
                                    loading={isLoadingDeposits}
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

                                        // localStorage.account_paysafe_deposits_table_sort_column =
                                        //     sorter.columnKey;
                                        // localStorage.account_paysafe_deposits_table_sort_order = sorter.order
                                        //     ? sorter.order.replace("end", "")
                                        //     : null;

                                        let array_get = [];
                                        extra.currentDataSource.map(
                                            (value, key) => {
                                                array_get.push({
                                                    "Merchant Number":
                                                        value.merchant_number,
                                                    "Ach Date": value.ach_date,
                                                    "Transmission Date":
                                                        value.transmission_date,
                                                    "Trace Number":
                                                        value.trace_number,
                                                    "DDA Amount":
                                                        value.dda_number,
                                                    "TR Amount":
                                                        value.tr_number,
                                                    Amount: value.amount
                                                });
                                            }
                                        );

                                        setCsvData(array_get);
                                    }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Detail"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="detail_click"
                                            key="detail_click"
                                            title={
                                                <CustomTableTitle
                                                    title="Detail"
                                                    dataIndex="detail_click"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            render={(text, record) => {
                                                return (
                                                    <a
                                                        href="#"
                                                        onClick={() =>
                                                            toggleModalDepositAllDetail(
                                                                record
                                                            )
                                                        }
                                                    >
                                                        {" "}
                                                        Detail{" "}
                                                    </a>
                                                );
                                            }}
                                        />
                                    )}
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
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Ach Date"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="ach_date"
                                            key="ach_date"
                                            title={
                                                <CustomTableTitle
                                                    title="Ach Date"
                                                    dataIndex="ach_date"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            render={(text, record) => {
                                                return moment(
                                                    record.ach_date
                                                ).format("L");
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Transmission Date"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="transmission_date"
                                            key="transmission_date"
                                            title={
                                                <CustomTableTitle
                                                    title="Transmission Date"
                                                    dataIndex="transmission_date"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
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
                                        p => p.title == "Trace Number"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="trace_number"
                                            key="trace_number"
                                            title={
                                                <CustomTableTitle
                                                    title="Trace Number"
                                                    dataIndex="trace_number"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "DDA Amount"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="dda_number"
                                            key="dda_number"
                                            title={
                                                <CustomTableTitle
                                                    title="DDA Amount"
                                                    dataIndex="dda_number"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "TR Amount"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="tr_number"
                                            key="tr_number"
                                            title={
                                                <CustomTableTitle
                                                    title="TR Amount"
                                                    dataIndex="tr_number"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
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
                                                    title="DDA Amount"
                                                    dataIndex="amount"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="deposit_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_account_paysafe_deposits_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_account_paysafe_deposits_table
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
                                </ResizableAntdTable>
                            </div>
                        </Card>{" "}
                        <TableColumnSettings
                            showTableColumnSettings={showTableColumnSettings}
                            setShowTableColumnSettings={
                                setShowTableColumnSettings
                            }
                            localStorageKey="column_settings_account_paysafe_deposits_table"
                        />
                        <PagePaysafeDepositDetailAllModal
                            toggleModalDepositAllDetail={
                                toggleModalDepositAllDetail
                            }
                            setShowModalDepositAllDetail={
                                setShowModalDepositAllDetail
                            }
                            showModalDepositAllDetail={
                                showModalDepositAllDetail
                            }
                            merchant_number={match.params.id}
                            depositModalAllRecord={depositModalAllRecord}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PagePaysafeDeposit;
