import React, { useState, useEffect } from "react";
import { Row, Col, message, notification, Card } from "antd";

import Board from "react-trello";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import { dateDiff } from "../../../../providers/dateDiff";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";

import { CloseCircleOutlined } from "@ant-design/icons";

const PageTicketDnD = ({ dataTableInfo, getForms }) => {
    useEffect(() => {
        console.log("dataTableInfo", dataTableInfo);
        getFormszzz();

        return () => {};
    }, []);

    const [dataTable, setDataTable] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [ticketSupportReply, setTicketSupportReply] = useState([
        {
            id: "",
            title: "",
            description: "",
            metadata: "",
            draggable: true
        }
    ]);
    const [ticketCustomerReply, setTicketCustomerReply] = useState([
        {
            id: "",
            title: "",
            description: "",
            metadata: "",
            draggable: true
        }
    ]);
    const [ticketOnHold, setTicketOnHold] = useState([
        {
            id: "",
            title: "",
            description: "",
            metadata: "",
            draggable: true
        }
    ]);
    const [ticketClosed, setTicketClosed] = useState([
        {
            id: "",
            title: "",
            description: "",
            metadata: "",
            draggable: true
        }
    ]);

    const currentUserData = getUserData();

    const setToHTML = data => {
        //  //console.log("data",data)
        return (
            <div dangerouslySetInnerHTML={{ __html: trimResponse(data) }}></div>
        );
    };

    const boldenDate = date => {
        //var span = document.createElement("b");
        // var newDate = "<b>" + date + "</b>"
        //span.style.fontWeight="bold";
        //span.innerHTML = date
        // //console.log(span);
        // //console.log(<div dangerouslySetInnerHTML={{__html:span}}></div>)
        // //console.log("date",newDate)
        ////console.log(date)
        //return <div dangerouslySetInnerHTML={{__html: date }}></div>
    };

    const trimResponse = response => {
        let res = "";
        if (response) {
            let _response = response.split('<br><div className="gmail_quote">');
            if (_response[0].length > 45) {
                res = _response[0].substring(0, 45) + " ...";
            } else {
                res = _response[0];
            }
        }

        return res;
    };

    const trimTicketTitle = ticketTitle => {
        let newTicketTitle = "";
        if (ticketTitle.length > 35) {
            newTicketTitle = ticketTitle.substring(0, 35) + " ...";
        } else {
            newTicketTitle = ticketTitle;
        }
        return newTicketTitle;
    };

    const timeUpdatedAt = time => {
        let responseTime = "";
        if (
            moment(time)
                .fromNow(true)
                .includes("minute") ||
            moment(time)
                .fromNow(true)
                .includes("minutes")
        ) {
            responseTime =
                moment(time)
                    .fromNow(true)
                    .replace("minute", "min") ||
                moment(time)
                    .fromNow(true)
                    .replace("minutes", "min");
        } else if (
            moment(time)
                .fromNow(true)
                .includes("an hour")
        ) {
            responseTime = moment(time)
                .fromNow(true)
                .replace("an hour", "1 hour");
        } else {
            responseTime = moment(time)
                .fromNow(true)
                .replace("a few seconds", "a few seconds");
        }
        return responseTime + " ago";
    };

    useEffect(() => {
        ////console.log("list",List)
        // console.log("boarded", dataTable.data);
        let dataTicketSupportReply = [
            {
                id: "",
                title: "",
                description: "",
                metadata: ""
            }
        ];
        let dataCustomerReply = [
            {
                id: "",
                title: "",
                description: "",
                metadata: ""
            }
        ];
        let dataOnHold = [
            {
                id: "",
                title: "",
                description: "",
                metadata: ""
            }
        ];
        let dataClosed = [
            {
                id: "",
                title: "",
                description: "",
                metadata: ""
            }
        ];
        if (dataTable && dataTable.length > 0) {
            dataTable.map((x, index) => {
                if (x.ticket_status === "Awaiting Support Reply") {
                    dataTicketSupportReply.push({
                        id: x.id.toString(),
                        title: (
                            <div key={index}>
                                <Link
                                    to={`tickets/ticket/${x.id}`}
                                    className="view_btn"
                                >
                                    {trimTicketTitle(x.ticket_subject)}
                                </Link>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: "100"
                                    }}
                                >
                                    <div style={{ marginTop: "5px" }}>
                                        {x.user
                                            ? x.user.user_fields
                                                ? x.user.user_fields
                                                      .merchant_name
                                                    ? "Merchant Name: " +
                                                      x.user.user_fields
                                                          .merchant_name
                                                    : "Merchant Name: None"
                                                : "Merchant Name: None"
                                            : "(user deleted)"}
                                    </div>
                                    <div>
                                        {x.ticket_responses &&
                                        x.ticket_responses[0] &&
                                        x.ticket_responses[0].submitted_by &&
                                        x.ticket_responses[0].submitted_by
                                            .name != ""
                                            ? "updated by - " +
                                              x.ticket_responses[0].submitted_by
                                                  .name
                                            : ""}
                                        {x.ticket_responses[0] &&
                                        x.ticket_responses[0].created_at !=
                                            "undefined" ? (
                                            <b>
                                                {" "}
                                                {dateDiff(
                                                    x.ticket_responses[0]
                                                        .created_at
                                                )}{" "}
                                            </b>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        ),
                        description: setToHTML(x.ticket_description),
                        // description: x.ticket_description,
                        metadata: x.ticket_status,
                        hideCardDeleteIcon: true
                    });
                } else if (x.ticket_status === "Awaiting Customer Reply") {
                    dataCustomerReply.push({
                        id: x.id.toString(),
                        title: (
                            <div key={index}>
                                <Link
                                    to={`tickets/ticket/${x.id}`}
                                    className="view_btn"
                                >
                                    {trimTicketTitle(x.ticket_subject)}
                                </Link>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: "100"
                                    }}
                                >
                                    <div style={{ marginTop: "5px" }}>
                                        {x.user
                                            ? x.user.user_fields
                                                ? x.user.user_fields
                                                      .merchant_name
                                                    ? "Merchant Name: " +
                                                      x.user.user_fields
                                                          .merchant_name
                                                    : "Merchant Name: None"
                                                : "Merchant Name: None"
                                            : "(user deleted)"}
                                    </div>
                                    <div>
                                        {x.ticket_responses &&
                                        x.ticket_responses[0] &&
                                        x.ticket_responses[0].submitted_by &&
                                        x.ticket_responses[0].submitted_by
                                            .name != ""
                                            ? "updated by - " +
                                              x.ticket_responses[0].submitted_by
                                                  .name
                                            : ""}
                                        {x.ticket_responses[0] &&
                                        x.ticket_responses[0].created_at !=
                                            "undefined" ? (
                                            <b>
                                                {" "}
                                                {dateDiff(
                                                    x.ticket_responses[0]
                                                        .created_at
                                                )}{" "}
                                            </b>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        ),
                        description: setToHTML(x.ticket_description),
                        metadata: x.ticket_status
                    });
                } else if (x.ticket_status === "On Hold") {
                    dataOnHold.push({
                        id: x.id.toString(),
                        title: (
                            <div key={index}>
                                <Link
                                    to={`tickets/ticket/${x.id}`}
                                    className="view_btn"
                                >
                                    {trimTicketTitle(x.ticket_subject)}
                                </Link>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: "100"
                                    }}
                                >
                                    <div style={{ marginTop: "5px" }}>
                                        {x.user
                                            ? x.user.user_fields
                                                ? x.user.user_fields
                                                      .merchant_name
                                                    ? "Merchant Name: " +
                                                      x.user.user_fields
                                                          .merchant_name
                                                    : "Merchant Name: None"
                                                : "Merchant Name: None"
                                            : "(user deleted)"}
                                    </div>
                                    <div>
                                        {" "}
                                        {x.ticket_responses &&
                                        x.ticket_responses[0] &&
                                        x.ticket_responses[0].submitted_by &&
                                        x.ticket_responses[0].submitted_by
                                            .name != ""
                                            ? "updated by - " +
                                              x.ticket_responses[0].submitted_by
                                                  .name
                                            : ""}
                                        {x.ticket_responses[0] &&
                                        x.ticket_responses[0].created_at !=
                                            "undefined" ? (
                                            <b>
                                                {" "}
                                                {dateDiff(
                                                    x.ticket_responses[0]
                                                        .created_at
                                                )}{" "}
                                            </b>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        ),
                        description: setToHTML(x.ticket_description),
                        metadata: x.ticket_status
                    });
                } else if (x.ticket_status === "Closed") {
                    dataClosed.push({
                        id: x.id.toString(),
                        title: (
                            <div key={index}>
                                <Link
                                    to={`tickets/ticket/${x.id}`}
                                    className="view_btn"
                                >
                                    {trimTicketTitle(x.ticket_subject)}
                                </Link>
                                <div
                                    style={{
                                        fontSize: "10px",
                                        fontWeight: "100"
                                    }}
                                >
                                    <div style={{ marginTop: "5px" }}>
                                        {x.user
                                            ? x.user.user_fields
                                                ? x.user.user_fields
                                                      .merchant_name
                                                    ? "Merchant Name: " +
                                                      x.user.user_fields
                                                          .merchant_name
                                                    : "Merchant Name: None"
                                                : "Merchant Name: None"
                                            : "(user deleted)"}
                                    </div>
                                    <div>
                                        {x.ticket_responses &&
                                        x.ticket_responses[0] &&
                                        x.ticket_responses[0].submitted_by &&
                                        x.ticket_responses[0].submitted_by
                                            .name != ""
                                            ? "updated by - " +
                                              x.ticket_responses[0].submitted_by
                                                  .name
                                            : ""}
                                        {x.ticket_responses[0] &&
                                        x.ticket_responses[0].created_at !=
                                            "undefined" ? (
                                            <b>
                                                {" "}
                                                {dateDiff(
                                                    x.ticket_responses[0]
                                                        .created_at
                                                )}{" "}
                                            </b>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        ),
                        description: setToHTML(x.ticket_description),
                        metadata: x.ticket_status
                    });
                }
                setTicketSupportReply(dataTicketSupportReply);
                setTicketCustomerReply(dataCustomerReply);
                setTicketOnHold(dataOnHold);
                setTicketClosed(dataClosed);
            });
        } else {
            setTicketSupportReply(dataTicketSupportReply);
            setTicketCustomerReply(dataCustomerReply);
            setTicketOnHold(dataOnHold);
            setTicketClosed(dataClosed);
        }
    }, [dataTable]);

    const {
        mutate: mutateTicketDnd,
        isLoading: isLoadingTicketDnd
    } = useAxiosQuery("POST", "api/v1/ticket/getTicket", "mutate_ticket_page");

    const getFormszzz = () => {
        mutateTicketDnd(dataTableInfo, {
            onSuccess: res => {
                if (res.success) {
                    console.log("tciketdnd", res);
                    setDataTable(res.data);
                }
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    const removeEmptyData = data => {
        let newArr = [];
        data.forEach(x => {
            if (
                x.id != "" &&
                x.title != "" &&
                x.description != "" &&
                x.metadata != ""
            ) {
                newArr.push(x);
            }
        });
        return newArr;
    };

    const handleDragStart = (cardId, laneId) => {};

    const onCardClick = (cardId, metadata, laneId) => {
        location.href = window.location.origin + "/tickets/ticket/" + cardId;
    };

    const {
        mutate: mutatehandleDragEnd,
        isLoading: isLoadinghandleDragEnd
    } = useAxiosQuery(
        "POST",
        "api/v1/ticket/updateTicketStatus",
        "mutate_ticket_page"
    );
    const key = "updatable";

    const handleDragEnd = (
        cardId,
        sourceLaneId,
        targetLaneId,
        position,
        cardDetails
    ) => {
        let data = {
            ticket_id: cardId,
            ticket_status: targetLaneId,
            updated_by_user_id: currentUserData.id
        };
        console.log(data);
        message.loading({
            content: "Updating...",
            key,
            duration: 0
        });

        mutatehandleDragEnd(data, {
            onSuccess: res => {
                // getForms();
                getFormszzz();
                message.success({
                    content: "Updated Successfully!",
                    key
                });
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    const data = {
        lanes: [
            {
                id: "Awaiting Support Reply",
                title: "Awaiting Support Reply",
                cards: removeEmptyData(ticketSupportReply)
            },
            {
                id: "Awaiting Customer Reply",
                title: "Awaiting Customer Reply",
                cards: removeEmptyData(ticketCustomerReply)
            },
            {
                id: "On Hold",
                title: "On Hold",
                cards: removeEmptyData(ticketOnHold)
            },
            {
                id: "Closed",
                title: "Recently Closed",
                cards: removeEmptyData(ticketClosed)
            }
        ]
    };

    const onCardDelete = (cardId, laneId) => {
        // console.log('onCardDelete', cardId, laneId)
        mutatedeleteRecord(
            { id: cardId },
            {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "Tickets Successfully Deleted"
                        });
                        getFormszzz();
                    }
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const {
        mutate: mutatedeleteRecord,
        isLoading: isLoadingdeleteRecord
    } = useAxiosQuery("DELETE", "api/v1/ticket", "mutate_ticket_page");

    const CustomCard = props => {
        return (
            <Card
                style={{
                    background: "white",
                    margin: "5px",
                    borderRadius: "3px",
                    width: "300px"
                }}
                className="CustomCard"
            >
                <a
                    href="#"
                    onClick={e => {
                        onCardDelete(props.id);
                        // e.preventDefault()
                        // alert(props.id)
                    }}
                    style={{
                        position: "absolute",
                        right: "11px"
                    }}
                >
                    <CloseCircleOutlined />
                </a>
                {props.title}
                {props.description}
            </Card>
        );
    };
    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <Board
                data={data}
                laneDraggable={false}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                className="react-trello-board board"
                cardDragClass="card-drag"
                cardDropClass="card-drop"
                onCardClick={onCardClick}
                style={{ background: "none!important" }}
                onCardDelete={onCardDelete}
                customCardLayout={true}
                components={{
                    Card: CustomCard
                }}
            />
        </div>
    );
};

export default PageTicketDnD;
