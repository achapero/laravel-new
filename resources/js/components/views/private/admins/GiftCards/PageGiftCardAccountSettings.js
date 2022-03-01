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

const PageGiftCardAccountSettings = ({ history, match, permission }) => {
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
                className="view_account_setting"
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
                                <Col className="gutter-row" span={12}>
                                    <h1>Check Balance URL</h1>
                                    {dashboardData.account.merchant_name && (
                                        <Input
                                            readOnly
                                            defaultValue={
                                                window.location.host +
                                                "/checkbalance/" +
                                                dashboardData.account.id
                                            }
                                        ></Input>
                                    )}
                                </Col>
                            </Row>
                        </Card>{" "}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PageGiftCardAccountSettings;
