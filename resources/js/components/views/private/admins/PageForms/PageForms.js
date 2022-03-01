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
    DatePicker
} from "antd";
import {
    DeleteFilled,
    SearchOutlined,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    UserAddOutlined,
    PrinterOutlined
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

import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { widhtAdjustable } from "../../../../providers/widhtAdjustable";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PageForms = ({ history, permission }) => {
    // const shortname = match.params.shortname;
    // let history = useHistory();
    const my_location = useLocation();
    const my_filter = queryString.parse(history.search);

    const handleReset = clearFilters => {
        clearFilters();
    };
    let searchInput;
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: my_filter.app_status ? my_filter.app_status : "",
        page_number: 1,
        page_size: 20,
        online_status: 0,
        column: localStorage.data_table_form_sort_column,
        order: localStorage.data_table_form_sort_order
    });

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Forms - " + moment().format("YYYY-MM-DD");
    const {
        data: dataForm,
        isLoading: isLoadingForm,
        refetch: refetchForm,
        isFetching: isFetchingForm
    } = useAxiosQuery(
        `GET`,
        `api/v1/forms?${$.param(dataTableInfo)}`,
        `show_form`,
        res => {
            if (res.success) {
                // console.log("@datassss", res.data);
                setTimeout(() => getCheckPermission(permission), 500);
                let array_get = [];
                res.data.map((value, key) => {
                    array_get.push({
                        ID: value.id,
                        "Form Name": value.form_name,
                        "Form Link":
                            window.location.origin + "/" + value.form_shortname,
                        "Form Page": value.form_pages,
                        "Date Created": value.created_at
                            ? moment(value.created_at).format("YYYY-MM-DD")
                            : ""
                    });
                });
                setCsvData(array_get);
            }
        }
    );

    useEffect(() => {
        console.log("@dataTableInfo", dataTableInfo);
        localStorage.data_table_form_sort_column = dataTableInfo.column;
        localStorage.data_table_form_sort_order = dataTableInfo.order;
        refetchForm();
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
        data: localStorage.column_settings_form_table
            ? JSON.parse(localStorage.column_settings_form_table)
            : [
                  { title: "Form Name", show: true },
                  { title: "Form Link", show: true },
                  { title: "Form Pages", show: true },
                  { title: "Date Created", show: true },
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
        mutate: mutateDeleteForm,
        isLoading: isLoadingDeleteForm
    } = useAxiosQuery("DELETE", "api/v1/forms", "show_form");

    const deleteRecord = record => {
        mutateDeleteForm(record, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Form Successfully Deleted"
                    });
                    // console.log('delete msg',res)
                }
            }
            // onError: res => {
            // }
        });
    };

    const editRecord = record => {
        history.push(`/forms/list/${record.id}`);
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
                Forms
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
                "Category",
                "Form Name",
                "Form Link",
                "Form Page",
                "Date Created"
            ]
        ];
        const data = csvData.map(elt => [
            elt["ID"],
            elt["Category"],
            elt["Form Name"],
            elt["Form Link"],
            elt["Form Page"],
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

    useEffect(() => {
        let col_sizes = localStorage.form_table_col_sizes
            ? JSON.parse(localStorage.form_table_col_sizes)
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
        if (!localStorage.form_table_col_sizes) {
            var a = {
                "Form Name": 131,
                "Form Link": 124,
                "Form Pages": 127,
                "Date Created": 140
            };

            localStorage.setItem("form_table_col_sizes", JSON.stringify(a));

            $(`table th:nth-child(1)`).prop("width", 131);
            $(`table th:nth-child(2)`).prop("width", 124);
            $(`table th:nth-child(3)`).prop("width", 127);
            $(`table th:nth-child(4)`).prop("width", 140);
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
            <Card title="Forms">
                <Row>
                    <Col md={8} xs={0}></Col>
                    <Col md={8} sm={0}></Col>
                    <Col md={8} sm={24}>
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
                                onChange={e => setSearchText(e.target.value)}
                            />
                            {/* <CSVLink
                                data={csvData}
                                filename={ExportFileName+".csv"}
                            >
                                <Button icon={<FileExcelOutlined />}></Button>
                            </CSVLink>
                            <Button
                                icon={<PrinterOutlined />}
                                onClick={() => exportPDF()}
                            ></Button> */}
                            <Button
                                icon={<SettingOutlined />}
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
                        dataSource={dataForm ? dataForm.data : []}
                        loading={
                            isLoadingForm ||
                            isLoadingDeleteForm ||
                            isFetchingForm
                        }
                        rowKey={record => record.id}
                        pagination={{
                            pageSize: dataTableInfo.page_size,
                            current: dataForm ? dataForm.current_page : 1,
                            showSizeChanger: true,
                            total: dataForm ? dataForm.total : 1,

                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} items`,

                            pageSizeOptions: [20, 50, 100, 200]
                        }}
                        onChange={(pagination, filters, sorter, extra) => {
                            // console.log("pagination", pagination);
                            setDataTableInfo({
                                ...dataTableInfo,
                                page_number: pagination.current,
                                page_size: pagination.pageSize
                                // column: sorter.columnKey,
                                // order: sorter.order
                                //     ? sorter.order.replace("end", "")
                                //     : null
                            });

                            // localStorage.data_table_form_sort_column =
                            //     sorter.columnKey;
                            // localStorage.data_table_form_sort_order = sorter.order
                            //     ? sorter.order.replace("end", "")
                            //     : null;

                            let array_get = [];
                            extra.currentDataSource.map((value, key) => {
                                array_get.push({
                                    ID: value.id,
                                    "Form Name": value.form_name,
                                    "Form Link":
                                        window.location.origin +
                                        "/" +
                                        value.form_shortname,
                                    "Form Page": value.form_pages,
                                    "Date Created": value.created_at
                                        ? moment(value.created_at).format(
                                              "YYYY-MM-DD"
                                          )
                                        : ""
                                });
                            });
                            setCsvData(array_get);
                        }}
                        scroll={{ x: "fit-content" }}
                    >
                        {showTableColumnSettings.data.find(
                            p => p.title == "Form Name"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                title="Form Name"
                                key="form_name"
                                dataIndex="form_name"
                                title={
                                    <CustomTableTitle
                                        title="Form Name"
                                        dataIndex="form_name"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="form_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_form_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_form_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Form Link"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                key="form_shortname"
                                title={
                                    <CustomTableTitle
                                        title="Form Link"
                                        dataIndex="form_shortname"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="form_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_form_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_form_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                // dataIndex="form_shortname"
                                render={(text, record) => {
                                    return (
                                        <a
                                            href={`${window.location.origin}/form/${record.form_shortname}`}
                                            target="_blank"
                                            className="view_btn"
                                        >
                                            {`${window.location.origin}/form/${record.form_shortname}`}
                                        </a>
                                    );
                                }}
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Form Pages"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                title={
                                    <CustomTableTitle
                                        title="Form Pages"
                                        dataIndex="form_pages"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="form_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_form_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_form_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                key="form_pages"
                                showSorterTooltip={false}
                                dataIndex="form_pages"
                            />
                        )}
                        {showTableColumnSettings.data.find(
                            p => p.title == "Date Created"
                        ).show && (
                            <Table.Column
                                ellipsis={true}
                                title={
                                    <CustomTableTitle
                                        title="Date Created"
                                        dataIndex="created_at_srt"
                                        dataTableInfo={dataTableInfo}
                                        setDataTableInfo={setDataTableInfo}
                                        localStorageKey="form_table_col_sizes"
                                        localStorageTableCols={
                                            localStorage.column_settings_form_table
                                                ? JSON.parse(
                                                      localStorage.column_settings_form_table
                                                  ).length - 1
                                                : 0
                                        }
                                    />
                                }
                                key="created_at_srt"
                                showSorterTooltip={false}
                                // dataIndex="created_at"
                                render={(text, record) => {
                                    return record.created_at_srt;
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
                                // fixed="right"
                                render={(text, record) => {
                                    return (
                                        <div>
                                            <ButtonGroup>
                                                <Button
                                                    icon={<EyeOutlined />}
                                                    type="primary"
                                                    name="view_btn"
                                                    onClick={() =>
                                                        editRecord(record)
                                                    }
                                                ></Button>
                                                <Popconfirm
                                                    title="Are you sure you want to delete this Form?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={e =>
                                                        deleteRecord(record)
                                                    }
                                                >
                                                    <Button
                                                        type="primary"
                                                        icon={<DeleteFilled />}
                                                        name="delete_btn"
                                                        style={{
                                                            background:
                                                                "rgb(248, 107, 107)",
                                                            borderColor:
                                                                " rgb(248, 107, 107)"
                                                        }}
                                                    ></Button>
                                                </Popconfirm>
                                            </ButtonGroup>
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
                localStorageKey="column_settings_form_table"
            />
        </Content>
    );
};

export default PageForms;
