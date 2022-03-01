import React, { useState, useEffect, useRef } from "react";
import { Card, div, Row, Col, Button, Typography } from "antd";
import moment from "moment";
import ContentHeader from "./PagePaysafeContentHeader";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../providers/getUserData";
import { arrayColumn } from "../../../../../providers/arrayColumn";
import { number_format } from "../../../../../providers/number_format";
import PagePaysafeBatchDetailModal from "./Modals/PagePaysafeBatchDetailModal";
import PagePaysafeDepositDetailModal from "./Modals/PagePaysafeDepositDetailModal";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    DashboardOutlined,
    ContainerOutlined,
    ReadOutlined,
    CreditCardOutlined,
    ReloadOutlined,
    UserOutlined,
    DollarCircleOutlined,
    ExclamationCircleOutlined,
    FolderOpenOutlined,
    PieChartOutlined,
    LineChartOutlined,
    CheckCircleFilled,
    CheckSquareOutlined
} from "@ant-design/icons";
const PagePaysafeDashboard = ({ history, match }) => {
    const { Title } = Typography;
    const userdata = getUserData();
    const [paysafeID, setPaysafeID] = useState(match.params.merchant_number);
    const [lastBatchSummary, setLastBatchSummary] = useState([]);
    const [lastBatchDate, setLastBatchDate] = useState();
    const [lastBatchNumber, setLastBatchNumber] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [selectedBatchNumber, setSelectedBatchNumber] = useState();
    const [showModalBatchDetails, setShowModalBatchDetails] = useState(false);

    const [lastDepositDate, setLastDepositDate] = useState();
    const [depositTotal, setTotalDeposit] = useState();
    const [depositReceived, setDepositReceived] = useState();
    const [showModalDepositDetails, setShowModalDepostDetails] = useState(
        false
    );
    const [merchantNumber, setMerchantNumber] = useState(
        match.params.merchant_number
    );
    let init = 1;

    const {
        data: dataGetBatchDetail,
        isLoading: isLoadingBatchDetail,
        refetch: refetchBatchDetail,
        isFetching: isFetchingBatchDetail
    } = useAxiosQuery(
        "GET",
        "api/v1/paysafe/batch/detail/" + match.params.merchant_number,
        "paysafe_get_batch_detail_" + match.params.merchant_number,
        res => {
            console.log("@lastbatch", res);
            if (res.success) {
                if (res.batch_date) {
                    var bdate = res.batch_date;
                    var _bdate = bdate.split(" ");
                    setLastBatchDate(moment("" + _bdate[0]).format("LL"));
                }
                setLastBatchSummary(res.summary);

                setLastBatchNumber(res.batch_number);
            }
        }
    );

    const {
        data: dataGetDepositDetail,
        isLoading: isLoadingDepositDetail,
        refetch: refetchDepositDetail,
        isFetching: isFetchingDepositDetail
    } = useAxiosQuery(
        "GET",
        "api/v1/paysafe/deposit/detail?id=" + match.params.merchant_number,
        "paysafe_get_deposit_detail_" + match.params.merchant_number,
        res => {
            console.log("@depositlast", res);
            if (res.success) {
                if (res.data.length != 0) {
                    setLastDepositDate(moment(res.lastDate).format("LL"));
                    setTotalDeposit(res.totalAmount);
                    setDepositReceived(res.batchRecieved);
                }
            }
        }
    );

    const trimStr = (str, length) => {
        if (str) {
            if (str.length > length) {
                str = str.substring(0, length);
                str = str + "...";
            }
            return str;
        }
    };

    const getCardTypeTotal = card_type => {
        if (lastBatchSummary) {
            if (lastBatchSummary.length !== 0) {
                if (card_type == "Report Total") {
                    let total = arrayColumn(lastBatchSummary, "total_amount");

                    var sum = total.reduce(function(a, b) {
                        return a + b;
                    }, 0);

                    return "$" + number_format(sum, 2);
                } else {
                    let index = arrayColumn(
                        lastBatchSummary,
                        "card_type"
                    ).indexOf(card_type);
                    if (index !== -1) {
                        return (
                            "$" +
                            number_format(
                                lastBatchSummary[index]["total_amount"],
                                2
                            )
                        );
                    }
                }
            }
        } else {
            return "---";
        }
    };

    const toggleModalBatchDetails = batch_number => {
        setSelectedBatchNumber(batch_number);
        setShowModalBatchDetails(!showModalBatchDetails);
    };

    const toggleModalDepositDetails = () => {
        setShowModalDepostDetails(!showModalDepositDetails);
    };

    const {
        mutate: mutateUsergetMerhcantParamsPaysafe,
        isLoading: isLoadingUsergetMerhcantParamsPaysafe
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/accounts/getMerhcantParamsPaysafe",
        "mutate_getMerhcantParamsPaysafe_rcent"
    );
    const {
        mutate: mutateUserRecent,
        isLoading: isLoadingUserRecent
    } = useAxiosQuery("POST", "api/v1/user/recent", "mutate_paysafe_rcent");

    useEffect(() => {
        mutateUsergetMerhcantParamsPaysafe(
            { id: match.params.merchant_number },
            {
                onSuccess: res => {
                    if (init) {
                        var id = match.params.merchant_number.toString();
                        if (id.length > 4) {
                            id = id.substring(
                                id.length - 4 < 0 ? 0 : id.length - 4,
                                id.length
                            );
                        }
                        if (id.length == 4) {
                            id = `****${id}`;
                        }

                        let data = {
                            title: `<div style='font-weight:bold;'>${res.data[0].merchant_name}</div> (${id})`,
                            type: "Paysafe",
                            url: `${window.location.origin}/reporting/paysafe/accounts/${match.params.merchant_number}`
                        };
                        mutateUserRecent(data, {
                            onSuccess: res => {}
                        });
                        init = 0;
                    }
                }
            }
        );
    }, []);

    return (
        <div
            className=""
            id="paysafeDashboard"
            style={{
                padding: "24px 16px"
            }}
        >
            <ContentHeader
                history={history}
                merchantNumber={match.params.merchant_number}
            />

            <div style={{ position: "relative", width: "100%", top: "20px" }}>
                <Row gutter={8}>
                    <Col xs={24} md={12}>
                        <div className="paymentCard1">
                            <Title level={5} className="cardHeaderPayment">
                                LAST BATCH DATE - {lastBatchDate}
                            </Title>
                            <br></br>
                            <Row>
                                <Col xs={24} md={8}>
                                    <p className="cardrecPayment">
                                        {lastBatchDate ? 1 : 0} batch received
                                    </p>
                                </Col>
                                <Col xs={24} md={16}>
                                    <table
                                        style={{
                                            color: "white",
                                            width: "100%"
                                        }}
                                        className="table-blue"
                                    >
                                        <tbody>
                                            <tr>
                                                <td>American Express</td>
                                                <td>
                                                    {getCardTypeTotal("Amex")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Visa</td>
                                                <td>
                                                    {getCardTypeTotal("Visa")}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Master Card</td>
                                                <td>
                                                    {getCardTypeTotal(
                                                        "MasterCard"
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Other</td>
                                                <td>
                                                    {getCardTypeTotal(
                                                        "Discover Acquirer"
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>{" "}
                                    <hr></hr>
                                    <p>
                                        {" "}
                                        <a
                                            href="#"
                                            onClick={e =>
                                                toggleModalBatchDetails(
                                                    lastBatchNumber
                                                )
                                            }
                                            className="cardButtonStylePayment"
                                        >
                                            <span>
                                                <CheckSquareOutlined />
                                            </span>
                                            <span> View more details </span>
                                        </a>
                                    </p>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={24} md={24}>
                                    <Title
                                        level={4}
                                        style={{
                                            color: "white",
                                            marginTop: "6px"
                                        }}
                                    >
                                        Daily Batch Total :{" "}
                                        {getCardTypeTotal("Report Total")}
                                    </Title>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <div className="paymentCard2">
                            <Title level={5} className="cardHeaderPayment">
                                {/* LAST DEPOSIT DATE - March 20,2020 */}
                                LAST DEPOSIT DATE -{" "}
                                {lastDepositDate && lastDepositDate}
                            </Title>
                            <br></br>
                            <Row>
                                <Col md={14} style={{ color: "white" }}>
                                    <p className="cardrecPayment">
                                        {depositReceived ? depositReceived : 0}{" "}
                                        deposit received
                                    </p>
                                    <Title level={4} style={{ color: "white" }}>
                                        {/* Daily Batch Total: $7,617.89 */}
                                        Daily Deposit Total:{" "}
                                        {depositTotal
                                            ? "$" + depositTotal
                                            : "---"}
                                    </Title>
                                </Col>
                                <Col md={10} style={{ color: "white" }}>
                                    <a
                                        href="#"
                                        className="cardButtonStylePayment"
                                        onClick={e =>
                                            toggleModalDepositDetails()
                                        }
                                    >
                                        <span>
                                            <CheckSquareOutlined />
                                        </span>
                                        <span> View more details </span>
                                    </a>
                                </Col>
                            </Row>
                            <br></br> <hr></hr>
                            <Row>
                                <Col md={12}>
                                    <div
                                        className="cardButtonLinkPayment"
                                        style={{ color: "transparent" }}
                                    >
                                        {" "}
                                        <LineChartOutlined />
                                        MTD Volume History{" "}
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div
                                        className="cardButtonLinkPayment"
                                        style={{ color: "transparent" }}
                                    >
                                        <PieChartOutlined />
                                        MTD Transaction Type{" "}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <PagePaysafeBatchDetailModal
                    showModalBatchDetails={showModalBatchDetails}
                    setShowModalBatchDetails={setShowModalBatchDetails}
                    toggleModalBatchDetails={toggleModalBatchDetails}
                    batch_number={selectedBatchNumber}
                    merchant_number={paysafeID}
                />
                <PagePaysafeDepositDetailModal
                    showModalDepositDetails={showModalDepositDetails}
                    setShowModalDepostDetails={setShowModalDepostDetails}
                    toggleModalDepositDetails={toggleModalDepositDetails}
                    merchant_number={merchantNumber}
                />
            </div>
        </div>
    );
};
export default PagePaysafeDashboard;
