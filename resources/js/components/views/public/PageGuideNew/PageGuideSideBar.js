import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Table,
    FormGroup,
    Label,
    CustomInput,
    notification,
    message,
    Menu,
    Dropdown,
    Tooltip,
    AutoComplete,
    Tag
} from "antd";

import { Link, useLocation, useHistory } from "react-router-dom";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    DownOutlined,
    RightOutlined,
    EyeOutlined,
    LoadingOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleFilled
} from "@ant-design/icons";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import { duration } from "moment";
import getUserData from "../../../providers/getUserData";

const PageGuideSideBar = ({ history, match, match_id, title, refetchsub }) => {
    let userdata = getUserData();
    const [cardGuides, setCardGuides] = useState([]);
    const {
        data: dataGuides,
        isLoading: isLoadingDataGuidesTable,
        refetch: getGuides,
        isFetching: isFetchingDataGuidesTable
    } = useAxiosQuery(
        "GET",
        `api/v1/guidesidebar?id=${match_id}`,
        "guides_page_sidebar",
        res => {
            console.log("@sidebar", res);

            if (userdata) {
                if (userdata.role != "Merchant") {
                    setCardGuides(res.data);
                } else {
                    var arr = [];
                    res.data.forEach(element => {
                        if (
                            element.visible == "All" ||
                            element.visible == null
                        ) {
                            arr.push(element);
                        }
                    });
                    setCardGuides(arr);
                }
            } else {
                var arr = [];
                res.data.forEach(element => {
                    if (element.visible == "All" || element.visible == null) {
                        arr.push(element);
                    }
                });
                setCardGuides(arr);
            }
        }
    );

    const [subId, setSubId] = useState();
    useEffect(() => {
        console.log(match);
        var a = match.url.split("/");
        setSubId(a[4]);
        getGuides();
    }, [match]);

    const onSelectGuideChevron = (e, id) => {
        e.stopPropagation();

        if (
            $(".CardGuide" + id)
                .find(".cardChildren" + id)
                .hasClass("hide")
        ) {
            $(".CardGuide" + id)
                .find(".cardChildren" + id)
                .removeClass("hide");
            $(".CardGuide" + id)
                .find(".iconGuide" + id)
                .removeClass("hide");
            $(".CardGuide" + id)
                .find(".iconGuideright" + id)
                .addClass("hide");
        } else {
            $(".CardGuide" + id)
                .find(".cardChildren" + id)
                .addClass("hide");

            $(".CardGuide" + id)
                .find(".iconGuide" + id)
                .addClass("hide");
            $(".CardGuide" + id)
                .find(".iconGuideright" + id)
                .removeClass("hide");
        }
    };

    const onSelectGuideSubChevron = (e, id) => {
        e.stopPropagation();

        if (
            $(".CardGuideSub" + id)
                .find(".cardChildrenSub" + id)
                .hasClass("hide")
        ) {
            $(".CardGuideSub" + id)
                .find(".cardChildrenSub" + id)
                .removeClass("hide");
            $(".CardGuideSub" + id)
                .find(".iconGuideSub" + id)
                .removeClass("hide");
            $(".CardGuideSub" + id)
                .find(".iconGuideSubright" + id)
                .addClass("hide");
        } else {
            $(".CardGuideSub" + id)
                .find(".cardChildrenSub" + id)
                .addClass("hide");

            $(".CardGuideSub" + id)
                .find(".iconGuideSub" + id)
                .addClass("hide");
            $(".CardGuideSub" + id)
                .find(".iconGuideSubright" + id)
                .removeClass("hide");
        }
    };

    const menuSubGuide = data => (
        <Menu>
            <Menu.Item key="1">
                <Button
                    icon={<EditOutlined />}
                    onClick={e => showModalEditSub(e, data)}
                    type="link"
                >
                    Update Title{" "}
                </Button>
            </Menu.Item>

            {/* <Menu.Item key="2">
                <Button
                    icon={<PlusCircleFilled />}
                    type="link"
                    onClick={e => showModalAddGuideContentSub(e, data)}
                    // loading={isLoadingDeleteGuide}
                >
                    Add Content{" "}
                </Button>
            </Menu.Item> */}
            <Menu.Item key="3">
                <Button
                    icon={<PlusCircleFilled />}
                    type="link"
                    onClick={e => showModalAddSubSub(e, data)}
                    // loading={isLoadingDeleteGuide}
                >
                    Add Sub-Sub Item{" "}
                </Button>
            </Menu.Item>
            <Menu.Item key="4">
                <Button
                    icon={<DeleteFilled />}
                    type="link"
                    style={{ color: "rgb(248, 107, 1)" }}
                    onClick={e => deleteGuideSub(data.id)}
                    loading={isLoadingDeleteGuideSub}
                >
                    Delete
                </Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <div
            className="box-shadow-card-guide"
            style={{ border: " 1px solid #f0f0f0", minHeight: "50vh" }}
        >
            {cardGuides.length != 0 &&
                cardGuides.map((card, index) => (
                    <div key={index}>
                        <div
                            style={{
                                cursor: "pointer"
                            }}
                            className={"CardGuide" + card.id}
                        >
                            <div
                                style={{
                                    padding: "10px"
                                }}
                            >
                                <div
                                    // onClick={() =>
                                    //     onSelectGuide(
                                    //         card.id,
                                    //         "CardGuide" + card.id,
                                    //         card.merchant_guide_subs.length,
                                    //         "guide"
                                    //     )
                                    // }
                                    style={{
                                        padding: "10px",
                                        paddingBottom: "0px"
                                    }}
                                >
                                    <Row>
                                        <Col md={2}></Col>
                                        <Col md={20}>
                                            <div
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                <Link
                                                    style={{
                                                        color:
                                                            match.params.id ==
                                                                card.id &&
                                                            title == card.title
                                                                ? "#FE6933"
                                                                : "black"
                                                    }}
                                                    to={`/guides/${card.id}`}
                                                >
                                                    {" "}
                                                    <b>{card.title}</b>{" "}
                                                </Link>
                                            </div>
                                        </Col>

                                        <Col md={2}>
                                            {card.merchant_guide_subs.length !=
                                                0 && (
                                                <span
                                                    style={{
                                                        float: "right"
                                                    }}
                                                >
                                                    {" "}
                                                    <DownOutlined
                                                        style={{
                                                            marginTop: "5px"
                                                        }}
                                                        onClick={e =>
                                                            onSelectGuideChevron(
                                                                e,
                                                                card.id
                                                            )
                                                        }
                                                        // className="cui-chevron-right icons d-block "
                                                        className={
                                                            match_id == card.id
                                                                ? `iconGuide` +
                                                                  card.id +
                                                                  ``
                                                                : `iconGuide` +
                                                                  card.id +
                                                                  ` hide`
                                                        }
                                                    ></DownOutlined>
                                                    <RightOutlined
                                                        style={{
                                                            marginTop: "5px"
                                                        }}
                                                        onClick={e =>
                                                            onSelectGuideChevron(
                                                                e,
                                                                card.id
                                                            )
                                                        }
                                                        // className="cui-chevron-right icons d-block "
                                                        className={
                                                            match_id == card.id
                                                                ? `iconGuideright` +
                                                                  card.id +
                                                                  ` hide`
                                                                : `iconGuideright` +
                                                                  card.id +
                                                                  ``
                                                        }
                                                    ></RightOutlined>
                                                </span>
                                            )}
                                        </Col>
                                    </Row>
                                </div>

                                {card.merchant_guide_subs.length != 0 && (
                                    <div
                                        className={
                                            `cardChildren` +
                                            card.id +
                                            ` ${
                                                match_id == card.id
                                                    ? ""
                                                    : "hide"
                                            }`
                                        }
                                    >
                                        {card.merchant_guide_subs.map(
                                            (sub, subkey) => (
                                                <div key={subkey}>
                                                    <div
                                                        // key={
                                                        //     subkey
                                                        // }
                                                        // onClick={() =>
                                                        //     onSelectGuideSub(
                                                        //         sub.id
                                                        //     )
                                                        // }
                                                        className={
                                                            "CardGuideSub" +
                                                            sub.id
                                                        }
                                                    >
                                                        <Row
                                                            style={{
                                                                paddingLeft:
                                                                    "28px"
                                                            }}
                                                        >
                                                            <Col md={2}></Col>
                                                            <Col md={20}>
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "5px",

                                                                        wordBreak:
                                                                            "break-all"
                                                                    }}
                                                                >
                                                                    <Link
                                                                        style={{
                                                                            color:
                                                                                match
                                                                                    .params
                                                                                    .id ==
                                                                                    sub.id &&
                                                                                title ==
                                                                                    sub.sub_title
                                                                                    ? "#FE6933"
                                                                                    : "black"
                                                                        }}
                                                                        to={`/guides/${card.id}/sub/${sub.id}`}
                                                                    >
                                                                        -{" "}
                                                                        {
                                                                            sub.sub_title
                                                                        }{" "}
                                                                    </Link>
                                                                    {sub
                                                                        .merchant_guide_sub_subs
                                                                        .length !=
                                                                        0 && (
                                                                        <span
                                                                            style={{
                                                                                marginLeft:
                                                                                    "5px"
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            <DownOutlined
                                                                                style={{
                                                                                    marginTop:
                                                                                        "5px"
                                                                                }}
                                                                                onClick={e =>
                                                                                    onSelectGuideSubChevron(
                                                                                        e,
                                                                                        sub.id
                                                                                    )
                                                                                }
                                                                                // className="cui-chevron-right icons d-block "
                                                                                className={
                                                                                    subId ==
                                                                                    sub.id
                                                                                        ? `iconGuideSub` +
                                                                                          sub.id +
                                                                                          ``
                                                                                        : `iconGuideSub` +
                                                                                          sub.id +
                                                                                          ` hide`
                                                                                }
                                                                            ></DownOutlined>
                                                                            <RightOutlined
                                                                                style={{
                                                                                    marginTop:
                                                                                        "5px"
                                                                                }}
                                                                                onClick={e =>
                                                                                    onSelectGuideSubChevron(
                                                                                        e,
                                                                                        sub.id
                                                                                    )
                                                                                }
                                                                                // className="cui-chevron-right icons d-block "
                                                                                className={
                                                                                    subId ==
                                                                                    sub.id
                                                                                        ? `iconGuideSubright` +
                                                                                          sub.id +
                                                                                          ` hide`
                                                                                        : `iconGuideSubright` +
                                                                                          sub.id +
                                                                                          ``
                                                                                }
                                                                            ></RightOutlined>
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        {sub
                                                            .merchant_guide_sub_subs
                                                            .length != 0 && (
                                                            <div
                                                                className={
                                                                    "cardChildrenSub" +
                                                                    sub.id +
                                                                    ` ${
                                                                        subId ==
                                                                        sub.id
                                                                            ? ""
                                                                            : "hide"
                                                                    }`
                                                                }
                                                            >
                                                                {sub.merchant_guide_sub_subs.map(
                                                                    (
                                                                        subsub,
                                                                        subsubkey
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                subsubkey
                                                                            }
                                                                            // onClick={e =>
                                                                            //     onSelectGuideSubSub(
                                                                            //         e,
                                                                            //         subsub.id
                                                                            //     )
                                                                            // }
                                                                        >
                                                                            <Row
                                                                                style={{
                                                                                    paddingLeft:
                                                                                        "53px"
                                                                                }}
                                                                            >
                                                                                <Col
                                                                                    md={
                                                                                        2
                                                                                    }
                                                                                ></Col>
                                                                                <Col
                                                                                    md={
                                                                                        20
                                                                                    }
                                                                                >
                                                                                    <div
                                                                                        style={{
                                                                                            marginTop:
                                                                                                "5px",

                                                                                            wordBreak:
                                                                                                "break-all"
                                                                                        }}
                                                                                    >
                                                                                        <Link
                                                                                            style={{
                                                                                                color:
                                                                                                    match
                                                                                                        .params
                                                                                                        .id ==
                                                                                                        subsub.id &&
                                                                                                    title ==
                                                                                                        subsub.sub_sub_title
                                                                                                        ? "#FE6933"
                                                                                                        : "black"
                                                                                            }}
                                                                                            to={`/guides/${card.id}/sub/${sub.id}/sub-sub/${subsub.id}`}
                                                                                        >
                                                                                            --{" "}
                                                                                            {
                                                                                                subsub.sub_sub_title
                                                                                            }
                                                                                        </Link>
                                                                                    </div>
                                                                                </Col>
                                                                            </Row>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default PageGuideSideBar;
