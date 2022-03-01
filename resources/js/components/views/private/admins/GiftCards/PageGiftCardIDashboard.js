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
    Typography
} from "antd";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import toCurrency from "../../../../providers/toCurrency";
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
    DollarCircleOutlined
} from "@ant-design/icons";
import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGiftCardIDashboard = ({ history, match, permission }) => {
    useEffect(() => {
        setTimeout(() => getCheckPermission(permission), 500);
    }, []);

    const userdata = getUserData();
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
                console.log("mutate_get_giftcards_info_merchant", res);
                addRecent(res.data);
                setDashboardData(res.data);
            }
        }
    );

    useEffect(() => {
        if (userdata.role == "Merchant") {
            gcrestriction();
        }

        return () => {};
    }, []);

    let init = 1;

    const {
        mutate: mutateUserRecent,
        isLoading: isLoadingUserRecent
    } = useAxiosQuery("POST", "api/v1/user/recent", "mutate_gift_card_info_");

    const addRecent = res => {
        if (init) {
            var id = res.account.id.toString();
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
                title: `<div style='font-weight:bold;'>${res.account.merchant_name} </div> (${id})`,
                type: "Gift",
                url: `${window.location.origin}/gift-cards/${res.account.id}`
            };
            mutateUserRecent(data, {
                onSuccess: res => {}
            });

            init = 0;
        }
    };

    const loadingSpin = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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

    return (
        <>
            <div
                id="giftcardinfopage"
                style={{ display: "flex", padding: "24px 16px" }}
            >
                <PageGIftCardContentHeaderV2
                    giftId={match.params.id}
                    history={history}
                />
                <div
                    style={{ position: "relative", width: "100%" }}
                    className="view_dashboard"
                >
                    <Row>
                        <Col md={24}>
                            <Card
                                title={
                                    <>
                                        {dashboardData.account
                                            .merchant_name && (
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
                            >
                                <div>
                                    <Row gutter={16}>
                                        <Col md={12}>
                                            <Row>
                                                <Col md={24}>
                                                    <div
                                                        style={{
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <Typography.Title
                                                            level={3}
                                                        >
                                                            {" "}
                                                            Cards{" "}
                                                        </Typography.Title>
                                                    </div>

                                                    <div className="gift-rectangle">
                                                        <div className="gift-rectangle-value color-blue">
                                                            <Typography.Title
                                                                level={4}
                                                            >
                                                                {isLoadingGiftCardInfo ? (
                                                                    <>
                                                                        <Spin
                                                                            indicator={
                                                                                loadingSpin
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    parseInt(
                                                                        dashboardData
                                                                            .cards
                                                                            .countActive
                                                                    ).toFixed(0)
                                                                )}
                                                            </Typography.Title>
                                                        </div>
                                                        <div className="gift-rectangle-info">
                                                            ACTIVE
                                                        </div>
                                                        <div className="gift-rectangle-icon-right">
                                                            <CreditCardOutlined />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={24}>
                                                    <div className="gift-rectangle">
                                                        <div className="gift-rectangle-value color-brown">
                                                            <Typography.Title
                                                                level={4}
                                                            >
                                                                {isLoadingGiftCardInfo ? (
                                                                    <>
                                                                        <Spin
                                                                            indicator={
                                                                                loadingSpin
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    `0`
                                                                )}
                                                            </Typography.Title>
                                                        </div>
                                                        <div className="gift-rectangle-info">
                                                            RESERVED
                                                        </div>
                                                        <div className="gift-rectangle-icon-right">
                                                            <CheckCircleOutlined />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={24}>
                                                    <div className="gift-rectangle">
                                                        <div className="gift-rectangle-value color-brown">
                                                            <Typography.Title
                                                                level={4}
                                                            >
                                                                {isLoadingGiftCardInfo ? (
                                                                    <>
                                                                        <Spin
                                                                            indicator={
                                                                                loadingSpin
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    parseInt(
                                                                        dashboardData
                                                                            .cards
                                                                            .countAll
                                                                    ).toFixed(0)
                                                                )}
                                                            </Typography.Title>
                                                        </div>
                                                        <div className="gift-rectangle-info">
                                                            TOTAL (active +
                                                            inactive)
                                                        </div>
                                                        <div className="gift-rectangle-icon-right">
                                                            <DollarCircleOutlined />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={24}>
                                                    <div className="gift-rectangle">
                                                        <div className="gift-rectangle-value color-blue">
                                                            <Typography.Title
                                                                level={4}
                                                            >
                                                                $
                                                                {isLoadingGiftCardInfo ? (
                                                                    <>
                                                                        <Spin
                                                                            indicator={
                                                                                loadingSpin
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    toCurrency(
                                                                        parseFloat(
                                                                            dashboardData
                                                                                .cards
                                                                                .totalBalance
                                                                        ).toFixed(
                                                                            2
                                                                        )
                                                                    )
                                                                )}
                                                            </Typography.Title>
                                                        </div>
                                                        <div className="gift-rectangle-info">
                                                            TOTAL CREDIT AMOUNT
                                                        </div>
                                                        <div className="gift-rectangle-icon-right">
                                                            <DollarCircleOutlined />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={12}>
                                            <Row>
                                                <Col md={24}>
                                                    <div
                                                        style={{
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <Typography.Title
                                                            level={3}
                                                        >
                                                            {" "}
                                                            Terminals{" "}
                                                        </Typography.Title>
                                                    </div>

                                                    <div className="gift-rectangle">
                                                        <div className="gift-rectangle-value color-blue">
                                                            <Typography.Title
                                                                level={4}
                                                            >
                                                                {isLoadingGiftCardInfo ? (
                                                                    <>
                                                                        <Spin
                                                                            indicator={
                                                                                loadingSpin
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    dashboardData
                                                                        .terminals
                                                                        .countActive
                                                                )}
                                                            </Typography.Title>
                                                        </div>
                                                        <div className="gift-rectangle-info">
                                                            # OF TERMINALS
                                                        </div>
                                                        <div className="gift-rectangle-icon-right">
                                                            <CheckCircleOutlined />
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default PageGiftCardIDashboard;
