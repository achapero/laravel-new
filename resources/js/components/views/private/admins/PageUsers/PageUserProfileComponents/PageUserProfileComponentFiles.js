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
    UserAddOutlined,
    ArrowLeftOutlined,
    PrinterOutlined,
    UploadOutlined
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

import ModalUploadMerchantFile from "../Modals/ModalUploadMerchantFile";

import CustomTableTitle from "../../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

const PageUserProfileComponentFiles = ({ user_id, dataUser }) => {
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const [form] = Form.useForm();
    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);

    const [dataTableInfo, setDataTableInfo] = useState({
        user_id: user_id,
        filter_value: "",
        page_number: 1,
        page_size: 10,
        column: localStorage.data_table_files_sort_column,
        order: localStorage.data_table_files_sort_order
    });

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Profile Files - " + moment().format("YYYY-MM-DD");
    const {
        data: dataAsset,
        isLoading: isLoadingAsset,
        isFetching: isFetchingAsset,
        refetch: refetchAsset
    } = useAxiosQuery(
        "GET",
        `api/v1/users/merchant_files/tab_files?${$.param(dataTableInfo)}`,
        `users_files_${user_id}`,
        res => {
            if (res.success) {
                console.log('files', res.data)
            }
        }
    );

    useEffect(() => {
        localStorage.data_table_files_sort_column = dataTableInfo.column;
        localStorage.data_table_files_sort_order = dataTableInfo.order;

        refetchAsset();
        return () => {};
    }, [dataTableInfo]);

    const [searchText, setSearchText] = useState("");
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDataTableInfo({ ...dataTableInfo, filter_value: searchText });
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchText]);

    function truncate(input) {
        if (input.length > 20) {
            return input.substring(0, 20) + "..";
        }
        return input;
    }

    const {
        mutate: mutateDeleteAsset,
        isLoading: isLoadingDeleteAsset
    } = useAxiosQuery("DELETE", `api/v1/users/files`, `users_files_${user_id}`);

    const deleteRecord = value => {
        mutateDeleteAsset(value, {
            onSuccess: res => {
                refetchAsset();
                notification.success({
                    message: "File Successfully Deleted"
                });
            }
        });
    };

    const toggleModalUploadMerchantFile = () => {
        setShowModalUploadMerchantFile(!showModalUploadMerchantFile);
    };

    const [
        showModalUploadMerchantFile,
        setShowModalUploadMerchantFile
    ] = useState(false);

    useEffect(() => {
        let col_sizes = localStorage.profile_files_table_col_sizes
            ? JSON.parse(localStorage.profile_files_table_col_sizes)
            : null;
        // console.log("col_sizes", col_sizes);
        if (col_sizes) {
            Object.keys(col_sizes).map((title, key) => {
                // console.log($("table th:contains(" + title + ")"));
                // console.log(title, Object.values(col_sizes)[key]);
                $("table th:contains(" + title + ")").attr(
                    "width",
                    parseInt(Object.values(col_sizes)[key]) + 32
                );
            });
        }
        return () => {};
    }, []);

    useEffect(() => {
        if (!localStorage.profile_files_table_col_sizes) {
            var data = {
                "File Name": 124,
                "Category": 118,
                "File Size": 115,
            };
            localStorage.setItem("profile_files_table_col_sizes", JSON.stringify(data));

            $("table th:nth-child(1)").prop("width", "124");
            $("table th:nth-child(2)").prop("width", "118");
            $("table th:nth-child(3)").prop("width", "115");
        } else {
            $(".action").prop("width", "100");
        }
        return () => {};
    }, []);

    return (
        <div>
            <Divider orientation="right" plain>
                <Title level={2}>Files</Title>
            </Divider>

            <Button
                type="primary"
                title="Upload"
                icon={<UploadOutlined />}
                style={{ float: "right", marginBottom: "10px" }}
                onClick={e => toggleModalUploadMerchantFile()}
            >
                Upload
            </Button>
            <ResizableAntdTable
                dataSource={dataAsset ? dataAsset.data.data : []}
                loading={isLoadingAsset || isFetchingAsset}
                rowKey={record => record.id}
                onChange={(pagination, filters, sorter, extra) => {
                    console.log("sorter", sorter);
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
                            <h1>Files List</h1>
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
                                    }}
                                    icon={<FileExcelOutlined />}></Button>
                                </CSVLink>
                                <Button
                                    icon={<PrinterOutlined />}
                                    style={{
                                        background: "#13c2c2",
                                        color: "#ffffff",
                                        border: "1px solid #13c2c2"
                                    }}
                                    onClick={() => exportPDF()}
                                ></Button> */}
                            </Space>
                        </Col>
                    </Row>
                )}
                scroll={{ x: "fit-content" }}
            >
                <Table.Column
                    key="file_name"
                    render={(text, record) => {
                        var str = record.file_name;
                        var res = str.split(".");
                        var last_arr = res.pop();

                        var truncate1 = truncate(res);
                        var final_name = truncate1 + "." + last_arr;
                        let url = window.location.origin + "/storage/" + record.file_url

                        let icon = "";
                        if ( last_arr == "jpg" || last_arr == "jpeg" || last_arr == "png" ) {
                            icon = "fa fa-file-image-o";
                        }
                        if (last_arr == "pdf") {
                            icon = "fa fa-file-pdf-o";
                        }

                        return (
                            <a
                                href={url}
                                target="_blank"
                                download={url}
                            >
                                <div style={{ display: "inline" }}>
                                    <span>
                                        {" "}
                                        <i
                                            className={icon}
                                            aria-hidden="true"
                                        ></i>
                                    </span>

                                    <span style={{ marginLeft: "5px" }}>
                                        {record.file_name}
                                    </span>
                                </div>
                            </a>
                        );
                    }}
                    title={
                        <CustomTableTitle
                            title="File Name"
                            dataIndex="file_name"
                            dataTableInfo={dataTableInfo}
                            setDataTableInfo={setDataTableInfo}
                            localStorageKey="profile_files_table_col_sizes"
                            localStorageTableCols={3}
                        />
                    }
                    ellipsis={true}
                />

                <Table.Column
                    title="Category"
                    key="category"
                    dataIndex="category"
                    title={
                        <CustomTableTitle
                            title="Category"
                            dataIndex="category"
                            dataTableInfo={dataTableInfo}
                            setDataTableInfo={setDataTableInfo}
                            localStorageKey="profile_files_table_col_sizes"
                            localStorageTableCols={3}
                        />
                    }
                    ellipsis={true}
                />

                <Table.Column
                    key="file_size"
                    dataIndex="file_size"
                    title={
                        <CustomTableTitle
                            title="File Size"
                            dataIndex="file_size"
                            dataTableInfo={dataTableInfo}
                            setDataTableInfo={setDataTableInfo}
                            localStorageKey="profile_files_table_col_sizes"
                            localStorageTableCols={3}
                        />
                    }
                    ellipsis={true}
                />

                <Table.Column
                    title="Action"
                    key="action"
                    className="action"
                    render={(text, record) => {
                        return (
                            <div>
                                <Popconfirm
                                    title="Are you sure to delete this File?"
                                    onConfirm={() => deleteRecord(record)}
                                    okText="Confirm"
                                    cancelText="Cancel"
                                >
                                    <Button
                                        // loading={isLoadingDeleteUser}
                                        type="primary"
                                        danger
                                        size="sm"
                                        title="Delete"
                                        icon={<DeleteFilled />}
                                    ></Button>
                                </Popconfirm>
                            </div>
                        );
                    }}
                />
            </ResizableAntdTable>
            <ModalUploadMerchantFile
                showModalUploadMerchantFile={showModalUploadMerchantFile}
                setShowModalUploadMerchantFile={setShowModalUploadMerchantFile}
                toggleModalUploadMerchantFile={toggleModalUploadMerchantFile}
                user_id={user_id}
            />
        </div>
    );
};

export default PageUserProfileComponentFiles;
