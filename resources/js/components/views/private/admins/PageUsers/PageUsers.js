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
    Checkbox,
    Upload
} from "antd";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    UserAddOutlined,
    PrinterOutlined,
    UploadOutlined,
    KeyOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import queryString from "query-string";
import { Content } from "antd/lib/layout/layout";
import moment, { isMoment } from "moment";
import ButtonGroup from "antd/es/button/button-group";
import Search from "antd/lib/input/Search";
import { CSVLink } from "react-csv";

import TableColumnSettings from "../../../../providers/TableColumnSettings";
import ModalUserAddNew from "./ModalUserAddNew";

import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";
import ModalUploadMerchantFileStatements from "../PageFiles/ModalUploadMerchantFileStatements";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PageBoardingClearent = ({ permission }) => {
    let userdata = getUserData();
    let history = useHistory();
    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);
    const [inputFilter, setInputFilter] = useState();

    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: my_filter.app_status ? my_filter.app_status : "",
        page_number: 1,
        page_size: 20,
        online_status: 0,
        column: localStorage.data_table_user_sort_column,
        order: localStorage.data_table_user_sort_order,
        role: localStorage.table_user_role
            ? JSON.parse(localStorage.table_user_role)
            : [
                  "Super Admin",
                  "Admin",
                  "Manager",
                  "Merchant",
                  "PAN Admin",
                  "Merchant: Tickets Only"
              ],
        status: localStorage.table_user_status
            ? JSON.parse(localStorage.table_user_status)
            : ["Active", "Inactice", "Inquiry", "Invited"]
    });

    let ExportFileName = "Users - " + moment().format("YYYY-MM-DD") + ".csv";
    const [csvData, setCsvData] = useState([]);
    const {
        data: dataUserTable,
        isLoading: isLoadingDataUserTable,
        refetch: refetchUserTable,
        isFetching: isFetchingDataUserTable
    } = useAxiosQuery(
        "GET",
        `api/v1/users/profiles?${$.param(dataTableInfo)}`,
        "users_table",
        res => {
            if (res.success) {
                setTimeout(() => getCheckPermission(permission), 500);
                // console.log(
                //     "array_get",
                //     JSON.parse(localStorage.column_settings_user_table).length
                // );
            }
        }
    );

    useEffect(() => {
        localStorage.data_table_user_sort_column = dataTableInfo.column;
        localStorage.data_table_user_sort_order = dataTableInfo.order;

        refetchUserTable();
        return () => {};
    }, [dataTableInfo]);

    const checkIfDefault = column => {
        if (localStorage.data_table_user_sort_column) {
            if (localStorage.data_table_user_sort_column == column) {
                return localStorage.data_table_user_sort_order + "end";
            }
        }
        return null;
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
        data: localStorage.column_settings_user_table
            ? JSON.parse(localStorage.column_settings_user_table)
            : [
                  { title: "ID", show: true },
                  { title: "Owner Name", show: true },
                  { title: "MID", show: true },
                  { title: "Email", show: true },
                  { title: "Merchant Name", show: true },
                  { title: "Paysafe Account", show: true },
                  { title: "Clearent Account", show: true },
                  { title: "Gift Card Account", show: true },
                  { title: "Gift Card Checkout", show: true },
                  { title: "Account Type", show: true },
                  { title: "Team Name", show: true },
                  { title: "Registered", show: true },
                  { title: "Role", show: true },
                  { title: "Status", show: true },
                  { title: "Last Modified", show: true },
                  { title: "Action", show: true }
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

    const {
        mutate: mutateDeleteUser,
        isLoading: isLoadingDeleteUser
    } = useAxiosQuery("DELETE", "api/v1/users", "users_table");

    // for delete button
    const handleDeleteUser = record => {
        mutateDeleteUser(record, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "User Successfully Deleted"
                    });
                    console.log("delete msg", res);
                }
            }
        });
    };

    const [showModalAddNew, setShowModalAddNew] = useState(false);

    useEffect(() => {
        let col_sizes = localStorage.users_table_col_sizes
            ? JSON.parse(localStorage.users_table_col_sizes)
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
        if (!localStorage.users_table_col_sizes) {
            var data = {
                ID: 68,
                "Owner Name": 136,
                MID: 80,
                Email: 220,
                "Merchant Name": 156,
                "Paysafe Account": 159,
                "Clearent Account": 161,
                "Gift Card Account": 163,
                "Gift Card Checkout": 170,
                "Account Type": 137,
                "Team Name": 125,
                Registered: 121,
                Role: 100,
                Status: 100,
                "Last Modified": 137,
                Action: 150
            };
            localStorage.setItem("users_table_col_sizes", JSON.stringify(data));

            $("table th:nth-child(1)").prop("width", "68");
            $("table th:nth-child(2)").prop("width", "136");
            $("table th:nth-child(3)").prop("width", "80");
            $("table th:nth-child(4)").prop("width", "220");
            $("table th:nth-child(5)").prop("width", "156");
            $("table th:nth-child(6)").prop("width", "159");
            $("table th:nth-child(7)").prop("width", "161");
            $("table th:nth-child(8)").prop("width", "163");
            $("table th:nth-child(9)").prop("width", "170");
            $("table th:nth-child(10)").prop("width", "137");
            $("table th:nth-child(11)").prop("width", "125");
            $("table th:nth-child(12)").prop("width", "121");
            $("table th:nth-child(13)").prop("width", "150");
            $("table th:nth-child(14)").prop("width", "100");
            $("table th:nth-child(15)").prop("width", "137");
            $("table th:nth-child(16)").prop("width", "150");
        } else {
            // $(".action").prop("width", "100");
        }
        return () => {};
    }, []);

    const [
        showModalUploadMerchantFileStatements,
        setShowModalUploadMerchantFileStatements
    ] = useState(false);

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            <ModalUploadMerchantFileStatements
                showModalUploadMerchantFileStatements={
                    showModalUploadMerchantFileStatements
                }
                setShowModalUploadMerchantFileStatements={
                    setShowModalUploadMerchantFileStatements
                }
            />
            <Card
                title="Profiles"
                extra={
                    <>
                        <Button
                            icon={<UploadOutlined />}
                            onClick={e =>
                                setShowModalUploadMerchantFileStatements(true)
                            }
                            name="upload_statement_btn"
                        >
                            Upload Statements
                        </Button>
                        <Button
                            type="primary"
                            onClick={e => setShowModalAddNew(true)}
                            icon={<UserAddOutlined />}
                            name="add_btn"
                        >
                            Add Profile
                        </Button>
                    </>
                }
            >
                <Row>
                    <Col xs={24} md={8} className="p-0">
                        <div style={{ display: "flex" }}>
                            <Button
                                icon={<UsergroupDeleteOutlined />}
                                onClick={e => {
                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        online_status: 0,
                                        filter_value: "",
                                        page_number: 1,
                                        page_size: 20
                                        // role: [
                                        //     "Super Admin",
                                        //     "Admin",
                                        //     "Manager",
                                        //     "Merchant",
                                        //     "PAN Admin",
                                        //     "Merchant: Tickets Only",
                                        // ],
                                        // status: [
                                        //     "Active",
                                        //     "Inactice",
                                        //     "Inquiry",
                                        //     "Invited",
                                        // ],
                                    });
                                    setInputFilter("");
                                }}
                            >
                                Profiles
                            </Button>
                            <Button
                                style={{ marginLeft: "10px" }}
                                icon={<UsergroupDeleteOutlined />}
                                onClick={e => {
                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        online_status: 1,
                                        filter_value: "",
                                        page_number: 1,
                                        page_size: 20
                                        // role: [
                                        //     "Super Admin",
                                        //     "Admin",
                                        //     "Manager",
                                        //     "Merchant",
                                        //     "PAN Admin",
                                        //     "Merchant: Tickets Only",
                                        // ],
                                        // status: [
                                        //     "Active",
                                        //     "Inactice",
                                        //     "Inquiry",
                                        //     "Invited",
                                        // ],
                                    });
                                    setInputFilter("");
                                }}
                            >
                                Online Profiles
                            </Button>
                        </div>
                    </Col>
                    <Col xs={0} md={8}></Col>
                    <Col xs={24} md={8} className="text-right search_profile">
                        <div style={{ display: "flex" }}>
                            <Search
                                allowClear
                                type="text"
                                placeholder="Search"
                                onSearch={e => {
                                    setDataTableInfo({
                                        ...dataTableInfo,
                                        filter_value: e
                                    });
                                }}
                                onChange={e => {
                                    setSearchText(e.target.value);
                                    setInputFilter(e.target.value);
                                }}
                                value={inputFilter}
                            />
                            {/* <CSVLink
                                data={csvData}
                                filename={ExportFileName + ".csv"}
                            >
                                <Button icon={<FileExcelOutlined />}></Button>
                            </CSVLink>
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={() => exportPDF()}
                            ></Button> */}
                            <Button
                                icon={<SettingOutlined />}
                                style={{ marginLeft: "5px" }}
                                onClick={e =>
                                    setShowTableColumnSettings({
                                        ...showTableColumnSettings,
                                        show: true
                                    })
                                }
                            ></Button>
                        </div>
                    </Col>
                </Row>
                <Divider />

                <div className="table-responsive">
                    <ResizableAntdTable
                        loading={isLoadingDataUserTable}
                        rowKey={record => record.id}
                        dataSource={dataUserTable ? dataUserTable.data : []}
                        pagination={{
                            pageSize: dataTableInfo.page_size,
                            current: dataUserTable
                                ? dataUserTable.current_page
                                : 1,
                            showSizeChanger: true,
                            total: dataUserTable
                                ? dataUserTable.total_count
                                : 1,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,

                            pageSizeOptions: [20, 50, 100, 200]
                        }}
                        onChange={(pagination, filters, sorter, extra) => {
                            console.log("pagination", pagination);
                            localStorage.setItem(
                                "role",
                                JSON.stringify(filters.role)
                            );
                            localStorage.setItem(
                                "status",
                                JSON.stringify(filters.status)
                            );
                            setDataTableInfo({
                                ...dataTableInfo,
                                page_number: pagination.current,
                                page_size: pagination.pageSize,
                                role: filters.role,
                                status: filters.status
                                // column: sorter.columnKey,
                                // order: sorter.order
                                //     ? sorter.order.replace("end", "")
                                //     : null
                            });

                            // localStorage.data_table_user_sort_column = sorter.columnKey;
                            // localStorage.data_table_user_sort_order = sorter.order ? sorter.order.replace("end", "") : null;
                        }}
                        filterType="checkbox"
                        scroll={{ x: "fit-content" }}
                    >
                        {showTableColumnSettings.data.find(p => p.title == "ID")
                            .show && (
                            <Table.Column
                                key="id"
                                render={(text, record) => {
                                    return (
                                        <>
                                            <Link
                                                to={`/profiles/${record.id}`}
                                                className="view_btn"
                                            >
                                                {record.id}
                                            </Link>
                                        </>
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="ID"
                                        dataIndex="id"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Owner Name"
                        ).show && (
                            <Table.Column
                                key="name"
                                render={(text, record) => {
                                    // let onlineBorder =  record.online_status == true ? "3px solid green" : "3px solid red";
                                    // let type = record.upload ? record.upload.split('/') : '';
                                    let onlineColor =
                                        record.online_status == true
                                            ? "green"
                                            : "";
                                    return (
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                flexDirection: "row"
                                            }}
                                        >
                                            {/* {record.upload && (
                                                <Image
                                                    style={{
                                                        borderRadius: "50%",
                                                        color: onlineBorder
                                                    }}
                                                    width={40}
                                                    src={type[0] == 'https:' ? record.upload : window.location.origin + "/storage/" +record.upload}
                                                    preview={false}
                                                />
                                            )} */}
                                            <span
                                                style={{
                                                    marginLeft: "10px",
                                                    marginTop: "5px",
                                                    color: onlineColor
                                                }}
                                            >
                                                {record.name}
                                            </span>
                                        </div>
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Owner Name"
                                        dataIndex="name"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "MID"
                        ).show && (
                            <Table.Column
                                key="user_links"
                                render={(text, record) => {
                                    return (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: record.mid_values
                                            }}
                                        />
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="MID"
                                        dataIndex="user_links"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Email"
                        ).show && (
                            <Table.Column
                                key="email"
                                render={(text, record) => {
                                    return (
                                        <Link
                                            to={`/profiles/${record.id}`}
                                            className="view_btn"
                                        >
                                            {record.email}
                                        </Link>
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Email"
                                        dataIndex="email"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
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
                                key="merchantNumber"
                                render={(text, record) => {
                                    var a = "";
                                    if (record.user_fields) {
                                        a = (
                                            <Link
                                                to={`/profiles/${record.id}`}
                                                className="view_btn"
                                            >
                                                {record.user_fields
                                                    .merchant_name
                                                    ? trimStr(
                                                          record.user_fields
                                                              .merchant_name,
                                                          30
                                                      )
                                                    : "None"}
                                            </Link>
                                        );
                                    } else {
                                        a = (
                                            <Link to={`/profiles/${record.id}`}>
                                                None
                                            </Link>
                                        );
                                    }
                                    return a;
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Merchant Name"
                                        dataIndex="merchantNumber"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Paysafe Account"
                        ).show && (
                            <Table.Column
                                key="paysafe_account"
                                render={(text, record) => {
                                    return (
                                        <div
                                            // style={{display: "flex", flexDirection: "column"}}
                                            dangerouslySetInnerHTML={{
                                                __html: record.paysafe_names
                                            }}
                                        />
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Paysafe Account"
                                        dataIndex="paysafe_account"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Clearent Account"
                        ).show && (
                            <Table.Column
                                key="clearent_account"
                                render={(text, record) => {
                                    return (
                                        <div
                                            // style={{display: "flex", flexDirection: "column"}}
                                            dangerouslySetInnerHTML={{
                                                __html: record.clearent_names
                                            }}
                                        />
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Clearent Account"
                                        dataIndex="clearent_account"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Gift Card Account"
                        ).show && (
                            <Table.Column
                                key="giftcard_account"
                                render={(text, record) => {
                                    return (
                                        <div
                                            // style={{display: "flex", flexDirection: "column"}}
                                            dangerouslySetInnerHTML={{
                                                __html: record.gift_names
                                            }}
                                        />
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Gift Card Account"
                                        dataIndex="giftcard_account"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Gift Card Checkout"
                        ).show && (
                            <Table.Column
                                key="AuthNet"
                                render={(text, record) => {
                                    if (record.authnet_merchant) {
                                        return (
                                            <a
                                                href={`${window.location.origin}/giftcard-checkout/${record.authnet_merchant.auth_username}`}
                                                target="_blank"
                                            >
                                                {trimStr(
                                                    record.authnet_merchant
                                                        .merchant_name,
                                                    15
                                                )}
                                            </a>
                                        );
                                    }
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Gift Card Checkout"
                                        dataIndex="AuthNet"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Account Type"
                        ).show && (
                            <Table.Column
                                key="account_type"
                                render={(text, record) => {
                                    if (record.user_fields) {
                                        return record.user_fields.account_type;
                                    }
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Account Type"
                                        dataIndex="account_type"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Team Name"
                        ).show && (
                            <Table.Column
                                key="team_name"
                                render={(text, record) => {
                                    if (record.user_fields) {
                                        return record.user_fields.team_name;
                                    }
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Team Name"
                                        dataIndex="team_name"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Registered"
                        ).show && (
                            <Table.Column
                                key="created_at"
                                render={(text, record) => {
                                    return record.created_at_srt;
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Registered"
                                        dataIndex="created_at"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Role"
                        ).show && (
                            <Table.Column
                                dataIndex="role"
                                key="role"
                                filters={[
                                    {
                                        text: "Super Admin",
                                        value: "Super Admin"
                                    },
                                    {
                                        text: "Admin",
                                        value: "Admin"
                                    },
                                    {
                                        text: "Manager",
                                        value: "Manager"
                                    },
                                    {
                                        text: "Merchant",
                                        value: "Merchant"
                                    },
                                    {
                                        text: "PAN Admin",
                                        value: "PAN Admin"
                                    },
                                    {
                                        text: "Merchant: Tickets Only",
                                        value: "Merchant: Tickets Only"
                                    }
                                ]}
                                defaultFilteredValue={dataTableInfo.role}
                                title={
                                    <CustomTableTitle
                                        title="Role"
                                        dataIndex="role"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Status"
                        ).show && (
                            <Table.Column
                                dataIndex="status"
                                key="status"
                                filters={[
                                    {
                                        text: "Active",
                                        value: "Active"
                                    },
                                    {
                                        text: "Inactice",
                                        value: "Inactice"
                                    },
                                    {
                                        text: "Inquiry",
                                        value: "Inquiry"
                                    },
                                    {
                                        text: "Invited",
                                        value: "Invited"
                                    }
                                ]}
                                defaultFilteredValue={dataTableInfo.status}
                                title={
                                    <CustomTableTitle
                                        title="Status"
                                        dataIndex="status"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Last Modified"
                        ).show && (
                            <Table.Column
                                title="Last Modified"
                                dataIndex="updated_at"
                                key="updated_at"
                                render={(text, record) => {
                                    return moment(record.updated_at).format(
                                        "YYYY-MM-DD"
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Last Modified"
                                        dataIndex="updated_at"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="users_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_user_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_user_table
                                                  ).length
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
                                title="Action"
                                key="action"
                                className="action"
                                render={(text, record) => {
                                    return (
                                        <div>
                                            <Space>


                                                <Button
                                                    type="primary"
                                                    title="Edit"
                                                    name="view_btn"
                                                    icon={<EyeOutlined />}
                                                    onClick={e => {
                                                        // if ( record.role == "Advisor" ) {
                                                        //     history.push(
                                                        //         `/advisor/edit/${record.id}`
                                                        //     );
                                                        // } else {
                                                        // }
                                                        history.push(
                                                            `/profiles/${record.id}`
                                                        );
                                                    }}
                                                ></Button>

                                                <Popconfirm
                                                    title="Are you sure you want to delete this User?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={e =>
                                                        handleDeleteUser(record)
                                                    }
                                                >
                                                    <Button
                                                        name="delete_btn"
                                                        loading={
                                                            isLoadingDeleteUser
                                                        }
                                                        type="primary"
                                                        danger
                                                        title="Delete"
                                                        icon={<DeleteFilled />}
                                                    ></Button>
                                                </Popconfirm>
                                            </Space>
                                        </div>
                                    );
                                }}
                            />
                        )}
                    </ResizableAntdTable>
                </div>
            </Card>
            <TableColumnSettings
                showTableColumnSettings={showTableColumnSettings}
                setShowTableColumnSettings={setShowTableColumnSettings}
                localStorageKey="column_settings_user_table"
            />
            <ModalUserAddNew
                showModalAddNew={showModalAddNew}
                setShowModalAddNew={setShowModalAddNew}
            />
        </Content>
    );
};

export default PageBoardingClearent;
