import {
    DeleteOutlined,
    EyeOutlined,
    FileExcelOutlined,
    LoadingOutlined,
    PrinterOutlined,
    SettingOutlined,
    UserAddOutlined,
    SearchOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Col,
    Input,
    notification,
    Popconfirm,
    Row,
    Space,
    DatePicker,
    Table
} from "antd";
import { ExportTableButton } from "ant-table-extensions";
import { Content } from "antd/lib/layout/layout";
import moment, { isMoment } from "moment";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import queryString from "query-string";
import Search from "antd/lib/input/Search";
import { CSVLink } from "react-csv";
import TableColumnSettings from "../../../../../providers/TableColumnSettings";
import PageBoardingClearentModalAddNew from "./PageBoardingClearentModalAddNew";
import ButtonGroup from "antd/lib/button/button-group";

// import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ModalApiKey from "../../PageUsers/PageUserProfileComponents/ModalApiKey";
import { widhtAdjustable } from "../../../../../providers/widhtAdjustable";

import CustomTableTitle from "../../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import getCheckPermission from "../../../../../providers/getCheckPermission";

const PageBoardingClearent = ({ history, permission }) => {
    let userdata = getUserData();
    const my_location = useLocation();
    const my_filter = queryString.parse(my_location.search);

    useEffect(() => {
        console.log('permission', permission)

    }, [])

    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: my_filter.app_status ? my_filter.app_status : "",
        page_number: 1,
        page_size: 20,
        column: localStorage.data_table_boarding_sort_column,
        order: localStorage.data_table_boarding_sort_order
    });

    const [csvData, setCsvData] = useState([]);
    let ExportFileName =
        "Boarding Applicants - " + moment().format("YYYY-MM-DD");
    const {
        data: dataBoardingTable,
        isLoading: isLoadingDataBoardingTable,
        refetch: refetchBoardingTable,
        isFetching: isFetchingDataBoardingTable
    } = useAxiosQuery(
        "GET",
        `api/v1/applicationReview${
            userdata.role == "Merchant" ? `/byRole/${userdata.email}` : ""
        }?${$.param(dataTableInfo)}`,
        "boarding_table",
        res => {
            if (res.success) {
                // getCheckPermission(permission)
                setTimeout(() => getCheckPermission(permission), 500);

                let array_get = [];
                let _data =
                    userdata.role == "Merchant" ? res.data : res.data.data;

                if (userdata.role == "Merchant") {
                    console.log("@data", _data);
                    if (_data.length == 0) {
                        notification.warning({
                            message: "Get started by requesting your MID"
                        });
                        history.push(
                            "/tickets/add?subject=Requesting MID please"
                        );
                    }
                    if (_data.length == 1) {
                        history.push(`/boarding/clearent/${res.data[0].id}`);
                    }
                }

                _data.map((value, key) => {
                    let merchant_DbaName = "";
                    if (value.merchantDbaName) {
                        let merchantDbaName = JSON.parse(value.merchantDbaName);
                        merchant_DbaName = merchantDbaName.dbaName;
                    } else {
                        let inputs = value.inputs;
                        inputs = inputs.split(",");
                        let dbaName = inputs.find(
                            p =>
                                p.indexOf("DbaName") !== -1 ||
                                p.indexOf("DbaOfBusiness") !== -1
                        );
                        if (dbaName) {
                            dbaName = dbaName.split(":");
                            dbaName = dbaName[1].replace(/"/g, "");

                            var a = dbaName.split("}");
                            var b = a[1] ? a[1].replace(/"/g, "") : a[0];
                            // console.log(b);
                            merchant_DbaName = b;
                        }
                    }
                    array_get.push({
                        ID: value.id,
                        Email: value.email,
                        "Merchant Number": value.merchantNumber,
                        "Business Name": merchant_DbaName,
                        "App Status": value.application_status
                            ? value.application_status
                            : "New",
                        "Date Submited": value.date_submitted
                            ? moment(value.date_submitted).format("YYYY-MM-DD")
                            : "",
                        "Date Created": value.created_at
                            ? moment(value.created_at).format("YYYY-MM-DD")
                            : ""
                    });
                });
                setCsvData(array_get);
                console.log("res", array_get);
            }
        }
    );

    useEffect(() => {
        // console.log("@dataTableInfo", dataTableInfo);
        localStorage.data_table_boarding_sort_column = dataTableInfo.column;
        localStorage.data_table_boarding_sort_order = dataTableInfo.order;
        refetchBoardingTable();
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

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_boarding_table
            ? JSON.parse(localStorage.column_settings_boarding_table)
            : [
                  { title: "ID", show: true },
                  { title: "Email", show: true },
                  {
                      title: "Merchant Number",

                      show: true
                  },
                  {
                      title: "Business Name",

                      show: true
                  },
                  { title: "App Status", show: true },
                  {
                      title: "Date Submited",

                      show: true
                  },
                  { title: "Date Created", show: true },
                  { title: "Action", show: true }
              ]
    });

    const [showModalAddNew, setShowModalAddNew] = useState(false);

    const {
        mutate: mutateDeleteBoarding,
        isLoading: isLoadingMutateDeleteBoarding
    } = useAxiosQuery("DELETE", "api/v1/formdata", "boarding_table");

    const handleDeleteBoarding = id => {
        mutateDeleteBoarding(
            { id: id },
            {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "Boarding Successfully Deleted"
                        });
                    }
                }
            }
        );
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
                Boarding Applicants
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

        const headers = [
            [
                "ID",
                "Email",
                "Merchant Number",
                "Business Name",
                "App Status",
                "Date Submited",
                "Date Created"
            ]
        ];
        const data = csvData.map(elt => [
            elt["ID"],
            elt["Email"],
            elt["Merchant Number"],
            elt["Business Name"],
            elt["App Status"],
            elt["Date Submited"],
            elt["Date Created"]
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

    const [showModalApiKey, setShowModalApiKey] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState();
    const toggleShowModalApiKey = record => {
        setSelectedMerchant(record);
        setShowModalApiKey(true);
        console.log(record);
    };

    const handleReset = clearFilters => {
        clearFilters();
    };
    let searchInput;
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    useEffect(() => {
        let col_sizes = localStorage.boarding_table_col_sizes
            ? JSON.parse(localStorage.boarding_table_col_sizes)
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
        if (!localStorage.boarding_table_col_sizes) {
            var a = {
                ID: 70,
                Email: 220,
                "Merchant Number": 170,
                "Business Name": 147,
                "App Status": 117,
                "Date Submited": 142,
                "Date Created": 138
            };

            localStorage.setItem("boarding_table_col_sizes", JSON.stringify(a));

            $(`table th:nth-child(1)`).prop("width", 70);
            $(`table th:nth-child(2)`).prop("width", 220);
            $(`table th:nth-child(3)`).prop("width", 170);
            $(`table th:nth-child(4)`).prop("width", 147);
            $(`table th:nth-child(5)`).prop("width", 117);
            $(`table th:nth-child(6)`).prop("width", 142);
            $(`table th:nth-child(7)`).prop("width", 138);
        }

        return () => {};
    }, []);

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            <Card
                title={
                    <>
                        Applicants{" "}
                        {isFetchingDataBoardingTable && <LoadingOutlined />}
                    </>
                }
                extra={
                    <Button
                        type="primary"
                        name="add_btn"
                        onClick={e => setShowModalAddNew(true)}
                        icon={<UserAddOutlined />}

                    >
                        Add Applicant
                    </Button>
                }
            >
                <div className="table-responsive">
                    <ResizableAntdTable
                        scroll={{ x: "fit-content" }}
                        className="table-boarding-clearent"
                        loading={isLoadingDataBoardingTable}
                        rowKey={record => record.id}
                        dataSource={
                            dataBoardingTable
                                ? userdata.role == "Merchant"
                                    ? dataBoardingTable.data
                                    : dataBoardingTable.data.data
                                : []
                        }
                        pagination={{
                            pageSize: dataTableInfo.page_size,
                            current: dataBoardingTable
                                ? dataBoardingTable.data.current_page
                                : 1,
                            showSizeChanger: true,
                            total: dataBoardingTable
                                ? dataBoardingTable.data.total
                                : 1,

                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,

                            pageSizeOptions: [20, 50, 100, 200]
                        }}
                        onChange={(pagination, filters, sorter, extra) => {
                            console.log("pagination", pagination);
                            setDataTableInfo({
                                ...dataTableInfo,
                                page_number: pagination.current,
                                page_size: pagination.pageSize,
                                // role: filters.role,
                                // status: filters.status
                                // column: sorter.columnKey,
                                // order: sorter.order
                                //     ? sorter.order.replace("end", "")
                                //     : null
                            });

                            // localStorage.data_table_boarding_sort_column =
                            //     sorter.columnKey;
                            // localStorage.data_table_boarding_sort_order = sorter.order
                            //     ? sorter.order.replace("end", "")
                            //     : null;

                            let array_get = [];
                            extra.currentDataSource.map((value, key) => {
                                let merchant_DbaName = "";
                                if (value.merchantDbaName) {
                                    let merchantDbaName = JSON.parse(
                                        value.merchantDbaName
                                    );
                                    merchant_DbaName = merchantDbaName.dbaName;
                                } else {
                                    let inputs = value.inputs;
                                    inputs = inputs.split(",");
                                    let dbaName = inputs.find(
                                        p =>
                                            p.indexOf("DbaName") !== -1 ||
                                            p.indexOf("DbaOfBusiness") !== -1
                                    );
                                    if (dbaName) {
                                        dbaName = dbaName.split(":");
                                        dbaName = dbaName[1].replace(/"/g, "");

                                        var a = dbaName.split("}");
                                        var b = a[1]
                                            ? a[1].replace(/"/g, "")
                                            : a[0];
                                        // console.log(b);
                                        merchant_DbaName = b;
                                    }
                                }
                                array_get.push({
                                    ID: value.id,
                                    Email: value.email,
                                    "Merchant Number": value.merchantNumber,
                                    "Business Name": merchant_DbaName,
                                    "App Status": value.application_status
                                        ? value.application_status
                                        : "New",
                                    "Date Submited": value.date_submitted
                                        ? moment(value.date_submitted).format(
                                              "YYYY-MM-DD"
                                          )
                                        : "",
                                    "Date Created": value.created_at
                                        ? moment(value.created_at).format(
                                              "YYYY-MM-DD"
                                          )
                                        : ""
                                });
                            });
                            setCsvData(array_get);
                        }}
                        title={() => (
                            <Row>
                                <Col xs={12} md={8} className="p-0"></Col>
                                <Col xs={0} md={8}></Col>
                                <Col xs={12} md={8} className="text-right">
                                    <div style={{ display: "flex" }}>
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
                                            <Button
                                                icon={<FileExcelOutlined />}
                                            ></Button>
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
                        )}
                    >
                        {showTableColumnSettings.data.find(p => p.title == "ID")
                            .show && (
                            <Table.Column
                                style={{ width: "1000px" }}
                                ellipsis={true}
                                key="id"
                                dataIndex="id"
                                title={
                                    <CustomTableTitle
                                        title="ID"
                                        dataIndex="id"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="boarding_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_boarding_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_boarding_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                ellipses={true}
                                render={(text, record) => {
                                    return (
                                        <Link
                                            to={`/boarding/clearent/${record.id}`}
                                            className="view_btn"
                                        >
                                            {record.id}
                                        </Link>
                                    );
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Email"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                key="email"
                                dataIndex="email"
                                title={
                                    <CustomTableTitle
                                        title="Email"
                                        dataIndex="email"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="boarding_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_boarding_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_boarding_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                ellipses={true}
                                render={(text, record) => {
                                    return (
                                        <Link
                                            to={`/boarding/clearent/${record.id}`}
                                            className="view_btn"
                                        >
                                            {record.email}
                                        </Link>
                                    );
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Merchant Number"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                title={
                                    <CustomTableTitle
                                        title="Merchant Number"
                                        dataIndex="merchantNumber"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="boarding_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_boarding_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_boarding_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                key="merchantNumber"
                                dataIndex="merchantNumber"
                                ellipsis={true}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Business Name"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                title={
                                    <CustomTableTitle
                                        title="Business Name"
                                        dataIndex="merchantDbaName"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="boarding_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_boarding_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_boarding_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                key="merchantDbaName"
                                dataIndex="merchantDbaName"
                                render={(text, record) => {
                                    if (record.merchantDbaName) {
                                        let merchantDbaName = JSON.parse(
                                            record.merchantDbaName
                                        );
                                        merchantDbaName =
                                            merchantDbaName.dbaName;
                                        return merchantDbaName;
                                    } else {
                                        let inputs = record.inputs;
                                        inputs = inputs.split(",");
                                        let dbaName = inputs.find(
                                            p =>
                                                p.indexOf("DbaName") !== -1 ||
                                                p.indexOf("DbaOfBusiness") !==
                                                    -1
                                        );
                                        if (dbaName) {
                                            dbaName = dbaName.split(":");
                                            dbaName = dbaName[1].replace(
                                                /"/g,
                                                ""
                                            );

                                            var a = dbaName.split("}");
                                            var b = a[1]
                                                ? a[1].replace(/"/g, "")
                                                : a[0];
                                            // console.log(b);
                                            return b;
                                        }
                                    }
                                }}
                                ellipsis={true}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "App Status"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                key="status"
                                dataIndex="status"
                                title={
                                    <CustomTableTitle
                                        title="App Status"
                                        dataIndex="status"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="boarding_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_boarding_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_boarding_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                                // dataIndex="application_status"
                                render={(text, record) => {
                                    if (userdata.role != "Merchant") {
                                        return record.application_status ? (
                                            record.application_status ==
                                                "Boarded" ||
                                            record.application_status ==
                                                "Shipped" ? (
                                                <a
                                                    href="#"
                                                    onClick={e =>
                                                        toggleShowModalApiKey(
                                                            record
                                                        )
                                                    }
                                                >
                                                    {record.application_status}
                                                </a>
                                            ) : (
                                                record.application_status
                                            )
                                        ) : (
                                            "New"
                                        );
                                    } else {
                                        return record.application_status
                                            ? record.application_status
                                            : "New";
                                    }
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Date Submited"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                title={
                                    <CustomTableTitle
                                        title="Date Submited"
                                        dataIndex="date_submitted"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="boarding_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_boarding_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_boarding_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                key="date_submitted"
                                dataIndex="date_submitted"
                                ellipsis={true}

                                // render={(text, record) => {
                                //     return record.date_submitted ? moment(record.date_submitted).format("YYYY-MM-DD HH:MM A") : ''
                                // }}
                            />
                        )}

                        {showTableColumnSettings.data.find(
                            p => p.title == "Date Created"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                key="created_at_srt"
                                dataIndex="created_at_srt"
                                title={
                                    <CustomTableTitle
                                        title="Date Created"
                                        dataIndex="created_at_srt"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="boarding_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_boarding_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_boarding_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                ellipsis={true}
                                render={(text, record) => {
                                    return (
                                        <Link
                                            to={`/boarding/clearent/${record.id}`}
                                            className="view_btn"
                                        >
                                            {/* {moment(record.created_at_srt).format(
                                                "MM/DD/YY HH:mm A"
                                            )} */}
                                            {record.created_at_srt}
                                        </Link>
                                    );
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Action"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                title="Action"
                                key="action"
                                render={(text, record) => {
                                    return (
                                        <ButtonGroup>
                                            <Link
                                                to={`/boarding/clearent/${record.id}`}
                                            >
                                                <Button
                                                    type="primary"
                                                    name="view_btn"
                                                    icon={<EyeOutlined />}
                                                ></Button>
                                            </Link>
                                            {userdata.role != "Merchant" && (
                                                <Popconfirm
                                                    okText="Yes"
                                                    cancelText="No"
                                                    title="Are you sure you want to permanently remove this Submitted Form?"
                                                    onConfirm={e =>
                                                        handleDeleteBoarding(
                                                            record.id
                                                        )
                                                    }
                                                >
                                                    <Button
                                                        name="delete_btn"
                                                        type="primary"
                                                        danger
                                                        icon={
                                                            <DeleteOutlined />
                                                        }
                                                    ></Button>
                                                </Popconfirm>
                                            )}
                                        </ButtonGroup>
                                    );
                                }}
                                ellipses={true}
                            />
                        )}
                    </ResizableAntdTable>
                </div>
            </Card>
            <TableColumnSettings
                showTableColumnSettings={showTableColumnSettings}
                setShowTableColumnSettings={setShowTableColumnSettings}
                localStorageKey="column_settings_boarding_table"
            />
            <PageBoardingClearentModalAddNew
                showModalAddNew={showModalAddNew}
                setShowModalAddNew={setShowModalAddNew}
            />

            {showModalApiKey && (
                <ModalApiKey
                    showModalApiKey={showModalApiKey}
                    setShowModalApiKey={setShowModalApiKey}
                    toggleShowModalApiKey={toggleShowModalApiKey}
                    selectedMerchant={selectedMerchant}
                />
            )}
        </Content>
    );
};

export default PageBoardingClearent;
