import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Table } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import getUserData from "../../../../providers/getUserData";

const PageDashboardSectionReminders = () => {
    let userdata = getUserData();
    const {
        mutate: mutateReminders,
        isLoading: isLoadingReminders
    } = useAxiosQuery(
        "POST",
        "api/v1/ticket/filtered_reminders",
        "dashboard_reminders"
    );

    const [dataTableInfo, setDataTableInfo] = useState({
        user_id: userdata.id,
        filter_value: "",
        page_number: 1,
        page_size: "5",
        sort_order: { column: "id", order: "asc" },
        show_ticket_priority_none: "true",
        show_ticket_priority_low: "true",
        show_ticket_priority_medium: "true",
        show_ticket_priority_high: "true",
        show_ticket_customer: "false",
        show_ticket_support: "true",
        show_ticket_close: "false",
        show_ticket_onhold: "false",
        show_ticket_open: "false",
        show_type_training: "true",
        show_type_pos_software: "true",
        show_type_credit_card: "true",
        show_type_work_station: "true",
        show_type_service_requested: "true",
        show_type_sales: "true",
        show_type_gift_cards: "true",
        show_type_adapt_pay: "true",
        show_type_cc_terminal: "true",
        show_type_pan_request: "true",
        show_type_none: "true"
    });
    const [remindersList, setRemindersList] = useState([]);
    useEffect(() => {
        mutateReminders(dataTableInfo, {
            onSuccess: res => {
                setRemindersList(res.data);
            }
        });
        return () => {};
    }, []);

    return (
        <>
            <Title level={2} className="mb-0">
                Reminders
            </Title>
            <Card title="Awaiting Support Reply List">
                <div className="table-responsive">
                    {" "}
                    <Table
                        rowKey={record => record.id}
                        loading={isLoadingReminders}
                        size="small"
                        dataSource={remindersList}
                    >
                        <Table.Column
                            title="ID"
                            key="id"
                            render={(text, record) => {
                                return (
                                    <a
                                        href={`/tickets/ticket/${record.id}`}
                                        target="_blank"
                                    >
                                        #{record.id}
                                    </a>
                                );
                            }}
                        />
                        <Table.Column
                            title="Ticket Status"
                            key="ticket_status"
                            render={(text, record) => {
                                return (
                                    <Link to={`tickets/ticket/${record.id}`}>
                                        <p
                                            style={{
                                                position: "relative",
                                                top: 8,
                                                color: "#f86c6b"
                                            }}
                                        >
                                            {record.ticket_status}
                                        </p>
                                    </Link>
                                );
                            }}
                        />
                        <Table.Column
                            title="Assigned to"
                            key="assigned_to"
                            render={(text, record) => {
                                return (
                                    record.assigned_to &&
                                    record.assigned_to.name
                                );
                            }}
                        />
                        <Table.Column
                            title="Ticket Submitted by"
                            key="ticket_submitted_by"
                            dataIndex="ticket_submitted_by"
                        />
                        <Table.Column
                            title="Action"
                            key="action"
                            render={(text, record) => {
                                return (
                                    <Button
                                        type="primary"
                                        href={`/tickets/ticket/${record.id}`}
                                        target="_blank"
                                    >
                                        <EyeOutlined />
                                    </Button>
                                );
                            }}
                        />
                    </Table>
                </div>
            </Card>
        </>
    );
};

export default PageDashboardSectionReminders;
