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
    Tabs,
    Upload,
    Checkbox,
    Select
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
    DollarCircleOutlined,
    ExportOutlined
} from "@ant-design/icons";
import { arrayColumn } from "../../../../providers/arrayColumn";
import FileSaver from "file-saver";
import exportFromJSON from "export-from-json";
import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGiftCardDataManagement = ({ history, match, permission }) => {
    useEffect(() => {
        setTimeout(() => getCheckPermission(permission), 500);
    }, []);

    const { RangePicker } = DatePicker;
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

    const { TabPane } = Tabs;
    const account_id = match.params.id;

    const [cardRange, setCardRange] = useState({
        min: null,
        max: null
    });

    const [cardRangeDelete, setCardRangeDelete] = useState({
        min: null,
        max: null
    });

    const handleGenerateCard = () => {
        console.log(cardRange);
        if (cardRange.min != null && cardRange.max != null) {
            let data = {
                account_id: account_id,
                ...cardRange,
                action: "generateCards"
            };
            mutateGenerateCard(data, {
                onSuccess: res => {
                    console.log(res);
                    if (res.success) {
                        notification.success({
                            message: "Cards Successfully Generated"
                        });
                    } else {
                        let existing_cards = arrayColumn(
                            res.existing_cards,
                            "card_number"
                        );

                        console.log("existing_cards", existing_cards);

                        notification.error({
                            message: `Cards ${existing_cards.join(
                                ","
                            )} Already Existed`
                        });
                    }
                }
            });
        } else {
            notification.error({
                message: "Please input Card Range From and Range To"
            });
        }
    };

    const {
        mutate: mutateGenerateCard,
        isLoading: isLoadingMutateGenerateCard
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_account_cards",
        `gift_card_account_cards_table_${account_id}`
    );

    const {
        mutate: mutateDeleteCard,
        isLoading: isLoadingMutateDeleteCard
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_account_cards_delete",
        `gift_card_account_cards_table_${account_id}`
    );

    const handleDeleteCard = () => {
        if (cardRangeDelete.min == null && cardRangeDelete.max == null) {
            notification.error({
                message: "Please input Card Range From and Range To"
            });
        }

        if (cardRangeDelete.min != null && cardRangeDelete.max != null) {
            let data = {
                account_id: account_id,
                ...cardRangeDelete,
                action: "deleteCards"
            };
            console.log(data);
            mutateDeleteCard(data, {
                onSuccess: res => {
                    console.log(res);
                    if (res.success) {
                        notification.success({
                            message: "Cards Successfully Deleted"
                        });
                    }
                }
            });
        }
    };

    const handleDeleteCardDrange = () => {
        if (drange.length == 0) {
            notification.error({
                message: "Please select Date Range"
            });
        }

        if (drange.length != 0) {
            let data = {
                account_id: account_id,
                action: "deleteCardsDrange",
                drange: [...drange]
            };
            console.log(data);
            mutateDeleteCard(data, {
                onSuccess: res => {
                    console.log(res);
                    if (res.success) {
                        notification.success({
                            message: "Cards Successfully Deleted"
                        });
                    }
                }
            });
        }
    };

    const [exportAs, setExportAs] = useState(null);
    const [includeTransactions, setIncludeTransactions] = useState(false);

    const {
        data: dataGiftCardCardMgmt,
        isLoading: isLoadingGetGiftCardCardMgmt,
        refetch: refetchGiftCardCardMgmt,
        isFetching: isFetchingGetGiftCardCardMgmt
    } = useAxiosQuery(
        "GET",
        `api/v1/gift_card_account_cards?id=${match.params.id}`,
        `gift_card_account_cards_${match.params.id}`,
        res => {
            // console.log("gift_card_account_cards_", res);
        }
    );

    const handleExportData = () => {
        if (exportAs) {
            let data = [...dataGiftCardCardMgmt.data];
            // console.log("includeTransactions", includeTransactions);
            if (!includeTransactions) {
                data.map((d, key) => {
                    delete d.merchant_gift_card_account_card_transactions;
                });
            }

            let file_name = account_id + "_cards";
            let exportType;
            if (exportAs == "XML") {
                exportType = exportFromJSON.types.xml;
            }
            if (exportAs == "CSV") {
                exportType = exportFromJSON.types.csv;
            }
            if (exportAs == "JSON") {
                exportType = exportFromJSON.types.json;
            }
            if (exportAs == "Excel") {
                exportType = exportFromJSON.types.xls;
            }

            exportFromJSON({
                data: data,
                fileName: file_name,
                exportType: exportType
            });

            refetchGiftCardCardMgmt();
        } else {
            notification.error({ message: "Select Export As" });
        }
    };

    const handleImportCsv = file => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const text = e.target.result;
            console.log(text);
            processCSV(text); // plugged in here
        };

        reader.readAsText(file);
    };

    const {
        mutate: mutateGiftCardImport,
        isLoading: isLoadingMutateGiftCardImport
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_account_cards",
        `gift_card_account_cards_${match.params.id}`
    );

    const processCSV = (str, delim = ",") => {
        const headers = str.slice(0, str.indexOf("\n")).split(delim);
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");

        const newArray = rows.map(row => {
            const values = row.split(delim);
            const eachObject = headers.reduce((obj, header, i) => {
                header = header.replace('"').replace(/\r/g, "");
                let v = values[i].replace(/"/g, "").replace(/\r/g, "");
                if (v == "null") {
                    v = null;
                }
                if (header == "created_at") {
                    v = moment(v).format("YYYY-MM-DD");
                }
                if (header == "updated_at") {
                    v = v ? moment(v).format("YYYY-MM-DD") : v;
                }
                if (header == "expiration_date") {
                    v = v ? moment(v).format("YYYY-MM-DD") : v;
                }
                obj[header] = v;
                return obj;
            }, {});
            return eachObject;
        });

        console.log("newArray", newArray);
        let data = { action: "import", data: newArray };
        mutateGiftCardImport(data, {
            onSuccess: res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Card Successfully Imported"
                    });
                } else {
                    let existing_cards = arrayColumn(
                        res.existing_cards,
                        "card_number"
                    );

                    console.log("existing_cards", existing_cards);

                    notification.error({
                        message: `Cards ${existing_cards.join(
                            ","
                        )} Already Existed`
                    });
                }
            },
            onError: res => {
                notification.error({ message: "Card Import Failed" });
            }
        });
    };

    const userdata = getUserData();

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

    const [drange, setDrange] = useState([]);
    const datePickerRange = (value, dateString) => {
        setDrange(dateString);
    };

    return (
        <div
            id="giftcardmanagement"
            style={{ display: "flex", padding: "24px 16px" }}
        >
            <PageGIftCardContentHeaderV2
                giftId={match.params.id}
                history={history}
            />
            <div
                style={{ position: "relative", width: "100%" }}
                className="view_data_management"
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
                            <Tabs defaultActiveKey="1">
                                <TabPane tab="Generate Card" key="1">
                                    <Card title={<b>Card Generation</b>}>
                                        <Row>
                                            <Col md={18}>
                                                <b>
                                                    Provide a Generation Range
                                                </b>
                                                <br />
                                                <div
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Range From"
                                                        type="number"
                                                        style={{
                                                            width: "150px"
                                                        }}
                                                        value={cardRange.min}
                                                        onChange={e =>
                                                            setCardRange({
                                                                ...cardRange,
                                                                min:
                                                                    e.target
                                                                        .value
                                                            })
                                                        }
                                                    />
                                                    <Input
                                                        placeholder="Range To"
                                                        type="number"
                                                        style={{
                                                            marginLeft: "10px",
                                                            width: "150px"
                                                        }}
                                                        value={cardRange.max}
                                                        onChange={e =>
                                                            setCardRange({
                                                                ...cardRange,
                                                                max:
                                                                    e.target
                                                                        .value
                                                            })
                                                        }
                                                    />
                                                    <Checkbox
                                                        onChange={e => {
                                                            console.log(e);
                                                        }}
                                                        style={{
                                                            marginLeft: "10px"
                                                        }}
                                                    >
                                                        Reserve for eCards
                                                    </Checkbox>
                                                </div>
                                            </Col>
                                            <Col
                                                md={6}
                                                style={{ textAlign: "end" }}
                                            >
                                                <br />
                                                <Button
                                                    type="primary"
                                                    style={{
                                                        marginLeft: "10px",
                                                        marginTop: "10px"
                                                    }}
                                                    icon={<ReloadOutlined />}
                                                    onClick={e =>
                                                        handleGenerateCard()
                                                    }
                                                    loading={
                                                        isLoadingMutateGenerateCard
                                                    }
                                                >
                                                    Generate
                                                </Button>
                                            </Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                            <Col md={18}>
                                                <b>Provide a Deletion Range</b>
                                                <br />
                                                <div
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Range From"
                                                        type="number"
                                                        style={{
                                                            width: "150px"
                                                        }}
                                                        value={
                                                            cardRangeDelete.min
                                                        }
                                                        onChange={e =>
                                                            setCardRangeDelete({
                                                                ...cardRangeDelete,
                                                                min:
                                                                    e.target
                                                                        .value
                                                            })
                                                        }
                                                    />
                                                    <Input
                                                        placeholder="Range To"
                                                        type="number"
                                                        style={{
                                                            marginLeft: "10px",
                                                            width: "150px"
                                                        }}
                                                        value={
                                                            cardRangeDelete.max
                                                        }
                                                        onChange={e =>
                                                            setCardRangeDelete({
                                                                ...cardRangeDelete,
                                                                max:
                                                                    e.target
                                                                        .value
                                                            })
                                                        }
                                                    />

                                                    {/* <RangePicker
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            marginLeft: "10px"
                                                        }}
                                                        onChange={(
                                                            value,
                                                            dateString
                                                        ) => {
                                                            datePickerRange(
                                                                value,
                                                                dateString
                                                            );
                                                        }}
                                                    /> */}
                                                </div>
                                            </Col>
                                            <Col
                                                md={6}
                                                style={{ textAlign: "end" }}
                                            >
                                                <br />

                                                <Popconfirm
                                                    title="Are you sure ?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={e =>
                                                        handleDeleteCard()
                                                    }
                                                >
                                                    <Button
                                                        // loading={isLoadingDeleteUser}
                                                        type="primary"
                                                        danger
                                                        title="Delete"
                                                        icon={<DeleteFilled />}
                                                        style={{
                                                            marginLeft: "10px",
                                                            marginTop: "10px"
                                                        }}
                                                        loading={
                                                            isLoadingMutateDeleteCard
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </Popconfirm>
                                            </Col>
                                            <Col md={18}>
                                                <br />
                                                <div
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    <RangePicker
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            marginLeft: "10px"
                                                        }}
                                                        onChange={(
                                                            value,
                                                            dateString
                                                        ) => {
                                                            datePickerRange(
                                                                value,
                                                                dateString
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                            <Col
                                                md={6}
                                                style={{ textAlign: "end" }}
                                            >
                                                <br />

                                                <Popconfirm
                                                    title="Are you sure ?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={e =>
                                                        handleDeleteCardDrange()
                                                    }
                                                >
                                                    <Button
                                                        // loading={isLoadingDeleteUser}
                                                        type="primary"
                                                        danger
                                                        title="Delete"
                                                        icon={<DeleteFilled />}
                                                        style={{
                                                            marginLeft: "10px",
                                                            marginTop: "10px"
                                                        }}
                                                        loading={
                                                            isLoadingMutateDeleteCard
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </Popconfirm>
                                            </Col>
                                        </Row>
                                    </Card>
                                </TabPane>
                                <TabPane tab="Data Import" key="2">
                                    <Card title={<b>Data Import</b>}>
                                        <Upload
                                            accept=".csv"
                                            beforeUpload={() => false}
                                            // multiple={true}
                                            onChange={file => {
                                                handleImportCsv(file.file);
                                            }}
                                            showUploadList={false}
                                        >
                                            <Button
                                                icon={<UploadOutlined />}
                                                type="primary"
                                                loading={
                                                    isLoadingMutateGiftCardImport
                                                }
                                            >
                                                Select a CSV File to import
                                            </Button>
                                        </Upload>
                                    </Card>
                                </TabPane>
                                <TabPane tab="Data Export" key="3">
                                    <Card
                                        title={<b> Data Export</b>}
                                        loading={
                                            isLoadingGetGiftCardCardMgmt ||
                                            isFetchingGetGiftCardCardMgmt
                                        }
                                    >
                                        <Row>
                                            <Col md={24}>
                                                <b>Export As</b>
                                                <Select
                                                    placeholder="Choose..."
                                                    style={{
                                                        marginLeft: "10px"
                                                    }}
                                                    onChange={e =>
                                                        setExportAs(e)
                                                    }
                                                    value={exportAs}
                                                >
                                                    <Select.Option value="XML">
                                                        XML
                                                    </Select.Option>
                                                    <Select.Option value="CSV">
                                                        CSV
                                                    </Select.Option>
                                                    <Select.Option value="JSON">
                                                        JSON
                                                    </Select.Option>
                                                    <Select.Option value="Excel">
                                                        Excel
                                                    </Select.Option>
                                                </Select>
                                                <br></br>
                                                <div
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                >
                                                    Select the format you wish
                                                    to export the data as.
                                                </div>
                                                <br></br>
                                                <div>
                                                    <Checkbox
                                                        onChange={e => {
                                                            setIncludeTransactions(
                                                                e.target.checked
                                                            );
                                                        }}
                                                        checked={
                                                            includeTransactions
                                                        }
                                                        style={{
                                                            marginLeft: "10px"
                                                        }}
                                                    >
                                                        Include Transactions
                                                    </Checkbox>
                                                </div>
                                                <br></br>
                                                <div>
                                                    <Button
                                                        icon={
                                                            <ExportOutlined />
                                                        }
                                                        type="primary"
                                                        onClick={e =>
                                                            handleExportData()
                                                        }
                                                    >
                                                        Export
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </TabPane>
                            </Tabs>
                        </Card>{" "}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PageGiftCardDataManagement;
