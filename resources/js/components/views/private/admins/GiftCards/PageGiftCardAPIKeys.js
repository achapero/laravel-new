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
    DatePicker,
    Modal
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
    PrinterOutlined
} from "@ant-design/icons";

const PageGiftCardAPIKeys = ({ history, match }) => {
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "100",
        column: localStorage.table_gift_card_keys_table_sort_column == null
            ? localStorage.table_gift_card_keys_table_sort_column
            : "id",
        order: localStorage.table_gift_card_keys_table_sort_order == null
            ? localStorage.table_gift_card_keys_table_sort_order
            : "asc"
    });

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);


    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Gift Card Keys - " + moment().format("YYYY-MM-DD");

    const {
        data: getGCAPIKeys,
        isLoading: isLoadingGetGCAPIKeys,
        refetch: refetchGetGetGCAPIKeys,
        isFetching: isFetchingGetGCAPIKeys
    } = useAxiosQuery(
        "GET",
        `api/v1/filtered/keys?${$.param(dataTableInfo)}`,
        "gift_card_keys_list",
        res => {
            if (res.success) {
                // console.log(res);
                setList(res);

                let array_get = [];
                res.data.data.map((value, key) => {
                    array_get.push({
                        ID: value.id,
                        Title: value.title,
                        APIkey: value.api_key
                    });
                });
                setCsvData(array_get);
            }
        }
    );
    
    useEffect(() => {
        refetchGetGetGCAPIKeys();

        return () => {};
    }, [dataTableInfo]);

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
                API KEYS
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

        const headers = [["ID", "Title", "APIkey"]];
        const data = csvData.map(elt => [
            elt["ID"],
            elt["Title"],
            elt["APIkey"]
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

    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_table_gift_card_keys_table
            ? JSON.parse(
                  localStorage.column_settings_table_gift_card_keys_table
              )
            : [
                  {
                      title: "Title",
                      show: true
                  },
                  {
                      title: "API Key",
                      show: true
                  },
                  {
                      title: "Action",
                      show: true
                  }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.table_gift_card_keys_table_sort_column) {
            if (localStorage.table_gift_card_keys_table_sort_column == column) {
                return (
                    localStorage.table_gift_card_keys_table_sort_order + "end"
                );
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

    const {
        mutate: mutatedeleteRecord,
        isLoading: isLoadingdeleteRecord
    } = useAxiosQuery(
        "DELETE",
        "api/v1/giftcard/keys",
        "mutate_deleteRecord_forms"
    );

    function deleteRecord(id) {
        mutatedeleteRecord(
            { id: id },
            {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "API Key Successfully Deleted"
                        });
                        refetchGetGetGCAPIKeys();
                    }
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    }

    const [showModalGenerateKey, setShowModalGenerateKey] = useState(false);
    const [generateTitleKey, setGenerateTitleKey] = useState("");
    const handleGenerateNewKey = () => {
        setShowModalGenerateKey(!showModalGenerateKey);
    };

    const {
        mutate: mutateSubmitGenerateNewKey,
        isLoading: isLoadingSubmitGenerateNewKey
    } = useAxiosQuery("POST", "api/v1/giftcard/keys", "mutate_generated_key");

    const handleSubmitGenerateNewKey = () => {
        let data = {
            title: generateTitleKey
        };

        mutateSubmitGenerateNewKey(data, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "New Generate Key Successfully Created"
                    });
                    refetchGetGetGCAPIKeys();
                    setShowModalGenerateKey(false);
                }
            }
        });
    };

    return (
        <div
            className=""
            id="paysafeGiftCardKeys"
            style={{
                padding: "24px 16px"
            }}
        >
            <div style={{ position: "relative", width: "100%", top: "20px" }}>
                <Row>
                    <Col md={24}>
                        <Card
                            title="Gift Card API Keys"
                            bordered={false}
                            extra={
                                <Button
                                    type="primary"
                                    onClick={e => handleGenerateNewKey()}
                                >
                                    Generate New Key
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
                                            placeholder="Search Title"
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
                                            onClick={() => OpenSettings()}
                                        ></Button>
                                    </div>
                                </Col>
                            </Row>
                            <Divider />

                            <div className="table-responsive">
                                <Table
                                    loading={isLoadingGetGCAPIKeys}
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

                                        pageSizeOptions: [100, 200]
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
                                            page_size: pagination.pageSize,
                                            column: sorter.columnKey,
                                            order: sorter.order
                                                ? sorter.order.replace(
                                                      "end",
                                                      ""
                                                  )
                                                : null
                                        });

                                        localStorage.table_gift_card_keys_table_sort_column =
                                            sorter.columnKey;
                                        localStorage.table_gift_card_keys_table_sort_order = sorter.order
                                            ? sorter.order.replace("end", "")
                                            : null;

                                        let array_get = [];
                                        extra.currentDataSource.map(
                                            (value, key) => {
                                                array_get.push({
                                                    ID: value.id,
                                                    Title: value.title,
                                                    APIkey: value.api_key
                                                });
                                            }
                                        );
                                        setCsvData(array_get);
                                    }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Title"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="title"
                                            key="title"
                                            title="Title"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "title"
                                            )}
                                            render={(text, record) => {
                                                return record.title
                                                    ? record.title
                                                    : "";
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "API Key"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="api_key"
                                            key="api_key"
                                            title="API Key"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "api_key"
                                            )}
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Action"
                                    ).show && (
                                        <Table.Column
                                            title="Action"
                                            key="action"
                                            // fixed="right"
                                            render={(text, record) => {
                                                return (
                                                    <div>
                                                        <Popconfirm
                                                            title="Are you sure you want to delete this API Key?"
                                                            okText="Yes"
                                                            cancelText="No"
                                                            onConfirm={e =>
                                                                deleteRecord(
                                                                    record.id
                                                                )
                                                            }
                                                        >
                                                            <Button
                                                                loading={
                                                                    isLoadingdeleteRecord
                                                                }
                                                                type="primary"
                                                                danger
                                                                title="Delete"
                                                                icon={
                                                                    <DeleteFilled />
                                                                }
                                                            ></Button>
                                                        </Popconfirm>
                                                    </div>
                                                );
                                            }}
                                        />
                                    )}
                                </Table>
                            </div>
                        </Card>{" "}
                        <TableColumnSettings
                            showTableColumnSettings={showTableColumnSettings}
                            setShowTableColumnSettings={
                                setShowTableColumnSettings
                            }
                            localStorageKey="column_settings_table_gift_card_keys_table"
                        />
                    </Col>
                </Row>
            </div>

            <Modal
                visible={showModalGenerateKey}
                onCancel={() => {
                    setShowModalGenerateKey(false);
                }}
                width={500}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowModalGenerateKey(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="back"
                        onClick={() => {
                            handleSubmitGenerateNewKey();
                        }}
                        loading={isLoadingSubmitGenerateNewKey}
                    >
                        Submit
                    </Button>
                ]}
                title="Generate New Key"
            >
                <Row>
                    <Col md={24}>
                        <Input
                            type="text"
                            placeholder="title"
                            onChange={e => {
                                setGenerateTitleKey(e.target.value);
                            }}
                        />
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default PageGiftCardAPIKeys;
