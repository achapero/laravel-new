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

import ModalUploadMerchantFile from "./ModalUploadMerchantFile";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    PrinterOutlined,
    SearchOutlined
} from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";
import moment, { isMoment } from "moment";
import queryString from "query-string";

import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import { CSVLink } from "react-csv";

import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { widhtAdjustable } from "../../../../providers/widhtAdjustable";

import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PageFiles = ({ permission }) => {
    const userdata = getUserData();

    const handleReset = clearFilters => {
        clearFilters();
    };
    let searchInput;
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const [merchantFiles, setMerchantFiles] = useState([]);
    const [
        showModalUploadMerchantFile,
        setShowModalUploadMerchantFile
    ] = useState(false);

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_files_table
            ? JSON.parse(localStorage.column_settings_files_table)
            : [
                  { title: "Merchant Name", show: true },
                  { title: "Category", show: true },
                  {
                      title: "File Name",

                      show: true
                  },
                  {
                      title: "File Size",

                      show: true
                  },

                  { title: "Date Created", show: true },
                  { title: "Action", show: true }
              ]
    });

    const toggleModalUploadMerchantFile = () => {
        setShowModalUploadMerchantFile(!showModalUploadMerchantFile);
    };

    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);
    var str = my_filter.email;
    var resstr = str ? str.replace("+", "%2B") : "";

    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: str ? resstr : "",
        page_number: 1,
        page_size: 100,
        column: localStorage.data_table_files_sort_column,
        order: localStorage.data_table_files_sort_order
    });

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Files - " + moment().format("YYYY-MM-DD");
    const {
        data: dataAllFiles,
        isLoading: isLoadingAllFiles,
        refetch: refetchAllFiles,
        isFetching: isFetchingTblAllFiles
    } = useAxiosQuery(
        "GET",
        `api/v1/users/merchant_files/filtered?${$.param(dataTableInfo)}`,
        "files_filtered_table",
        res => {
            if (res.success) {
                console.log("@files", res);
                setTimeout(() => getCheckPermission(permission), 1000);
            }
        }
    );

    useEffect(() => {
        console.log("@dataTableInfo", dataTableInfo);
        localStorage.data_table_files_sort_column = dataTableInfo.column;
        localStorage.data_table_files_sort_order = dataTableInfo.order;

        refetchAllFiles();
        return () => {};
    }, [dataTableInfo]);

    const {
        mutate: mutateDeleteUser,
        isLoading: isLoadingDeleteUser
    } = useAxiosQuery("DELETE", "api/v1/users/files", "files_table");

    const handleDeleteUser = record => {
        console.log(record);
        mutateDeleteUser(record, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "File Successfully Deleted"
                    });
                    refetchAllFiles();
                }
            }
        });
    };

    function truncate(input) {
        if (input.length > 20) {
            return input.substring(0, 20) + "..";
        }
        return input;
    }

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

    const checkIfDefault = column => {
        if (localStorage.data_table_files_sort_column) {
            if (localStorage.data_table_files_sort_column == column) {
                return localStorage.data_table_files_sort_order + "end";
            }
        }

        return null;
    };

    useEffect(() => {
        let col_sizes = localStorage.merchant_files_table_col_sizes
            ? JSON.parse(localStorage.merchant_files_table_col_sizes)
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
        if (!localStorage.merchant_files_table_col_sizes) {
            var a = {
                "Merchant Name": 155,
                Category: 115,
                "File Name": 120,
                "File Size": 99,

                "Date Created": 135
            };

            localStorage.setItem(
                "merchant_files_table_col_sizes",
                JSON.stringify(a)
            );

            $(`table th:nth-child(1)`).prop("width", 155);
            $(`table th:nth-child(2)`).prop("width", 115);
            $(`table th:nth-child(3)`).prop("width", 120);
            $(`table th:nth-child(4)`).prop("width", 99);
            $(`table th:nth-child(5)`).prop("width", 135);
        }

        return () => {};
    }, []);

    return (
        <>
            <div
                className="animated fadeIn merchantFiles"
                id="merchantFiles idmerchantFilesMerchant"
                style={{
                    padding: "24px 16px"
                }}
            >
                <Row>
                    <Col md={24}>
                        <Card
                            title="Merchant Files"
                            bordered={false}
                            extra={
                                <Button
                                    type="primary"
                                    title="Upload"
                                    icon={<UploadOutlined />}
                                    onClick={e =>
                                        toggleModalUploadMerchantFile()
                                    }
                                    name="add_btn"
                                >
                                    Upload
                                </Button>
                            }
                        >
                            <Row>
                                <Col md={8} xs={0}></Col>
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
                                        isLoadingAllFiles ||
                                        isFetchingTblAllFiles
                                    }
                                    rowKey={record => record.id}
                                    dataSource={
                                        dataAllFiles
                                            ? dataAllFiles.data.data
                                            : []
                                    }
                                    pagination={{
                                        pageSize: dataTableInfo.page_size,
                                        current: dataAllFiles
                                            ? dataAllFiles.data.current_page
                                            : 1,
                                        showSizeChanger: true,
                                        total: dataAllFiles
                                            ? dataAllFiles.data.total
                                            : 1,

                                        showTotal: (total, range) =>
                                            `${range[0]}-${range[1]} of ${total} items`,

                                        pageSizeOptions: [100, 200]
                                    }}
                                    onChange={(
                                        pagination,
                                        filters,
                                        sorter,
                                        extra
                                    ) => {
                                        console.log("sorter", sorter);
                                        setDataTableInfo({
                                            ...dataTableInfo,
                                            page_number: pagination.current,
                                            page_size: pagination.pageSize
                                        });
                                    }}
                                    scroll={{ x: "fit-content" }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Merchant Name"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="dba_name"
                                            key="dba_name"
                                            title={
                                                <CustomTableTitle
                                                    title="Merchant Name"
                                                    dataIndex="dba_name"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="merchant_files_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_files_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_files_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            ellipsis={true}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Category"
                                    ).show && (
                                        <Table.Column
                                            key="category"
                                            render={(text, record) => {
                                                return (
                                                    <>
                                                        {record.category
                                                            ? record.category
                                                            : ""}
                                                    </>
                                                );
                                            }}
                                            title={
                                                <CustomTableTitle
                                                    title="Category"
                                                    dataIndex="category"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="merchant_files_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_files_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_files_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            ellipsis={true}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "File Name"
                                    ).show && (
                                        <Table.Column
                                            key="file_name"
                                            render={(text, record) => {
                                                var str = record.file_name;
                                                var res = str.split(".");
                                                var last_arr = res.pop();

                                                var truncate1 = truncate(
                                                    res[0]
                                                );
                                                var final_name =
                                                    truncate1 + "." + last_arr;

                                                let icon = "";
                                                if (
                                                    last_arr == "jpg" ||
                                                    last_arr == "jpeg" ||
                                                    last_arr == "png"
                                                ) {
                                                    icon = "fa fa-file-image-o";
                                                }
                                                if (last_arr == "pdf") {
                                                    icon = "fa fa-file-pdf-o";
                                                }

                                                let href =
                                                    record.file_url.indexOf(
                                                        ".pdf"
                                                    ) !== -1
                                                        ? `${record.file_url}`
                                                        : record.file_url;

                                                if (
                                                    record.file_name.includes(
                                                        "assets"
                                                    )
                                                ) {
                                                    return (
                                                        <a
                                                            href={
                                                                record.file_name
                                                            }
                                                            target="_blank"
                                                            download={
                                                                record.file_name
                                                            }
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "inline"
                                                                }}
                                                            >
                                                                <span>
                                                                    <i
                                                                        className={
                                                                            icon
                                                                        }
                                                                        aria-hidden="true"
                                                                    ></i>
                                                                </span>

                                                                <span
                                                                    style={{
                                                                        marginLeft:
                                                                            "5px"
                                                                    }}
                                                                >
                                                                    {final_name}
                                                                </span>
                                                            </div>
                                                        </a>
                                                    );
                                                } else {
                                                    return (
                                                        <a
                                                            href={`/storage/${href}`}
                                                            target="_blank"
                                                            download={
                                                                record.file_name
                                                            }
                                                        >
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "inline"
                                                                }}
                                                            >
                                                                <span>
                                                                    <i
                                                                        className={
                                                                            icon
                                                                        }
                                                                        aria-hidden="true"
                                                                    ></i>
                                                                </span>

                                                                <span
                                                                    style={{
                                                                        marginLeft:
                                                                            "5px"
                                                                    }}
                                                                >
                                                                    {final_name}
                                                                </span>
                                                            </div>
                                                        </a>
                                                    );
                                                }
                                            }}
                                            title={
                                                <CustomTableTitle
                                                    title="File Name"
                                                    dataIndex="file_name"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="merchant_files_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_files_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_files_table
                                                              ).length
                                                            : 0
                                                    }
                                                />
                                            }
                                            ellipsis={true}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "File Size"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="file_size"
                                            key="file_size"
                                            title={
                                                <CustomTableTitle
                                                    title="File Size"
                                                    dataIndex="file_size"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="merchant_files_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_files_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_files_table
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
                                            dataIndex="created_at_srt"
                                            key="created_at_srt"
                                            title={
                                                <CustomTableTitle
                                                    title="Date Created"
                                                    dataIndex="created_at_srt"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="merchant_files_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_files_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_files_table
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
                                            showSorterTooltip={false}
                                            dataIndex="action"
                                            title="Action"
                                            className="action"
                                            align="left"
                                            sortable={false}
                                            render={(text, record) => {
                                                return (
                                                    <Popconfirm
                                                        title="Are you sure you want to delete this File?"
                                                        okText="Yes"
                                                        cancelText="No"
                                                        onConfirm={e =>
                                                            handleDeleteUser(
                                                                record
                                                            )
                                                        }
                                                    >
                                                        <Button
                                                            // loading={isLoadingDeleteUser}
                                                            type="primary"
                                                            danger
                                                            title="Delete"
                                                            icon={
                                                                <DeleteFilled />
                                                            }
                                                            name="delete_btn"
                                                        ></Button>
                                                    </Popconfirm>
                                                );
                                            }}
                                        />
                                    )}
                                </ResizableAntdTable>
                            </div>
                        </Card>{" "}
                    </Col>
                </Row>
            </div>
            <TableColumnSettings
                showTableColumnSettings={showTableColumnSettings}
                setShowTableColumnSettings={setShowTableColumnSettings}
                localStorageKey="column_settings_files_table"
            />
            <ModalUploadMerchantFile
                showModalUploadMerchantFile={showModalUploadMerchantFile}
                setShowModalUploadMerchantFile={setShowModalUploadMerchantFile}
                toggleModalUploadMerchantFile={toggleModalUploadMerchantFile}
                getMerchantFiles={refetchAllFiles}
            />
        </>
    );
};

export default PageFiles;
