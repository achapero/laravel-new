import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
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
    Modal,
    Spin,
    Typography
} from "antd";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import { number_format } from "../../../../providers/number_format";
import { CSVLink } from "react-csv";
import PageGIftCardContentHeaderV2 from "./PageGIftCardContentHeaderV2";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    LoadingOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    PrinterOutlined
} from "@ant-design/icons";
import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGiftCardTerminalManagement = ({ history, match, permission }) => {
    useEffect(() => {
        setTimeout(() => getCheckPermission(permission), 500);
    }, []);

    const [dashboardData, setDashboardData] = useState({
        cards: {},
        terminals: {},
        account: {}
    });

    const {
        data: dataGiftCardInfo,
        isLoading: isLoadingGiftCardInfo
    } = useAxiosQuery(
        "GET",
        "api/v1/gift_card_accounts/dashboard/" + match.params.id,
        "data_giftcards_info",
        res => {
            if (res.success) {
                setDashboardData(res.data);
            }
        }
    );

    useEffect(() => {
        // getListGiftCardsInfo();
        return () => {};
    }, []);

    const [List, setList] = useState([]);
    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "100",
        column: localStorage.table_gift_cards_terminal_management_table_sort_column
            ? localStorage.table_gift_cards_terminal_management_table_sort_column
            : "id",
        order: localStorage.table_gift_cards_terminal_management_table_sort_order
            ? localStorage.table_gift_cards_terminal_management_table_sort_order
            : "asc"
    });

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        getListGiftCardsTerminals();
        return () => {};
    }, [dataTableInfo]);

    const {
        mutate: mutateGiftCardsTerminalsMerchant,
        isLoading: isLoadingGiftCardsTerminalsMerchant
    } = useAxiosQuery(
        "POST",
        "api/v1/giftCardsMerchantTerminal",
        "mutate_get_giftcards_terminal_merchant"
    );

    const {
        mutate: mutateGiftCardsTerminals,
        isLoading: isLoadingGiftCardsTerminals
    } = useAxiosQuery(
        "POST",
        "api/v1/giftCardsMerchantTerminal",
        "mutate_get_giftcards_terminal"
    );

    const getListGiftCardsTerminals = () => {
        // if (userdata.role = "Merchant") {
        mutateGiftCardsTerminals(
            { ...dataTableInfo, id: match.params.id },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("terminal", res);
                        setList(res);
                    }
                }
            }
        );
        // } else {
        //     mutateGiftCardsTerminalsMerchant(
        //         {},
        //         {
        //             onSuccess: res => {
        //                 if (res.success) {
        //                     mutateGiftCardsTerminals(
        //                         { id: match.params.id },
        //                         {
        //                             onSuccess: res => {
        //                                 if (res.success) {
        //                                     console.log("terminal", res);
        //                                     setList(res);
        //                                 }
        //                             }
        //                         }
        //                     );
        //                 }
        //             }
        //         }
        //     );
        // }
    };

    const [csvData, setCsvData] = useState([]);
    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_table_gift_cards_terminal_management_table
            ? JSON.parse(
                  localStorage.column_settings_table_gift_cards_terminal_management_table
              )
            : [
                  {
                      title: "Hardware ID",
                      show: true
                  },

                  {
                      title: "License Key",
                      show: true
                  },
                  {
                      title: "Description",
                      show: true
                  },
                  {
                      title: "Type",
                      show: true
                  },
                  {
                      title: "Location Address Date",
                      show: true
                  }
              ]
    });

    const checkIfDefault = column => {
        if (
            localStorage.table_gift_cards_terminal_management_table_sort_column
        ) {
            if (
                localStorage.table_gift_cards_terminal_management_table_sort_column ==
                column
            ) {
                return (
                    localStorage.table_gift_cards_terminal_management_table_sort_order +
                    "end"
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
        mutate: mutateGCrestriction,
        isLoading: isLoadingGCrestrictrion
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_accounts/gc_restriction",
        "mutate_gc_restriction"
    );

    const gcrestriction = () => {
        mutateGCrestriction(
            { id: match.params.id, user_id: userdata.id },
            {
                onSuccess: res => {
                    console.log("@restrict", res);
                    if (!res.success) {
                        history.push("/gc/gift-cards");
                    }
                }
            }
        );
    };

    useEffect(() => {
        if (userdata.role == "Merchant") {
            gcrestriction();
        }

        return () => {};
    }, []);

    let componentRef = useRef();
    const hello = "Say Hello to learning Props/State in React!";

    return (
        <div
            id="giftcardmanagement"
            style={{ display: "flex", padding: "24px 16px" }}
        >
            {" "}
            {/* <ContentHeader history={history} giftId={match.params.id} /> */}
            <PageGIftCardContentHeaderV2
                giftId={match.params.id}
                history={history}
            />
            <div
                style={{ position: "relative", width: "100%" }}
                className="view_terminal_management"
            >
                <Row>
                    <Col md={24}>
                        <Card
                            title={
                                <>
                                    {dashboardData.account.merchant_name && (
                                        <>
                                            {dashboardData.account.id} :{" "}
                                            {
                                                dashboardData.account
                                                    .merchant_name
                                            }
                                        </>
                                    )}
                                </>
                            }
                            bordered={false}
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
                                        <ReactToPrint
                                            trigger={() => (
                                                <Button
                                                    icon={<PrinterOutlined />}
                                                    style={{
                                                        marginLeft: "5px"
                                                    }}
                                                />
                                            )}
                                            content={() => componentRef}
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
                                <Table
                                    loading={
                                        isLoadingGiftCardsTerminals ||
                                        isLoadingGiftCardsTerminalsMerchant
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

                                        localStorage.table_gift_cards_terminal_management_table_sort_column =
                                            sorter.columnKey;
                                        localStorage.table_gift_cards_terminal_management_table_sort_order = sorter.order
                                            ? sorter.order.replace("end", "")
                                            : null;

                                        setCsvData(extra.currentDataSource);
                                    }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Hardware ID"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="hardware_id"
                                            key="hardware_id"
                                            title="Hardware ID"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "hardware_id"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "License Key"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="license_key"
                                            key="license_key"
                                            title="License Key"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "license_key"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Description"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="description"
                                            key="description"
                                            title="Description"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "description"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Type"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="type"
                                            key="type"
                                            title="Type"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "type"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Location Address Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="location_address_id"
                                            key="location_address_id"
                                            title="Location Address Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "Location Address Date"
                                            )}
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
                            localStorageKey="column_settings_table_gift_cards_terminal_management_table"
                        />
                    </Col>
                </Row>
            </div>
            <div style={{ display: "none" }}>
                <ComponentToPrint
                    ref={el => (componentRef = el)}
                    hello={hello}
                    dataGiftCardCardMgmt={List}
                    dashboardData={dashboardData}
                />
            </div>
        </div>
    );
};

export default PageGiftCardTerminalManagement;

class ComponentToPrint extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>TERMINAL MANAGEMENT REPORT</h2>
                    <h3 style={{ marginTop: "-10px" }}>
                        Account Name :{" "}
                        {this.props.dashboardData.account.merchant_name && (
                            <span style={{ textTransform: "uppercase" }}>
                                {/* {this.props.dashboardData.account.id} :{" "} */}
                                {this.props.dashboardData.account.merchant_name}
                            </span>
                        )}
                    </h3>
                    <h5 style={{ marginTop: "-10px" }}>Date Printed : </h5>
                    <h5 style={{ marginTop: "-10px" }}>
                        {moment().format("MM/DD/YYYY, h:mm:ss A")}
                    </h5>
                </div>
                <br />
                <Table
                    rowKey={record => record.id}
                    // dataSource={ this.props.dataGiftCardCardMgmt ? this.props.dataGiftCardCardMgmt.data.data : []  }
                    dataSource={
                        this.props.dataGiftCardCardMgmt.length != 0
                            ? this.props.dataGiftCardCardMgmt.data.data
                            : []
                    }
                    pagination={false}
                >
                    <Table.Column
                        title="Hardware ID"
                        dataIndex="hardware_id"
                        key="hardware_id"
                    />
                    <Table.Column
                        title="License Key"
                        dataIndex="license_key"
                        key="license_key"
                    />
                    <Table.Column
                        title="Description"
                        dataIndex="description"
                        key="description"
                    />
                    <Table.Column
                        title="Type"
                        dataIndex="type"
                        key="activation_date"
                    />
                    <Table.Column
                        title="Location Address Date"
                        dataIndex="location_address_id"
                        key="location_address_id"
                    />
                </Table>
            </Card>
        );
    }
}
