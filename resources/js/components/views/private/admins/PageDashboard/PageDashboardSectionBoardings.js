import React, { useState } from "react";
import { Card, Col, Layout, Row } from "antd";
import Title from "antd/lib/typography/Title";
import {
    CheckOutlined,
    LoadingOutlined,
    QuestionCircleOutlined,
    UsergroupAddOutlined
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
const PageDashboardSectionBoardings = ({ history }) => {
    const {
        data: dataBoardings,
        isLoading: isLoadingDataBoardings
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent",
        "dashboard_boardings_count",
        res => {}
    );
    let manualpendingreview = 0;
    return (
        <>
            <Title level={2} className="mb-0">
                Boardings{" "}
                {/* {isLoadingDataBoardings ? (
                    <LoadingOutlined spin />
                ) : (
                    <QuestionCircleOutlined />
                )} */}
            </Title>
            <Row gutter={25}>
                <Col xs={24} md={5}>
                    <Card
                        style={{
                            borderTop: "8px solid #1FA8D8",
                            cursor: "pointer"
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={e =>
                            history.push("/boarding/clearent?app_status=New")
                        }
                    >
                        <Title leve={1} className="mb-0">
                            {dataBoardings ? dataBoardings.boarding_new : 0}
                        </Title>
                        <Text>New</Text>
                    </Card>
                </Col>
                <Col xs={24} md={5}>
                    <Card
                        style={{
                            borderTop: "8px solid #F86B6B",
                            cursor: "pointer"
                        }}
                        onClick={e =>
                            history.push(
                                "/boarding/clearent?app_status=Awaiting Customer Response"
                            )
                        }
                        bodyStyle={{ padding: 10 }}
                    >
                        <Title leve={1} className="mb-0">
                            {dataBoardings &&
                            dataBoardings.data.find(
                                p => p.status == "Awaiting Customer Response"
                            )
                                ? dataBoardings.data.find(
                                      p =>
                                          p.status ==
                                          "Awaiting Customer Response"
                                  ).status_count
                                : 0}
                        </Title>
                        <Text>Awaiting for Customer Response</Text>
                    </Card>
                </Col>
                <Col xs={24} md={5}>
                    <Card
                        style={{
                            borderTop: "8px solid #1FA8D8",
                            cursor: "pointer"
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={e =>
                            history.push(
                                "/boarding/clearent?app_status=Quality Assurance Review"
                            )
                        }
                    >
                        <Title leve={1} className="mb-0">
                            {dataBoardings &&
                            dataBoardings.data.find(
                                p => p.status == "Quality Assurance Review"
                            )
                                ? dataBoardings.data.find(
                                      p =>
                                          p.status == "Quality Assurance Review"
                                  ).status_count
                                : 0}
                        </Title>
                        <Text>Quality Assurance Review</Text>
                    </Card>
                </Col>
                <Col xs={24} md={5}>
                    <Card
                        style={{
                            borderTop: "8px solid #FFC109",
                            cursor: "pointer"
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={e =>
                            history.push(
                                "/boarding/clearent?app_status=Pending Review"
                            )
                        }
                    >
                        <Title leve={1} className="mb-0">
                            {dataBoardings &&
                                dataBoardings.data.filter(
                                    p =>
                                        p.status == "Manual Review" ||
                                        p.status == "Pending Review"
                                ) &&
                                dataBoardings.data
                                    .filter(
                                        p =>
                                            p.status == "Manual Review" ||
                                            p.status == "Pending Review"
                                    )
                                    .map((data, key) => {
                                        manualpendingreview += parseInt(
                                            data.status_count
                                        );
                                    })}
                            {manualpendingreview}
                        </Title>
                        <Text>Manual/Pending Review</Text>
                    </Card>
                </Col>
                <Col xs={24} md={4}>
                    <Card
                        style={{
                            borderTop: "8px solid #4CBD74",
                            cursor: "pointer"
                        }}
                        onClick={e =>
                            history.push(
                                "/boarding/clearent?app_status=Boarded"
                            )
                        }
                        bodyStyle={{ padding: 10 }}
                    >
                        <Title leve={1} className="mb-0">
                            {dataBoardings &&
                            dataBoardings.data.find(p => p.status == "Boarded")
                                ? dataBoardings.data.find(
                                      p => p.status == "Boarded"
                                  ).status_count
                                : 0}
                        </Title>
                        <Text>Boarded</Text>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PageDashboardSectionBoardings;
