import React, { useEffect, useState, useRef } from "react";
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    Form,
    Modal,
    Alert,
    Select,
    Typography,
    Tooltip,
    Checkbox,
    Divider,
    Upload,
    notification
} from "antd";

import { dateDiff } from "../../../../providers/dateDiff";
import moment from "moment";

import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import getUserData from "../../../../providers/getUserData";
import { Element } from "react-scroll";

import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);
import "react-quill/dist/quill.snow.css";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    EditOutlined,
    SendOutlined
} from "@ant-design/icons";

const TicketResponses = ({ match, history }) => {
    const modulesToolBar = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" }
            ],
            ["link", "image", "video"],
            ["clean"]
        ],
        imageResize: {
            // parchment: Quill.import('parchment'),
            modules: ["Resize", "DisplaySize"]
        }
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video"
    ];

    const { Title, Text } = Typography;
    const [ticketData, setTicketData] = useState();
    const [ticketResponses, setTicketResponses] = useState();
    const [showReplyDiv, setShowReplyDiv] = useState(false);
    const [responseData, setResponseData] = useState({
        is_pan: false
    });
    const [lastDateUpdated, setLastDateUpdated] = useState();
    const [submitButtonText, setSubmitButtonText] = useState("Reply");
    const [submitButtonTextUpdate, setSubmitButtonTextUpdate] = useState(
        "Update"
    );

    const userdata = getUserData();
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [status, setStatus] = useState("");
    const [success, setSuccess] = useState(false);
    const [optionsAdmins, setOptionsAdmins] = useState([]);
    const [ticketAwaitSupportReplyId, setTticketAwaitSupportReplyId] = useState(
        null
    );
    let [index, setIndex] = useState(0);
    const [isSelectAssignedToLoading, setIsSelectAssignedToLoading] = useState(
        false
    );

    const [ticketResponders, setTicketResponders] = useState([]);

    const {
        mutate: mutateOldesTicket,
        isLoading: isLoadingOldesTicket
    } = useAxiosQuery("POST", "api/v1/ticket/oldest", "oldest_ticketresponses");

    const getOldestTicketAwaitingReplyStatus = () => {
        mutateOldesTicket(
            {},
            {
                onSuccess: res => {
                    if (res.success) {
                        nextSlideTicket(res.data);
                    }
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    useEffect(() => {
        getOldestTicketAwaitingReplyStatus();
    }, []);

    const nextSlideTicket = tickets => {
        var arrId = [];
        tickets.forEach(ticket => {
            //(ticket.id)
            // //console.log(ticket.id)
            arrId.push(ticket.id);
        });
        setTticketAwaitSupportReplyId(arrId);
        //console.log(arrId);
    };

    const slideticket = () => {
        //setIndex(index + 1);
        // //console.log(ticketAwaitSupportReplyId[index])
        if (ticketAwaitSupportReplyId.includes(parseInt(match.params.id))) {
            //console.log(ticketAwaitSupportReplyId);
            let id =
                ticketAwaitSupportReplyId.indexOf(parseInt(match.params.id)) +
                1;
            if (typeof ticketAwaitSupportReplyId[id] === "undefined") {
                window.location.href =
                    window.location.origin +
                    `/tickets/ticket/${ticketAwaitSupportReplyId[0]}`;
            } else {
                window.location.href =
                    window.location.origin +
                    `/tickets/ticket/${ticketAwaitSupportReplyId[id]}`;
            }
        } else {
            window.location.href =
                window.location.origin +
                `/tickets/ticket/${ticketAwaitSupportReplyId[0]}`;
        }
    };

    useEffect(() => {
        //console.log(
        //     "ticketAwaitSupportReplyId",
        //     ticketAwaitSupportReplyId && ticketAwaitSupportReplyId
        // );
    }, [ticketAwaitSupportReplyId]);

    const {
        mutate: mutateDeleteticketresponses,
        isLoading: isLoadingticketresponses
    } = useAxiosQuery(
        "DELETE",
        "api/v1/ticketresponses",
        "delete_ticket_responses"
    );

    const {
        data: ticketResponseData,
        isLoading: isLoadinggetTicketResponses,
        refetch: getTicketResponses,
        isFetching: isFetchinggetTicketResponses
    } = useAxiosQuery(
        "GET",
        `api/v1/ticket/${match.params.id}`,
        "get_ticket_responsedata",
        res => {
            console.log(res);
            if (res.success) {
                console.log("THETICKET", res);
                setTicketData(res.ticket);
                setStatus(res.ticket.ticket_status);

                setTicketResponses(res.ticket_responses);
                if (res.ticket_responses.length > 0) {
                    let _ticketResponders = {};
                    res.ticket_responses.map((ticket_response, key) => {
                        if (ticket_response.submitted_by.role != "Merchant") {
                            _ticketResponders = {
                                ..._ticketResponders,
                                [ticket_response.submitted_by.id]:
                                    ticket_response.submitted_by.name
                            };
                        }
                    });
                    setTicketResponders(_ticketResponders);
                    // //console.log(_ticketResponders);
                }
                if (userdata.role == "Merchant") {
                    res.ticket_responses.forEach(response => {
                        if (response.is_pan) {
                            mutateDeleteticketresponses(
                                { id: response.id },
                                {
                                    onSuccess: res => {
                                        //console.log(res);
                                    }
                                }
                            );
                        }
                    });
                }
            } else {
                history.push("/404");
            }
        }
    );

    const {
        mutate: mutateandleSubmitReply,
        isLoading: isLoadingandleSubmitReply
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/ticketresponses",
        "ticket_responses"
    );

    const handleSubmitReply = () => {
        console.log(
            "@whoseemail",
            ticketData.submitted_by.preferred_email
                ? ticketData.submitted_by.preferred_email
                : ticketData.submitted_by.email
        );
        let formData = new FormData();
        formData.append("attachment_url", responseData.attachment_url || "");
        formData.append("response", responseData.response || "");
        formData.append("is_sensitive", responseData.is_sensitive || "");
        formData.append(
            "is_pan",
            responseData.is_pan ||
                ticketData.ticket_subject.indexOf("Request for Full PAN") !== -1
                ? true
                : false
        );
        formData.append("ticket_id", match.params.id);
        formData.append("full_name", ticketData.submitted_by.name);
        formData.append(
            "email",
            ticketData.submitted_by.preferred_email
                ? ticketData.submitted_by.preferred_email
                : ticketData.submitted_by.email
        );
        formData.append("ticket_subject", ticketData.ticket_subject);
        formData.append("submitted_by", userdata.id);

        mutateandleSubmitReply(formData, {
            onSuccess: res => {
                setResponseData(null);
                getTicketResponses();
                setSubmitButtonText("Reply");

                setShowReplyDiv(false);
            }
        });
    };

    useEffect(() => {
        if (responseData) {
            parseEditorImages(responseData.response);
        }
        return () => {};
    }, [responseData]);

    const {
        mutate: mutateparseEditorImages,
        isLoading: isLoadingparseEditorImages
    } = useAxiosQuery(
        "POST",
        "api/v1/ticketresponses/response/upload",
        "ticket_responses_upload"
    );

    const parseEditorImages = _editor => {
        let editor = $(_editor);
        let imgs = editor.find("img");
        if (imgs.length > 0) {
            $.each(imgs, (key, img) => {
                //console.log($(img).attr("src"));
                let src = $(img).attr("src");
                if (src.indexOf("data:image") !== -1) {
                    mutateparseEditorImages(
                        {
                            image: src
                        },
                        {
                            onSuccess: res => {
                                if (res.success) {
                                    let _responseData = responseData.response;
                                    _responseData = _responseData.replace(
                                        src,
                                        location.origin + "/" + res.data
                                    );
                                    setResponseData({
                                        ...responseData,
                                        response: _responseData
                                    });
                                }
                            }
                        }
                    );
                }
            });
        } else {
            // return editor.prop("outerHTML");
        }
    };

    const handleClickUpload = () => {
        $("#file-input").trigger("click");
    };

    const handleShowReplyDiv = () => {
        setShowReplyDiv(!showReplyDiv);
    };

    useEffect(() => {
        if (ticketResponses) {
            if (ticketResponses.length != 0) {
                setLastDateUpdated(
                    moment(ticketResponses[0].created_at).format("LLL")
                );
            } else {
                setLastDateUpdated(moment(ticketData.created_at).format("LLL"));
            }
        } else {
            ticketData &&
                setLastDateUpdated(moment(ticketData.created_at).format("LLL"));
        }
        return () => {};
    }, [ticketResponses]);

    const handleToggleSubmitModal = () => {
        setShowSubmitModal(!showSubmitModal);
    };

    const {
        mutate: mutateUpdatesubmit,
        isLoading: isLoadingMutateUpdatesubmit,
        isSuccess: isSuccessMutateUpdatesubmit
    } = useAxiosQuery(
        "UPDATE",
        `api/v1/ticket/${ticketData && ticketData.id}`,
        `ticketresponsesubmit_update_${ticketData && ticketData.id}`
    );

    const Updatesubmit = () => {
        mutateUpdatesubmit(
            {
                ticket_status: status
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "Ticket Status Successfully Updated"
                        });
                        setShowSubmitModal(!showSubmitModal);
                        getTicketResponses();
                    }
                }
            }
        );
    };

    const updateField = e => {
        setStatus(e);
    };

    const getStatusColor = status => {
        switch (status) {
            case "Awaiting Customer Reply":
                return (
                    <span>
                        <Text type="success">{status}</Text>
                    </span>
                );
                break;
            case "Awaiting Support Reply":
                return (
                    <span>
                        <Text type="danger">{status}</Text>
                    </span>
                );
                break;
            case "On Hold":
                return (
                    <span>
                        <Text type="secondary">{status}</Text>
                    </span>
                );
                break;
            case "Closed":
                return (
                    <span>
                        <Text type="danger">{status}</Text>
                    </span>
                );
                break;
            case "Archived":
                return (
                    <span>
                        <Text type="warning">{status}</Text>
                    </span>
                );
                break;
            default:
                return status;
                break;
        }
    };

    const trimResponse = response => {
        if (response) {
            let _response = response.split('<br><div className="gmail_quote">');
            _response = _response[0];
            return _response;
        }
        return "";
    };

    const handleEditorChange = e => {
        // editorText = e;
        setResponseData({ ...responseData, response: e });
        // //console.log(e);
        // if ($(e).find("img").length > 0) {
        //     let img = $(e).find("img");
        //     img[0].attr("src", "nonono");
        //     //console.log(img);
        // } else {
        //     //console.log(e);
        // }
    };

    const {
        data: dataGetAdmins,
        isLoading: isLoadinggetAdmins,
        refetch: getAdmins,
        isFetching: isFetchingDataGuidesTable
    } = useAxiosQuery(
        "GET",
        "api/v1/users?not_employee=1",
        "users_getadmins_ticketresponses",
        res => {
            // console.log("mcc_codes", res);
            if (res.success) {
                let _options = [];
                res.data.map((admin, key) => {
                    if (admin.role != "Merchant")
                        _options.push({
                            label: admin.name,
                            value: admin.id,
                            role: admin.role
                        });
                });
                setOptionsAdmins(_options);
            }
            getTicketResponses();
        }
    );

    const {
        mutate: mutatehandleChangeAssignedTo,
        isLoading: isLoadinghandleChangeAssignedTo
    } = useAxiosQuery(
        "POST",
        "api/v1/ticket/set_assigned_to",
        "ticket_set_assigned_to"
    );

    const handleChangeAssignedTo = user => {
        let a = optionsAdmins.find(el => el.value == user);

        let data = {
            ticket_id: match.params.id,
            assigned_to: user,
            role: a.role
        };

        mutatehandleChangeAssignedTo(data, {
            onSuccess: res => {
                if (res.success) {
                    getTicketResponses();
                } else {
                    console.log(res);
                }
            }
        });
    };

    useEffect(() => {
        if (ticketData) {
            setResponseData({
                ...responseData,
                is_pan:
                    ticketData.ticket_subject.indexOf(
                        "Request for Full PAN"
                    ) !== -1
                        ? true
                        : false
            });
        }
    }, [ticketData]);

    return (
        <div style={{ padding: 20 }}>
            <Row gutter={12}>
                <Col md={16}>
                    <Card>
                        <div className="bg-primary p-1"></div>
                        <div>
                            <Title>
                                {ticketData && ticketData.ticket_subject}
                            </Title>
                            <div>
                                <Row>
                                    <Col md={12}>{lastDateUpdated}</Col>
                                    <Col md={12} className="text-right">
                                        <a
                                            href="#"
                                            className="mx-1 nodecor"
                                            onClick={e => handleShowReplyDiv()}
                                        >
                                            <i className="fa fa-reply"></i>{" "}
                                            Reply
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                            <Divider></Divider>
                            {showReplyDiv && (
                                <div className="animated fadeIn">
                                    <ReactQuill
                                        onChange={e => {
                                            handleEditorChange(e);
                                        }}
                                        style={{ height: 200 }}
                                        modules={modulesToolBar}
                                        formats={formats}
                                    />

                                    <div style={{ marginTop: 48 }}>
                                        <Row>
                                            <Col md={12}>
                                                {" "}
                                                <Upload
                                                    onChange={e => {
                                                        var file =
                                                            e.fileList[0];
                                                        file.status = "done";
                                                    }}
                                                    maxCount={1}
                                                    customRequest={({
                                                        onSuccess,
                                                        onError,
                                                        file
                                                    }) => {
                                                        setResponseData({
                                                            ...responseData,
                                                            attachment_url: file
                                                        });
                                                    }}
                                                >
                                                    <Button
                                                        icon={
                                                            <UploadOutlined />
                                                        }
                                                    >
                                                        Attach File
                                                    </Button>
                                                </Upload>
                                            </Col>
                                            <Col md={12}>
                                                {" "}
                                                {userdata &&
                                                userdata.role != "Merchant" ? (
                                                    <>
                                                        <span
                                                            check
                                                            className="checkbox pull-right"
                                                        >
                                                            <Checkbox
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="response_sensitive"
                                                                name="is_sensitive"
                                                                onChange={e =>
                                                                    setResponseData(
                                                                        {
                                                                            ...responseData,
                                                                            [e
                                                                                .target
                                                                                .name]:
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {" "}
                                                                Sensitive?
                                                            </Checkbox>
                                                        </span>

                                                        <span
                                                            check
                                                            className="checkbox pull-right mx-2"
                                                        >
                                                            <Checkbox
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="response_pan"
                                                                name="is_pan"
                                                                checked={
                                                                    responseData &&
                                                                    responseData.is_pan
                                                                }
                                                                onChange={e =>
                                                                    setResponseData(
                                                                        {
                                                                            ...responseData,
                                                                            [e
                                                                                .target
                                                                                .name]:
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {" "}
                                                                PAN Request?{" "}
                                                            </Checkbox>
                                                        </span>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                    <br />
                                    <div className="my-1">
                                        <Button
                                            size="sm"
                                            type="primary"
                                            className="mr-1"
                                            loading={isLoadingandleSubmitReply}
                                            onClick={handleSubmitReply}
                                            icon={<SendOutlined />}
                                        >
                                            {submitButtonText}
                                        </Button>
                                        <Button
                                            onClick={e =>
                                                setShowReplyDiv(false)
                                            }
                                            style={{ marginLeft: 5 }}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                    <Divider></Divider>
                                </div>
                            )}

                            {ticketResponses &&
                                ticketResponses.map((response, key) => {
                                    return (
                                        <div key={key}>
                                            <img
                                                src={`${response.image_url}`}
                                                width="40"
                                                className="pull-left mr-2 "
                                                style={{
                                                    marginRight: 5,
                                                    borderRadius: "50%"
                                                }}
                                            />
                                            {response.submitted_by.name}{" "}
                                            {response.is_sensitive == 1 && (
                                                <small className="pull-right text-danger">
                                                    (sensitive)
                                                </small>
                                            )}
                                            {response.is_pan == 1 && (
                                                <small className="pull-right text-danger">
                                                    (pan request)
                                                </small>
                                            )}
                                            <br></br>{" "}
                                            <small className="text-muted">
                                                {dateDiff(response.created_at)}
                                            </small>
                                            <div
                                                className={`pre-line mt-1 ${
                                                    response.is_pan
                                                        ? "bg-danger px-2"
                                                        : ""
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: trimResponse(
                                                        response.response
                                                    )
                                                }}
                                            ></div>
                                            {response.attachment_url && (
                                                <a
                                                    target="_blank"
                                                    download={
                                                        response.attachment_name
                                                    }
                                                    href={`${window.location.origin}/${response.attachment_url}`}
                                                >
                                                    Attachment
                                                </a>
                                            )}
                                            <Divider></Divider>
                                        </div>
                                    );
                                })}

                            <div className="py-1">
                                <img
                                    src={`${ticketData &&
                                        ticketData.image_url}`}
                                    width="40"
                                    className=" pull-left mr-2"
                                    style={{
                                        marginRight: 5,
                                        borderRadius: "50%"
                                    }}
                                />
                                {/* {console.log(ticketData)} */}
                                {ticketData && ticketData.submitted_by.name}
                                <br></br>{" "}
                                <small className="text-muted">
                                    {ticketData &&
                                        dateDiff(ticketData.created_at)}
                                </small>
                                <div
                                    className="pre-line mt-3"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            ticketData &&
                                            ticketData.ticket_description
                                    }}
                                ></div>
                                {ticketData && ticketData.attachment_url ? (
                                    <a
                                        target="_blank"
                                        download={ticketData.attachment_name}
                                        href={`${window.location.origin}/${ticketData.attachment_url}`}
                                    >
                                        Attachment
                                    </a>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <div className="bg-primary p-1 "></div>
                        <div>
                            <Title level={5}>Case Information</Title>
                            <div className="mb-3">
                                <div className="text-muted">Ticket Id</div>
                                <div>#{ticketData && ticketData.id}</div>
                            </div>
                            <div className="mb-3">
                                <div className="text-muted">
                                    <div> Status</div>
                                    <div>
                                        {ticketData &&
                                            getStatusColor(
                                                ticketData.ticket_status
                                            )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="text-muted">Assigned To</div>
                                {ticketData && ticketData.assigned_to
                                    ? ticketData.assigned_to.name
                                    : "None"}
                            </div>
                            <div className="mb-3">
                                <div className="text-muted">Responded By</div>
                                {ticketResponders.length != 0
                                    ? Object.values(ticketResponders).map(
                                          (responder, key) => {
                                              return (
                                                  <div
                                                      key={key}
                                                      className="mr-1"
                                                  >
                                                      {responder}
                                                  </div>
                                              );
                                          }
                                      )
                                    : "None"}
                            </div>
                            <div className="mb-3">
                                <div className="text-muted">Subject</div>
                                <div>
                                    {ticketData && ticketData.ticket_subject}
                                </div>
                            </div>
                            <Divider style={{ margin: "10px 0" }}></Divider>
                            <Title level={5}>Additional Information</Title>
                            <div className="mb-3">
                                <div className="text-muted">Priority</div>
                                <div>
                                    {ticketData && ticketData.ticket_priority}
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="text-muted">Classification</div>
                                <div>
                                    {ticketData && ticketData.ticket_type}
                                </div>
                            </div>
                            <Divider style={{ margin: "10px 0" }}></Divider>
                            <Title level={5}>User Information</Title>
                            <div className="mb-3">
                                <div className="text-muted">Email</div>
                                <div>
                                    {ticketData &&
                                        ticketData.submitted_by.email}
                                </div>
                                {ticketData &&
                                    ticketData.submitted_by.preferred_email && (
                                        <>
                                            <div className="text-muted">
                                                Preferred Email
                                            </div>
                                            <div>
                                                {
                                                    ticketData.submitted_by
                                                        .preferred_email
                                                }
                                            </div>
                                        </>
                                    )}
                            </div>
                            <Divider style={{ margin: "10px 0" }}></Divider>
                            <Title level={5}>Account Links</Title>
                            <div className="mb-3">
                                {ticketData &&
                                    ticketData.clearent_boardings.length >
                                        0 && (
                                        <h6 className="text-muted">
                                            Clearent Boarding
                                        </h6>
                                    )}
                                {ticketData &&
                                    ticketData.clearent_boardings.map(
                                        (boarding, key) => {
                                            return (
                                                boarding && (
                                                    <div key={key}>
                                                        <Link
                                                            to={`/boarding/clearent/${boarding.form_data_id}`}
                                                        >
                                                            {
                                                                boarding.merchantNumber
                                                            }
                                                            - {boarding.status}
                                                        </Link>
                                                    </div>
                                                )
                                            );
                                        }
                                    )}
                                {ticketData &&
                                    ticketData.submitted_by.user_links.filter(
                                        p => p.type == "clearent"
                                    ).length > 0 && (
                                        <div className="text-muted">
                                            Clearent Reporting
                                        </div>
                                    )}
                                {ticketData &&
                                    ticketData.submitted_by.user_links
                                        .filter(p => p.type == "clearent")
                                        .map((clearent_reporting, key) => {
                                            return (
                                                <div key={key}>
                                                    <Link
                                                        to={`/reporting/clearent/accounts/${clearent_reporting.link_id}`}
                                                    >
                                                        {
                                                            clearent_reporting.link_id
                                                        }
                                                    </Link>
                                                </div>
                                            );
                                        })}
                                {ticketData &&
                                    ticketData.submitted_by.user_links.filter(
                                        p => p.type == "gift"
                                    ).length > 0 && (
                                        <div className="text-muted">
                                            Gift Card
                                        </div>
                                    )}
                                {ticketData &&
                                    ticketData.submitted_by.user_links
                                        .filter(p => p.type == "gift")
                                        .map((gift, key) => {
                                            return (
                                                <div key={key}>
                                                    <Link
                                                        to={`/reporting/clearent/accounts/${gift.link_id}`}
                                                    >
                                                        {gift.link_id}
                                                    </Link>
                                                </div>
                                            );
                                        })}
                            </div>
                            <br />
                        </div>
                    </Card>
                    <br />
                </Col>
            </Row>
        </div>
    );
};

export default TicketResponses;
