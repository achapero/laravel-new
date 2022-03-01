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
    notification
} from "antd";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
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
import { widhtAdjustable } from "../../../../../providers/widhtAdjustable";

import CustomTableTitle from "../../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import getCheckPermission from "../../../../../providers/getCheckPermission";

const PagePaysafe = ({ history, permission }) => {
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "20",
        column: localStorage.account_paysafe_table_sort_column,
        order: localStorage.account_paysafe_table_sort_order,
        paysafe_status: localStorage.paysafe_paysafe_status
            ? JSON.parse(localStorage.paysafe_paysafe_status)
            : ["Open", "Closed"]
    });
    const [totalRecord, setTotalRecord] = useState(0);
    const [openRecord, setOpenRecord] = useState(0);
    const [closeRecord, setCloseRecord] = useState(0);

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        console.log("@dataTableInfo", dataTableInfo);
        localStorage.account_paysafe_table_sort_column = dataTableInfo.column;
        localStorage.account_paysafe_table_sort_order = dataTableInfo.order;
        displayMerchantList();
        return () => {};
    }, [dataTableInfo]);

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Reporting Paysafe - " + moment().format("YYYY-MM-DD");

    const {
        mutate: mutateMerchantList,
        isLoading: isLoadingMerchantList
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/accounts/filtered",
        "paysafe_merchant_list"
    );

    const displayMerchantList = () => {
        mutateMerchantList(dataTableInfo, {
            onSuccess: res => {
                // console.log("@", res);
                setTimeout(() => getCheckPermission(permission), 500);
                if (res.success) {
                    setList(res);

                    let array_get = [];
                    res.data.data.map((value, key) => {
                        array_get.push({
                            "App #": value.app_number,
                            "Merchant Number": value.merchant_number,
                            "Merchant Name": value.merchant_name,
                            "Agent #": value.agent_number,
                            "Agent Name": value.agent_name,
                            "Rep #": value.rep_number,
                            "Rep Name": value.rep_name,
                            Status: value.status,
                            "Approved Date": value.approved_date,
                            "Closed Date": value.closed_date,
                            "Corp Name": value.corp_name,
                            "Phone Number": value.phone_number,
                            "Owner Name": value.owner_name
                        });
                    });

                    setCsvData(array_get);

                    //console.log(res.acc);
                    setTotalRecord(res.total_count);
                    setOpenRecord(res.open_count);
                    setCloseRecord(res.close_count);
                    if (userdata.role == "Merchant") {
                        if (res.total_count <= 1) {
                            history.push(
                                `/reporting/paysafe/accounts/${res.data[0].merchantNumber}`
                            );
                            setShowTable(false);
                            //setShowTable(true);
                        } else {
                            setShowTable(true);
                        }
                    } else {
                        setShowTable(true);
                    }
                }
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    const {
        mutate: mutateGetMerchantList,
        isLoading: isLoadingGetMerchantList
    } = useAxiosQuery(
        "POST",
        "api/v1/paysafe/accounts/bulkinsert",
        "paysafe_get_merchant_list"
    );

    const handleGetMerchant = e => {
        mutateGetMerchantList(
            {},
            {
                onSuccess: res => {
                    notification.success({
                        message: "Paysafe Data Updated"
                    });
                    displayMerchantList();
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_account_paysafe_table
            ? JSON.parse(localStorage.column_settings_account_paysafe_table)
            : [
                  { title: "App #", show: true },
                  { title: "Merchant Number", show: true },
                  {
                      title: "Merchant Name",

                      show: true
                  },
                  {
                      title: "Agent #",

                      show: true
                  },

                  { title: "Agent Name", show: true },
                  { title: "Rep #", show: true },
                  { title: "Rep Name", show: true },
                  { title: "Status", show: true },
                  { title: "Approved Date", show: true },
                  { title: "Closed Date", show: true },
                  { title: "Corp Name", show: true },
                  { title: "Phone Number", show: true },
                  { title: "Owner Name", show: true }
              ]
    });

    useEffect(() => {
        let isMobile = window.matchMedia("only screen and (max-width: 480px)")
            .matches;

        if (isMobile) {
            setShowTableColumnSettings({
                show: false,
                data: [
                    { title: "App #", show: false },
                    { title: "Merchant Number", show: false },
                    {
                        title: "Merchant Name",

                        show: true
                    },
                    {
                        title: "Agent #",

                        show: false
                    },

                    { title: "Agent Name", show: false },
                    { title: "Rep #", show: false },
                    { title: "Rep Name", show: false },
                    { title: "Status", show: false },
                    { title: "Approved Date", show: false },
                    { title: "Closed Date", show: false },
                    { title: "Corp Name", show: false },
                    { title: "Phone Number", show: true },
                    { title: "Owner Name", show: false }
                ]
            });
        }
    }, []);

    const checkIfDefault = column => {
        if (localStorage.account_paysafe_table_sort_column) {
            if (localStorage.account_paysafe_table_sort_column == column) {
                console.log(column);
                return localStorage.account_paysafe_table_sort_order + "end";
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
                PaySafe
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
                "App #",
                "Merchant Number",
                "Merchant Name",
                "Agent #",
                "Agent Name",
                "Rep #",
                "Rep Name",
                "Status",
                "Approved Date",
                "Closed Date",
                "Corp Name",
                "Phone Number",
                "Owner Name"
            ]
        ];
        const data = csvData.map(elt => [
            elt["App #"],
            elt["Merchant Number"],
            elt["Merchant Name"],
            elt["Agent #"],
            elt["Agent Name"],
            elt["Rep #"],
            elt["Rep Name"],
            elt["Status"],
            elt["Approved Date"],
            elt["Closed Date"],
            elt["Corp Name"],
            elt["Phone Number"],
            elt["Owner Name"]
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
        let col_sizes = localStorage.rpaysafe_table_col_sizes
            ? JSON.parse(localStorage.rpaysafe_table_col_sizes)
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
    }, [showTableColumnSettings]);

    useEffect(() => {
        if (!localStorage.rpaysafe_table_col_sizes) {
            var a = {
                "App #": 150,
                "Merchant Number": 175,
                "Merchant Name": 167,
                "Agent #": 119,
                "Agent Name": 142,
                "Rep #": 91,
                "Rep Name": 132,
                Status: 120,
                "Approved Date": 156,
                "Closed Date": 137,
                "Corp Name": 142,
                "Phone Number": 165,
                "Owner Name": 142
            };

            localStorage.setItem("rpaysafe_table_col_sizes", JSON.stringify(a));

            $(`table th:nth-child(1)`).prop("width", 150);
            $(`table th:nth-child(2)`).prop("width", 175);
            $(`table th:nth-child(3)`).prop("width", 167);
            $(`table th:nth-child(4)`).prop("width", 119);
            $(`table th:nth-child(5)`).prop("width", 142);
            $(`table th:nth-child(6)`).prop("width", 91);
            $(`table th:nth-child(7)`).prop("width", 132);
            $(`table th:nth-child(8)`).prop("width", 120);
            $(`table th:nth-child(9)`).prop("width", 156);
            $(`table th:nth-child(10)`).prop("width", 137);
            $(`table th:nth-child(11)`).prop("width", 142);
            $(`table th:nth-child(12)`).prop("width", 165);
            $(`table th:nth-child(13)`).prop("width", 142);
        }

        return () => {};
    }, []);

    return (
        <div
            className="animated fadeIn account"
            id="paysafeaccounts"
            style={{
                padding: "24px 16px"
            }}
        >
            <Row>
                <Col md={24}>
                    <Card
                        title="Paysafe Merchant Accounts"
                        bordered={false}
                        extra={
                            <Button
                                type="primary"
                                title="Upload"
                                icon={<ReloadOutlined />}
                                loading={isLoadingGetMerchantList}
                                onClick={e => handleGetMerchant()}
                            >
                                Refresh Account List
                            </Button>
                        }
                    >
                        <Row>
                            <Col md={8} xs={0}>
                                {" "}
                                <div className="my-3">
                                    <b className=""> Total: ({totalRecord})</b>
                                    <b className=""> Open: ({openRecord})</b>
                                    <b className=""> Closed: ({closeRecord})</b>
                                </div>
                            </Col>
                            <Col md={8} sm={0}></Col>
                            <Col md={8} sm={24}>
                                <div style={{ display: "flex" }}>
                                    {" "}
                                    <Input.Search
                                        placeholder="Search"
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
                                    {/* <CSVLink
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
                                    ></Button> */}
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
                                loading={
                                    isLoadingMerchantList ||
                                    isLoadingGetMerchantList
                                }
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
                                        List.length != 0 ? List.data.total : 1,

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
                                    localStorage.setItem(
                                        "paysafe_paysafe_status",
                                        JSON.stringify(filters.status)
                                    );

                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        page_number: pagination.current,
                                        page_size: pagination.pageSize,
                                        paysafe_status: filters.status
                                        // column: sorter.columnKey,
                                        // order: sorter.order
                                        //     ? sorter.order.replace("end", "")
                                        //     : null
                                    });

                                    // localStorage.account_paysafe_table_sort_column =
                                    //     sorter.columnKey;
                                    // localStorage.account_paysafe_table_sort_order = sorter.order
                                    //     ? sorter.order.replace("end", "")
                                    //     : null;

                                    let array_get = [];
                                    extra.currentDataSource.map(
                                        (value, key) => {
                                            array_get.push({
                                                "App #": value.app_number,
                                                "Merchant Number":
                                                    value.merchant_number,
                                                "Merchant Name":
                                                    value.merchant_name,
                                                "Agent #": value.agent_number,
                                                "Agent Name": value.agent_name,
                                                "Rep #": value.rep_number,
                                                "Rep Name": value.rep_name,
                                                Status: value.status,
                                                "Approved Date":
                                                    value.approved_date,
                                                "Closed Date":
                                                    value.closed_date,
                                                "Corp Name": value.corp_name,
                                                "Phone Number":
                                                    value.phone_number,
                                                "Owner Name": value.owner_name
                                            });
                                        }
                                    );

                                    setCsvData(array_get);
                                }}
                            >
                                {showTableColumnSettings.data.find(
                                    p => p.title == "App #"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="app_number"
                                        key="app_number"
                                        title={
                                            <CustomTableTitle
                                                title="Account Name"
                                                dataIndex="app_number"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
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
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return (
                                                <Link
                                                    className="view_btn"
                                                    to={`/reporting/paysafe/accounts/${record.merchant_number}`}
                                                >
                                                    {record.merchant_number}
                                                </Link>
                                            );
                                        }}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Merchant Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchant_name"
                                        key="merchant_name"
                                        title={
                                            <CustomTableTitle
                                                title="Merchant Name"
                                                dataIndex="merchant_name"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return (
                                                <Link
                                                    className="view_btn"
                                                    to={`/reporting/paysafe/accounts/${record.merchant_number}`}
                                                >
                                                    {record.merchant_name}
                                                </Link>
                                            );
                                        }}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Agent #"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="agent_number"
                                        key="agent_number"
                                        title={
                                            <CustomTableTitle
                                                title="Agent #"
                                                dataIndex="agent_number"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Agent Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="agent_name"
                                        key="agent_name"
                                        title={
                                            <CustomTableTitle
                                                title="Agent Name"
                                                dataIndex="agent_name"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Rep #"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="rep_number"
                                        key="rep_number"
                                        title={
                                            <CustomTableTitle
                                                title="Rep #"
                                                dataIndex="rep_number"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Rep Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="rep_name"
                                        key="rep_name"
                                        title="Rep Name"
                                        title={
                                            <CustomTableTitle
                                                title="Rep Name"
                                                dataIndex="rep_name"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Status"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="status"
                                        key="status"
                                        title={
                                            <CustomTableTitle
                                                title="Status"
                                                dataIndex="status"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        filters={[
                                            {
                                                text: "Open",
                                                value: "Open"
                                            },
                                            {
                                                text: "Closed",
                                                value: "Closed"
                                            }
                                        ]}
                                        defaultFilteredValue={
                                            dataTableInfo.paysafe_status
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Approved Date"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="approved_date"
                                        key="approved_date"
                                        title={
                                            <CustomTableTitle
                                                title="Approved Date"
                                                dataIndex="approved_date"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
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
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Corp Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="corp_name"
                                        key="corp_name"
                                        title={
                                            <CustomTableTitle
                                                title="Corp Name"
                                                dataIndex="corp_name"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Phone Number"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="phone_number"
                                        key="phone_number"
                                        title={
                                            <CustomTableTitle
                                                title="Phone Number"
                                                dataIndex="phone_number"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "Owner Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="owner_name"
                                        key="owner_name"
                                        title={
                                            <CustomTableTitle
                                                title="Owner Name"
                                                dataIndex="owner_name"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rpaysafe_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_paysafe_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_paysafe_table
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
                        setShowTableColumnSettings={setShowTableColumnSettings}
                        localStorageKey="column_settings_account_paysafe_table"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default PagePaysafe;
