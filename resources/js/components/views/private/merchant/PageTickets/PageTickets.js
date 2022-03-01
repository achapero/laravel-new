import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    Divider,
    notification,
    Table,
    Popconfirm
} from "antd";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined
} from "@ant-design/icons";

import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import queryString from "query-string";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import Title from "antd/lib/typography/Title";
import TableColumnSettings from "../../../../providers/TableColumnSettings";
import { CSVLink } from "react-csv";
import { dateDiff } from "../../../../providers/dateDiff";
import getCheckPermission from "../../../../providers/getCheckPermission";
const PageTickets = ({ match, history, permission }) => {
    const userdata = getUserData();
    const ticket_status = match.params.status;
    const [statusCounts, setStatusCounts] = useState({
        awaitingcustomerreply: 0,
        awaitingsupportreply: 0,
        onhold: 0,
        closed: 0
    });
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        if (!ticket_status) {
            history.push("/tickets/awaitingcustomerreply");
        } else {
            getTickets();
        }
        return () => {};
    }, [match.params.status]);

    const {
        mutate: mutategetTicketst,
        isLoading: isLoadinggetTickets
    } = useAxiosQuery(
        "POST",
        "api/v1/ticket/status",
        "mutate_getTickets_merchant"
    );

    const getTickets = () => {
        mutategetTicketst(
            { status: ticket_status, user_id: userdata.id },
            {
                onSuccess: res => {
                    if (res.success) {
                        let obj = {
                            awaitingcustomerreply: 0,
                            awaitingsupportreply: 0,
                            onhold: 0,
                            closed: 0
                        };
                        setTimeout(() => getCheckPermission(permission), 1000);

                        setTickets(res.tickets);
                        res.tickets_count.forEach(element => {
                            let status = element.ticket_status.toLowerCase();
                            status = status.replace(/ /g, "");

                            obj = {
                                ...obj,
                                [status]: element.status_count
                                    ? element.status_count
                                    : 0
                            };
                        });

                        setStatusCounts({
                            ...statusCounts,
                            ...obj
                        });
                    }
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    return (
        <div
            id="merchanttickets"
            style={{
                padding: "24px 16px"
            }}
        >
            <Row className="justify-content-center">
                <Col md={3}></Col>
                <Col md={18}>
                    <Card>
                        <div className="bg-primary"></div>
                        <div>
                            <div style={{ padding: "10px" }}>
                                <span className="text-muted">Status: </span>
                                <Link
                                    to="/tickets/awaitingcustomerreply"
                                    style={{
                                        marginRight: "10px",
                                        marginLeft: "10px"
                                    }}
                                >
                                    {console.log(
                                        statusCounts["awaitingcustomerreply"]
                                    )}
                                    Awaiting Customer Reply{" "}
                                    {statusCounts["awaitingcustomerreply"] !=
                                        0 && (
                                        <>
                                            (
                                            {
                                                statusCounts[
                                                    "awaitingcustomerreply"
                                                ]
                                            }
                                            )
                                        </>
                                    )}
                                </Link>
                                <Link
                                    to="/tickets/awaitingsupportreply"
                                    style={{ marginRight: "10px" }}
                                >
                                    Awaiting Support Reply{" "}
                                    {statusCounts["awaitingsupportreply"] !=
                                        0 && (
                                        <>
                                            (
                                            {
                                                statusCounts[
                                                    "awaitingsupportreply"
                                                ]
                                            }
                                            )
                                        </>
                                    )}
                                </Link>
                                <Link
                                    to="/tickets/onhold"
                                    style={{ marginRight: "10px" }}
                                >
                                    On Hold{" "}
                                    {statusCounts["onhold"] != 0 && (
                                        <>({statusCounts["onhold"]})</>
                                    )}
                                </Link>
                                <Link
                                    to="/tickets/closed"
                                    style={{ marginRight: "10px" }}
                                >
                                    Closed{" "}
                                    {statusCounts["closed"] != 0 && (
                                        <>({statusCounts["closed"]})</>
                                    )}
                                </Link>
                                <Button
                                    type="primary"
                                    className="pull-right"
                                    name="add_btn"
                                >
                                    <Link to="/tickets/add">New Ticket</Link>
                                </Button>
                            </div>
                            <hr></hr>
                            <div>
                                {tickets.length ? (
                                    tickets.map((ticket, index) => {
                                        return (
                                            <div key={index}>
                                                <div>
                                                    <Link
                                                        to={`/tickets/ticket/${ticket.id}`}
                                                        className="nodecor"
                                                    >
                                                        {ticket.ticket_subject}
                                                    </Link>

                                                    <img
                                                        src={
                                                            ticket.last_submitted_photo !=
                                                            null
                                                                ? ticket.last_submitted_photo
                                                                : ticket.submitted_photo
                                                        }
                                                        className="pull-right img-circle"
                                                        width="40"
                                                    />
                                                    <div className="text-muted">
                                                        <small>
                                                            {ticket.last_submitted_by !=
                                                            null
                                                                ? ticket.last_submitted_by
                                                                : ticket
                                                                      .submitted_by
                                                                      .name}{" "}
                                                            -{" "}
                                                            {ticket.last_reply_date !=
                                                            null
                                                                ? dateDiff(
                                                                      ticket.last_reply_date
                                                                  )
                                                                : dateDiff(
                                                                      ticket.created_at
                                                                  )}{" "}
                                                            -{" "}
                                                            <Link
                                                                to={`/tickets/ticket/${ticket.id}`}
                                                                className="nodecor"
                                                            >{`${ticket.response_count} replies`}</Link>
                                                        </small>
                                                    </div>
                                                </div>

                                                <hr></hr>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center text-muted">
                                        No Tickets Found
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={3}></Col>
            </Row>
        </div>
    );
};

export default PageTickets;
