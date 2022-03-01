import React, { useEffect, useState } from "react";
import { Card, Col, Layout, Row } from "antd";
import Title from "antd/lib/typography/Title";
import {
    CheckOutlined,
    LoadingOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
const PageDashboardSectionNew = ({ history }) => {
    const [newRegistrationCount, setNewRegistrationCount] = useState(0);
    const [newFormsCount, setNewFormsCount] = useState(0);
    const {
        data: dataNewRegistrationCount,
        isLoading: isLoadingNewRegistrationCount
    } = useAxiosQuery(
        "GET",
        `api/v1/users/filtered_new`,
        "dashboard_new_registration_count",
        res => {
            // console.log("dashboard_new_registration_count", res);
            if (res.success) {
                setNewRegistrationCount(res.total_count);
            }
        }
    );
    const {
        data: dataNewFormsCount,
        isLoading: isLoadingNewFormsCount
    } = useAxiosQuery(
        "GET",
        `api/v1/formdata/new/new?${$.param({
            filter_value: "",
            page_number: 1,
            page_size: "100"
        })}`,
        "dashboard_new_forms_count",
        res => {
            if (res.success) {
                setNewFormsCount(res.total_count);
            }
        }
    );
    useEffect(() => {
        // getNewRegistrationCount();
        // getNewFormsCount();
        return () => {};
    }, []);

    const getNewRegistrationCount = () => {
        // mutateNewRegistrationCount(dataTableInfo, {
        //     onSuccess: res => {
        //         if (res.success) {
        //             setNewRegistrationCount(res.total_count);
        //         }
        //     }
        // });
    };
    const getNewFormsCount = () => {
        // mutateNewFormsCount(
        //     {
        //         filter_value: "",
        //         page_number: 1,
        //         page_size: "100"
        //     },
        //     {
        //         onSuccess: res => {
        //             if (res.success) {
        //                 setNewFormsCount(res.total_count);
        //             }
        //         }
        //     }
        // );
    };
    return (
        <>
            <Title level={2} className="mb-0">
                New
            </Title>
            <Row gutter={25}>
                <Col xs={24} md={5}>
                    <Card
                        style={{
                            borderTop: "8px solid #1FA8D8",
                            cursor: "pointer"
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={e => history.push("/profiles?status=New")}
                    >
                        <div className="text-right">
                            {isLoadingNewRegistrationCount ? (
                                <LoadingOutlined
                                    spin
                                    style={{ fontSize: 30 }}
                                />
                            ) : (
                                <UsergroupAddOutlined
                                    style={{ fontSize: 30 }}
                                />
                            )}
                        </div>
                        <Title leve={1} className="mb-0">
                            {dataNewRegistrationCount
                                ? dataNewRegistrationCount.total_count
                                : 0}
                        </Title>
                        <Text>Registration</Text>
                    </Card>
                </Col>
                <Col xs={24} md={5}>
                    <Title level={2} className="mb-0"></Title>
                    <Card
                        style={{
                            borderTop: "8px solid #1FA8D8",
                            cursor: "pointer"
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={e =>
                            history.push("/forms/submitted?status=New")
                        }
                    >
                        <div className="text-right">
                            {isLoadingNewFormsCount ? (
                                <LoadingOutlined
                                    spin
                                    style={{ fontSize: 30 }}
                                />
                            ) : (
                                <CheckOutlined style={{ fontSize: 30 }} />
                            )}
                        </div>
                        <Title leve={1} className="mb-0">
                            {dataNewFormsCount
                                ? dataNewFormsCount.total_count
                                : 0}
                        </Title>
                        <Text>Forms</Text>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PageDashboardSectionNew;
