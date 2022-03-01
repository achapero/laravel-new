import React, { useState, useEffect, useRef } from "react";
import { Card, div, Row, Col, Button } from "antd";
import ContentHeader from "./PageClearentContentHeader";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../providers/getUserData";
const PageClearentDashboard = ({ history, match }) => {
    const userdata = getUserData();
    const [showLoading, setShowLoading] = useState(false);
    let init = 1;

    const trimStr = (str, length) => {
        if (str) {
            if (str.length > length) {
                str = str.substring(0, length);
                str = str + "...";
            }
            return str;
        }
    };

    const {
        mutate: mutateGetMerchantParams,
        isLoading: isLoadingGetMerchantParams
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/accounts/getMerhcantParams",
        "mutate_clearent_dashboard_get_merchant_params"
    );

    const {
        mutate: mutateUserRecent,
        isLoading: isLoadingUserRecent
    } = useAxiosQuery(
        "POST",
        "api/v1/user/recent",
        "mutate_clearent_dashboard_user_recent"
    );

    useEffect(() => {
        mutateGetMerchantParams(
            {
                id: match.params.merchant_number
            },
            {
                onSuccess: res => {
                    if (init) {
                        if (res.data.length != 0) {
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

                            console.log(res);

                            let data = {
                                title: ` <div style='font-weight:bold;'>${res.data[0].merchantDBA}</div> (${id})`,
                                type: "Clearent",
                                url: `${window.location.origin}/reporting/clearent/accounts/${match.params.merchant_number}`
                            };
                            mutateUserRecent(data, {
                                onSuccess: res => {}
                            });

                            init = 0;
                        }
                    }
                }
            }
        );
    }, []);

    return (
        <div
            className=""
            id="clearentDashboard"
            style={{
                padding: "24px 16px"
            }}
        >
            <ContentHeader
                history={history}
                
                merchantNumber={match.params.merchant_number}
            />

            <div style={{ position: "relative", width: "100%", top: "20px" }}>
                <Row className="justify-content-center">
                    <Col md={24}>
                        <Card>
                            <div>
                                {userdata.role == "Super Admin" && (
                                    <Button
                                        type="primary"
                                        style={{ float: "left" }}
                                    >
                                        Deactivate Account
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default PageClearentDashboard;
