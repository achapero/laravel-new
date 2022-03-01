import React, { useState, useEffect, useRef } from "react";
import {
    Form,
    Card,
    Row,
    Col,
    Button,
    Input,
    InputNumber,
    Divider,
    notification,
    Table,
    Popconfirm,
    Modal,
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
    PrinterOutlined,
    SearchOutlined
} from "@ant-design/icons";

import { Link, useLocation, useHistory } from "react-router-dom";
import moment, { isMoment } from "moment";
import queryString from "query-string";

import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../providers/TableColumnSettings";

import { CSVLink } from "react-csv";
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MaskedInput from "antd-mask-input";
import { widhtAdjustable } from "../../../../providers/widhtAdjustable";

import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PagePanList = ({ permission }) => {
    // localStorage.removeItem("column_settings_panlist_table");
    const handleReset = clearFilters => {
        clearFilters();
    };
    let searchInput;
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };
    const [form] = Form.useForm();
    const userdata = getUserData();
    let history = useHistory();
    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);

    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: my_filter.app_status ? my_filter.app_status : "",
        page_number: 1,
        page_size: 20,
        column: localStorage.data_table_panlist_sort_column,
        order: localStorage.data_table_panlist_sort_order
    });

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_panlist_table
            ? JSON.parse(localStorage.column_settings_panlist_table)
            : [
                  { title: "DBA Name", show: true },
                  { title: "Amount", show: true },
                  { title: "Date Of Transaction", show: true },
                  { title: "Date Of Request", show: true },
                  { title: "Date Of Return", show: true },
                  { title: "Card Info", show: true },
                  { title: "Expiration Date", show: true },
                  { title: "Modified By", show: true },
                  { title: "Created By", show: true },
                  { title: "Action", show: true }
              ]
    });

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "PAN List - " + moment().format("YYYY-MM-DD");

    const {
        data: dataGetPANList,
        isLoading: isLoadingGetPANList,
        refetch: refetchTable,
        isFetching: isFetchingGetPANList
    } = useAxiosQuery(
        `GET`,
        `api/v1/pan_list?${$.param(dataTableInfo)}`,
        `get_pan_list`,
        res => {
            if (res.success) {
                console.log("Res", res);
                setTimeout(() => getCheckPermission(permission), 500);
            }
        }
    );

    useEffect(() => {
        localStorage.data_table_panlist_sort_column = dataTableInfo.column;
        localStorage.data_table_panlist_sort_order = dataTableInfo.order;

        refetchTable();
        return () => {};
    }, [dataTableInfo]);

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
        if (localStorage.data_table_panlist_sort_column) {
            if (localStorage.data_table_panlist_sort_column == column) {
                return localStorage.data_table_panlist_sort_order + "end";
            }
        }
        return null;
    };

    const [showModalNew, setShowModalNew] = useState(false);
    const handleCancel = () => {
        setShowModalNew(false);
        // form.resetFields();
    };

    const handleUpdate = record => {
        form.setFieldsValue({
            id: record ? record.id : "",
            dba: record ? record.dba : "",
            amount: record ? record.amount : "",
            card_info: record ? record.card_info : "",
            date_of_transaction: record
                ? moment(record.date_of_transaction)
                : "",
            date_of_request: record ? moment(record.date_of_request) : "",
            date_of_return: record ? moment(record.date_of_return) : "",
            expiration_date: record ? record.expiration_date : ""
        });
        setShowModalNew(true);
    };

    useEffect(() => {
        if (!showModalNew) {
            // form.resetFields();
            // console.log("asds");
        }
    }, [showModalNew]);

    const onFinishForm = data => {
        mutateAddPAN(data, {
            onSuccess: res => {
                if (res.success) {
                    setShowModalNew(false);
                    form.resetFields();
                    notification.success({
                        message: "Success",
                        description: "Successfull Added"
                    });
                }
            }
        });
    };

    const { mutate: mutateAddPAN, isLoading: isLoadingAddPAN } = useAxiosQuery(
        "POST",
        "api/v1/pan_list",
        "get_pan_list"
    );

    const handleDelete = record => {
        mutateDeletePAN(record, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Successfully Deleted"
                    });
                }
            }
        });
    };

    const {
        mutate: mutateDeletePAN,
        isLoading: isLoadingDeletePANPAN
    } = useAxiosQuery("DELETE", "api/v1/pan_list", "get_pan_list");

    useEffect(() => {
        let col_sizes = localStorage.pan_list_table_col_sizes
            ? JSON.parse(localStorage.pan_list_table_col_sizes)
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
        if (!localStorage.pan_list_table_col_sizes) {
            var data = {
                "DBA Name": 135,
                Amount: 113,
                "Date Of Transaction": 183,
                "Date Of Request": 156,
                "Date Of Return": 156,
                "Card Info": 115,
                "Expiration Date": 151,
                "Modified By": 138,
                "Created By": 127,
                Action: 100
            };
            localStorage.setItem(
                "pan_list_table_col_sizes",
                JSON.stringify(data)
            );

            $("table th:nth-child(1)").prop("width", "135");
            $("table th:nth-child(2)").prop("width", "113");
            $("table th:nth-child(3)").prop("width", "183");
            $("table th:nth-child(4)").prop("width", "156");
            $("table th:nth-child(5)").prop("width", "156");
            $("table th:nth-child(6)").prop("width", "115");
            $("table th:nth-child(7)").prop("width", "151");
            $("table th:nth-child(8)").prop("width", "138");
            $("table th:nth-child(9)").prop("width", "127");
            $("table th:nth-child(10)").prop("width", "100");
        } else {
            // $(".action").prop("width", "100");
        }
        return () => {};
    }, []);

    return (
        <div
            className="animated fadeIn merchantFiles"
            id="panList"
            style={{
                padding: "24px 16px"
            }}
        >
            <Card
                title="PAN Lists"
                bordered={false}
                extra={
                    <Button
                        type="primary"
                        title="Upload"
                        icon={<PlusCircleOutlined />}
                        onClick={e => {
                            form.resetFields();
                            setShowModalNew(true);
                        }}
                        name="add_btn"
                    >
                        Add New PAN
                    </Button>
                }
            >
                <Row gutter={24}>
                    <Col xs={12} md={8} className="p-0"></Col>
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
                    <ResizableAntdTable
                        scroll={{ x: "fit-content" }}
                        className="table-pan-list"
                        loading={isLoadingGetPANList || isLoadingAddPAN}
                        rowKey={record => record.id}
                        dataSource={
                            dataGetPANList ? dataGetPANList.data.data : []
                        }
                        pagination={{
                            pageSize: dataTableInfo.page_size,
                            current: dataGetPANList
                                ? dataGetPANList.data.current_page
                                : 1,
                            showSizeChanger: true,
                            total: dataGetPANList
                                ? dataGetPANList.data.total
                                : 1,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,
                            pageSizeOptions: [20, 50, 100, 200]
                        }}
                        onChange={(pagination, filters, sorter, extra) => {
                            // setDataTableInfo({
                            //     ...dataTableInfo,
                            //     page_number: pagination.current,
                            //     page_size: pagination.pageSize,
                            //     // column: sorter.columnKey,
                            //     // order: sorter.order ? sorter.order.replace("end", "") : null
                            // });
                        }}
                    >
                        {showTableColumnSettings.data.find(
                            p => p.title == "DBA Name"
                        ).show && (
                            <Table.Column
                                dataIndex="dba"
                                key="dba"
                                // title="DBA Name"
                                title={
                                    <CustomTableTitle
                                        title="DBA Name"
                                        dataIndex="dba"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Amount"
                        ).show && (
                            <Table.Column
                                key="amount"
                                dataIndex="amount"
                                title={
                                    <CustomTableTitle
                                        title="Amount"
                                        dataIndex="amount"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Date Of Transaction"
                        ).show && (
                            <Table.Column
                                key="date_of_transaction_srt"
                                dataIndex="date_of_transaction_srt"
                                title={
                                    <CustomTableTitle
                                        title="Date Of Transaction"
                                        dataIndex="date_of_transaction_srt"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Date Of Request"
                        ).show && (
                            <Table.Column
                                title="Date Of Request"
                                key="date_of_request_srt"
                                dataIndex="date_of_request_srt"
                                title={
                                    <CustomTableTitle
                                        title="Date Of Request"
                                        dataIndex="date_of_request_srt"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                                render={(text, record) => {
                                    return record.date_of_request_srt
                                        ? record.date_of_request_srt
                                        : "NA";
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Date Of Return"
                        ).show && (
                            <Table.Column
                                key="date_of_return_srt"
                                dataIndex="date_of_return_srt"
                                title={
                                    <CustomTableTitle
                                        title="Date Of Return"
                                        dataIndex="date_of_return_srt"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                                render={(text, record) => {
                                    return record.date_of_return_srt
                                        ? record.date_of_return_srt
                                        : "NA";
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Card Info"
                        ).show && (
                            <Table.Column
                                key="card_info"
                                render={(text, record) => {
                                    return record.card_info.replace(
                                        /.(?=.{4})/g,
                                        "#"
                                    );
                                }}
                                title={
                                    <CustomTableTitle
                                        title="Card Info"
                                        dataIndex="card_info"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Expiration Date"
                        ).show && (
                            <Table.Column
                                key="expiration_date"
                                dataIndex="expiration_date"
                                title={
                                    <CustomTableTitle
                                        title="Expiration Date"
                                        dataIndex="expiration_date"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                                render={(text, record) => {
                                    return record.expiration_date
                                        ? record.expiration_date
                                        : "NA";
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Modified By"
                        ).show && (
                            <Table.Column
                                key="name_modified_by"
                                dataIndex="name_modified_by"
                                title={
                                    <CustomTableTitle
                                        title="Modified By"
                                        dataIndex="name_modified_by"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                                render={(text, record) => {
                                    return record.name_modified_by
                                        ? record.name_modified_by
                                        : "NA";
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Created By"
                        ).show && (
                            <Table.Column
                                key="name"
                                dataIndex="name"
                                title={
                                    <CustomTableTitle
                                        title="Created By"
                                        dataIndex="name"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                                render={(text, record) => {
                                    return record.created_by
                                        ? record.created_by
                                        : "NA";
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Action"
                        ).show && (
                            <Table.Column
                                dataIndex="action"
                                // title="Action"
                                title={
                                    <CustomTableTitle
                                        title="Action"
                                        dataIndex="action"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="pan_list_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_panlist_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_panlist_table
                                                  ).length
                                                : 0
                                        }
                                    />
                                }
                                className="action"
                                align="left"
                                sortable={false}
                                render={(text, record) => {
                                    return (
                                        <Space>
                                            <Button
                                                type="primary"
                                                title="Edit"
                                                icon={<EditFilled />}
                                                onClick={e => {
                                                    handleUpdate(record);
                                                }}
                                                name="edit_btn"
                                            ></Button>
                                            <Popconfirm
                                                title="Are you sure you want to delete this PAN?"
                                                okText="Yes"
                                                cancelText="No"
                                                onConfirm={e =>
                                                    handleDelete(record)
                                                }
                                            >
                                                <Button
                                                    // loading={isLoadingDeletePAN}
                                                    type="primary"
                                                    danger
                                                    title="Delete"
                                                    name="delete_btn"
                                                    icon={<DeleteFilled />}
                                                ></Button>
                                            </Popconfirm>
                                        </Space>
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
                localStorageKey="column_settings_panlist_table"
            />

            <Modal
                visible={showModalNew}
                title="PAN Form"
                okText="Submit"
                cancelText="Cancel"
                width={600}
                onCancel={handleCancel}
                onOk={() => {
                    form.validateFields()
                        .then(values => {
                            onFinishForm(values);
                        })
                        .catch(info => {
                            console.log("Validate Failed:", info);
                        });
                }}
            >
                <Form
                    form={form}
                    name="panlistnew"
                    layout="vertical"
                    initialValues={{ user_id: userdata.id }}
                >
                    <Form.Item name="user_id" className="hide">
                        <Input name="user_id" />
                    </Form.Item>

                    <Form.Item name="id" className="hide">
                        <Input name="id" />
                    </Form.Item>

                    <Form.Item
                        label="DBA Name"
                        name="dba"
                        rules={[
                            { required: true, message: "DBA Name is required!" }
                        ]}
                    >
                        <Input name="dba" />
                    </Form.Item>

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[
                            { required: true, message: "Amount is required!" }
                        ]}
                    >
                        <InputNumber name="amount" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Transaction Date"
                        name="date_of_transaction"
                        rules={[
                            {
                                required: true,
                                message: "Transaction Date is required!"
                            }
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            name="date_of_transaction"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Request Date"
                        name="date_of_request"
                        rules={[
                            {
                                required: true,
                                message: "Request Date is required!"
                            }
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            name="date_of_request"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Return Date"
                        name="date_of_return"
                        rules={[
                            {
                                required: true,
                                message: "Return Date is required!"
                            }
                        ]}
                    >
                        <DatePicker
                            format="YYYY-MM-DD"
                            name="date_of_return"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Card Number"
                        name="card_info"
                        rules={[
                            { required: true, message: "Card is required!" }
                        ]}
                    >
                        <MaskedInput
                            mask="1111 1111 1111 1111"
                            size="large"
                            name="card_info"
                            placeholder="Card Number"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Expiration Date"
                        name="expiration_date"
                        rules={[
                            {
                                required: true,
                                message: "Expiration Date is required!"
                            }
                        ]}
                    >
                        <MaskedInput
                            mask="11/11"
                            name="expiration_date"
                            size="large"
                            placeholder="MM/YY"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PagePanList;
