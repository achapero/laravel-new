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
    notification,
    Popconfirm
} from "antd";

import { dateDiff } from "../../../../providers/dateDiff";
import moment from "moment";
import PageTicketUpdateStatus from "./Modals/PageTicketUpdateStatusModal";
import { Editor } from "@tinymce/tinymce-react";
import { Link } from "react-router-dom";
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
    SendOutlined,
    CheckCircleOutlinedm,
    ArrowLeftOutlined
} from "@ant-design/icons";

import PageTicketNotes from "./PageTicketNotes";

const TicketResponses = ({ match, history }) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let status_change = urlParams.get("status");

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
    const [ticketDataEmail, setTicketDataEmail] = useState();
    const [ticketDataImage, setTicketDataImage] = useState();
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
                    // console.log(err);
                }
            }
        );
    };

    // useEffect(() => {
    //     getOldestTicketAwaitingReplyStatus();
    // }, []);

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
            if (res.success) {
                console.log("THETICKET", res);
                setTicketData(res.ticket);
                setTicketDataEmail(
                    res.ticket.submitted_by.preferred_email == "" ||
                        res.ticket.submitted_by.preferred_email == "null" ||
                        res.ticket.submitted_by.preferred_email == null
                        ? res.ticket.submitted_by.email
                        : res.ticket.submitted_by.preferred_email
                );
                let type = res.ticket.image_url
                    ? res.ticket.image_url.split("/")
                    : "";
                setTicketDataImage(
                    type[0] == "https:"
                        ? res.ticket.image_url
                        : window.location.origin +
                              "/storage/" +
                              res.ticket.image_url
                );

                setStatus(res.ticket.ticket_status);

                if (status_change) {
                    if (status_change != res.ticket.ticket_status) {
                        mutateUpdatesubmit(
                            {
                                ticket_status: status_change,
                                status_change_updated_at: moment().format(
                                    "YYYY-MM-DD HH:mm:ss"
                                )
                            },
                            {
                                onSuccess: res => {
                                    if (res.success) {
                                        notification.success({
                                            message:
                                                "Ticket Status Successfully Updated"
                                        });
                                        // setShowSubmitModal(!showSubmitModal);
                                        getTicketResponses();
                                    }
                                }
                            }
                        );
                    }
                }

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
        "ticket_responses_ticket"
    );

    const handleSubmitReply = () => {
        // console.log(
        //     "@whoseemail",
        //     ticketData.submitted_by.preferred_email
        //         ? ticketData.submitted_by.preferred_email
        //         : ticketData.submitted_by.email
        // );
        let formData = new FormData();
        formData.append("attachment_url", responseData.attachment_url || "");
        formData.append("response", responseData.response || "");
        formData.append("is_sensitive", responseData.is_sensitive || "");
        formData.append("ticket_id", match.params.id);
        formData.append("full_name", ticketData.submitted_by.name);
        formData.append("ticket_subject", ticketData.ticket_subject);
        formData.append("submitted_by", userdata.id);
        formData.append(
            "is_pan",
            responseData.is_pan ||
                ticketData.ticket_subject.indexOf("Request for Full PAN") !== -1
                ? true
                : false
        );
        formData.append("email", ticketDataEmail);

        // console.log("full_name", ticketData.submitted_by.name)
        // console.log("email", ticketDataEmail)

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
        `api/v1/ticket/${match.params.id}`,
        `ticketresponsesubmit_update_${match.params.id}`
    );

    const Updatesubmit = () => {
        // mutateUpdatesubmit(
        //     {
        //         ticket_status: status
        //     },
        //     {
        //         onSuccess: res => {
        //             if (res.success) {
        //                 notification.success({
        //                     message: "Ticket Status Successfully Updated"
        //                 });
        //                 // setShowSubmitModal(!showSubmitModal);
        //                 getTicketResponses();
        //             }
        //         }
        //     }
        // );
    };

    const updateField = e => {
        // setStatus(e);
        if (e) {
            mutateUpdatesubmit(
                {
                    ticket_status: e,
                    status_change_updated_at: moment().format(
                        "YYYY-MM-DD HH:mm:ss"
                    )
                },
                {
                    onSuccess: res => {
                        if (res.success) {
                            notification.success({
                                message: "Ticket Status Successfully Updated"
                            });
                            // setShowSubmitModal(!showSubmitModal);
                            getTicketResponses();
                        }
                    }
                }
            );
        }
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
        let _response = response.split('<br><div className="gmail_quote">');
        _response = _response[0];
        return _response;
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
            if (res.success) {
                let _options = [];
                // console.log("mcc_codes", res);
                res.data.map((admin, key) => {
                    _options.push({
                        label: admin.name,
                        value: admin.id,
                        role: admin.role
                    });
                    // if (admin.role != "Merchant")
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

    // const handleChangeAssignedTo = (user) => {
    const handleChangeAssignedTo = (event, option) => {
        // console.log(option)
        // let a = optionsAdmins.find(el => el.value == user);

        let data = {
            ticket_id: match.params.id,
            assigned_to: option.value,
            role: option["data-role"]
        };

        mutatehandleChangeAssignedTo(data, {
            onSuccess: res => {
                if (res.success) {
                    getTicketResponses();
                } else {
                    // console.log(res);
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

    const {
        mutate: mutateGetSameContentToMerge,
        isLoading: isLoadingGetSameContentToMerge
    } = useAxiosQuery(
        "POST",
        "api/v1/ticketresponses/getSameContentToMerge",
        "ticket_responses_getSameContentToMerge"
    );

    useEffect(() => {
        getSameContentMerge();
    }, []);

    const [sameContentTickets, setSameContentTickets] = useState([]);

    const getSameContentMerge = () => {
        mutateGetSameContentToMerge(
            { id: match.params.id },
            {
                onSuccess: res => {
                    if (res.success) {
                        // console.log("same", res);
                        setSameContentTickets(res.data);
                    }
                }
            }
        );
    };

    const [showMergeButton, setShowMergeButton] = useState(false);
    const [selectedId, setSelectId] = useState([]);
    const handleSelectToMerge = value => {
        setSelectId(value);
        setShowMergeButton(true);
    };

    const {
        mutate: mutateMergeTicket,
        isLoading: isLoadingMergeTicket
    } = useAxiosQuery("POST", "api/v1/ticket/merge", "mutate_merge_ticket");

    const mergeTicket = () => {
        var obj = [];
        var _ids = [parseInt(match.params.id), ...selectedId];
        _ids.map(e => {
            obj.push({ id: e });
        });

        mutateMergeTicket(
            { ids: obj },
            {
                onSuccess: res => {
                    if (res.success) {
                        // console.log("@merge", res.message);
                        if (res.message == "all good") {
                            notification.success({
                                message: "Ticket Successfully Merge"
                            });
                            window.location.reload();
                        } else {
                            notification.error({
                                message: res.message
                            });
                        }
                    }
                },
                onError: err => {
                    // console.log(err);
                }
            }
        );
    };

    const [changeMerchant, setChangeMerchant] = useState(false);
    const [optionsMerhants, setOptionsMerhants] = useState([]);

    const {} = useAxiosQuery(
        "GET",
        "api/v1/users?only=Merchant",
        "users_get_merchant_ticketresponses",
        res => {
            if (res.success) {
                let _options = [];
                // console.log("mcc_codes", res);
                res.data.map((admin, key) => {
                    _options.push({
                        merchant: admin.user_fields
                            ? admin.user_fields.merchant_name
                            : "",
                        label: admin.name,
                        email: admin.email,
                        value: admin.id,
                        role: admin.role
                    });
                    // if (admin.role != "Merchant")
                });
                setOptionsMerhants(_options);
            }
        }
    );

    const onChangeMerchant = value => {
        // console.log(value)
        if (value) {
            let data = {
                id: match.params.id,
                submitted_by: value,
                updated_by_user_id: userdata.id
            };
            mutateUpdateMerchant(data, {
                onSuccess: res => {
                    if (res.success) {
                        setChangeMerchant(false);
                    }
                }
            });
        }
    };

    const {
        mutate: mutateUpdateMerchant,
        isLoading: isLoadingUpdateMerchant
    } = useAxiosQuery(
        `POST`,
        `api/v1/ticket/updateMerchant`,
        `get_ticket_responsedata`
    );

    return (
        <div style={{ padding: 20 }}>
            <Row gutter={12}>
                <Col md={16}>
                    <Card>
                        <div
                            style={{
                                position: "relative",
                                left: "-15px",
                                top: "-10px"
                            }}
                        >
                            <Button
                                icon={<ArrowLeftOutlined />}
                                type="link"
                                onClick={e => {
                                    history.push("/tickets");
                                }}
                            >
                                Back to Tickets
                            </Button>
                        </div>
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
                                    let image_type = response.image_url
                                        ? response.image_url.split("/")
                                        : "";
                                    return (
                                        <div key={key}>
                                            <img
                                                src={
                                                    image_type[0] == "https:"
                                                        ? response.image_url
                                                        : window.location
                                                              .origin +
                                                          "/storage/" +
                                                          response.image_url
                                                }
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
                                                    download={`${window.location.origin}/storage/${response.attachment_url}`}
                                                    href={`${window.location.origin}/storage/${response.attachment_url}`}
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
                                    src={ticketDataImage}
                                    width="40"
                                    className=" pull-left mr-2"
                                    style={{
                                        marginRight: 5,
                                        borderRadius: "50%"
                                    }}
                                />
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
                                <div className="pre-line mt-3">
                                    Created By:{" "}
                                    {ticketData && ticketData.name_created_by
                                        ? ticketData.name_created_by
                                        : ""}
                                </div>
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
                                    {userdata.role != "Merchant" ? (
                                        <>
                                            {ticketData && (
                                                <Select
                                                    showSearch
                                                    placeholder="Select Status..."
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    filterSort={(
                                                        optionA,
                                                        optionB
                                                    ) =>
                                                        optionA.children
                                                            .toLowerCase()
                                                            .localeCompare(
                                                                optionB.children.toLowerCase()
                                                            )
                                                    }
                                                    onChange={e =>
                                                        updateField(e)
                                                    }
                                                    style={{ width: "100%" }}
                                                    value={
                                                        ticketData.ticket_status
                                                    }
                                                >
                                                    <Select.Option
                                                        key="Awaiting Customer Reply"
                                                        value="Awaiting Customer Reply"
                                                    >
                                                        Awaiting Customer Reply
                                                    </Select.Option>
                                                    <Select.Option
                                                        key="Awaiting Support Reply"
                                                        value="Awaiting Support Reply"
                                                    >
                                                        Awaiting Support Reply
                                                    </Select.Option>
                                                    <Select.Option
                                                        key="On Hold"
                                                        value="On Hold"
                                                    >
                                                        On Hold
                                                    </Select.Option>
                                                    <Select.Option
                                                        key="Closed"
                                                        value="Closed"
                                                    >
                                                        Closed
                                                    </Select.Option>
                                                    <Select.Option
                                                        key="Archived"
                                                        value="Archived"
                                                    >
                                                        Archive
                                                    </Select.Option>
                                                </Select>
                                            )}
                                        </>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="text-muted">
                                    Search Assigned Admin
                                </div>
                                {userdata.role == "Merchant"
                                    ? ""
                                    : ticketData && (
                                          <Select
                                              showSearch
                                              placeholder="Search Assigned Admin..."
                                              filterOption={(input, option) =>
                                                  option.children
                                                      .toLowerCase()
                                                      .indexOf(
                                                          input.toLowerCase()
                                                      ) >= 0
                                              }
                                              filterSort={(optionA, optionB) =>
                                                  optionA.children
                                                      .toLowerCase()
                                                      .localeCompare(
                                                          optionB.children.toLowerCase()
                                                      )
                                              }
                                              defaultValue={
                                                  ticketData.assigned_to
                                                      ? ticketData.assigned_to
                                                            .id
                                                      : null
                                              }
                                              onChange={handleChangeAssignedTo}
                                              style={{ width: "100%" }}
                                          >
                                              {optionsAdmins.map((el, key) => {
                                                  return (
                                                      <Select.Option
                                                          value={el.value}
                                                          data-role={el.role}
                                                          key={key}
                                                      >
                                                          {el.label}
                                                      </Select.Option>
                                                  );
                                              })}
                                          </Select>
                                      )}
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
                                {changeMerchant == false && (
                                    <>
                                        <div className="text-muted">
                                            Email
                                            <Popconfirm
                                                title="Are you sure you want to change merchant?"
                                                okText="Comfirm"
                                                cancelText="Cancel"
                                                onConfirm={e =>
                                                    setChangeMerchant(true)
                                                }
                                            >
                                                <Button type="link">
                                                    Change Merchant
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                        <div>
                                            {ticketData &&
                                                ticketData.submitted_by
                                                    .name}{" "}
                                            (
                                            {ticketData &&
                                                ticketData.submitted_by
                                                    .user_fields &&
                                                ticketData.submitted_by
                                                    .user_fields.merchant_name}
                                            )
                                        </div>
                                    </>
                                )}
                                {changeMerchant == true && (
                                    <>
                                        <div className="text-muted">
                                            Email
                                            <Button
                                                onClick={e =>
                                                    setChangeMerchant(false)
                                                }
                                                type="link"
                                                danger
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Change Merchant"
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                        input.toLowerCase()
                                                    ) >= 0
                                            }
                                            filterSort={(optionA, optionB) =>
                                                optionA.children
                                                    .toLowerCase()
                                                    .localeCompare(
                                                        optionB.children.toLowerCase()
                                                    )
                                            }
                                            style={{ width: "100%" }}
                                            onChange={e => onChangeMerchant(e)}
                                        >
                                            {optionsMerhants.map((el, key) => {
                                                let name_label =
                                                    el.label +
                                                    " (" +
                                                    el.merchant +
                                                    ")";
                                                return (
                                                    <Select.Option
                                                        value={el.value}
                                                        key={key}
                                                    >
                                                        {name_label}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
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

                        {userdata.role == "Super Admin" && (
                            <>
                                {" "}
                                <Divider style={{ margin: "10px 0" }}></Divider>
                                <Title level={5}> Select Ticket To Merge</Title>
                                <Select
                                    showSearch
                                    mode="multiple"
                                    allowClear
                                    placeholder={
                                        sameContentTickets.length == 0
                                            ? "No Mergable Tickets..."
                                            : "Select Tickets..."
                                    }
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={e => handleSelectToMerge(e)}
                                    filterSort={(optionA, optionB) =>
                                        optionA.children
                                            .toLowerCase()
                                            .localeCompare(
                                                optionB.children.toLowerCase()
                                            )
                                    }
                                    style={{ width: "100%" }}
                                    disabled={
                                        sameContentTickets.length == 0
                                            ? true
                                            : false
                                    }
                                >
                                    {sameContentTickets &&
                                        sameContentTickets.map((el, key) => {
                                            return (
                                                <Select.Option
                                                    value={el.id}
                                                    key={key}
                                                >
                                                    {el.ticket_subject}
                                                </Select.Option>
                                            );
                                        })}
                                </Select>
                                {showMergeButton && (
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        loading={isLoadingMergeTicket}
                                        style={{
                                            marginTop: "10px"
                                        }}
                                        onClick={() => mergeTicket()}
                                    >
                                        Merge Ticket
                                    </Button>
                                )}
                            </>
                        )}
                    </Card>
                    <br />
                    <Row>
                        <Col md={24}>
                            <div>
                                {ticketAwaitSupportReplyId && (
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            slideticket();
                                        }}
                                        style={{ width: "100%" }}
                                    >
                                        Next Unanswered Ticket
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>

                    {userdata.role != "Merchant" && (
                        <Row>
                            <Col md={24}>
                                <PageTicketNotes ticket_id={match.params.id} />
                            </Col>
                        </Row>
                    )}

                    <PageTicketUpdateStatus
                        showSubmitModal={showSubmitModal}
                        handleToggleSubmitModal={handleToggleSubmitModal}
                        updateField={updateField}
                        ticketData={ticketData}
                        submitButtonTextUpdate={submitButtonTextUpdate}
                        Updatesubmit={Updatesubmit}
                        success={success}
                        status={status}
                        setShowSubmitModal={setShowSubmitModal}
                        isLoadingMutateUpdatesubmit={
                            isLoadingMutateUpdatesubmit
                        }
                    />
                </Col>
            </Row>
        </div>
    );
};

export default TicketResponses;
