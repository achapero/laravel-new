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
        page_size: 100,
        column:
            localStorage.data_table_files_sort_column == null
                ? localStorage.data_table_files_sort_column
                : "id",
        order:
            localStorage.data_table_files_sort_order == null
                ? localStorage.data_table_files_sort_order
                : "desc"
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
                let array_get = [];
                res.data.map((value, key) => {
                    array_get.push({
                        "File Name": value.file_name,
                        Category: value.category,
                        "File Size": value.file_size
                    });
                });
                setCsvData(array_get);
            }
        }
    );

    useEffect(() => {
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
                Profile Files
            </h1>
        </div>
    );

    const exportPDF = () => {
        const htmlToConvert = renderToString(<HeaderReport />);
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const doc = new jsPDF(orientation, unit, size);
        doc.setFontSize(15);

        const headers = [["File Name", "Category", "File Size"]];
        const data = csvData.map(elt => [
            elt["File Name"],
            elt["Category"],
            elt["File Size"]
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

    const toggleModalUploadMerchantFile = () => {
        setShowModalUploadMerchantFile(!showModalUploadMerchantFile);
    };

    const [
        showModalUploadMerchantFile,
        setShowModalUploadMerchantFile
    ] = useState(false);

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
            <Table
                style={{ width: "100%", overflow: "auto" }}
                bordered
                size="middle"
                dataSource={dataAsset ? dataAsset.data : []}
                loading={isLoadingAsset || isFetchingAsset}
                rowKey={record => record.id}
                onChange={(pagination, filters, sorter, extra) => {
                    console.log("sorter", sorter);
                    setDataTableInfo({
                        ...dataTableInfo,
                        page_number: pagination.current,
                        page_size: pagination.pageSize,
                        column: sorter.columnKey,
                        order: sorter.order
                            ? sorter.order.replace("end", "")
                            : null
                    });

                    localStorage.data_table_files_sort_column =
                        sorter.columnKey;
                    localStorage.data_table_files_sort_order = sorter.order
                        ? sorter.order.replace("end", "")
                        : null;

                    let array_get = [];
                    // console.log("extra", extra.currentDataSource);
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
            >
                <Table.Column
                    title="File Name"
                    key="file_name"
                    sorter={true}
                    render={(text, record) => {
                        var str = record.file_name;
                        var res = str.split(".");
                        var last_arr = res.pop();

                        var truncate1 = truncate(res);
                        var final_name = truncate1 + "." + last_arr;

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
                            record.file_url.indexOf(".pdf") !== -1
                                ? `${record.file_url}`
                                : record.file_url;

                        if (record.file_name.includes("assets")) {
                            return (
                                <a
                                    href={record.file_name}
                                    target="_blank"
                                    download={record.file_name}
                                >
                                    <div style={{ display: "inline" }}>
                                        {/*{last_arr == "jpg" || last_arr == "jpeg" || last_arr == "png" &&
                                            <Image
                                                width={50}
                                                href={window.location.origin+'/storage/'+record.file_name}
                                            />
                                        } {last_arr == "pdf"  && }*/}
                                        <span>
                                            {" "}
                                            <i
                                                className={icon}
                                                aria-hidden="true"
                                            ></i>
                                        </span>

                                        <span style={{ marginLeft: "5px" }}>
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
                                    download={record.file_name}
                                >
                                    <div style={{ display: "inline" }}>
                                        {/*{last_arr == "jpg" || last_arr == "jpeg" || last_arr == "png" &&
                                            <Image
                                                width={50}
                                                href={window.location.origin+'/storage/'+record.file_name}
                                            />
                                        } {last_arr == "pdf"  && }*/}
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
                        }
                    }}
                />

                <Table.Column
                    title="Category"
                    key="category"
                    sorter={true}
                    dataIndex="category"
                />

                <Table.Column
                    title="File Size"
                    key="file_size"
                    sorter={true}
                    dataIndex="file_size"
                />

                <Table.Column
                    title="Action"
                    key="action"
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
            </Table>
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
