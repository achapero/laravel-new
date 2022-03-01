import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Input,
    Table,
    Popconfirm,
    Divider,
    notification,
    Image,
    Tooltip,
    Drawer,
    Space,
    Modal,
    Form,
    Select,
    Checkbox,
    Typography,
    DatePicker
} from "antd";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    SearchOutlined,
    ArrowLeftOutlined,
    PrinterOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import queryString from "query-string";
import { Content } from "antd/lib/layout/layout";
import moment, { isMoment } from "moment";
import ButtonGroup from "antd/es/button/button-group";
import Search from "antd/lib/input/Search";
import { CSVLink } from "react-csv";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
import { values } from "lodash";

import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

import CustomTableTitle from "../../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

const PageUserProfileComponentTickets = ({ user_id, dataUser }) => {
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const [form] = Form.useForm();
    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);

    const [dataTableInfo, setDataTableInfo] = useState({
        id: user_id,
        filter_value: my_filter.app_status ? my_filter.app_status : "",
        page_number: 1,
        page_size: '10',
        online_status: 0,
        column: localStorage.data_table_ticket_sort_column,
        order: localStorage.data_table_ticket_sort_order,
        show_ticket_priority_none: localStorage.show_ticket_priority_none || "true",
        show_ticket_priority_low: localStorage.show_ticket_priority_low || "true",
        show_ticket_priority_medium: localStorage.show_ticket_priority_medium || "true",
        show_ticket_priority_high: localStorage.show_ticket_priority_high || "true",
        show_ticket_customer: localStorage.show_ticket_customer || "true",
        show_ticket_support: localStorage.show_ticket_support || "true",
        show_ticket_close: localStorage.show_ticket_close || "true",
        show_ticket_onhold: localStorage.show_ticket_onhold || "true",
        show_ticket_open: localStorage.show_ticket_open || "true",
        show_type_training: localStorage.show_type_training || "true",
        show_type_pos_software: localStorage.show_type_pos_software || "true",
        show_type_credit_card: localStorage.show_type_credit_card || "true",
        show_type_work_station: localStorage.show_type_work_station || "true",
        show_type_service_requested: localStorage.show_type_service_requested || "true",
        show_type_sales: localStorage.show_type_sales || "true",
        show_type_gift_cards: localStorage.show_type_gift_cards || "true",
        show_type_adapt_pay: localStorage.show_type_adapt_pay || "true",
        show_type_cc_terminal: localStorage.show_type_cc_terminal || "true"
    });

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Profile Tickets - " + moment().format("YYYY-MM-DD");

    const {
        data: dataAsset,
        isLoading: isLoadingAsset,
        isFetching: isFetchingAsset,
        refetch: refetchAsset
    } = useAxiosQuery(
        "GET",
        `api/v1/ticket_filtered_byUser?${$.param(dataTableInfo)}`,
        `filtered_byUser_${user_id}`,
        res => {
            if (res.success) {

            }
        }
    );

    useEffect(() => {
        localStorage.data_table_ticket_sort_column = dataTableInfo.column;
        localStorage.data_table_ticket_sort_order = dataTableInfo.order;

        refetchAsset();
        return () => {};
    }, [dataTableInfo]);

    const checkIfDefault = column => {
        if (localStorage.data_table_ticket_sort_column) {
            if (localStorage.data_table_ticket_sort_column == column) {
                return localStorage.data_table_ticket_sort_order + "end";
            }
        }
        return "";
    };

    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDataTableInfo({ ...dataTableInfo, filter_value: searchText });
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchText]);

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_profile_ticket_table
            ? JSON.parse(localStorage.column_settings_profile_ticket_table)
            : [
                  { title: "ID", show: true },
                  { title: "Ticket Status", show: true },
                  { title: "Submitted by", show: true },
                  { title: "Ticket Subject", show: true },
                  { title: "Ticket Type", show: true },
                  { title: "Ticket Priority", show: true },
                  { title: "Date Created", show: true },
                  { title: "Assigned To", show: true },
                  { title: "Date Responded", show: true }
              ]
    });

    const trimStr = (str, length) => {
        if (str) {
            if (str.length > length) {
                str = str.substring(0, length);
                str = str + "...";
            }
            return str;
        }
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const goToTicket = id => {
        let wUrl = `${window.location.origin}`;
        window.location.href = wUrl + `/tickets/ticket/${id}`;
    };

    const {
        mutate: mutateDeleteAsset,
        isLoading: isLoadingDeleteAsset
    } = useAxiosQuery("DELETE", `api/v1/ticket`, `filtered_byUser_${user_id}`);

    const deleteRecord = value => {
        mutateDeleteAsset(value, {
            onSuccess: res => {
                refetchAsset();
                notification.success({
                    message: "User Successfully Deleted"
                });
            }
        });
    };

    const handleReset = clearFilters => {
        clearFilters();
    };
    let searchInput;
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    useEffect(() => {
        let col_sizes = localStorage.profile_tickets_table_col_sizes
            ? JSON.parse(localStorage.profile_tickets_table_col_sizes)
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
        if (!localStorage.profile_tickets_table_col_sizes) {
            var data = {
                "ID": 60,
                "Ticket Status": 152,
                "Submitted by": 135,
                "Ticket Subject": 149,
                "Ticket Type": 123,
                "Ticket Priority": 136,
                "Date Created": 131,
                "Assigned To": 131,
                "Date Responded": 152,
            };
            localStorage.setItem("profile_tickets_table_col_sizes", JSON.stringify(data));

            $("table th:nth-child(1)").prop("width", "60");
            $("table th:nth-child(2)").prop("width", "152");
            $("table th:nth-child(3)").prop("width", "135");
            $("table th:nth-child(4)").prop("width", "149");
            $("table th:nth-child(5)").prop("width", "123");
            $("table th:nth-child(6)").prop("width", "136");
            $("table th:nth-child(7)").prop("width", "131");
            $("table th:nth-child(8)").prop("width", "131");
            $("table th:nth-child(9)").prop("width", "152");
        } else {
            $(".action").prop("width", "100");
        }
        return () => {};
    }, []);

    return (
        <div>
            <Divider orientation="right" plain>
                <Title level={2}>Tickets</Title>
            </Divider>

            <ResizableAntdTable
                scroll={{ x: "fit-content" }}
                dataSource={dataAsset ? dataAsset.data.data : []}
                loading={isLoadingAsset || isFetchingAsset}
                rowKey={record => record.id}
                onChange={(pagination, filters, sorter, extra) => {
                    console.log("pagination", pagination);
                    setDataTableInfo({
                        ...dataTableInfo,
                        page_number: pagination.current,
                        page_size: pagination.pageSize,
                    });
                }}
                pagination={{
                    // pageSize: dataAsset || dataAsset.total_count,
                    current: dataAsset
                        ? dataAsset.data.current_page
                        : 1,
                    showSizeChanger: true,
                    total: dataAsset ? dataAsset.data.total : 1,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,

                    pageSizeOptions: [10, 20, 50, 100, 200]
                }}
                title={() => (
                    <Row>
                        <Col xs={12} md={12} className="p-0">
                            <h1>Tickets List</h1>
                        </Col>
                        <Col xs={12} md={12} className="text-right">
                            <Space>
                                <Search
                                    allowClear
                                    type="text"
                                    placeholder="Search"
                                    onSearch={e =>
                                        setDataTableInfo({
                                            ...dataTableInfo,
                                            filter_value: e
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
                                    <Button style={{
                                        background: "#13c2c2",
                                        color: "#ffffff",
                                        border: "1px solid #13c2c2"
                                    }} icon={<FileExcelOutlined />}></Button>
                                </CSVLink>
                                <Button
                                    icon={<PrinterOutlined />}
                                    onClick={() => exportPDF()}
                                    style={{
                                        background: "#13c2c2",
                                        color: "#ffffff",
                                        border: "1px solid #13c2c2"
                                    }}
                                ></Button> */}

                                <Button
                                    icon={<SettingOutlined />}
                                    style={{
                                        background: "#13c2c2",
                                        color: "#ffffff",
                                        border: "1px solid #13c2c2"
                                    }}
                                    onClick={e =>
                                        setShowTableColumnSettings({
                                            ...showTableColumnSettings,
                                            show: true
                                        })
                                    }
                                ></Button>
                            </Space>
                        </Col>
                    </Row>
                )}
            >
                {showTableColumnSettings.data.find(p => p.title == "ID").show && (
                    <Table.Column
                        title="ID"
                        key="id"
                        render={(text, record) => {
                            return (
                                <p
                                    style={{
                                        cursor: "pointer",
                                        color: "#20a8d8"
                                    }}
                                    onClick={() => goToTicket(record.id)}
                                >
                                    #{record.id}
                                </p>
                            );
                        }}
                        title={
                            <CustomTableTitle
                                title="ID"
                                dataIndex="id"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Ticket Status" ).show && (
                    <Table.Column
                        key="ticket_status"
                        dataIndex="ticket_status"
                        title={
                            <CustomTableTitle
                                title="Ticket Status"
                                dataIndex="ticket_status"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Submitted by" ).show && (
                    <Table.Column
                        title="Submitted by"
                        key="ticket_submitted_by"
                        dataIndex="ticket_submitted_by"
                        title={
                            <CustomTableTitle
                                title="Submitted by"
                                dataIndex="ticket_submitted_by"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Ticket Subject" ).show && (
                    <Table.Column
                        title="Ticket Subject"
                        key="ticket_subject"
                        render={(text, record) => {
                            return (
                                <p
                                    style={{
                                        cursor: "pointer",
                                        color: "#20a8d8"
                                    }}
                                    onClick={() => goToTicket(record.id)}
                                >
                                    {record.ticket_subject}
                                </p>
                            );
                        }}
                        title={
                            <CustomTableTitle
                                title="Ticket Subject"
                                dataIndex="ticket_subject"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Ticket Type" ).show && (
                    <Table.Column
                        key="ticket_type"
                        dataIndex="ticket_type"
                        title={
                            <CustomTableTitle
                                title="Ticket Type"
                                dataIndex="ticket_type"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Ticket Priority" ).show && (
                    <Table.Column
                        key="ticket_priority"
                        dataIndex="ticket_priority"
                        title={
                            <CustomTableTitle
                                title="Ticket Priority"
                                dataIndex="ticket_priority"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Date Created" ).show && (
                    <Table.Column
                        key="created_at_srt"
                        render={(text, record) => {
                            return (
                                <p
                                    style={{
                                        cursor: "pointer",
                                        color: "#20a8d8"
                                    }}
                                    onClick={() => goToTicket(record.id)}
                                >
                                    {record.created_at_srt}
                                </p>
                            );
                        }}
                        title={
                            <CustomTableTitle
                                title="Date Created"
                                dataIndex="created_at_srt"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Assigned To" ).show && (
                    <Table.Column
                        title="Assigned To"
                        key="show_assignedTo"
                        render={(text, record) => {
                            return (
                                record.assigned_to && record.assigned_to.name
                            );
                        }}
                        title={
                            <CustomTableTitle
                                title="Assigned To"
                                dataIndex="show_assignedTo"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Date Responded" ).show && (
                    <Table.Column
                        title="Date Responded"
                        key="last_reply_date"
                        render={(text, record) => {
                            return record.last_reply_date ? record.last_reply_date : '';
                        }}
                        title={
                            <CustomTableTitle
                                title="Date Responded"
                                dataIndex="last_reply_date"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_tickets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_profile_ticket_table ?
                                        JSON.parse(localStorage.column_settings_profile_ticket_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}

                <Table.Column
                    title="Action"
                    key="action"
                    className="action"
                    render={(text, record) => {
                        return (
                            <div>
                                <ButtonGroup>
                                    <Button
                                        type="primary"
                                        size="sm"
                                        onClick={() => goToTicket(record.id)}
                                        icon={<EyeOutlined />}
                                    ></Button>
                                    <Popconfirm
                                        title="Are you sure to delete this ticket?"
                                        onConfirm={() => deleteRecord(record)}
                                        okText="Confirm"
                                        cancelText="Cancel"
                                    >
                                        <Button
                                            // loading={isLoadingDeleteUser}
                                            type="primary"
                                            size="sm"
                                            danger
                                            title="Delete"
                                            icon={<DeleteFilled />}
                                        ></Button>
                                    </Popconfirm>
                                </ButtonGroup>
                            </div>
                        );
                    }}
                />
            </ResizableAntdTable>
            <TableColumnSettings
                showTableColumnSettings={showTableColumnSettings}
                setShowTableColumnSettings={setShowTableColumnSettings}
                localStorageKey="column_settings_profile_ticket_table"
            />
        </div>
    );
};

export default PageUserProfileComponentTickets;
