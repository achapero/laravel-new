import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Divider,
    notification,
    Table,
    Popconfirm,
    DatePicker,
    Space
} from "antd";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    EditOutlined,
    EyeOutlined,
    MergeCellsOutlined,
    CheckCircleOutlined,
    PrinterOutlined,
    SearchOutlined,
    UserOutlined
} from "@ant-design/icons";

import {
    DirectLink,
    Element,
    Events,
    animateScroll as scroll,
    scrollSpy,
    scroller
} from "react-scroll";

import { Link, useLocation } from "react-router-dom";
import moment, { isMoment } from "moment";
import queryString from "query-string";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import { CSVLink } from "react-csv";
import PageTicketDnD from "./PageTicketsDnD";
import ButtonGroup from "antd/es/button/button-group";
// import TicketDND from "./TicketDnD";
import PageTicketUpdateStatusMulti from "./Modals/PageTicketUpdateStatusMultiModal";
import PageTicketUpdateAssignedToModal from "./Modals/PageTicketUpdateAssignedToModal";
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { widhtAdjustable } from "../../../../providers/widhtAdjustable";

import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";
import getCheckPermission from "../../../../providers/getCheckPermission";

const PageTickets = ({ permission }) => {
    const userdata = getUserData();
    const my_location = useLocation();
    const dashboard_filter = queryString.parse(my_location.search);

    const [List, setList] = useState([]);
    const [select, setSelect] = useState("");
    const [
        statusAwaitingCustomerReply,
        setStatusAwaitingCustomerReply
    ] = useState(0);
    const [statusOpen, setStatusOpen] = useState(0);
    const [
        statusAwaitingSupportReply,
        setStatusAwaitingSupportReply
    ] = useState(0);
    const [statusClose, setStatusClose] = useState(0);
    const [statusOnhold, setStatusOnhold] = useState(0);
    const [statusArchived, setStatusArchived] = useState(0);

    const location = useLocation();
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "20",
        column: localStorage.data_table_tickets_sort_column,
        order: localStorage.data_table_tickets_sort_order,
        ticket_priority:
            localStorage.tickets_ticket_priority &&
            localStorage.tickets_ticket_priority != "undefined"
                ? JSON.parse(localStorage.tickets_ticket_priority)
                : ["None", "High", "Low", "Medium"],
        ticket_status: dashboard_filter.ticket_status
            ? [dashboard_filter.ticket_status]
            : localStorage.tickets_ticket_status &&
              localStorage.tickets_ticket_status != "undefined"
            ? JSON.parse(localStorage.tickets_ticket_status)
            : [
                  "Awaiting Support Reply",
                  "Awaiting Customer Reply",
                  "On Hold",
                  "Closed"
                  //   "Archived"
              ],
        ticket_type:
            localStorage.tickets_ticket_type &&
            localStorage.tickets_ticket_type != "undefined"
                ? JSON.parse(localStorage.tickets_ticket_type)
                : [
                      "None",
                      "Training",
                      "POS Software",
                      "Credit Card",
                      "Workstation",
                      "Service Requested",
                      "Sales",
                      "Gift Cards",
                      "AdaptPAY",
                      "CC Terminal",
                      "Pan Request"
                  ]
    });

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_tickets_table
            ? JSON.parse(localStorage.column_settings_tickets_table)
            : [
                  { title: "ID", show: true },
                  { title: "Ticket Status", show: true },
                  { title: "Merchant Name", show: true },
                  { title: "Submitted by", show: true },
                  { title: "Ticket Subject", show: true },
                  { title: "Ticket Type", show: true },
                  { title: "Ticket Priority", show: true },
                  { title: "Date Created", show: true },
                  { title: "Assigned To", show: true },
                  { title: "Date Responded", show: true },
                  { title: "Action", show: true }
              ]
    });

    useEffect(() => {
        // console.log("Location changed");
        // console.log(dashboard_filter);
        if (!dashboard_filter.ticket_status) {
            setDataTableInfo({
                ...dataTableInfo,
                ticket_status:
                    localStorage.tickets_ticket_status &&
                    localStorage.tickets_ticket_status != "undefined"
                        ? JSON.parse(localStorage.tickets_ticket_status)
                        : [
                              "Awaiting Support Reply",
                              "Awaiting Customer Reply",
                              "On Hold",
                              "Closed"
                              //   "Archived"
                          ]
            });
        }
    }, [location]);

    useEffect(() => {
        localStorage.data_table_tickets_sort_column = dataTableInfo.column;
        localStorage.data_table_tickets_sort_order = dataTableInfo.order;
        // console.log('tickets_url_params', localStorage.tickets_url_params)
        getForms();
        return () => {};
    }, [dataTableInfo]);

    const { mutate: mutateForms, isLoading: isLoadingForms } = useAxiosQuery(
        "POST",
        "api/v1/ticket/filtered",
        "mutate_ticket_page"
    );

    let ExportFileName = "Tickets - " + moment().format("YYYY-MM-DD") + ".csv";
    const [csvData, setCsvData] = useState([]);

    const getForms = () => {
        // console.log(dataTableInfo);
        mutateForms(dataTableInfo, {
            onSuccess: res => {
                // console.log('@getForms',res);
                setList(res);
                res.tickets_count.forEach(element => {
                    let status = element.ticket_status
                        .toLowerCase()
                        .replace(/ /g, "");

                    if (status == "open") {
                        setStatusOpen(element.status_count);
                    }
                    if (status == "awaitingcustomerreply") {
                        setStatusAwaitingCustomerReply(element.status_count);
                    }
                    if (status == "awaitingsupportreply") {
                        setStatusAwaitingSupportReply(element.status_count);
                    }
                    if (status == "closed") {
                        setStatusClose(element.status_count);
                    }

                    if (status == "onhold") {
                        setStatusOnhold(element.status_count);
                    }
                    if (status == "archived") {
                        setStatusArchived(element.status_count);
                    }
                });
                setTimeout(() => getCheckPermission(permission), 500);
            },
            onError: err => {
                // console.log(err);
            }
        });
    };

    const {
        mutate: mutatedeleteRecord,
        isLoading: isLoadingdeleteRecord
    } = useAxiosQuery("DELETE", "api/v1/ticket", "mutate_ticket_page");

    function deleteRecord(id) {
        mutatedeleteRecord(
            { id: id },
            {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "Tickets Successfully Deleted"
                        });
                        getForms();
                    }
                },
                onError: err => {
                    // console.log(err);
                }
            }
        );
    }

    const OpenSettings = () => {
        setShowTableColumnSettings({
            ...showTableColumnSettings,
            show: true
        });
    };

    const checkIfDefault = column => {
        if (localStorage.data_table_tickets_sort_column) {
            if (localStorage.data_table_tickets_sort_column == column) {
                return localStorage.data_table_tickets_sort_order + "end";
            }
        }

        return null;
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

    const dateDiff = date => {
        let scaffold = "minute";
        let date_now = moment()
            .utc(0)
            .format("YYYY-MM-DD HH:mm:ss");
        let diff = moment(date_now).diff(moment(date), scaffold);
        if (diff > 60) {
            scaffold = "hour";
            diff = moment(date_now).diff(moment(date), scaffold);
            if (diff > 24) {
                scaffold = "day";
                diff = moment(date_now).diff(moment(date), scaffold);
                if (diff > 28) {
                    scaffold = "month";
                    diff = moment(date_now).diff(moment(date), scaffold);
                    if (diff > 12) {
                        scaffold = "year";
                        diff = moment(date_now).diff(moment(date), scaffold);
                    }
                }
            }
        }

        return (
            diff + " " + (diff > 1 ? scaffold + "s" : scaffold) + " " + "ago"
        );
    };

    const [showActions, setShowActions] = useState(true);

    const [selectedId, setSelectId] = useState([]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(selectedRows);
            setSelectId(selectedRows);

            if (selectedRows.length == 0) {
                setShowActions(true);
            } else {
                setShowActions(false);
            }
        }
    };

    useEffect(() => {
        Events.scrollEvent.register("begin", function() {
            // console.log("begin", arguments);
        });

        Events.scrollEvent.register("end", function() {
            // console.log("end", arguments);
        });
    });

    const handleReset = clearFilters => {
        clearFilters();
    };
    let searchInput;
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const {
        mutate: mutateMergeTicket,
        isLoading: isLoadingMergeTicket
    } = useAxiosQuery("POST", "api/v1/ticket/merge", "mutate_ticket_page");

    const mergeTicket = () => {
        if (selectedId.length <= 1) {
            notification.warning({
                message: "Nothing to Merge"
            });
        } else {
            mutateMergeTicket(
                { ids: selectedId },
                {
                    onSuccess: res => {
                        if (res.success) {
                            // console.log("@merge", res.message);
                            if (res.message == "all good") {
                                notification.success({
                                    message: "Ticket Successfully Merge"
                                });
                                getForms();
                                setDataTableInfo({
                                    ...dataTableInfo,
                                    reload: "2"
                                });

                                scroller.scrollTo("tableid" + res.arr_comp, {
                                    duration: 800,
                                    delay: 20,
                                    smooth: "easeInOutQuart",
                                    offset: -350
                                });
                            } else {
                                notification.error({
                                    message: res.message
                                });
                            }
                        }
                    },
                    onError: err => {
                        // console.log(err);
                    }
                }
            );
        }
    };

    const {
        mutate: mutatedeleteRecordMulti,
        isLoading: isLoadingdeleteRecordMulti
    } = useAxiosQuery(
        "POST",
        "api/v1/ticket/multiDelete",
        "mutate_ticket_page"
    );

    const deleteRecordMulti = () => {
        mutatedeleteRecordMulti(
            { ids: selectedId },
            {
                onSuccess: res => {
                    if (res.success) {
                        getForms();
                        notification.success({
                            message: "Tickets Successfully Deleted"
                        });
                        setShowActions(true);
                        setDataTableInfo({
                            ...dataTableInfo,
                            reload: "1"
                        });
                    }
                },
                onError: err => {
                    // console.log(err);
                }
            }
        );
    };
    const [showUpdateStatusMulti, setShowUpdateStatusMulti] = useState(false);
    const updateStatusMulti = () => {
        setShowUpdateStatusMulti(!showUpdateStatusMulti);
    };
    const [showUpdateAssignedTo, setShowUpdateAssignedTo] = useState(false);
    const updateAssignedTo = () => {
        setShowUpdateAssignedTo(!showUpdateAssignedTo);
    };

    const [columnWidth, setColumnWidth] = useState(300);

    useEffect(() => {
        let col_sizes = localStorage.tickets_table_table_col_sizes
            ? JSON.parse(localStorage.tickets_table_table_col_sizes)
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
        // $("table th:nth-child(1)").prop("width", "42");
        if (!localStorage.tickets_table_table_col_sizes) {
            var data = {
                ID: 67,
                "Ticket Status": 150,
                "Merchant Name": 156,
                "Submitted by": 143,
                "Ticket Subject": 146,
                "Ticket Type": 147,
                "Ticket Priority": 150,
                "Date Created": 150,
                "Assigned To": 136,
                "Date Responded": 157,
                Action: 100
            };

            localStorage.setItem(
                "tickets_table_table_col_sizes",
                JSON.stringify(data)
            );

            $("table th:nth-child(2)").prop("width", "67");
            $("table th:nth-child(3)").prop("width", "150");
            $("table th:nth-child(4)").prop("width", "156");
            $("table th:nth-child(5)").prop("width", "143");
            $("table th:nth-child(6)").prop("width", "146");
            $("table th:nth-child(7)").prop("width", "147");
            $("table th:nth-child(8)").prop("width", "150");
            $("table th:nth-child(9)").prop("width", "150");
            $("table th:nth-child(10)").prop("width", "136");
            $("table th:nth-child(11)").prop("width", "157");
            $("table th:nth-child(12)").prop("width", "100");
        }
        // else {
        //     $(".action").prop("width", "100");
        // }
        return () => {};
    }, []);

    const [Archivedbtn, setArchivedbtn] = useState(false);
    const tableArchived = status => {
        setArchivedbtn(!Archivedbtn);
        if (status == "Archived") {
            localStorage.setItem("localPageNumber", dataTableInfo.page_number);
            setDataTableInfo({
                ...dataTableInfo,
                ticket_status: [status],
                page_number: 1
            });
        } else {
            localStorage.setItem(
                "tickets_ticket_status",
                JSON.stringify([
                    "Awaiting Support Reply",
                    "Awaiting Customer Reply",
                    "On Hold",
                    "Closed"
                    // "Archived"
                ])
            );
            setDataTableInfo({
                ...dataTableInfo,
                page_number: localStorage.localPageNumber,
                ticket_status: dashboard_filter.ticket_status
                    ? [dashboard_filter.ticket_status]
                    : localStorage.tickets_ticket_status
                    ? JSON.parse(localStorage.tickets_ticket_status)
                    : [
                          "Awaiting Support Reply",
                          "Awaiting Customer Reply",
                          "On Hold",
                          "Closed",
                          "Archived"
                      ]
            });
            localStorage.removeItem("localPageNumber");
        }
    };

    return (
        <div
            className="pageTicket"
            id="tickets"
            style={{
                padding: "24px 16px"
            }}
        >
            <Row gutter={24}>
                <Col className="gutter-row" md={24}>
                    <PageTicketDnD
                        dataTableInfo={dataTableInfo}
                        getForms={getForms}
                    />

                    {/* {List.data &&
                        <PageTicketDnD
                            tableFilter={dataTableInfo}
                            getForms={getForms}
                            dataTable={List.data}
                            // dataTable={List.length != 0 ? List.data.data : []}
                            setDataTable={setList}
                        />
                    } */}
                </Col>
            </Row>

            <Row gutter={24}>
                <Col className="gutter-row" md={24}>
                    <Card
                        title="Tickets"
                        bordered={false}
                        extra={
                            <Link to="/tickets/add">
                                <Button
                                    type="primary"
                                    icon={<PlusCircleOutlined />}
                                    name="add_btn"
                                >
                                    Add New Ticket
                                </Button>
                            </Link>
                        }
                    >
                        <Row gutter={24}>
                            <Col className="gutter-row" md={16} xs={0}>
                                {Archivedbtn == false ? (
                                    <Button
                                        type="primary"
                                        loading={isLoadingMergeTicket}
                                        onClick={() =>
                                            tableArchived("Archived")
                                        }
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        name="archived_btn"
                                    >
                                        Show Archived
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        loading={isLoadingMergeTicket}
                                        onClick={() => tableArchived("all")}
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        name="archived_btn"
                                    >
                                        Show All
                                    </Button>
                                )}
                                <Button
                                    type="primary"
                                    icon={<UserOutlined />}
                                    loading={isLoadingMergeTicket}
                                    onClick={() => updateAssignedTo()}
                                    disabled={showActions}
                                    style={{
                                        marginRight: "5px"
                                    }}
                                    name="assigned_btn"
                                >
                                    Assigned To
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    loading={isLoadingMergeTicket}
                                    onClick={() => updateStatusMulti()}
                                    disabled={showActions}
                                    name="update_status_btn"
                                    style={{
                                        marginRight: "5px"
                                    }}
                                >
                                    Update Status
                                </Button>
                                <Popconfirm
                                    placement="bottom"
                                    title="Are you sure you want to delete this Ticket/s?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={e => deleteRecordMulti()}
                                >
                                    <Button
                                        type="primary"
                                        icon={<DeleteFilled />}
                                        loading={isLoadingMergeTicket}
                                        disabled={showActions}
                                        style={{
                                            marginRight: "5px"
                                        }}
                                        name="delete_ticket_btn"
                                    >
                                        Delete Ticket
                                    </Button>
                                </Popconfirm>
                                <Popconfirm
                                    placement="bottom"
                                    title="Are you sure you want to merege this Ticket/s?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={e => mergeTicket()}
                                >
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        loading={isLoadingMergeTicket}
                                        disabled={showActions}
                                        name="merge_ticket_btn"
                                    >
                                        Merge Ticket
                                    </Button>
                                </Popconfirm>
                            </Col>

                            <Col className="gutter-row" md={8} sm={24}>
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
                                    <Button
                                        icon={<SettingOutlined />}
                                        style={{ marginLeft: "5px" }}
                                        onClick={() => OpenSettings()}
                                    ></Button>
                                </div>
                            </Col>
                        </Row>
                        <Divider />
                        <div className="table-responsive table-tickets">
                            <ResizableAntdTable
                                // className="table-tickets"
                                scroll={{ x: "max-content" }}
                                rowSelection={rowSelection}
                                loading={isLoadingForms}
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
                                    if (!dashboard_filter.ticket_status) {
                                        localStorage.setItem(
                                            "tickets_ticket_status",
                                            JSON.stringify(
                                                filters.ticket_status
                                            )
                                        );
                                    }
                                    localStorage.setItem(
                                        "tickets_ticket_priority",
                                        JSON.stringify(filters.ticket_priority)
                                    );
                                    localStorage.setItem(
                                        "tickets_ticket_type",
                                        JSON.stringify(filters.ticket_type)
                                    );

                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        page_number: pagination.current,
                                        page_size: pagination.pageSize,
                                        ticket_status: filters.ticket_status,
                                        ticket_priority:
                                            filters.ticket_priority,
                                        ticket_type: filters.ticket_type
                                        // column: sorter.columnKey,
                                        // order: sorter.order ? sorter.order.replace("end", "") : "desc"
                                    });
                                    // console.log('table ticket_status',filters.ticket_status)

                                    // localStorage.data_table_tickets_sort_column =
                                    //     sorter.columnKey;
                                    // localStorage.data_table_tickets_sort_order = sorter.order
                                    //     ? sorter.order.replace("end", "")
                                    //     : "desc";
                                    // console.log("extra", extra.currentDataSource);
                                }}
                            >
                                {showTableColumnSettings.data.find(
                                    p => p.title == "ID"
                                ).show && (
                                    <Table.Column
                                        key="id"
                                        render={(text, record) => {
                                            return (
                                                <div id={"tableid" + record.id}>
                                                    <p>{record.id}</p>
                                                </div>
                                            );
                                        }}
                                        title={
                                            <CustomTableTitle
                                                title="ID"
                                                dataIndex="id"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Ticket Status"
                                ).show && (
                                    <Table.Column
                                        key="ticket_status"
                                        dataIndex="ticket_status"
                                        filters={[
                                            {
                                                text: "Awaiting Support Reply",
                                                value: "Awaiting Support Reply"
                                            },
                                            {
                                                text: "Awaiting Customer Reply",
                                                value: "Awaiting Customer Reply"
                                            },
                                            {
                                                text: "On Hold",
                                                value: "On Hold"
                                            },
                                            {
                                                text: "Closed",
                                                value: "Closed"
                                            },
                                            {
                                                text: "Archived",
                                                value: "Archived"
                                            }
                                        ]}
                                        filteredValue={
                                            dataTableInfo.ticket_status
                                        }
                                        title={
                                            <CustomTableTitle
                                                title="Ticket Status"
                                                dataIndex="ticket_status"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Merchant Name"
                                ).show && (
                                    <Table.Column
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
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Submitted by"
                                ).show && (
                                    <Table.Column
                                        dataIndex="ticket_submitted_by"
                                        key="ticket_submitted_by"
                                        title={
                                            <CustomTableTitle
                                                title="Submitted by"
                                                dataIndex="ticket_submitted_by"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Ticket Subject"
                                ).show && (
                                    <Table.Column
                                        title="Ticket Subject"
                                        key="ticket_subject"
                                        render={(text, record) => {
                                            return (
                                                <Link
                                                    to={`tickets/ticket/${record.id}`}
                                                    className="view_btn"
                                                >
                                                    <p>
                                                        {record.ticket_subject}
                                                    </p>
                                                </Link>
                                            );
                                        }}
                                        title={
                                            <CustomTableTitle
                                                title="Ticket Subject"
                                                dataIndex="ticket_subject"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Ticket Type"
                                ).show && (
                                    <Table.Column
                                        dataIndex="ticket_type"
                                        key="ticket_type"
                                        filters={[
                                            {
                                                text: "None",
                                                value: "None"
                                            },
                                            {
                                                text: "Training",
                                                value: "Training"
                                            },
                                            {
                                                text: "POS Software",
                                                value: "POS Software"
                                            },
                                            {
                                                text: "Credit Card",
                                                value: "Credit Card"
                                            },
                                            {
                                                text: "Workstation",
                                                value: "Workstation"
                                            },
                                            {
                                                text: "Service Requested",
                                                value: "Service Requested"
                                            },
                                            {
                                                text: "Sales",
                                                value: "Sales"
                                            },
                                            {
                                                text: "Gift Cards",
                                                value: "Gift Cards"
                                            },
                                            {
                                                text: "AdaptPAY",
                                                value: "AdaptPAY"
                                            },
                                            {
                                                text: "CC Terminal",
                                                value: "CC Terminal"
                                            },
                                            {
                                                text: "Pan Request",
                                                value: "Pan Request"
                                            }
                                        ]}
                                        filteredValue={
                                            dataTableInfo.ticket_type
                                        }
                                        title={
                                            <CustomTableTitle
                                                title="Ticket Type"
                                                dataIndex="ticket_type"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Ticket Priority"
                                ).show && (
                                    <Table.Column
                                        dataIndex="ticket_priority"
                                        key="ticket_priority"
                                        filters={[
                                            {
                                                text: "None",
                                                value: "None"
                                            },
                                            {
                                                text: "Low",
                                                value: "Low"
                                            },
                                            {
                                                text: "High",
                                                value: "High"
                                            },

                                            {
                                                text: "Medium",
                                                value: "Medium"
                                            }
                                        ]}
                                        filteredValue={
                                            dataTableInfo.ticket_priority
                                        }
                                        title={
                                            <CustomTableTitle
                                                title="Ticket Priority"
                                                dataIndex="ticket_priority"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
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
                                        dataIndex="created_at_srt"
                                        key="created_at_srt"
                                        render={(text, record) => {
                                            return (
                                                <Link
                                                    to={`tickets/ticket/${record.id}`}
                                                    className="view_btn"
                                                >
                                                    <p>
                                                        {record.created_at_srt}
                                                    </p>
                                                </Link>
                                            );
                                        }}
                                        title={
                                            <CustomTableTitle
                                                title="Date Created"
                                                dataIndex="created_at_srt"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Assigned To"
                                ).show && (
                                    <Table.Column
                                        dataIndex="assigned_by"
                                        key="assigned_by"
                                        title={
                                            <CustomTableTitle
                                                title="Assigned To"
                                                dataIndex="assigned_by"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Date Responded"
                                ).show && (
                                    <Table.Column
                                        key="last_reply_date"
                                        render={(text, record) => {
                                            return record.last_reply_date
                                                ? dateDiff(
                                                      record.last_reply_date
                                                  )
                                                : "";
                                        }}
                                        title={
                                            <CustomTableTitle
                                                title="Date Responded"
                                                dataIndex="last_reply_date"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="tickets_table_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_tickets_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_tickets_table
                                                          ).length - 1
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}

                                {showTableColumnSettings.data.find(
                                    p => p.title == "Action"
                                ).show && (
                                    <Table.Column
                                        dataIndex="action"
                                        className="action"
                                        align="left"
                                        title="Action"
                                        // title={
                                        //     <CustomTableTitle
                                        //         title="Action"
                                        //         dataIndex="action"
                                        //         dataTableInfo={dataTableInfo}
                                        //         setDataTableInfo={setDataTableInfo}localStorageKey="tickets_table_table_col_sizes"
                                        //         localStorageTableCols={
                                        //             localStorage.column_settings_tickets_table ?
                                        //                 JSON.parse(localStorage.column_settings_tickets_table).length - 1
                                        //                 : 0
                                        //         }
                                        //     />
                                        // }
                                        sortable={false}
                                        render={(text, record) => {
                                            return (
                                                <ButtonGroup>
                                                    <Link
                                                        to={`tickets/ticket/${record.id}`}
                                                    >
                                                        <Button
                                                            icon={
                                                                <EyeOutlined />
                                                            }
                                                            type="primary"
                                                            name="view_btn"
                                                        ></Button>
                                                    </Link>

                                                    {userdata.role ==
                                                        "Super Admin" && (
                                                        <Popconfirm
                                                            title="Are you sure you want to delete this Ticket?"
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onConfirm={e =>
                                                                deleteRecord(
                                                                    record.id
                                                                )
                                                            }
                                                        >
                                                            <Button
                                                                // loading={isLoadingDeleteUser}
                                                                type="primary"
                                                                danger
                                                                title="Delete"
                                                                loading={
                                                                    isLoadingdeleteRecord
                                                                }
                                                                icon={
                                                                    <DeleteFilled />
                                                                }
                                                                name="delete_ticket_btn"
                                                            ></Button>
                                                        </Popconfirm>
                                                    )}
                                                </ButtonGroup>
                                            );
                                        }}
                                    />
                                )}
                            </ResizableAntdTable>
                        </div>
                    </Card>
                </Col>
            </Row>
            <TableColumnSettings
                showTableColumnSettings={showTableColumnSettings}
                setShowTableColumnSettings={setShowTableColumnSettings}
                localStorageKey="column_settings_tickets_table"
            />
            {showUpdateStatusMulti && (
                <PageTicketUpdateStatusMulti
                    showUpdateStatusMulti={showUpdateStatusMulti}
                    setShowUpdateStatusMulti={setShowUpdateStatusMulti}
                    selectedId={selectedId}
                    getForms={getForms}
                    dataTableInfo={dataTableInfo}
                    setDataTableInfo={setDataTableInfo}
                />
            )}

            {showUpdateAssignedTo && (
                <PageTicketUpdateAssignedToModal
                    showUpdateAssignedTo={showUpdateAssignedTo}
                    setShowUpdateAssignedTo={setShowUpdateAssignedTo}
                    selectedId={selectedId}
                    getForms={getForms}
                    dataTableInfo={dataTableInfo}
                    setDataTableInfo={setDataTableInfo}
                />
            )}
        </div>
    );
};

export default PageTickets;
