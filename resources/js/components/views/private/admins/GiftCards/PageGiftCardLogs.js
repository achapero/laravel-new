import React, { useState, useEffect, useRef } from "react";
// import moment, { isMoment } from "moment";
import moment from "moment-timezone";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
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
    DatePicker,
    Modal,
    Spin,
    Typography,
    Comment,
    Avatar
} from "antd";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import { number_format } from "../../../../providers/number_format";
import { CSVLink } from "react-csv";
import PageGIftCardContentHeaderV2 from "./PageGIftCardContentHeaderV2";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    LoadingOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    DollarCircleOutlined
} from "@ant-design/icons";

import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGiftCardLogs = ({ history, permission }) => {
    const loadingSpin = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);
    localStorage.removeItem("column_settings_gcc_logs_table");
    localStorage.removeItem("gcc_logs_table_col_sizes");
    localStorage.removeItem("data_table_gcc_logs_sort_column");
    localStorage.removeItem("data_table_gcc_logs_sort_order");

    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: my_filter.app_status ? my_filter.app_status : "",
        page_number: 1,
        page_size: 20,
        days: 7,
        column:
            localStorage.data_table_gcc_logs_sort_column == null
                ? "created_at"
                : localStorage.data_table_gcc_logs_sort_column,
        order:
            localStorage.data_table_gcc_logs_sort_order == null
                ? "desc"
                : localStorage.data_table_gcc_logs_sort_order
    });

    const [List, setList] = useState([]);
    const {
        data: dataForms,
        refetch: refetchForms,
        isFetching: isFetchingForms,
        isLoading: isLoadingForms
    } = useAxiosQuery(
        "GET",
        "api/v1/gift_logs?" + $.param(dataTableInfo),
        "gift_logs",
        res => {
            if (res.success) {
                // console.log("gift_logs", res);
                // setTimeout(() => getCheckPermission(permission), 500);
                setList(res);
            }
        }
    );

    useEffect(() => {
        localStorage.data_table_gcc_logs_sort_column = dataTableInfo.column;
        localStorage.data_table_gcc_logs_sort_order = dataTableInfo.order;
        refetchForms();
        // getData();
        return () => {};
    }, [dataTableInfo]);

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

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_gcc_logs_table
            ? JSON.parse(localStorage.column_settings_gcc_logs_table)
            : [
                  { title: "Merchant Name", show: true },
                  { title: "Request Header", show: true },
                  { title: "Request Body", show: true },
                  { title: "Response Body", show: true },
                  { title: "Transaction Type", show: true },
                  { title: "Date Created", show: true }
              ]
    });

    const OpenSettings = () => {
        setShowTableColumnSettings({
            ...showTableColumnSettings,
            show: true
        });
    };

    const checkIfDefault = column => {
        if (localStorage.data_table_gcc_logs_sort_column) {
            if (localStorage.data_table_gcc_logs_sort_column == column) {
                return localStorage.data_table_gcc_logs_sort_order + "end";
            }
        }

        return null;
    };

    useEffect(() => {
        let col_sizes = localStorage.gcc_logs_table_col_sizes
            ? JSON.parse(localStorage.gcc_logs_table_col_sizes)
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
        if (!localStorage.gcc_logs_table_col_sizes) {
            var data = {
                "Merchant Name": "135",
                "Request Header": "135",
                "Request Body": "135",
                "Response Body": "135",
                "Transaction Type": "135",
                "Date Created": "135"
            };
            localStorage.setItem(
                "gcc_logs_table_col_sizes",
                JSON.stringify(data)
            );

            $("table th:nth-child(1)").prop("width", "135");
            $("table th:nth-child(2)").prop("width", "135");
            $("table th:nth-child(3)").prop("width", "135");
            $("table th:nth-child(4)").prop("width", "135");
            $("table th:nth-child(5)").prop("width", "135");
            $("table th:nth-child(6)").prop("width", "135");
        } else {
            // $(".action").prop("width", "100");
        }
        return () => {};
    }, []);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleComment, setIsModalVisibleComment] = useState();
    const [modalText, setModalText] = useState("");

    const handlerView = (val, type) => {
        // console.log(val)
        let data = JSON.parse(val);
        console.log(data);

        setModalText(data);
        setIsModalVisibleComment(type);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [visibleDays, setVisibleDays] = useState(false);
    const handleGetDays = val => {
        // alert(val)
        setVisibleDays(!visibleDays);
        setDataTableInfo({
            ...dataTableInfo,
            page_number: 1,
            days: val
        });
    };

    return (
        <div
            className="animated fadeIn merchantFiles"
            id="panList"
            style={{
                padding: "24px 16px"
            }}
        >
            <Card title="Gift Card Logs" bordered={false}>
                <Row gutter={24}>
                    <Col xs={12} md={8} className="p-0">
                        <Button
                            type="primary"
                            title="Upload"
                            icon={<ReloadOutlined />}
                            onClick={e => {
                                // getData();
                                refetchForms();
                            }}
                        >
                            Refresh
                        </Button>
                        {/* {visibleDays == false && <Button
                                type="primary"
                                title="Upload"
                                icon={<EyeOutlined />}
                                onClick={e => handleGetDays(7)}
                                style={{ marginLeft: '5px'}}
                            >
                                View Last 7 Days
                        </Button> }
                        {visibleDays == true && <Button
                            type="primary"
                            title="Upload"
                            icon={<EyeOutlined />}
                            onClick={e => handleGetDays(3)}
                            style={{ marginLeft: '5px'}}
                        >
                            View Last 3 Days
                        </Button>} */}
                    </Col>
                    <Col xs={0} md={8}></Col>
                    <Col xs={12} md={8}>
                        <div style={{ display: "flex" }}>
                            <Input.Search
                                placeholder="Search"
                                onSearch={e =>
                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        filter_value: e,
                                        page_number: 1
                                    })
                                }
                                onChange={e => setSearchText(e.target.value)}
                                allowClear
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
                    {List && (
                        <ResizableAntdTable
                            className="table-pan-list"
                            scroll={{ x: "fit-content" }}
                            loading={isFetchingForms}
                            // loading={isLoadingLogs}
                            // loading={isLoadingLogs || isLoadingAddPAN}
                            rowKey={record => record.id}
                            dataSource={List.data ? List.data.data : []}
                            pagination={{
                                pageSize: dataTableInfo.page_size,
                                current: List.data ? List.data.current_page : 1,
                                showSizeChanger: true,
                                total: List.data ? List.data.total : 1,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} items (in past 7 days)`,
                                pageSizeOptions: [20, 50, 100, 200]
                            }}
                            onChange={(pagination, filters, sorter, extra) => {
                                setDataTableInfo({
                                    ...dataTableInfo,
                                    page_number: pagination.current,
                                    page_size: pagination.pageSize
                                    // column: sorter.columnKey,
                                    // order: sorter.order ? sorter.order.replace("end", "") : null
                                });
                            }}
                        >
                            {showTableColumnSettings.data.find(
                                p => p.title == "Merchant Name"
                            ).show && (
                                <Table.Column
                                    key="merchant_name"
                                    dataIndex="merchant_name"
                                    render={(text, record) => {
                                        return record.merchant_name
                                            ? record.merchant_name
                                            : record.merchant_name_old;
                                    }}
                                    title={
                                        <CustomTableTitle
                                            title="Merchant Name"
                                            dataIndex="merchant_name"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                            localStorageKey="gcc_logs_table_col_sizes"
                                            localStorageTableCols={
                                                localStorage.column_settings_gcc_logs_table
                                                    ? JSON.parse(
                                                          localStorage.column_settings_gcc_logs_table
                                                      ).length
                                                    : 0
                                            }
                                        />
                                    }
                                    ellipsis={true}
                                />
                            )}
                            {showTableColumnSettings.data.find(
                                p => p.title == "Request Header"
                            ).show && (
                                <Table.Column
                                    key="request_header"
                                    dataIndex="request_header"
                                    render={(text, record) => {
                                        return (
                                            <p
                                                style={{
                                                    color: "#3cb4ca",
                                                    cursor: "pointer"
                                                }}
                                                onClick={e =>
                                                    handlerView(
                                                        record.request_header,
                                                        1
                                                    )
                                                }
                                            >
                                                {record.request_header}
                                            </p>
                                        );
                                    }}
                                    title={
                                        <CustomTableTitle
                                            title="Request Header"
                                            dataIndex="request_header"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                            localStorageKey="gcc_logs_table_col_sizes"
                                            localStorageTableCols={
                                                localStorage.column_settings_gcc_logs_table
                                                    ? JSON.parse(
                                                          localStorage.column_settings_gcc_logs_table
                                                      ).length
                                                    : 0
                                            }
                                        />
                                    }
                                    ellipsis={true}
                                />
                            )}
                            {showTableColumnSettings.data.find(
                                p => p.title == "Request Body"
                            ).show && (
                                <Table.Column
                                    key="request_body"
                                    dataIndex="request_body"
                                    render={(text, record) => {
                                        return (
                                            <p
                                                style={{
                                                    color: "#3cb4ca",
                                                    cursor: "pointer"
                                                }}
                                                onClick={e =>
                                                    handlerView(
                                                        record.request_body,
                                                        2
                                                    )
                                                }
                                            >
                                                {record.request_body}
                                            </p>
                                        );
                                    }}
                                    title={
                                        <CustomTableTitle
                                            title="Request Body"
                                            dataIndex="request_body"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                            localStorageKey="gcc_logs_table_col_sizes"
                                            localStorageTableCols={
                                                localStorage.column_settings_gcc_logs_table
                                                    ? JSON.parse(
                                                          localStorage.column_settings_gcc_logs_table
                                                      ).length
                                                    : 0
                                            }
                                        />
                                    }
                                    ellipsis={true}
                                />
                            )}
                            {showTableColumnSettings.data.find(
                                p => p.title == "Response Body"
                            ).show && (
                                <Table.Column
                                    key="response_body"
                                    dataIndex="response_body"
                                    render={(text, record) => {
                                        return (
                                            <p
                                                style={{
                                                    color: "#3cb4ca",
                                                    cursor: "pointer"
                                                }}
                                                onClick={e =>
                                                    handlerView(
                                                        record.response_body,
                                                        3
                                                    )
                                                }
                                            >
                                                {record.response_body}
                                            </p>
                                        );
                                    }}
                                    title={
                                        <CustomTableTitle
                                            title="Response Body"
                                            dataIndex="response_body"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                            localStorageKey="gcc_logs_table_col_sizes"
                                            localStorageTableCols={
                                                localStorage.column_settings_gcc_logs_table
                                                    ? JSON.parse(
                                                          localStorage.column_settings_gcc_logs_table
                                                      ).length
                                                    : 0
                                            }
                                        />
                                    }
                                    ellipsis={true}
                                />
                            )}
                            {showTableColumnSettings.data.find(
                                p => p.title == "Transaction Type"
                            ).show && (
                                <Table.Column
                                    key="transaction_type"
                                    dataIndex="transaction_type"
                                    title={
                                        <CustomTableTitle
                                            title="Transaction Type"
                                            dataIndex="transaction_type"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                            localStorageKey="gcc_logs_table_col_sizes"
                                            localStorageTableCols={
                                                localStorage.column_settings_gcc_logs_table
                                                    ? JSON.parse(
                                                          localStorage.column_settings_gcc_logs_table
                                                      ).length
                                                    : 0
                                            }
                                        />
                                    }
                                    ellipsis={true}
                                />
                            )}
                            {showTableColumnSettings.data.find(
                                p => p.title == "Date Created"
                            ).show && (
                                <Table.Column
                                    key="created_at"
                                    dataIndex="created_at"
                                    render={(text, record) => {
                                        // return moment(record.updated_at).format("YYYY-MM-DD h:mm:ss");
                                        return moment(record.updated_at)
                                            .tz("America/New_York")
                                            .format("YYYY-MM-DD h:mm:ss A");
                                        // return moment().tz("America/Los_Angeles").format();;
                                    }}
                                    title={
                                        <CustomTableTitle
                                            title="Date Created (EST)"
                                            dataIndex="created_at"
                                            dataTableInfo={dataTableInfo}
                                            setDataTableInfo={setDataTableInfo}
                                            localStorageKey="gcc_logs_table_col_sizes"
                                            localStorageTableCols={
                                                localStorage.column_settings_gcc_logs_table
                                                    ? JSON.parse(
                                                          localStorage.column_settings_gcc_logs_table
                                                      ).length
                                                    : 0
                                            }
                                        />
                                    }
                                    ellipsis={true}
                                />
                            )}
                        </ResizableAntdTable>
                    )}
                </div>
            </Card>

            <Modal
                title="View Details"
                visible={isModalVisible}
                okButtonProps={{ style: { display: "none" } }}
                onCancel={handleCancel}
                cancelText="close"
                width={800}
            >
                <p>
                    {/* {modalText} */}
                    {isModalVisibleComment == 1 && (
                        <span>
                            {modalText["Accept"] && (
                                <>
                                    {" "}
                                    Accept : {modalText["Accept"]}
                                    <br />
                                </>
                            )}
                            {modalText["Connection"] && (
                                <>
                                    {" "}
                                    Accept-Encoding :{" "}
                                    {modalText["Accept-Encoding"]}
                                    <br />
                                </>
                            )}
                            {modalText["Connection"] && (
                                <>
                                    {" "}
                                    Connection : {modalText["Connection"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["Content-Length"] && (
                                <>
                                    {" "}
                                    Content-Length :{" "}
                                    {modalText["Content-Length"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["Content-Type"] && (
                                <>
                                    {" "}
                                    Content-Type : {modalText["Content-Type"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["Host"] && (
                                <>
                                    {" "}
                                    Host : {modalText["Host"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["Postman-Token"] && (
                                <>
                                    {" "}
                                    Postman-Token : {modalText["Postman-Token"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["User-Agent"] && (
                                <>
                                    {" "}
                                    User-Agent : {modalText["User-Agent"]}
                                    <br />{" "}
                                </>
                            )}
                        </span>
                    )}
                    {isModalVisibleComment == 2 && (
                        <span>
                            {modalText["Amount"] != "" ? (
                                <>
                                    {" "}
                                    Amount : {modalText["Amount"]}
                                    <br />{" "}
                                </>
                            ) : (
                                <>
                                    Amount : 0.00
                                    <br />
                                </>
                            )}
                            {modalText["CardNumber"] && (
                                <>
                                    {" "}
                                    CardNumber : {modalText["CardNumber"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["CashierRef"] && (
                                <>
                                    {" "}
                                    CashierRef : {modalText["CashierRef"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["Force"] && (
                                <>
                                    {" "}
                                    Force : {modalText["Force"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["HardwareID"] && (
                                <>
                                    {" "}
                                    HardwareID : {modalText["HardwareID"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["ReferenceNumber"] && (
                                <>
                                    {" "}
                                    ReferenceNumber :{" "}
                                    {modalText["ReferenceNumber"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["TipAmount"] != "" ? (
                                <>
                                    {" "}
                                    TipAmount : {modalText["TipAmount"]}
                                    <br />{" "}
                                </>
                            ) : (
                                <>
                                    TipAmount : 0.00
                                    <br />
                                </>
                            )}
                            {modalText["TransactionRef"] && (
                                <>
                                    {" "}
                                    TransactionRef :{" "}
                                    {modalText["TransactionRef"]}
                                    <br />{" "}
                                </>
                            )}
                        </span>
                    )}
                    {isModalVisibleComment == 3 && (
                        <span>
                            {modalText["ErrorCode"] && (
                                <>
                                    {" "}
                                    ErrorCode : {modalText["ErrorCode"]}
                                    <br />{" "}
                                </>
                            )}
                            {modalText["Message"] != "" ? (
                                <>
                                    {" "}
                                    Message : {modalText["Message"]}
                                    <br />{" "}
                                </>
                            ) : (
                                <>
                                    Message : <br />
                                </>
                            )}
                            {!modalText["ErrorCode"] && (
                                <>
                                    {modalText["ReferenceCode"] && (
                                        <>
                                            {" "}
                                            ReferenceCode :{" "}
                                            {modalText["ReferenceCode"]}
                                            <br />{" "}
                                        </>
                                    )}
                                    {modalText["FinalTransactionAmount"] !=
                                    "" ? (
                                        <>
                                            {" "}
                                            FinalTransactionAmount :{" "}
                                            {
                                                modalText[
                                                    "FinalTransactionAmount"
                                                ]
                                            }
                                            <br />{" "}
                                        </>
                                    ) : (
                                        <>
                                            FinalTransactionAmount : 0<br />
                                        </>
                                    )}
                                    {modalText["CardBalance"] != "" ? (
                                        <>
                                            {" "}
                                            CardBalance :{" "}
                                            {modalText["CardBalance"]}
                                            <br />{" "}
                                        </>
                                    ) : (
                                        <>
                                            CardBalance : 0.00
                                            <br />
                                        </>
                                    )}
                                </>
                            )}
                        </span>
                    )}
                </p>
            </Modal>

            <TableColumnSettings
                showTableColumnSettings={showTableColumnSettings}
                setShowTableColumnSettings={setShowTableColumnSettings}
                localStorageKey="column_settings_gcc_logs_table"
            />
        </div>
    );
};

export default PageGiftCardLogs;
