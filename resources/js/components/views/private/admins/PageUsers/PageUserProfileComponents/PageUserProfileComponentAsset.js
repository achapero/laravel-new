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

import CustomTableTitle from "../../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PageUserProfileComponentAsset = ({ user_id, dataUser }) => {
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
        page_size: 10,
        column: localStorage.data_table_asset_sort_column,
        order: localStorage.data_table_asset_sort_order
    });

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Profile Assets - " + moment().format("YYYY-MM-DD");

    const {
        data: dataAsset,
        isLoading: isLoadingAsset,
        isFetching: isFetchingAsset,
        refetch: refetchAsset
    } = useAxiosQuery(
        "GET",
        `api/v1/devicemgmt_filtered_byUser?${$.param(dataTableInfo)}`,
        // `api/v1/devicemgmt_filtered_byUser?id=${user_id}`,
        `devicemgmt_filtered_${user_id}`,
        res => {
            if (res.success) {

            }
        }
    );

    useEffect(() => {
        localStorage.data_table_asset_sort_column = dataTableInfo.column;
        localStorage.data_table_asset_sort_order = dataTableInfo.order;

        refetchAsset();
        return () => {};
    }, [dataTableInfo]);

    const checkIfDefault = column => {
        if (localStorage.data_table_asset_sort_column) {
            if (localStorage.data_table_asset_sort_column == column) {
                return localStorage.data_table_asset_sort_order + "end";
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
        data: localStorage.column_settings_asset_table
            ? JSON.parse(localStorage.column_settings_asset_table)
            : [
                  { title: "Asset Name", show: true },
                  { title: "Serial Number", show: true },
                  { title: "Asset Type", show: true },
                  { title: "Given Date", show: true },
                  { title: "Manufacturer", show: true },
                  { title: "Date Assigned", show: true },
                  { title: "Notes", show: true }
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

    const [FormDatas, setFormDatas] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalValue, setIsModalValue] = useState(false);
    const viewRecord = value => {
        setIsModalVisible(true);
        setIsModalValue(value);
        setFormDatas({ ...FormDatas, id: value.id });
    };

    const cancel = () => {
        form.resetFields();
        setIsModalVisible(false);
        setIsModalValue();
        setFormDatas();
    };

    const {
        mutate: mutateUpdateAsset,
        isLoading: isLoadingUpdateAsset
    } = useAxiosQuery(
        "UPDATE",
        `api/v1/devicemgmt`,
        `devicemgmt_filtered_${user_id}`
    );

    const onFinishFormAsset = value => {
        console.log("@form input", FormDatas);
        mutateUpdateAsset(FormDatas, {
            onSuccess: res => {
                form.resetFields();
                setIsModalVisible(false);
                setIsModalValue();
                setFormDatas();
                notification.success({
                    message: "User Successfully Update"
                });
            }
        });
    };

    const {
        mutate: mutateDeleteAsset,
        isLoading: isLoadingDeleteAsset
    } = useAxiosQuery(
        "DELETE",
        `api/v1/devicemgmt`,
        `devicemgmt_filtered_${user_id}`
    );

    const deleteRecord = value => {
        mutateDeleteAsset(value, {
            onSuccess: res => {
                form.resetFields();
                setIsModalVisible(false);
                setIsModalValue();
                setFormDatas();
                notification.success({
                    message: "User Successfully Deleted"
                });
            }
        });
    };

    useEffect(() => {
        let col_sizes = localStorage.profile_assets_table_col_sizes
            ? JSON.parse(localStorage.profile_assets_table_col_sizes)
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
        if (!localStorage.profile_assets_table_col_sizes) {
            var data = {
               "Asset Name": 121,
               "Serial Number": 131,
               "Asset Type": 109,
               "Given Date": 119,
               "Manufacturer": 125,
               "Date Assigned": 129,
               "Notes": 89,
            };
            localStorage.setItem("profile_assets_table_col_sizes", JSON.stringify(data));

            $("table th:nth-child(1)").prop("width", "121");
            $("table th:nth-child(2)").prop("width", "131");
            $("table th:nth-child(3)").prop("width", "109");
            $("table th:nth-child(4)").prop("width", "119");
            $("table th:nth-child(5)").prop("width", "125");
            $("table th:nth-child(6)").prop("width", "129");
            $("table th:nth-child(7)").prop("width", "89");
        } else {
            $(".action").prop("width", "100");
        }
        return () => {};
    }, []);


    return (
        <div>
            <Divider orientation="right" plain>
                <Title level={2}>Assets</Title>
            </Divider>

            <ResizableAntdTable
                style={{ width: "100%", overflow: "auto" }}
                bordered
                size="middle"
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
                            <h1>Asset List</h1>
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
                scroll={{ x: "fit-content" }}
            >
                {showTableColumnSettings.data.find(p => p.title == "Asset Name").show && (
                    <Table.Column
                        key="device_name"
                        dataIndex="device_name"
                        title={
                            <CustomTableTitle
                                title="Asset Name"
                                dataIndex="device_name"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageTableCols={
                                    localStorage.column_settings_asset_table ?
                                        JSON.parse(localStorage.column_settings_asset_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find( p => p.title == "Serial Number" ).show && (
                    <Table.Column
                        key="serial_number"
                        dataIndex="serial_number"
                        title={
                            <CustomTableTitle
                                title="Serial Number"
                                dataIndex="serial_number"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageTableCols={
                                    localStorage.column_settings_asset_table ?
                                        JSON.parse(localStorage.column_settings_asset_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find(p => p.title == "Asset Type") .show && (
                    <Table.Column
                        key="device_type"
                        dataIndex="device_type"
                        title={
                            <CustomTableTitle
                                title="Asset Type"
                                dataIndex="device_type"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageTableCols={
                                    localStorage.column_settings_asset_table ?
                                        JSON.parse(localStorage.column_settings_asset_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find(p => p.title == "Given Date") .show && (
                    <Table.Column
                        key="given_date"
                        render={(text, record) => {
                            return moment(record.given_date).format(
                                "YYYY-MM-DD"
                            );
                        }}
                        title={
                            <CustomTableTitle
                                title="Given Date"
                                dataIndex="given_date"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_assets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_asset_table ?
                                        JSON.parse(localStorage.column_settings_asset_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}

                {showTableColumnSettings.data.find(p => p.title == "Manufacturer") .show && (
                    <Table.Column
                        key="manufacturer"
                        dataIndex="manufacturer"
                        title={
                            <CustomTableTitle
                                title="Manufacturer"
                                dataIndex="manufacturer"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_assets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_asset_table ?
                                        JSON.parse(localStorage.column_settings_asset_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}
                {showTableColumnSettings.data.find(p => p.title == "Date Assigned") .show && (
                    <Table.Column
                        key="date_assigned"
                        render={(text, record) => {
                            return moment(record.date_assigned).format(
                                "YYYY-MM-DD"
                            );
                        }}
                        title={
                            <CustomTableTitle
                                title="Date Assigned"
                                dataIndex="date_assigned"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_assets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_asset_table ?
                                        JSON.parse(localStorage.column_settings_asset_table).length
                                        : 0
                                }
                            />
                        }
                        ellipsis={true}
                    />
                )}

                {showTableColumnSettings.data.find(p => p.title == "Notes") .show && (
                    <Table.Column
                        key="notes"
                        dataIndex="notes"
                        title={
                            <CustomTableTitle
                                title="Notes"
                                dataIndex="notes"
                                dataTableInfo={dataTableInfo}
                                setDataTableInfo={setDataTableInfo}
                                localStorageKey="profile_assets_table_col_sizes"
                                localStorageTableCols={
                                    localStorage.column_settings_asset_table ?
                                        JSON.parse(localStorage.column_settings_asset_table).length
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
                                        onClick={() => viewRecord(record)}
                                        icon={<EyeOutlined />}
                                    ></Button>
                                    <Popconfirm
                                        title="Are you sure to delete this asset?"
                                        onConfirm={() => deleteRecord(record)}
                                        onCancel={cancel}
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
                                </ButtonGroup>
                            </div>
                        );
                    }}
                />
            </ResizableAntdTable>

            <TableColumnSettings
                showTableColumnSettings={showTableColumnSettings}
                setShowTableColumnSettings={setShowTableColumnSettings}
                localStorageKey="column_settings_asset_table"
            />

            <Modal
                title="Asset Details"
                visible={isModalVisible}
                className="modal-md"
                onCancel={cancel}
                footer={[
                    <Button key="cancel" onClick={cancel}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={() => {
                            form.submit();
                        }}
                    >
                        Submit
                    </Button>
                ]}
            >
                <Form
                    name="basic"
                    layout="vertical"
                    onFinish={onFinishFormAsset}
                    initialValues={modalValue}
                    form={form}
                >
                    <Form.Item label="Asset Name" name="device_name">
                        <Input
                            placeholder="Asset Name"
                            name="device_name"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    device_name: e.target.value
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Serial Number" name="serial_number">
                        <Input
                            name="serial_number"
                            placeholder="Serial Number"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    serial_number: e.target.value
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Merchant Name" name="merchant_name">
                        <Input
                            name="merchant_name"
                            placeholder="Merchant Name"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    merchant_name: e.target.value
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item label="Asset Type" name="device_type">
                        <Select
                            name="device_type"
                            placeholder="Asset Type"
                            onChange={e =>
                                setFormDatas({ ...FormDatas, device_type: e })
                            }
                        >
                            <Option value="">Select Asset Type</Option>
                            <Option value="Workstation">Workstation</Option>
                            <Option value="Thermal Printer">
                                Thermal Printer
                            </Option>
                            <Option value="Impact Printer">
                                Impact Printer
                            </Option>
                            <Option value="Cash Drawer">Cash Drawer</Option>
                            <Option value="Router">Router</Option>
                            <Option value="Switch">Switch</Option>
                            <Option value="Server">Server</Option>
                            <Option value="VAR Sheet">VAR Sheet</Option>
                            <Option value="New Terminal">New Terminal</Option>
                            <Option value="Reinjected Terminal">
                                Reinjected Terminal
                            </Option>
                            <Option value="Loaner Terminal">
                                Loaner Terminal
                            </Option>
                            <Option value="No Load Terminal">
                                No Load Terminal
                            </Option>
                            <Option value="Customer Supplied">
                                Customer Supplied
                            </Option>
                            <Option value="Shipped to KIF">
                                Shipped to KIF
                            </Option>
                            <Option value="Tampered">Tampered</Option>
                        </Select>
                    </Form.Item>

                    {modalValue && (
                        <Form.Item label="Given Date">
                            <DatePicker
                                className="myDatePicker"
                                format={"YYYY-MM-DD"}
                                placeholder="Given Date"
                                // defaultValue={
                                //     modalValue.given_date !== ""
                                //         ? moment(modalValue.given_date)
                                //         : ""
                                // }
                                onChange={e =>
                                    setFormDatas({
                                        ...FormDatas,
                                        given_date: e
                                    })
                                }
                            />
                        </Form.Item>
                    )}

                    <Form.Item label="Manufacturer" name="manufacturer">
                        <Input
                            name="manufacturer"
                            placeholder="Manufacturer"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    manufacturer: e.target.value
                                })
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Assigned Merchant"
                        name="assigned_merchant_name"
                    >
                        <Input
                            name="assigned_merchant_name"
                            placeholder="Assigned Merchant"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    assigned_merchant_name: e.target.value
                                })
                            }
                        />
                    </Form.Item>

                    {modalValue && (
                        <Form.Item label="Date Assigned">
                            <DatePicker
                                className="myDatePicker"
                                format={"YYYY-MM-DD"}
                                placeholder="Start Date"
                                // defaultValue={
                                //     modalValue.date_assigned !== ""
                                //         ? moment(modalValue.date_assigned)
                                //         : ""
                                // }
                                onChange={e =>
                                    setFormDatas({
                                        ...FormDatas,
                                        date_assigned: e
                                    })
                                }
                            />
                        </Form.Item>
                    )}

                    <Form.Item label="Notes" name="notes">
                        <TextArea
                            rows={5}
                            name="notes"
                            placeholder="Notes"
                            onChange={e =>
                                setFormDatas({
                                    ...FormDatas,
                                    notes: e.target.value
                                })
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PageUserProfileComponentAsset;
