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

const PageClearent = ({ history, match }) => {
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: 20,
        column: localStorage.account_clearent_table_sort_column,
        order: localStorage.account_clearent_table_sort_order
    });
    const [totalRecord, setTotalRecord] = useState(0);
    const [openRecord, setOpenRecord] = useState(0);
    const [closeRecord, setCloseRecord] = useState(0);

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        console.log("@dataTableInfo", dataTableInfo);
        localStorage.account_clearent_table_sort_column = dataTableInfo.column;
        localStorage.account_clearent_table_sort_order = dataTableInfo.order;
        displayMerchantList();
        return () => {};
    }, [dataTableInfo]);

    const {
        mutate: mutateMerchantList,
        isLoading: isLoadingMerchantList
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/filtered",
        "clearent_merchant_list"
    );

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Reporting Clearent - " + moment().format("YYYY-MM-DD");

    const displayMerchantList = () => {
        mutateMerchantList(dataTableInfo, {
            onSuccess: res => {
                console.log("@", res);
                if (res.success) {
                    setList(res);

                    //console.log(res.acc);
                    setTotalRecord(res.total_count);
                    setOpenRecord(res.open_count);
                    setCloseRecord(res.close_count);
                    if(res.data.data.length > 0){
                        if (userdata.role == "Merchant") {
                            if (res.total_count <= 1) {
                                history.push(
                                    `/reporting/clearent/accounts/${res.data.data[0].merchantNumber}`
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
                }
            },
            onError: err => {
                console.log(err);
            }
        });
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
                Clearent
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
                "Merchant Number",
                "DBA Name",
                "Boarded Date",
                "Type",
                "Next Day Funding Enabled",
                "Settlement Method",
                "Status",
                "Complience Status",
                "SAQ Type Code",
                "SAQ Pass Date",
                "SAQ Expiration Date",
                "Email",
                "Business Phone",
                "Taxpayer Legal Name",
                "Tin Status Description",
                "Mailing Address",
                "MCC Description",
                "Physical Address",
                "Principal Name"
            ]
        ];
        const data = csvData.map(elt => [
            elt["Merchant Number"],
            elt["DBA Name"],
            elt["Boarded Date"],
            elt["Type"],
            elt["Next Day Funding Enabled"],
            elt["Settlement Method"],
            elt["Status"],
            elt["Complience Status"],
            elt["SAQ Type Code"],
            elt["SAQ Pass Date"],
            elt["SAQ Expiration Date"],
            elt["Email"],
            elt["Business Phone"],
            elt["Taxpayer Legal Name"],
            elt["Tin Status Description"],
            elt["Mailing Address"],
            elt["MCC Description"],
            elt["Physical Address"],
            elt["Principal Name"]
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

    const {
        mutate: mutateGetMerchantList,
        isLoading: isLoadingGetMerchantList
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/getMerchantsList",
        "clearent_get_merchant_list"
    );

    const handleGetMerchant = e => {
        mutateGetMerchantList(
            {},
            {
                onSuccess: res => {
                    notification.success({
                        message: "Clearent Data Updated"
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
        data: localStorage.column_settings_account_clearent_table
            ? JSON.parse(localStorage.column_settings_account_clearent_table)
            : [
                  { title: "Merchant Number", show: true },
                  { title: "DBA Name", show: true },
                  {
                      title: "Boarded Date",

                      show: true
                  },
                  {
                      title: "Type",

                      show: true
                  },

                  { title: "Next Day Funding Enabled", show: true },
                  { title: "Settlement Method", show: true },
                  { title: "Status", show: true },
                  { title: "Complience Status", show: true },
                  { title: "SAQ Type Code", show: true },
                  { title: "SAQ Pass Date", show: true },
                  { title: "SAQ Expiration Date", show: true },
                  { title: "Email", show: true },
                  { title: "Business Phone", show: true },
                  { title: "Taxpayer Legal Name", show: true },
                  { title: "Tin Status Description", show: true },
                  { title: "Mailing Address", show: true },
                  { title: "MCC Description", show: true },
                  { title: "Physical Address", show: true },
                  { title: "Principal Name", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.account_clearent_table_sort_column) {
            if (localStorage.account_clearent_table_sort_column == column) {
                return localStorage.account_clearent_table_sort_order + "end";
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

    useEffect(() => {
        let col_sizes = localStorage.rclearent_table_col_sizes
            ? JSON.parse(localStorage.rclearent_table_col_sizes)
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
        if (!localStorage.rclearent_table_col_sizes) {
            var a = {
                "Merchant Number": 171,
                "DBA Name": 124,
                "Boarded Date": 138,
                Type: 83,
                "Next Day Funding Enabled": 218,
                "Settlement Method": 173,
                Status: 93,
                "Complience Status": 174,
                "SAQ Type Code": 154,
                "SAQ Pass Date": 144,
                "SAQ Expiration Date": 183,
                Email: 189,
                "Business Phone": 154,
                "Taxpayer Legal Name": 188,
                "Tin Status Description": 191,
                "Mailing Address": 159,
                "MCC Description": 164,
                "Physical Address": 162,
                "Principal Name": 146
            };

            localStorage.setItem(
                "rclearent_table_col_sizes",
                JSON.stringify(a)
            );

            $(`table th:nth-child(1)`).prop("width", 171);
            $(`table th:nth-child(2)`).prop("width", 124);
            $(`table th:nth-child(3)`).prop("width", 138);
            $(`table th:nth-child(4)`).prop("width", 83);
            $(`table th:nth-child(5)`).prop("width", 218);
            $(`table th:nth-child(6)`).prop("width", 173);
            $(`table th:nth-child(7)`).prop("width", 93);
            $(`table th:nth-child(8)`).prop("width", 174);
            $(`table th:nth-child(9)`).prop("width", 154);
            $(`table th:nth-child(10)`).prop("width", 144);
            $(`table th:nth-child(11)`).prop("width", 183);
            $(`table th:nth-child(12)`).prop("width", 189);
            $(`table th:nth-child(13)`).prop("width", 154);
            $(`table th:nth-child(14)`).prop("width", 188);
            $(`table th:nth-child(15)`).prop("width", 191);
            $(`table th:nth-child(16)`).prop("width", 159);
            $(`table th:nth-child(17)`).prop("width", 164);
            $(`table th:nth-child(18)`).prop("width", 162);
            $(`table th:nth-child(19)`).prop("width", 146);
        }

        return () => {};
    }, []);

    return (
        <div
            className="animated fadeIn account"
            id="clearentaccounts"
            style={{
                padding: "24px 16px"
            }}
        >
            <Row>
                <Col md={24}>
                    <Card
                        title="Clearent Merchant Accounts"
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
                                    </CSVLink> */}
                                    {/* <Button
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
                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        page_number: pagination.current,
                                        page_size: pagination.pageSize
                                        // column: sorter.columnKey,
                                        // order: sorter.order
                                        //     ? sorter.order.replace("end", "")
                                        //     : null
                                    });

                                    // localStorage.account_clearent_table_sort_column =
                                    //     sorter.columnKey;
                                    // localStorage.account_clearent_table_sort_order = sorter.order
                                    //     ? sorter.order.replace("end", "")
                                    //     : null;

                                    let array_get = [];
                                    extra.currentDataSource.map(
                                        (value, key) => {
                                            array_get.push({
                                                "Merchant Number":
                                                    value.merchantNumber,
                                                "DBA Name": value.merchantDBA,
                                                "Boarded Date": value.merchantBoardedDate
                                                    ? moment(
                                                          value.merchantBoardedDate
                                                      ).format("YYYY-MM-DD")
                                                    : "",
                                                Type:
                                                    value.merchantIncorporationTypeDescription,
                                                "Next Day Funding Enabled":
                                                    value.isMerchantNextDayFundingEnabled,
                                                "Settlement Method":
                                                    value.merchantSettlementMethodName,
                                                Status:
                                                    value.merchantStatusDescription,
                                                "Complience Status":
                                                    value.merchantComplianceStatusDescription,
                                                "SAQ Type Code":
                                                    value.merchantSAQTypeCode,
                                                "SAQ Pass Date": value.merchantLastSAQPassDate
                                                    ? moment(
                                                          value.merchantLastSAQPassDate
                                                      ).format("YYYY-MM-DD")
                                                    : "",
                                                "SAQ Expiration Date": value.merchantSAQExpirationDate
                                                    ? moment(
                                                          value.merchantSAQExpirationDate
                                                      ).format("YYYY-MM-DD")
                                                    : "",
                                                Email:
                                                    value.merchantEmailAddress,
                                                "Business Phone":
                                                    value.merchantBusinessPhoneNumberFull,
                                                "Taxpayer Legal Name":
                                                    value.merchantTaxpayerLegalName,
                                                "Tin Status Description":
                                                    value.merchantTINStatusDescription,
                                                "Mailing Address":
                                                    value.merchantPhysicalAddressLine1 +
                                                    ", " +
                                                    value.merchantPhysicalCity +
                                                    ", " +
                                                    value.merchantPhysicalStateOrProvince +
                                                    ", " +
                                                    value.merchantPhysicalPostalCode,
                                                "MCC Description":
                                                    value.merchantMCCDescription,
                                                "Physical Address":
                                                    value.merchantPhysicalAddressLine1 +
                                                    ", " +
                                                    value.merchantPhysicalCity +
                                                    ", " +
                                                    value.merchantPhysicalPostalCode,
                                                "Principal Name":
                                                    value.merchantPrincipal1FirstName
                                            });
                                        }
                                    );

                                    setCsvData(array_get);
                                }}
                                scroll={{ x: "fit-content" }}
                            >
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Merchant Number"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantNumber"
                                        key="merchantNumber"
                                        title={
                                            <CustomTableTitle
                                                title="Merchant Number"
                                                dataIndex="merchantNumber"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return (
                                                <Link
                                                    to={`/reporting/clearent/accounts/${record.merchantNumber}`}
                                                >
                                                    {record.merchantNumber}
                                                </Link>
                                            );
                                        }}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "DBA Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantDBA"
                                        key="merchantDBA"
                                        title={
                                            <CustomTableTitle
                                                title="DBA Name"
                                                dataIndex="merchantDBA"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Boarded Date"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantBoardedDate"
                                        key="merchantBoardedDate"
                                        title={
                                            <CustomTableTitle
                                                title="Boarded Date"
                                                dataIndex="merchantBoardedDate"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return moment(
                                                record.merchantBoardedDate
                                            ).format("ll");
                                        }}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Type"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantIncorporationTypeDescription"
                                        key="merchantIncorporationTypeDescription"
                                        title={
                                            <CustomTableTitle
                                                title="Type"
                                                dataIndex="merchantIncorporationTypeDescription"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Next Day Funding Enabled"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="isMerchantNextDayFundingEnabled"
                                        key="isMerchantNextDayFundingEnabled"
                                        title={
                                            <CustomTableTitle
                                                title="Next Day Funding Enabled"
                                                dataIndex="isMerchantNextDayFundingEnabled"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Settlement Method"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantSettlementMethodName"
                                        key="merchantSettlementMethodName"
                                        title={
                                            <CustomTableTitle
                                                title="Settlement Method"
                                                dataIndex="merchantSettlementMethodName"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
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
                                        dataIndex="merchantStatusDescription"
                                        key="merchantStatusDescription"
                                        title={
                                            <CustomTableTitle
                                                title="Status"
                                                dataIndex="merchantStatusDescription"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Complience Status"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantComplianceStatusDescription"
                                        key="merchantComplianceStatusDescription"
                                        title={
                                            <CustomTableTitle
                                                title="Complience Status"
                                                dataIndex="merchantComplianceStatusDescription"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "SAQ Type Code"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantSAQTypeCode"
                                        key="merchantSAQTypeCode"
                                        title={
                                            <CustomTableTitle
                                                title="SAQ Type Code"
                                                dataIndex="merchantSAQTypeCode"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "SAQ Pass Date"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantLastSAQPassDate"
                                        key="merchantLastSAQPassDate"
                                        title={
                                            <CustomTableTitle
                                                title="SAQ Pass Date"
                                                dataIndex="merchantLastSAQPassDate"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return record.merchantLastSAQPassDate
                                                ? moment(
                                                      record.merchantLastSAQPassDate
                                                  ).format("ll")
                                                : "";
                                        }}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "SAQ Expiration Date"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantSAQExpirationDate"
                                        key="merchantSAQExpirationDate"
                                        title={
                                            <CustomTableTitle
                                                title="SAQ Expiration Date"
                                                dataIndex="merchantSAQExpirationDate"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return record.merchantSAQExpirationDate !=
                                                ""
                                                ? moment(
                                                      record.merchantSAQExpirationDate
                                                  ).format("ll")
                                                : "";
                                        }}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Email"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantEmailAddress"
                                        key="merchantEmailAddress"
                                        title={
                                            <CustomTableTitle
                                                title="Email"
                                                dataIndex="merchantEmailAddress"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Business Phone"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantBusinessPhoneNumberFull"
                                        key="merchantBusinessPhoneNumberFull"
                                        title={
                                            <CustomTableTitle
                                                title="Business Phone"
                                                dataIndex="merchantBusinessPhoneNumberFull"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "Taxpayer Legal Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantTaxpayerLegalName"
                                        key="merchantTaxpayerLegalName"
                                        title={
                                            <CustomTableTitle
                                                title="Taxpayer Legal Name"
                                                dataIndex="merchantTaxpayerLegalName"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "Tin Status Description"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantTINStatusDescription"
                                        key="merchantTINStatusDescription"
                                        title={
                                            <CustomTableTitle
                                                title="Tin Status Description"
                                                dataIndex="merchantTINStatusDescription"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "Mailing Address"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantMailingAddressLine1"
                                        key="merchantMailingAddressLine1"
                                        title={
                                            <CustomTableTitle
                                                title="Mailing Address"
                                                dataIndex="merchantMailingAddressLine1"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return (
                                                record.merchantMailingAddressLine1 +
                                                record.merchantMailingAddressLine2 +
                                                " ," +
                                                record.merchantMailingCity +
                                                " " +
                                                record.merchantMailingStateProvince +
                                                " " +
                                                record.merchantMailingPostalCode
                                            );
                                        }}
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "MCC Description"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantMCCDescription"
                                        key="merchantMCCDescription"
                                        title={
                                            <CustomTableTitle
                                                title="MCC Description"
                                                dataIndex="merchantMCCDescription"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "Physical Address"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantPhysicalAddressLine1"
                                        key="merchantPhysicalAddressLine1"
                                        title={
                                            <CustomTableTitle
                                                title="Physical Address"
                                                dataIndex="merchantPhysicalAddressLine1"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            return (
                                                record.merchantPhysicalAddressLine1 +
                                                record.merchantPhysicalAddressLine2 +
                                                " ," +
                                                record.merchantPhysicalCity +
                                                " " +
                                                record.merchantPhysicalStateOrProvince +
                                                " " +
                                                record.merchantPhysicalPostalCode
                                            );
                                        }}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Principal Name"
                                ).show && (
                                    <Table.Column
                                        ellipsis={true}
                                        dataIndex="merchantPrincipal1FirstName"
                                        key="merchantPrincipal1FirstName"
                                        title={
                                            <CustomTableTitle
                                                title="Principal Name"
                                                dataIndex="merchantPrincipal1FirstName"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="rclearent_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_account_clearent_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_account_clearent_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        render={(text, record) => {
                                            let merchantPrincipal1FirstName = record
                                                ? record.merchantPrincipal1FirstName
                                                : "";
                                            let merchantPrincipal2FirstName = record
                                                ? record.merchantPrincipal2FirstName
                                                : "";
                                            return `${merchantPrincipal1FirstName} ${merchantPrincipal2FirstName}`;
                                        }}
                                    />
                                )}
                            </ResizableAntdTable>
                        </div>
                    </Card>{" "}
                    <TableColumnSettings
                        showTableColumnSettings={showTableColumnSettings}
                        setShowTableColumnSettings={setShowTableColumnSettings}
                        localStorageKey="column_settings_account_clearent_table"
                    />
                </Col>
            </Row>
        </div>
    );
};

export default PageClearent;
