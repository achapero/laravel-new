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
    Typography,
    Menu,
    Dropdown
} from "antd";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import { number_format } from "../../../../providers/number_format";
import { CSVLink } from "react-csv";
import PageGIftCardContentHeaderV2 from "./PageGIftCardContentHeaderV2";
import PageGiftCardManagementModal from "./Modals/PageGiftCardManagementModal";
import PageGiftCardManagementModalAddValue from "./Modals/PageGiftCardManagementModalAddValue";
import PageGiftCardManagementModalRedeemValue from "./Modals/PageGiftCardManagementModalRedeemValue";
import PageGiftCardManagementModalTransfer from "./Modals/PageGiftCardManagementModalTransfer";
import PageGiftCardManagementModalDeactiivate from "./Modals/PageGiftCardManagementModalDeactiivate";
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

const PageGiftCardManagement = ({ history, match, permission }) => {
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

    const userdata = getUserData();
    const [showTable, setShowTable] = useState(false);

    const [dataTableInfo, setDataTableInfo] = useState({
        filter_value: "",
        page_number: 1,
        page_size: "100",
        column: localStorage.table_gift_cards_card_management_table_sort_column
            ? localStorage.table_gift_cards_card_management_table_sort_column
            : "id",
        order: localStorage.table_gift_cards_card_management_table_sort_order
            ? localStorage.table_gift_cards_card_management_table_sort_order
            : "asc"
    });

    const {
        data: dataGiftCardCardMgmt,
        isLoading: isLoadingGetGiftCardCardMgmt,
        refetch: refetchGiftCardCardMgmt,
        isFetching: isFetchingGetGiftCardCardMgmt
    } = useAxiosQuery(
        "GET",
        `api/v1/gift_card_account_cards?id=${
            match.params.id
        }&${new URLSearchParams(dataTableInfo).toString()}`,
        `gift_card_account_cards_table_${match.params.id}`,
        res => {
            console.log("gift_card_account_cards_", res);
        }
    );

    useEffect(() => {
        if (dataGiftCardCardMgmt) {
            refetchGiftCardCardMgmt();
        }
        return () => {};
    }, [dataTableInfo]);

    const [csvData, setCsvData] = useState([]);
    const [showTableColumnSettings, setShowTableColumnSettings] = useState({
        show: false,
        data: localStorage.column_settings_table_gift_cards_card_management_table
            ? JSON.parse(
                  localStorage.column_settings_table_gift_cards_card_management_table
              )
            : [
                  {
                      title: "Card Number",
                      show: true
                  },

                  {
                      title: "Balance",
                      show: true
                  },
                  {
                      title: "Is Promotional",
                      show: true
                  },
                  {
                      title: "Activation Date",
                      show: true
                  },
                  {
                      title: "Expiration Date",
                      show: true
                  },
                  {
                      title: "Action",
                      show: true
                  }
              ]
    });

    const checkIfDefault = column => {
        if (localStorage.table_gift_cards_card_management_table_sort_column) {
            if (
                localStorage.table_gift_cards_card_management_table_sort_column ==
                column
            ) {
                return (
                    localStorage.table_gift_cards_card_management_table_sort_order +
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

    const [showTransactionsModal, setShowTransactionsModal] = useState(false);
    const [transactionList, setTransactionList] = useState([]);
    const toggleTransactionsModal = () => {
        setShowTransactionsModal(!showTransactionsModal);
    };

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
    const [showAddValue, setShowAddValue] = useState(false);
    const [redeemShowValue, setReddemShowValue] = useState(false);

    const [transferShowValue, setTransferShowValue] = useState(false);
    const [deactivateCardShowValue, setDeactivateCardShowValue] = useState(
        false
    );

    const [cardId, setCardId] = useState(0);
    const [cardnumber, setCardNumber] = useState(0);
    const addValueToggle = () => {
        setShowAddValue(!showAddValue);
    };

    const redeemValueToogle = () => {
        setReddemShowValue(!redeemShowValue);
    };

    const transferToogle = () => {
        setTransferShowValue(!transferShowValue);
    };
    const deactivateCardToogle = () => {
        setDeactivateCardShowValue(!deactivateCardShowValue);
    };

    const menu = record => (
        <Menu>
            <Menu.Item key="1">
                <div
                    onClick={e => {
                        addValueToggle();
                        setCardId(record.id);
                    }}
                >
                    Add Value
                </div>
            </Menu.Item>
            <Menu.Item key="2">
                <div
                    onClick={e => {
                        redeemValueToogle();
                        setCardId(record.id);
                    }}
                >
                    Redeem Value
                </div>
            </Menu.Item>
            <Menu.Item key="3">
                <div
                    onClick={e => {
                        transferToogle();
                        setCardId(record.id);
                    }}
                >
                    Transfer
                </div>
            </Menu.Item>
            <Menu.Item key="4">
                <div
                    onClick={e => {
                        deactivateCardToogle();
                        setCardId(record.id);
                        setCardNumber(record.card_number);
                    }}
                >
                    Deactivate Card
                </div>
            </Menu.Item>
            <Menu.Item key="5">
                <div
                    onClick={e => {
                        toggleTransactionsModal();

                        setTransactionList(
                            record.merchant_gift_card_account_card_transactions_card_id
                        );
                    }}
                >
                    Transactions
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <div
            id="giftcardmanagement"
            style={{ display: "flex", padding: "24px 16px" }}
        >
            {/* <ContentHeader history={history} giftId={match.params.id} /> */}
            <PageGIftCardContentHeaderV2
                giftId={match.params.id}
                history={history}
            />
            <div
                style={{ position: "relative", width: "100%" }}
                className="view_card_management"
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
                                        {/* <Button
                                            icon={<PrinterOutlined />}
                                            style={{ marginLeft: "5px" }}
                                        ></Button> */}
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
                                        isLoadingGetGiftCardCardMgmt ||
                                        isFetchingGetGiftCardCardMgmt
                                    }
                                    rowKey={record => record.id}
                                    dataSource={
                                        dataGiftCardCardMgmt
                                            ? dataGiftCardCardMgmt.data.data
                                            : []
                                    }
                                    pagination={{
                                        pageSize: dataTableInfo.page_size,
                                        current: dataGiftCardCardMgmt
                                            ? dataGiftCardCardMgmt.data
                                                  .current_page
                                            : 1,
                                        showSizeChanger: true,
                                        total: dataGiftCardCardMgmt
                                            ? dataGiftCardCardMgmt.data.total
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

                                        localStorage.table_gift_cards_card_management_table_sort_column =
                                            sorter.columnKey;
                                        localStorage.table_gift_cards_card_management_table_sort_order = sorter.order
                                            ? sorter.order.replace("end", "")
                                            : null;

                                        setCsvData(extra.currentDataSource);
                                    }}
                                >
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Card Number"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="card_number"
                                            key="card_number"
                                            title="Card Number"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "card_number"
                                            )}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Balance"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="balance"
                                            key="balance"
                                            title="Balance"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "balance"
                                            )}
                                            render={(text, record) => {
                                                return `$${parseFloat(
                                                    record.balance
                                                ).toFixed(2)}`;
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Is Promotional"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="is_promotional"
                                            key="is_promotional"
                                            title="Is Promotional"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "is_promotional"
                                            )}
                                            render={(text, record) => {
                                                return record.is_promotional
                                                    ? "Yes"
                                                    : "No";
                                            }}
                                        />
                                    )}

                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Activation Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="activation_date"
                                            key="activation_date"
                                            title="Activation Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "activation_date"
                                            )}
                                            render={(text, record) => {
                                                return record.activation_date
                                                    ? moment(
                                                          record.activation_date
                                                      ).format("DD MMM YYYY")
                                                    : "Not Activated";
                                            }}
                                        />
                                    )}
                                    {showTableColumnSettings.data.find(
                                        p => p.title == "Expiration Date"
                                    ).show && (
                                        <Table.Column
                                            dataIndex="expiration_date"
                                            key="expiration_date"
                                            title="Expiration Date"
                                            sorter={true}
                                            defaultSortOrder={checkIfDefault(
                                                "expiration_date"
                                            )}
                                            render={(text, record) => {
                                                return record.expiration_date
                                                    ? moment(
                                                          record.expiration_date
                                                      ).format("DD MMM YYYY")
                                                    : "-";
                                            }}
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
                                                    <Dropdown
                                                        overlay={() =>
                                                            menu(record)
                                                        }
                                                        trigger={["click"]}
                                                        placement="bottomCenter"
                                                    >
                                                        <Button>Actions</Button>
                                                    </Dropdown>
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
                            localStorageKey="column_settings_table_gift_cards_card_management_table"
                        />
                    </Col>
                </Row>
                <PageGiftCardManagementModal
                    showTransactionsModal={showTransactionsModal}
                    setShowTransactionsModal={setShowTransactionsModal}
                    toggleTransactionsModal={toggleTransactionsModal}
                    transactionList={transactionList}
                />

                <PageGiftCardManagementModalAddValue
                    showAddValue={showAddValue}
                    setShowAddValue={setShowAddValue}
                    cardId={cardId}
                    match={match}
                    userdata={userdata}
                />

                <PageGiftCardManagementModalRedeemValue
                    redeemShowValue={redeemShowValue}
                    setReddemShowValue={setReddemShowValue}
                    cardId={cardId}
                    match={match}
                    userdata={userdata}
                />

                <PageGiftCardManagementModalTransfer
                    transferShowValue={transferShowValue}
                    setTransferShowValue={setTransferShowValue}
                    cardId={cardId}
                    match={match}
                    userdata={userdata}
                    selectdata={
                        dataGiftCardCardMgmt && dataGiftCardCardMgmt.data.data
                    }
                />

                <PageGiftCardManagementModalDeactiivate
                    deactivateCardShowValue={deactivateCardShowValue}
                    setDeactivateCardShowValue={setDeactivateCardShowValue}
                    cardId={cardId}
                    match={match}
                    userdata={userdata}
                    cardnumber={cardnumber}
                />
            </div>

            {/* print print hahaha */}
            <div style={{ display: "none" }}>
                <ComponentToPrint
                    ref={el => (componentRef = el)}
                    hello={hello}
                    dataGiftCardCardMgmt={dataGiftCardCardMgmt}
                    dashboardData={dashboardData}
                />
            </div>
        </div>
    );
};

export default PageGiftCardManagement;

class ComponentToPrint extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>CARD MANAGEMENT REPORT</h2>
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
                    dataSource={
                        this.props.dataGiftCardCardMgmt
                            ? this.props.dataGiftCardCardMgmt.data.data
                            : []
                    }
                    pagination={false}
                >
                    <Table.Column
                        dataIndex="card_number"
                        key="card_number"
                        title="Card Number"
                    />
                    <Table.Column
                        title="Balance"
                        dataIndex="balance"
                        key="balance"
                    />
                    <Table.Column
                        title="Is Promotional"
                        dataIndex="is_promotional"
                        key="is_promotional"
                    />
                    <Table.Column
                        title="Activation Date"
                        dataIndex="activation_date"
                        key="activation_date"
                        render={(text, record) => {
                            return record.activation_date
                                ? moment(record.activation_date).format(
                                      "DD MMM YYYY"
                                  )
                                : "-";
                        }}
                    />
                    <Table.Column
                        title="Expiration Date"
                        dataIndex="expiration_date"
                        key="expiration_date"
                        render={(text, record) => {
                            return record.expiration_date
                                ? moment(record.expiration_date).format(
                                      "DD MMM YYYY"
                                  )
                                : "-";
                        }}
                    />
                </Table>
            </Card>
        );
    }
}
