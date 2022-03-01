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
const PageDashboardSectionTickets = ({ history }) => {
    const {
        data: dataTickets,
        isLoading: isLoadingDataTickets
    } = useAxiosQuery(
        "GET",
        "api/v1/ticket",
        "dashboard_tickets_count",
        res => {}
    );
    return (
        <>
            <Title level={2} className="mb-0">
                Tickets
                {isLoadingDataTickets && <LoadingOutlined spin />}
            </Title>
            <Row gutter={25}>
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            borderTop: "8px solid #1FA8D8",
                            cursor: "pointer"
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={e =>
                            history.push(
                                // "/tickets?ticket_status=Awaiting Support Reply"
                                "/tickets"
                            )
                        }
                    >
                        <Title leve={1} className="mb-0">
                            {dataTickets &&
                            dataTickets.tickets_count.find(
                                p => p.ticket_status == "Awaiting Support Reply"
                            )
                                ? dataTickets.tickets_count.find(
                                      p =>
                                          p.ticket_status ==
                                          "Awaiting Support Reply"
                                  ).status_count
                                : 0}
                        </Title>
                        <Text>Awaiting Support Reply</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card
                        style={{ borderTop: "8px solid #4CBD74" }}
                        bodyStyle={{ padding: 10, cursor: "pointer" }}
                        onClick={e =>
                            history.push(
                                // "/tickets?ticket_status=Awaiting Customer Reply"
                                "/tickets"
                            )
                        }
                    >
                        <Title leve={1} className="mb-0">
                            {dataTickets &&
                            dataTickets.tickets_count.find(
                                p =>
                                    p.ticket_status == "Awaiting Customer Reply"
                            )
                                ? dataTickets.tickets_count.find(
                                      p =>
                                          p.ticket_status ==
                                          "Awaiting Customer Reply"
                                  ).status_count
                                : 0}
                        </Title>
                        <Text>Awaiting for Customer Reply</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card
                        style={{ borderTop: "8px solid #FFC109" }}
                        bodyStyle={{ padding: 10, cursor: "pointer" }}
                        onClick={e =>
                            history.push(
                                // "/tickets?ticket_status=On Hold"
                                "/tickets"
                            )
                        }
                    >
                        <Title leve={1} className="mb-0">
                            {dataTickets &&
                            dataTickets.tickets_count.find(
                                p => p.ticket_status == "On Hold"
                            )
                                ? dataTickets.tickets_count.find(
                                      p => p.ticket_status == "On Hold"
                                  ).status_count
                                : 0}
                        </Title>
                        <Text>On Hold</Text>
                    </Card>
                </Col>
                <Col xs={24} md={6}>
                    <Card
                        style={{
                            borderTop: "8px solid #C8CED3",
                            cursor: "pointer"
                        }}
                        bodyStyle={{ padding: 10 }}
                        onClick={e =>
                            history.push(
                                // "/tickets?ticket_status=Closed"
                                "/tickets"
                            )
                        }
                    >
                        <Title leve={1} className="mb-0">
                            {dataTickets &&
                            dataTickets.tickets_count.find(
                                p => p.ticket_status == "Closed"
                            )
                                ? dataTickets.tickets_count.find(
                                      p => p.ticket_status == "Closed"
                                  ).status_count
                                : 0}
                        </Title>
                        <Text>Closed</Text>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PageDashboardSectionTickets;
