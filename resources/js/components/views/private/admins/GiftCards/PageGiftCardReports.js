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
import ReactToPrint from "react-to-print";
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
    DollarCircleOutlined
} from "@ant-design/icons";
import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGiftCardReports = ({ history, match, permission }) => {
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
        column: localStorage.table_gift_cards_reports_table_sort_column
            ? localStorage.table_gift_cards_reports_table_sort_column
            : "id",
        order: localStorage.table_gift_cards_reports_table_sort_order
            ? localStorage.table_gift_cards_reports_table_sort_order
            : "asc"
    });

    const userdata = getUserData();

    useEffect(() => {
        if (userdata.role == "Merchant") {
            gcrestriction();
        }

        return () => {};
    }, []);

    let componentRefEGCR = useRef();
    let componentRefGCB = useRef();
    let componentRefL = useRef();
    let componentRefNAGC = useRef();
    let componentRefTDFC = useRef();
    let componentRefTDBL = useRef();

    // const {
    //     mutate: mutateGiftCardsTerminals,
    //     isLoading: isLoadingGiftCardsTerminals
    // } = useAxiosQuery(
    //     "POST",
    //     "api/v1/giftCardsMerchantTerminal",
    //     "mutate_get_giftcards_terminal"
    // );

    // const getListGiftCardsTerminals = () => {
    //     // if (userdata.role = "Merchant") {
    //     mutateGiftCardsTerminals(
    //         { ...dataTableInfo, id: match.params.id },
    //         {
    //             onSuccess: res => {
    //                 if (res.success) {
    //                     console.log("terminal", res);
    //                     setList(res);
    //                 }
    //             }
    //         }
    //     );
    // };

    const [EGCR, getEGCR] = useState();
    const [GCB, getGCB] = useState();
    const [GCL, getGCL] = useState();
    const [GCNA, getGCNA] = useState();
    const [GCT, getGCT] = useState();
    const [GCTL, getGCTL] = useState();

    const { mutate: mutaEGCR, isLoading: isLoadingEGCR } = useAxiosQuery(
        "POST",
        `api/v1/expire_gift_card`,
        "expire_gift_card"
    );

    const getDataEGCR = () => {
        mutaEGCR(
            {
                account_id: match.params.id
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("getEGCR", res);
                        getEGCR(res);
                    }
                }
            }
        );
    };

    const { mutate: mutaGCB, isLoading: isLoadingGCB } = useAxiosQuery(
        "POST",
        `api/v1/gift_card_balances`,
        "gift_card_balances"
    );

    const getDataGCB = () => {
        mutaGCB(
            {
                account_id: match.params.id
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("getDataGCB", res);
                        getGCB(res);

                        getDataGCL();
                    }
                }
            }
        );
    };

    const { mutate: mutaGCL, isLoading: isLoadingGCL } = useAxiosQuery(
        "POST",
        `api/v1/gift_card_location`,
        "gift_card_location"
    );

    const getDataGCL = () => {
        mutaGCL(
            {
                account_id: match.params.id
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("getDataGCL", res);
                        getGCL(res);
                        getDataGCNA();
                    }
                }
            }
        );
    };

    const { mutate: mutaGCNA, isLoading: isLoadingGCNA } = useAxiosQuery(
        "POST",
        `api/v1/gift_card_non_active`,
        "gift_card_non_active"
    );

    const getDataGCNA = () => {
        mutaGCNA(
            {
                account_id: match.params.id
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("getDataGCNA", res);
                        getGCNA(res);
                        getDataGCT();
                    }
                }
            }
        );
    };

    const { mutate: mutaGCT, isLoading: isLoadingGCT } = useAxiosQuery(
        "POST",
        `api/v1/gift_card_transaction`,
        "gift_card_transaction"
    );

    const getDataGCT = () => {
        mutaGCT(
            {
                account_id: match.params.id
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("getDataGCT", res);
                        getGCT(res);
                        getDataGCTL();
                    }
                }
            }
        );
    };

    const { mutate: mutaGCTL, isLoading: isLoadingGCTL } = useAxiosQuery(
        "POST",
        `api/v1/gift_card_transaction_location`,
        "gift_card_transaction_location"
    );

    const getDataGCTL = () => {
        mutaGCTL(
            {
                account_id: match.params.id
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("getDataGCTL", res);
                        getGCTL(res);
                    }
                }
            }
        );
    };

    useEffect(() => {
        // getListGiftCardsTerminals();
        // getDataEGCR();
        getDataGCB();
        return () => {};
    }, []);

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
                className="view_report"
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
                            <Row gutter={24}>
                                <Col className="gutter-row" span={6}>
                                    <Card
                                    // title="Reports"
                                    >
                                        <ReactToPrint
                                            trigger={() => (
                                                <Button
                                                    type="link"
                                                    block
                                                    style={{
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    Expired Gift Cards
                                                </Button>
                                            )}
                                            content={() => componentRefEGCR}
                                        />
                                        <ReactToPrint
                                            trigger={() => (
                                                <Button
                                                    type="link"
                                                    block
                                                    style={{
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    Gift Cards Balances
                                                </Button>
                                            )}
                                            content={() => componentRefGCB}
                                        />
                                        <ReactToPrint
                                            trigger={() => (
                                                <Button
                                                    type="link"
                                                    block
                                                    style={{
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    Locations
                                                </Button>
                                            )}
                                            content={() => componentRefL}
                                        />
                                        <ReactToPrint
                                            trigger={() => (
                                                <Button
                                                    type="link"
                                                    block
                                                    style={{
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    Non-Activated Gift Cards
                                                </Button>
                                            )}
                                            content={() => componentRefNAGC}
                                        />
                                        <ReactToPrint
                                            trigger={() => (
                                                <Button
                                                    type="link"
                                                    block
                                                    style={{
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    Transaction Details - For
                                                    Card
                                                </Button>
                                            )}
                                            content={() => componentRefTDFC}
                                        />
                                        <ReactToPrint
                                            trigger={() => (
                                                <Button
                                                    type="link"
                                                    block
                                                    style={{
                                                        textAlign: "left"
                                                    }}
                                                >
                                                    Transaction Details - By
                                                    Location
                                                </Button>
                                            )}
                                            content={() => componentRefTDBL}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>{" "}
                    </Col>
                </Row>
            </div>
            <div style={{ display: "none" }}>
                <ComponentToPrintEGCR
                    ref={el => (componentRefEGCR = el)}
                    dashboardData={dashboardData}
                    dataTable={EGCR}
                />
            </div>
            <div style={{ display: "none" }}>
                <ComponentToPrintGCB
                    ref={el => (componentRefGCB = el)}
                    dashboardData={dashboardData}
                    dataTable={GCB}
                />
            </div>
            <div style={{ display: "none" }}>
                <ComponentToPrintL
                    ref={el => (componentRefL = el)}
                    dashboardData={dashboardData}
                    dataTable={GCL}
                />
            </div>
            <div style={{ display: "none" }}>
                <ComponentToPrintNAGC
                    ref={el => (componentRefNAGC = el)}
                    dashboardData={dashboardData}
                    dataTable={GCNA}
                />
            </div>
            <div style={{ display: "none" }}>
                <ComponentToPrintTDFC
                    ref={el => (componentRefTDFC = el)}
                    dashboardData={dashboardData}
                    dataTable={GCT}
                />
            </div>
            <div style={{ display: "none" }}>
                <ComponentToPrintTDBL
                    ref={el => (componentRefTDBL = el)}
                    dashboardData={dashboardData}
                    dataTable={GCTL}
                />
            </div>
        </div>
    );
};

export default PageGiftCardReports;

class ComponentToPrintEGCR extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ textTransform: "uppercase" }}>
                        Expired Gift Cards REPORT
                    </h2>
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
                        this.props.dataTable ? this.props.dataTable.data : []
                    }
                    pagination={false}
                    size={"small"}
                >
                    <Table.Column
                        title="Card Number"
                        dataIndex="card_number"
                        key="card_number"
                    />
                    <Table.Column
                        title="Expiration Date"
                        dataIndex="expiration_date"
                        key="expiration_date"
                    />
                </Table>
            </Card>
        );
    }
}

class ComponentToPrintGCB extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ textTransform: "uppercase" }}>
                        Gift Cards Balances REPORT
                    </h2>
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
                        this.props.dataTable ? this.props.dataTable.data : []
                    }
                    size={"small"}
                    pagination={false}
                >
                    <Table.Column
                        title="Card Number"
                        dataIndex="card_number"
                        key="card_number"
                    />
                    <Table.Column
                        title="Balance"
                        dataIndex="balance"
                        key="balance"
                        render={(text, record) => {
                            return record.balance.toFixed(2);
                        }}
                    />
                </Table>
            </Card>
        );
    }
}

class ComponentToPrintL extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ textTransform: "uppercase" }}>
                        Locations REPORT
                    </h2>
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
                        this.props.dataTable ? this.props.dataTable.data : []
                    }
                    pagination={false}
                    size={"small"}
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
                        title="Location Address ID"
                        dataIndex="location_address_id"
                        key="location_address_id"
                    />
                </Table>
            </Card>
        );
    }
}

class ComponentToPrintNAGC extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ textTransform: "uppercase" }}>
                        Non-Activated Gift Cards REPORT
                    </h2>
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
                        this.props.dataTable ? this.props.dataTable.data : []
                    }
                    pagination={false}
                    size={"small"}
                >
                    <Table.Column
                        title="Card Number"
                        dataIndex="card_number"
                        key="card_number"
                    />
                    <Table.Column
                        title="Activation Date"
                        dataIndex="activation_date"
                        key="activation_date"
                    />
                    <Table.Column
                        title="Expiration Date"
                        dataIndex="expiration_date"
                        key="expiration_date"
                    />
                </Table>
            </Card>
        );
    }
}

class ComponentToPrintTDFC extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ textTransform: "uppercase" }}>
                        Transaction Details - For Card REPORT
                    </h2>
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
                        this.props.dataTable ? this.props.dataTable.data : []
                    }
                    size={"small"}
                    pagination={false}
                >
                    <Table.Column
                        title="Card Number"
                        dataIndex="card_number"
                        key="card_number"
                    />
                    <Table.Column
                        title="Refrence Code"
                        dataIndex="reference_code"
                        key="reference_code"
                    />
                    <Table.Column
                        title="Transaction Type"
                        dataIndex="transaction_type"
                        key="transaction_type"
                    />
                    <Table.Column
                        title="Cashier"
                        dataIndex="cashier"
                        key="cashier"
                    />
                    <Table.Column
                        title="Amount"
                        dataIndex="amount"
                        key="amount"
                        render={(text, record) => {
                            return record.amount
                                ? record.amount.toFixed(2)
                                : (0.0).toFixed(2);
                        }}
                    />
                </Table>
            </Card>
        );
    }
}

class ComponentToPrintTDBL extends React.Component {
    render() {
        return (
            <Card style={{ border: "none" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ textTransform: "uppercase" }}>
                        Transaction Details - By Location REPORT
                    </h2>
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
                        this.props.dataTable ? this.props.dataTable.data : []
                    }
                    pagination={false}
                    size={"small"}
                >
                    <Table.Column
                        title="Card Number"
                        dataIndex="card_number"
                        key="card_number"
                    />
                    <Table.Column
                        title="Refrence Code"
                        dataIndex="reference_code"
                        key="reference_code"
                    />
                    <Table.Column
                        title="Transaction Type"
                        dataIndex="transaction_type"
                        key="transaction_type"
                    />
                    <Table.Column
                        title="Cashier"
                        dataIndex="cashier"
                        key="cashier"
                    />
                    <Table.Column
                        title="Amount"
                        dataIndex="amount"
                        key="amount"
                        render={(text, record) => {
                            return record.amount
                                ? record.amount.toFixed(2)
                                : (0.0).toFixed(2);
                        }}
                    />
                    <Table.Column
                        title="Location Address ID"
                        dataIndex="location_address_id"
                        key="location_address_id"
                        render={(text, record) => {
                            return record.merchant_gift_card_account_terminals
                                ? record.merchant_gift_card_account_terminals
                                      .location_address_id
                                : "";
                        }}
                    />
                </Table>
            </Card>
        );
    }
}
