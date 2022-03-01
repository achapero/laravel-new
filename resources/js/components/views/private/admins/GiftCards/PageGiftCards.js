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
    Checkbox,
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
    DeleteOutlined
} from "@ant-design/icons";
import { widhtAdjustable } from "../../../../providers/widhtAdjustable";
import CustomTableTitle from "../../../../providers/CustomTableTitle";
import ResizableAntdTable from "resizable-antd-table";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGiftCards = ({ history, permission, match }) => {
    const userdata = getUserData();
    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: 20,
        column: localStorage.table_gift_cards_table_sort_column,
        order: localStorage.table_gift_cards_table_sort_order,
        isActive: 1,
        user_id: userdata.role == "Merchant" ? userdata.id : null
    });

    const [showTable, setShowTable] = useState(false);

    const [csvData, setCsvData] = useState([]);
    let ExportFileName = "Gift Cards - " + moment().format("YYYY-MM-DD");
    const {
        data: dataGiftCards,
        refetch: refetchGiftCards,
        isLoading: isLoadingGiftCards,
        isFetching: isFetchingGiftCards
    } = useAxiosQuery(
        "GET",
        "api/v1/gift_card_accounts?" + $.param(dataTableInfo),
        "data_get_giftcards",
        res => {
            setTimeout(() => getCheckPermission(permission), 500);
            if (res.success) {
                // console.log(res);
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
        }
    );
    useEffect(() => {
        localStorage.table_gift_cards_table_sort_column = dataTableInfo.column;
        localStorage.table_gift_cards_table_sort_order = dataTableInfo.order;
        // getListGiftCards();
        refetchGiftCards();
        return () => {};
    }, [dataTableInfo]);

    // const getListGiftCards = () => {
    //     if (userdata.role != "Merchant") {
    //         dataGiftCards(dataTableInfo, {
    //             onSuccess: res => {
    //                 if (res.success) {
    //                     console.log(res);
    //                     setList(res);

    //                     let array_get = [];
    //                     res.data.data.map((value, key) => {
    //                         array_get.push({
    //                             ID: value.id,
    //                             AccountName: value.merchant_name
    //                         });
    //                     });
    //                     setCsvData(array_get);
    //                 }
    //             },
    //             onError: err => {
    //                 console.log(err);
    //             }
    //         });
    //     } else {
    //         let data = { ...dataTableInfo, user_id: userdata.id };
    //         dataGiftCards(data, {
    //             onSuccess: res => {
    //                 if (res.success) {
    //                     console.log(res);
    //                     setList(res);

    //                     let array_get = [];
    //                     res.data.data.map((value, key) => {
    //                         array_get.push({
    //                             ID: value.id,
    //                             AccountName: value.merchant_name
    //                         });
    //                     });
    //                     setCsvData(array_get);
    //                 }
    //             },
    //             onError: err => {
    //                 console.log(err);
    //             }
    //         });
    //     }
    // };

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
        data: localStorage.column_settings_table_gift_cards_table
            ? JSON.parse(localStorage.column_settings_table_gift_cards_table)
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
                  }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.table_gift_cards_table_sort_column) {
            if (localStorage.table_gift_cards_table_sort_column == column) {
                return localStorage.table_gift_cards_table_sort_order + "end";
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
        let col_sizes = localStorage.gc_table_col_sizes
            ? JSON.parse(localStorage.gc_table_col_sizes)
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
        if (!localStorage.gc_table_col_sizes) {
            var a = {
                "Account Name": 146,
                "Account Id": 134
            };

            localStorage.setItem("gc_table_col_sizes", JSON.stringify(a));

            $(`table th:nth-child(1)`).prop("width", 146);
            $(`table th:nth-child(2)`).prop("width", 134);
        }

        return () => {};
    }, []);

    const [form] = Form.useForm();

    const [showModalNew, setShowModalNew] = useState(false);
    const handleCancel = () => {
        setShowModalNew(false);
        // form.resetFields();
    };

    const {
        mutate: mutateAddGiftCard,
        isLoading: isLoadingGiftCard
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_accounts",
        "data_get_giftcards"
    );

    const onFinishForm = values => {
        let data = {
            isActive: values.isActive == true ? 1 : 0,
            merchant_name: values.merchant_name,
            max_card_age_in_months: values.max_card_age_in_months,
            max_activation_value: values.max_activation_value
        };
        console.log("data", data);

        mutateAddGiftCard(data, {
            onSuccess: res => {
                if (res.success) {
                    // getListGiftCards();
                    setShowModalNew(false);
                    form.resetFields();
                    notification.success({
                        message: "Success",
                        description: "Successfully Added"
                    });
                }
            }
        });
    };

    const [showModalDisable, setShowModalDisable] = useState(false);
    const handleCancelDisable = () => {
        setShowModalDisable(false);
        // form.resetFields();
    };

    const {
        mutate: mutateUpdateGiftCard,
        isLoading: isLoadingUPdateGiftCard
    } = useAxiosQuery(
        "UPDATE",
        "api/v1/gift_card_accounts",
        "data_get_giftcards"
    );

    const [disableID, setDisableID] = useState();
    const [disableTest, setDisableText] = useState();
    const handleDisable = id => {
        setShowModalDisable(true);
        setDisableID(id);
    };

    const handleDisableUpdate = () => {
        if (disableTest == "Disable") {
            setShowModalDisable(false);
            console.log("success");
            let data = {
                id: disableID,
                isActive: 0
            };
            mutateUpdateGiftCard(data, {
                onSuccess: res => {
                    if (res.success) {
                        // getListGiftCards();
                        setDisableText("");
                        notification.success({
                            message: "Success",
                            description: "Successfully Disabled"
                        });
                    }
                }
            });
        } else {
            notification.warning({
                message: "Waring",
                description: 'Please type "Disable" to comfirm'
            });
        }
    };

    const handleDisableInputConfirm = value => {
        console.log("handleDisableInputConfirm", value);
        if (value == "Disable") {
            console.log("success");
            $(".submit-disable").removeAttr("disabled");
            // $('.ant-btn-primary').removeAttr("disabled")
        } else {
            notification.warning({
                message: "Waring",
                description: "Please type Disable to comfirm"
            });
        }
    };

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
                            bordered={false}
                            // extra={
                            //     <Button
                            //         type="primary"
                            //         title="Upload"
                            //         icon={<PlusCircleOutlined />}
                            //         onClick={e => {
                            //             form.resetFields();
                            //             setShowModalNew(true);
                            //         }}
                            //     >
                            //         Add Gift Card
                            //     </Button>
                            // }
                        >
                            <Row gutter={24}>
                                <Col md={8} xs={0}>
                                    <h1>Gift Card</h1>
                                </Col>
                                <Col md={16} sm={24}>
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
                                            onChange={e => {
                                                setSearchText(e.target.value);
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            title="Upload"
                                            style={{ marginLeft: "5px" }}
                                            name="view_disabled_gift_card_btn"
                                            // icon={<DeleteOutlined />}
                                            onClick={e => {
                                                // form.resetFields();
                                                // setShowModalNew(true);
                                                // window.location.href = '/gc/disabled-gift-cards'
                                                history.push(
                                                    "/gc/disabled-gift-cards"
                                                );
                                            }}
                                        >
                                            {/* /gc/disabled-gift-cards */}
                                            Disabled Gift Card List
                                        </Button>
                                        <Button
                                            type="primary"
                                            title="Upload"
                                            name="add_btn"
                                            style={{ marginLeft: "5px" }}
                                            icon={<PlusCircleOutlined />}
                                            onClick={e => {
                                                form.resetFields();
                                                setShowModalNew(true);
                                            }}
                                        >
                                            Add Gift Card
                                        </Button>
                                        <Button
                                            icon={<SettingOutlined />}

                                            style={{
                                                marginLeft: "5px",
                                                width: "45px"
                                            }}
                                            onClick={() => OpenSettings()}
                                        ></Button>
                                    </div>
                                </Col>
                            </Row>
                            <Divider />

                            <div className="table-responsive">
                                <ResizableAntdTable
                                    loading={
                                        isLoadingGiftCards ||
                                        isFetchingGiftCards
                                    }
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

                                        // localStorage.table_gift_cards_table_sort_column =
                                        //     sorter.columnKey;
                                        // localStorage.table_gift_cards_table_sort_order = sorter.order
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
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Account Name"
                                    ).show && (
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
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Account Id"
                                    ).show && (
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

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Action"
                                    ).show && (
                                        <Table.Column
                                            ellipsis={true}
                                            title="Action"
                                            key="action"
                                            width={200}
                                            // fixed="right"
                                            render={(text, record) => {
                                                return (
                                                    <Space>
                                                        <Link
                                                            to={`/gc/gift-cards/${record.id}/dashboard`}
                                                        >
                                                            <Button
                                                                type="primary"
                                                                name="view_btn"
                                                            >
                                                                Manage
                                                            </Button>
                                                        </Link>

                                                        {/* <Popconfirm
                                                        title="Click [Confirm] if you want to disable this gift card."
                                                        onConfirm={e => handleDisable(record.id) }
                                                        okText="Confirm"
                                                        cancelText="Cancel"
                                                    >
                                                    </Popconfirm> */}
                                                        {/* <Button
                                                        type="danger"
                                                        onClick={e => handleDisable(record.id)}
                                                    >
                                                        Disable

                                                    </Button> */}
                                                        <Button
                                                            type="danger"
                                                            name="delete_btn"
                                                            onClick={e =>
                                                                handleDisable(
                                                                    record.id
                                                                )
                                                            }
                                                            style={{
                                                                display:
                                                                    userdata.role ==
                                                                    "Merchant"
                                                                        ? "none"
                                                                        : "block"
                                                            }}
                                                        >
                                                            Disable
                                                        </Button>
                                                    </Space>
                                                );
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
                            localStorageKey="column_settings_table_gift_cards_table"
                        />
                    </Col>
                </Row>
            </div>

            <Modal
                visible={showModalNew}
                title="Gift Card Form"
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
                    name="gift-card-new"
                    layout="vertical"
                    initialValues={{
                        max_activation_value: 500,
                        max_card_age_in_months: 12,
                        isActive: true
                    }}
                >
                    <Form.Item name="id" className="hide">
                        <Input name="id" />
                    </Form.Item>

                    <Form.Item
                        label="Account Name"
                        name="merchant_name"
                        rules={[
                            { required: true, message: "This is required!" }
                        ]}
                    >
                        <Input name="merchant_name" />
                    </Form.Item>

                    <Form.Item
                        label="Max Card Age In Months"
                        name="max_card_age_in_months"
                        rules={[
                            { required: true, message: "This is required!" }
                        ]}
                    >
                        <InputNumber
                            name="max_card_age_in_months"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Max Activation Value"
                        name="max_activation_value"
                        rules={[
                            { required: true, message: "This is required!" }
                        ]}
                    >
                        <Input name="max_activation_value" />
                    </Form.Item>
                    <Form.Item
                        label=""
                        name="isActive"
                        valuePropName="checked"
                        // rules={[
                        //     { required: true, message: "This is required!" }
                        // ]}
                    >
                        <Checkbox>isActive</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                visible={showModalDisable}
                title="Gift Card Disable"
                className="modal-disable"
                width={400}
                onCancel={handleCancelDisable}
                cancelText="Cancel"
                onOk={e => handleDisableUpdate()}
                okText="Submit"
            >
                <label>
                    Please type "<b>Disable</b>" to confirm
                </label>
                <Input
                    key="input-disable"
                    className="input-Disable"
                    onChange={e => setDisableText(e.target.value)}
                    value={disableTest}
                ></Input>
            </Modal>
        </div>
    );
};

export default PageGiftCards;
