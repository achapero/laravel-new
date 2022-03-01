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
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import CustomTableTitle from "../../../../providers/CustomTableTitle";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import PageAssetManagmentModal from "./PageAssetManagmentModal";
import { CSVLink } from "react-csv";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    EyeOutlined,
    PrinterOutlined
} from "@ant-design/icons";
import ButtonGroup from "antd/es/button/button-group";

import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { widhtAdjustable } from "../../../../providers/widhtAdjustable";
import ResizableAntdTable from "resizable-antd-table";
import getCheckPermission from "../../../../providers/getCheckPermission";

const PageAssetManagement = ({ history, match, permission }) => {
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "20",
        column: localStorage.table_device_mgmt_table_sort_column,
        order: localStorage.table_device_mgmt_table_sort_order
    });

    const userdata = getUserData();

    useEffect(() => {
        localStorage.table_device_mgmt_table_sort_column = dataTableInfo.column;
        localStorage.table_device_mgmt_table_sort_order = dataTableInfo.order;
        displayDeviceMgmtList();
        return () => {};
    }, [dataTableInfo]);

    const {
        mutate: mutateDeviceMgmtList,
        isLoading: isLoadingDeviceMgmtList
    } = useAxiosQuery("POST", "api/v1/devicemgmt/filtered", "device_mgmt_list");

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Asset Management - " + moment().format("YYYY-MM-DD");

    const displayDeviceMgmtList = () => {
        mutateDeviceMgmtList(dataTableInfo, {
            onSuccess: res => {
                // console.log("@", res);
                if (res.success) {
                    setList(res);
                    setTimeout(() => getCheckPermission(permission), 500);
                }
            },
            onError: err => {
                // console.log(err);
            }
        });
    };

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_table_device_mgmt_table
            ? JSON.parse(localStorage.column_settings_table_device_mgmt_table)
            : [
                  { title: "Asset Name", show: true },
                  { title: "Serial Number", show: true },
                  { title: "Asset Type", show: true },
                  { title: "Given Date", show: true },
                  { title: "Manufacturer", show: true },
                  { title: "Assigned Merchant", show: true },
                  { title: "Date Assigned", show: true },
                  { title: "Notes", show: true }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.table_device_mgmt_table_sort_column) {
            if (localStorage.table_device_mgmt_table_sort_column == column) {
                return localStorage.table_device_mgmt_table_sort_order + "end";
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

    const [modalForm, setModalForm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(defaultData);
    const [addOnly, setAddOnly] = useState(true);
    const toggleModalForm = (e = null) => {
        if (e) {
            e.preventDefault();
        }
        setSelectedRecord(defaultData);
        setAddOnly(true);
        setModalForm(!modalForm);
    };

    const viewRecord = record => {
        setSelectedRecord([
            {
                id: record.id,
                device_name: record.device_name,
                serial_number: record.serial_number,
                merchant_name: record.merchant_name,
                device_type: record.device_type,
                given_date: record.given_date,
                manufacturer: record.manufacturer,
                assigned_merchant: record.assigned_merchant,
                date_assigned: record.date_assigned,
                notes: record.notes
            }
        ]);
        setAddOnly(false);
        setModalForm(!modalForm);
    };

    function defaultData() {
        return [
            {
                id: null,
                device_name: null,
                serial_number: null,
                merchant_name: null,
                device_type: null,
                given_date: null,
                manufacturer: null,
                assigned_merchant: null,
                date_assigned: null,
                notes: null
            }
        ];
    }

    const {
        mutate: mutateDeleteAssets,
        isLoading: isLoadingDeleteAssets
    } = useAxiosQuery("DELETE", "api/v1/devicemgmt", "files_table");

    const handleDeleteAssets = record => {
        // console.log(record);
        mutateDeleteAssets(record, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Asset Successfully Deleted"
                    });
                    displayDeviceMgmtList();
                }
            }
        });
    };

    useEffect(() => {
        let col_sizes = localStorage.asset_management_table_col_sizes
            ? JSON.parse(localStorage.asset_management_table_col_sizes)
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
        if (!localStorage.asset_management_table_col_sizes) {
            var data = {
                "Asset Name": 129,
                "Serial Number": 142,
                "Asset Type": 122,
                "Given Date": 123,
                Manufacturer: 140,
                "Assigned Merchant": 220,
                "Date Assigned": 143,
                Notes: 97,
                Action: 100
            };
            localStorage.setItem(
                "asset_management_table_col_sizes",
                JSON.stringify(data)
            );

            $("table th:nth-child(1)").prop("width", "129");
            $("table th:nth-child(2)").prop("width", "142");
            $("table th:nth-child(3)").prop("width", "122");
            $("table th:nth-child(4)").prop("width", "123");
            $("table th:nth-child(5)").prop("width", "140");
            $("table th:nth-child(6)").prop("width", "220");
            $("table th:nth-child(7)").prop("width", "143");
            $("table th:nth-child(8)").prop("width", "97");
            $("table th:nth-child(9)").prop("width", "100");
        } else {
            // $(".action").prop("width", "100");
        }
        return () => {};
    }, []);

    return (
        <div
            className="animated fadeIn account"
            id="deviceMgmt"
            style={{
                padding: "24px 16px"
            }}
        >
            <Row>
                <Col md={24}>
                    <Card
                        title="Asset Management"
                        bordered={false}
                        extra={
                            <Button
                                type="primary"
                                title="Upload"
                                icon={<PlusCircleOutlined />}
                                onClick={e => toggleModalForm()}
                                name="add_btn"
                            >
                                Add New
                            </Button>
                        }
                    >
                        <Row>
                            <Col md={8} xs={0}>
                                {" "}
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
                                        <Button icon={<FileExcelOutlined />}></Button>
                                    </CSVLink>
                                    <Button
                                        icon={<PrinterOutlined />}
                                        onClick={() => exportPDF()}
                                    ></Button> */}
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
                                loading={isLoadingDeviceMgmtList}
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
                                        // order: sorter.order ? sorter.order.replace("end", "") : null
                                    });

                                    // localStorage.table_device_mgmt_table_sort_column = sorter.columnKey;
                                    // localStorage.table_device_mgmt_table_sort_order = sorter.order ? sorter.order.replace("end", "") : null;
                                }}
                                scroll={{ x: "max-content" }}
                            >
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Asset Name"
                                ).show && (
                                    <Table.Column
                                        dataIndex="device_name"
                                        key="device_name"
                                        title={
                                            <CustomTableTitle
                                                title="Asset Name"
                                                dataIndex="device_name"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Serial Number"
                                ).show && (
                                    <Table.Column
                                        key="serial_number"
                                        render={(text, record) => {
                                            return (
                                                <Link
                                                    to="#"
                                                    onClick={() =>
                                                        viewRecord(record)
                                                    }
                                                >
                                                    {record.serial_number}
                                                </Link>
                                            );
                                        }}
                                        title={
                                            <CustomTableTitle
                                                title="Serial Number"
                                                dataIndex="serial_number"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Asset Type"
                                ).show && (
                                    <Table.Column
                                        dataIndex="device_type"
                                        key="device_type"
                                        title={
                                            <CustomTableTitle
                                                title="Asset Type"
                                                dataIndex="device_type"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Given Date"
                                ).show && (
                                    <Table.Column
                                        dataIndex="given_date"
                                        key="given_date"
                                        title={
                                            <CustomTableTitle
                                                title="Given Date"
                                                dataIndex="given_date"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Manufacturer"
                                ).show && (
                                    <Table.Column
                                        dataIndex="manufacturer"
                                        key="manufacturer"
                                        title={
                                            <CustomTableTitle
                                                title="Manufacturer"
                                                dataIndex="manufacturer"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Assigned Merchant"
                                ).show && (
                                    <Table.Column
                                        dataIndex="assigned_merchant_name"
                                        key="assigned_merchant_name"
                                        title={
                                            <CustomTableTitle
                                                title="Assigned Merchant"
                                                dataIndex="assigned_merchant_name"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Date Assigned"
                                ).show && (
                                    <Table.Column
                                        dataIndex="date_assigned"
                                        key="date_assigned"
                                        title={
                                            <CustomTableTitle
                                                title="Date Assigned"
                                                dataIndex="date_assigned"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}
                                {showTableColumnSettings.data.find(
                                    p => p.title == "Notes"
                                ).show && (
                                    <Table.Column
                                        dataIndex="notes"
                                        key="notes"
                                        title={
                                            <CustomTableTitle
                                                title="Notes"
                                                dataIndex="notes"
                                                dataTableInfo={dataTableInfo}
                                                setDataTableInfo={
                                                    setDataTableInfo
                                                }
                                                localStorageKey="asset_management_table_col_sizes"
                                                localStorageTableCols={
                                                    localStorage.column_settings_table_device_mgmt_table
                                                        ? JSON.parse(
                                                              localStorage.column_settings_table_device_mgmt_table
                                                          ).length
                                                        : 0
                                                }
                                            />
                                        }
                                        ellipsis={true}
                                    />
                                )}

                                <Table.Column
                                    dataIndex="action"
                                    title="Action"
                                    className="action"
                                    align="left"
                                    sortable={false}
                                    render={(text, record) => {
                                        return (
                                            <ButtonGroup>
                                                <Button
                                                    icon={<EyeOutlined />}
                                                    type="primary"
                                                    name="edit_btn"
                                                    onClick={() =>
                                                        viewRecord(record)
                                                    }
                                                ></Button>
                                                <Popconfirm
                                                    title="Are you sure you want to delete this Asset?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={e =>
                                                        handleDeleteAssets(
                                                            record
                                                        )
                                                    }
                                                >
                                                    <Button
                                                        loading={
                                                            isLoadingDeleteAssets
                                                        }
                                                        type="primary"
                                                        danger
                                                        title="Delete"
                                                        name="delete_btn"
                                                        icon={<DeleteFilled />}
                                                    ></Button>
                                                </Popconfirm>
                                            </ButtonGroup>
                                        );
                                    }}
                                />
                            </ResizableAntdTable>
                        </div>
                    </Card>{" "}
                    <TableColumnSettings
                        showTableColumnSettings={showTableColumnSettings}
                        setShowTableColumnSettings={setShowTableColumnSettings}
                        localStorageKey="column_settings_table_device_mgmt_table"
                    />
                    <PageAssetManagmentModal
                        modalForm={modalForm}
                        setModalForm={setModalForm}
                        toggleModalForm={toggleModalForm}
                        selectedRecord={selectedRecord[0]}
                        addOnly={addOnly}
                        displayDeviceMgmtList={displayDeviceMgmtList}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default PageAssetManagement;
