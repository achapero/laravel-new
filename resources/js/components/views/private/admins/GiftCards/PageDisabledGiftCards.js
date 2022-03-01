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
    notification,
    Checkbox ,
    Modal,
    Form,
    InputNumber,
    Space
} from "antd";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../providers/TableColumnSettings";

import { number_format } from "../../../../providers/number_format";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { renderToString } from "react-dom/server";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    PrinterOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import { widhtAdjustable } from "../../../../providers/widhtAdjustable";
import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";
import getCheckPermission from "../../../../providers/getCheckPermission";
const PageDisabledGiftCards = ({ history, permission }) => {
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: 20,
        column: localStorage.table_gift_cards_disable_table_sort_column,
        order: localStorage.table_gift_cards_disable_table_sort_order,
        isAtive: 0,
    });


    localStorage.removeItem('column_settings_table_gift_cards_disable_table')
    localStorage.removeItem('gc_disable_table_col_sizes')

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        localStorage.table_gift_cards_disable_table_sort_column = dataTableInfo.column;
        localStorage.table_gift_cards_disable_table_sort_order = dataTableInfo.order;
        getListGiftCards();

        return () => {};
    }, [dataTableInfo]);

    const {
        mutate: mutateGiftCards,
        isLoading: isLoadingGiftCards
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_accounts/filtered",
        "data_get_giftcards"
    );

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Gift Cards - " + moment().format("YYYY-MM-DD");
    const getListGiftCards = () => {
        if (userdata.role != "Merchant") {
            mutateGiftCards(dataTableInfo, {
                onSuccess: res => {
                    if (res.success) {
                        // console.log(res);
                        setTimeout(() => getCheckPermission(permission), 500);
                        setList(res);

                        let array_get = [];
                        res.data.data.map((value, key) => {
                            array_get.push({
                                ID: value.id,
                                AccountName: value.merchant_name
                            });
                        });
                        setCsvData(array_get);
                    }
                },
                onError: err => {
                    console.log(err);
                }
            });
        } else {
            let data = { ...dataTableInfo, user_id: userdata.id };
            mutateGiftCards(data, {
                onSuccess: res => {
                    if (res.success) {
                        console.log(res);
                        setList(res);

                        let array_get = [];
                        res.data.data.map((value, key) => {
                            array_get.push({
                                ID: value.id,
                                AccountName: value.merchant_name
                            });
                        });
                        setCsvData(array_get);
                    }
                },
                onError: err => {
                    console.log(err);
                }
            });
        }
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
                Gift Cards
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

        const headers = [["ID", "AccountName"]];
        const data = csvData.map(elt => [elt["ID"], elt["AccountName"]]);

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

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_table_gift_cards_disable_table
            ? JSON.parse(localStorage.column_settings_table_gift_cards_disable_table)
            : [
                  {
                      title: "Account Id",
                      show: true
                  },
                  {
                      title: "Account Name",
                      show: true
                  },
                  {
                      title: "Action",
                      show: true
                  },
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.table_gift_cards_disable_table_sort_column) {
            if (localStorage.table_gift_cards_disable_table_sort_column == column) {
                return localStorage.table_gift_cards_disable_table_sort_order + "end";
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
        }, 1000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchText]);

    useEffect(() => {
        let col_sizes = localStorage.gc_disable_table_col_sizes
            ? JSON.parse(localStorage.gc_disable_table_col_sizes)
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
        if (!localStorage.gc_disable_table_col_sizes) {
            var a = {
                "Account Name": 146,
                "Account Id": 134,
                "Action": 134
            };

            localStorage.setItem("gc_disable_table_col_sizes", JSON.stringify(a));

            $(`table th:nth-child(1)`).prop("width", 146);
            $(`table th:nth-child(2)`).prop("width", 134);
            $(`table th:nth-child(3)`).prop("width", 134);
        }

        return () => {};
    }, []);

    const { mutate: mutateUpdateGiftCard, isLoading: isLoadingUPdateGiftCard } = useAxiosQuery(
        "UPDATE",
        "api/v1/gift_card_accounts",
        "data_get_giftcards"
    );

    const handleDisable = (id) => {
        let data = {
            id : id ,
            isActive : 1,
        }
        mutateUpdateGiftCard(data, {
            onSuccess: res => {
                if (res.success) {
                    getListGiftCards();
                    notification.success({
                        message: "Success",
                        description: "Successfully Re-enabled"
                    });
                }
            }
        });
    }

    return (
        <div
            className=""
            id="paysafeGiftCard"
            style={{
                padding: "24px 16px"
            }}
        >
            <div style={{ position: "relative", width: "100%", top: "20px" }}>
                <Row>
                    <Col md={24}>
                        <Card
                            // title="Disabled Gift Cards"
                            bordered={false}
                        >
                            <Row>
                                <Col md={8} xs={0}>
                                    <h1>Disabled Gift Cards</h1>
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
                                        <Button
                                            type="primary"
                                            title="Upload"
                                            style={{ marginLeft: "5px" }}
                                            // icon={<ArrowLeftOutlined />}
                                            onClick={e => {
                                                // form.resetFields();
                                                // setShowModalNew(true);
                                                history.push("/gc/gift-cards");
                                            }}
                                        >
                                            {/* /gc/disabled-gift-cards */}
                                            Gift Card List
                                        </Button>
                                        <Button
                                            icon={<SettingOutlined />}
                                            style={{ marginLeft: "5px", width: '45px' }}
                                            onClick={() => OpenSettings()}
                                        ></Button>
                                    </div>
                                </Col>
                            </Row>
                            <Divider />

                            <div className="table-responsive">
                                <ResizableAntdTable
                                    loading={isLoadingGiftCards}
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
                                            List.length != 0
                                                ? List.data.total
                                                : 1,

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
                                            // order: sorter.order
                                            //     ? sorter.order.replace(
                                            //           "end",
                                            //           ""
                                            //       )
                                            //     : null
                                        });

                                        // localStorage.table_gift_cards_disable_table_sort_column =
                                        //     sorter.columnKey;
                                        // localStorage.table_gift_cards_disable_table_sort_order = sorter.order
                                        //     ? sorter.order.replace("end", "")
                                        //     : null;

                                        let array_get = [];
                                        extra.currentDataSource.map(
                                            (value, key) => {
                                                array_get.push({
                                                    ID: value.id,
                                                    AccountName:
                                                        value.merchant_name
                                                });
                                            }
                                        );
                                        setCsvData(array_get);
                                    }}
                                    scroll={{ x: "fit-content" }}
                                >
                                    {showTableColumnSettings.data.find(  p => p.title == "Account Name" ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="merchant_name"
                                            key="merchant_name"
                                            title={
                                                <CustomTableTitle
                                                    title="Account Name"
                                                    dataIndex="merchant_name"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="gc_disable_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_table_gift_cards_disable_table
                                                            ? JSON.parse(
                                                                  localStorage.column_settings_table_gift_cards_disable_table
                                                              ).length - 1
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(p => p.title == "Account Id").show && (
                                        <Table.Column
                                            ellipsis={true}
                                            dataIndex="id"
                                            key="id"
                                            title={
                                                <CustomTableTitle
                                                    title="Account Id"
                                                    dataIndex="id"
                                                    dataTableInfo={
                                                        dataTableInfo
                                                    }
                                                    setDataTableInfo={
                                                        setDataTableInfo
                                                    }
                                                    localStorageKey="gc_table_col_sizes"
                                                    localStorageTableCols={
                                                        localStorage.column_settings_table_gift_cards_table
                                                            ? JSON.parse(
                                                                    localStorage.column_settings_table_gift_cards_table
                                                                ).length - 1
                                                            : 0
                                                    }
                                                />
                                            }
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(p => p.title == "Action" ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            title="Action"
                                            key="action"
                                            width={200}
                                            // fixed="right"
                                            render={(text, record) => {
                                                return (<Space>
                                                    <Popconfirm
                                                        title="Click [Confirm] if you want to disable this gift card."
                                                        onConfirm={e => handleDisable(record.id) }
                                                        okText="Confirm"
                                                        cancelText="Cancel"

                                                    >
                                                        <Button type="primary" name="edit_btn">
                                                            Re-enable
                                                        </Button>
                                                    </Popconfirm>
                                                </Space>);
                                            }}
                                        />
                                    )}
                                </ResizableAntdTable>
                            </div>
                        </Card>{" "}
                        <TableColumnSettings
                            showTableColumnSettings={showTableColumnSettings}
                            setShowTableColumnSettings={
                                setShowTableColumnSettings
                            }
                            localStorageKey="column_settings_table_gift_cards_disable_table"
                        />
                    </Col>
                </Row>
            </div>

        </div>
    );
};

export default PageDisabledGiftCards;
