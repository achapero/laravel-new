import React, { useState, useEffect, useRef, useCallback } from "react";
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
import ModalUpdateTitle from "./Modals/ModalUpdateTitle";
import PageGuideConentAddEditModal from "./Modals/PageGuideConentAddEditModal";
import getCheckPermission from "../../../../providers/getCheckPermission";
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
    PlusCircleFilled,
    DoubleRightOutlined,
    RightSquareFilled,
    PlayCircleTwoTone,
    SwitcherTwoTone,
    RightCircleTwoTone,
    DiffTwoTone,
    DragOutlined,
    MenuOutlined
} from "@ant-design/icons";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { duration } from "moment";
import getUserData from "../../../../providers/getUserData";

import PageGuideAddEditModal from "./Modals/PageGuideAddEditModal";
import PageGuideModalSelectRole from "./Modals/PageGuideModalSelectRole";
import PageGuideSubAddEditModal from "./Modals/PageGuideSubAddEditModal.js";
import PageGuideSubConentAddEditModal from "./Modals/PageGuideSubConentAddEditModal";
import PageGuideSubSubAddEditModal from "./Modals/PageGuideSubSubAddEditModal";
import PageGuideSubSubConentAddEditModal from "./Modals/PageGuideSubSubConentAddEditModal";
import ModalMoveSub from "./Modals/ModalMoveSub";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PageGuideSideBar = ({
    history,
    match,
    match_id,
    title,
    refetchsub,
    permission
}) => {
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
            setCardGuides(res.data);
            setTimeout(() => getCheckPermission(permission), 500);
        }
    );

    const [subId, setSubId] = useState();
    useEffect(() => {
        console.log(match);
        var a = match.url.split("/");
        setSubId(a[4]);
        getGuides();
    }, [match]);

    const [showUpdateTitle, setShowUpdateTile] = useState(false);
    const [showUpdateTitleId, setShowUpdateTileId] = useState(0);
    const [showUpdateTitleData, setShowUpdateTileData] = useState("");
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const editGuide = (e, data) => {
        setShowUpdateTile(!showUpdateTitle);
        setShowUpdateTileData(data.title);
        setShowUpdateTileId(data.id);
        setUrl("api/v1/guide_new_edit");
        setText("Guide");
    };

    const [showAddeEditContentModal, setShowAddEditContentModal] = useState(
        false
    );
    const [showAddeEditContentId, setShowAddEditContentId] = useState(0);
    const [showAddeEditContentData, setShowAddEditContentData] = useState(0);
    const [addOnly, setAddOnly] = useState(true);

    const showModalAddGuideContent = (e, data) => {
        setShowAddEditContentModal(!showAddeEditContentModal);
        setAddOnly(true);
        setShowAddEditContentId(data.id);
    };

    const [showAddeSub, setShowAddAddeSub] = useState(false);
    const [showAddeSubId, setShowAddAddeSubId] = useState(0);
    const [addOnlySub, setAddOnlySub] = useState(true);

    const showModalAddSub = (e, data) => {
        setShowAddAddeSub(!showAddeSub);
        setAddOnlySub(true);
        setShowAddAddeSubId(data.id);
    };

    const [updateDataSub, setUpdateDataSub] = useState({});
    const showModalEditSub = (e, data) => {
        setAddOnlySub(false);
        setUpdateDataSub(data);
        setShowAddAddeSub(!showAddeEditContentModal);
        setShowAddAddeSubId(data.id);
    };

    const {
        mutate: mutateDeleteGuide,
        isLoading: isLoadingDeleteGuide
    } = useAxiosQuery("POST", "api/v1/guide/delete", "guides_new");

    const deleteGuide = (e, id) => {
        e.stopPropagation();
        mutateDeleteGuide(
            {
                id: id
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Guide Deleted Successfully"
                    });
                    history.push("/admin-guides");
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const {
        mutate: mutateDeleteGuideSub,
        isLoading: isLoadingDeleteGuideSub
    } = useAxiosQuery("POST", "api/v1/guide_sub/delete", `guide_sub`);

    const deleteGuideSub = id => {
        mutateDeleteGuideSub(
            {
                id: id
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Sub Guide Deleted Successfully"
                    });
                    getGuides();
                    var a = match.url;
                    var b = a.split("sub");

                    history.push(b[0]);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const [
        showAddeEditContentModalSub,
        setShowAddEditContentModalSub
    ] = useState(false);

    const [contentSubAdd, setContentSubAdd] = useState(false);
    const [contentSubData, setContentSubData] = useState({});
    const [contentSubId, setContentSubId] = useState(0);
    const showModalAddGuideContentSub = (e, data) => {
        setShowAddEditContentModalSub(!showAddeEditContentModalSub);
        setContentSubAdd(true);
        setContentSubData(data);
        setContentSubId(data.id);
    };

    const [showAddeSubSub, setShowAddAddeSubSub] = useState(false);
    const [showAddeSubSubId, setShowAddAddeSubSubId] = useState(0);
    const [addOnlySubSub, setAddOnlySubSub] = useState(true);

    const showModalAddSubSub = (e, data) => {
        setShowAddAddeSubSub(!showAddeSubSub);
        setAddOnlySubSub(true);
        setShowAddAddeSubSubId(data.id);
    };

    const [updateDataSubSub, setUpdateDataSubSub] = useState({});
    const showModalEditSubSub = (e, data) => {
        setAddOnlySubSub(false);
        setUpdateDataSubSub(data);
        setShowAddAddeSubSub(!showAddeSubSub);
        setShowAddAddeSubSubId(data.id);
    };

    const [
        showAddeEditContentModalSubSub,
        setShowAddEditContentModalSubSub
    ] = useState(false);
    const [contentSubSubAdd, setContentSubSubAdd] = useState(false);
    const [contentSubSubData, setContentSubSubData] = useState({});
    const [contentSubSubId, setContentSubSubId] = useState(0);

    const showModalAddGuideContentSubSub = (e, data) => {
        setShowAddEditContentModalSubSub(!showAddeEditContentModalSubSub);
        setContentSubSubAdd(true);
        setContentSubSubData(data);
        setContentSubSubId(data.id);
    };

    const {
        mutate: mutateDeleteGuideSubSub,
        isLoading: isLoadingDeleteGuideSubSub
    } = useAxiosQuery(
        "DELETE",
        "api/v1/guide_sub_subs",
        `guide_sub_sub${match.params.id}`
    );

    const deleteGuideSubSub = (e, id) => {
        mutateDeleteGuideSubSub(
            {
                id: id
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Sub Guide Deleted Successfully"
                    });
                    getGuides();
                    var a = match.url;
                    var b = a.split("sub-sub");

                    history.push(b[0]);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

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

    const menuGuide = data => (
        <Menu>
            <Menu.Item key="1">
                <Button
                    icon={<EditOutlined />}
                    onClick={e => editGuide(e, data)}
                    type="link"
                >
                    Update Title{" "}
                </Button>
            </Menu.Item>

            {/* <Menu.Item key="2">
                <Button
                    icon={<PlusCircleFilled />}
                    type="link"
                    onClick={e => showModalAddGuideContent(e, data)}
                >
                    Add Content{" "}
                </Button>
            </Menu.Item> */}
            {/* <Menu.Item key="3">
                <Button
                    icon={<PlusCircleFilled />}
                    type="link"
                    onClick={e => showModalAddSub(e, data)}
                >
                    Add Sub Item{" "}
                </Button>
            </Menu.Item> */}
            <Menu.Item key="4">
                <Button
                    icon={<DeleteFilled />}
                    type="link"
                    style={{ color: "rgb(248, 107, 1)" }}
                    onClick={e => deleteGuide(e, data.id)}
                    loading={isLoadingDeleteGuide}
                >
                    Delete
                </Button>
            </Menu.Item>
        </Menu>
    );

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
            {/* <Menu.Item key="3">
                <Button
                    icon={<PlusCircleFilled />}
                    type="link"
                    onClick={e => showModalAddSubSub(e, data)}
                    // loading={isLoadingDeleteGuide}
                >
                    Add Sub-Sub Item{" "}
                </Button>
            </Menu.Item> */}
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

    const menuSubSubGuide = data => (
        <Menu>
            <Menu.Item key="1">
                <Button
                    icon={<EditOutlined />}
                    onClick={e => showModalEditSubSub(e, data)}
                    type="link"
                >
                    Update Title{" "}
                </Button>
            </Menu.Item>

            {/* <Menu.Item key="2">
                <Button
                    icon={<PlusCircleFilled />}
                    type="link"
                    onClick={e => showModalAddGuideContentSubSub(e, data)}
                    // loading={isLoadingDeleteGuide}
                >
                    Add Content{" "}
                </Button>
            </Menu.Item> */}

            <Menu.Item key="4">
                <Button
                    icon={<DeleteFilled />}
                    type="link"
                    style={{ color: "rgb(248, 107, 1)" }}
                    onClick={e => deleteGuideSubSub(e, data.id)}
                    loading={isLoadingDeleteGuideSubSub}
                >
                    Delete
                </Button>
            </Menu.Item>
        </Menu>
    );

    const [modalMoveSub, setModalMoveSub] = useState(false);
    const [modalMoveSubData, setModalMoveSubData] = useState();
    const showModalMoveSub = (e, sub) => {
        setModalMoveSub(true);
        setModalMoveSubData({
            ...sub
        });
        console.log(sub);
    };

    const grid = 2;

    const key = "updatable";

    const getItemStyle = (isDragging, draggableStyle) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,
        cursor: "pointer",
        // change background colour if dragging
        background: isDragging ? "lightgreen" : "transparent",

        // styles we need to apply on draggables
        ...draggableStyle
    });

    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? "lightblue" : "transparent",
        padding: grid,
        cursor: "move",
        width: "100%"
    });

    const {
        mutate: mutateOndragEnd,
        isLoading: isLoadingOndragEnd
    } = useAxiosQuery("POST", "api/v1/guide/updateSort", "mutate_drag_end");

    const onDragEnd = result => {
        // dropped outside the list
        console.log(result);
        if (!result.destination) {
            return;
        } else {
            if (result.source.index != result.destination.index) {
                message.loading({
                    content: "Updating...",
                    key,
                    duration: 0
                });

                var arrayA = cardGuides;
                const res = arrayA;

                const [removed] = res.splice(result.source.index, 1);
                res.splice(result.destination.index, 0, removed);

                console.log("arrayA", res);

                mutateOndragEnd(
                    {
                        res: res
                    },
                    {
                        onSuccess: res => {
                            message.success({
                                content: "Updated Successfully!",
                                key
                            });
                            // getGuides();
                            // console.log(res);
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }
        }
    };

    const {
        mutate: mutateOndragEndSub,
        isLoading: isLoadingOndragEndSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_sub/updateSort",
        "mutate_drag_end_sub"
    );

    const onDragEndSub = (result, index) => {
        if (!result.destination) {
            return;
        } else {
            if (result.source.index != result.destination.index) {
                message.loading({
                    content: "Updating...",
                    key,
                    duration: 0
                });

                var arrayA = cardGuides;
                console.log(arrayA);
                const res = arrayA[index].merchant_guide_subs;
                const [removed] = res.splice(result.source.index, 1);
                res.splice(result.destination.index, 0, removed);

                arrayA[index].merchant_guide_subs = res;

                mutateOndragEndSub(
                    {
                        source: result.source.index,
                        destination: result.destination.index,
                        id: result.draggableId,
                        res: res
                    },
                    {
                        onSuccess: res => {
                            message.success({
                                content: "Updated Successfully!",
                                key
                            });
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }
        }
    };

    const {
        mutate: mutateOndragEndSubSub,
        isLoading: isLoadingOndragEndSubSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_sub_sub/updateSort",
        "mutate_drag_end_sub"
    );

    const onDragEndSubSub = (result, index, index2) => {
        if (!result.destination) {
            return;
        } else {
            if (result.source.index != result.destination.index) {
                message.loading({
                    content: "Updating...",
                    key,
                    duration: 0
                });

                var arrayA = cardGuides;
                const res =
                    arrayA[index].merchant_guide_subs[index2]
                        .merchant_guide_sub_subs;
                const [removed] = res.splice(result.source.index, 1);
                res.splice(result.destination.index, 0, removed);

                arrayA[index].merchant_guide_subs[
                    index2
                ].merchant_guide_sub_subs = res;

                mutateOndragEndSubSub(
                    {
                        source: result.source.index,
                        destination: result.destination.index,
                        id: result.draggableId,
                        res: res
                    },
                    {
                        onSuccess: res => {
                            message.success({
                                content: "Updated Successfully!",
                                key
                            });
                        },
                        onError: err => {
                            console.log(err);
                        }
                    }
                );
            }
        }
    };

    return (
        <div
            className="box-shadow-card-guide"
            style={{ border: " 1px solid #f0f0f0", minHeight: "50vh" }}
        >
            {cardGuides.length != 0 &&
                cardGuides.map((card, key) => (
                    <div
                        style={{
                            cursor: "pointer"
                        }}
                        key={key}
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
                                    <Col md={2}>
                                        <Dropdown
                                            overlay={() => menuGuide(card)}
                                            placement={"bottomLeft"}
                                        >
                                            <SettingOutlined
                                                className="edit_guide_btn"
                                                style={{
                                                    visibility:
                                                        match.params.id ==
                                                            card.id &&
                                                        title == card.title
                                                            ? "initial"
                                                            : "hidden",
                                                    marginTop: "5px"
                                                }}
                                                onClick={e =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        </Dropdown>{" "}
                                    </Col>
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
                                                to={`/admin-guides/${card.id}`}
                                            >
                                                {" "}
                                                <b>{card.title}</b>{" "}
                                            </Link>
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#40a9ff",
                                                    textDecoration: "underline"
                                                }}
                                                onClick={e =>
                                                    showModalAddSub(e, card)
                                                }
                                                className="add_guide_btn"
                                            >
                                                <PlusCircleFilled />
                                            </span>
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
                                        ` ${match_id == card.id ? "" : "hide"}`
                                    }
                                >
                                    <DragDropContext
                                        onDragEnd={e => onDragEndSub(e, key)}
                                    >
                                        <Droppable droppableId="droppable2">
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={getListStyle(
                                                        snapshot.isDraggingOver
                                                    )}
                                                >
                                                    {card.merchant_guide_subs &&
                                                        card.merchant_guide_subs.map(
                                                            (sub, subkey) => (
                                                                <Draggable
                                                                    key={
                                                                        "" +
                                                                        sub.id
                                                                    }
                                                                    draggableId={
                                                                        "" +
                                                                        sub.id
                                                                    }
                                                                    index={
                                                                        subkey
                                                                    }
                                                                >
                                                                    {(
                                                                        provided,
                                                                        snapshot
                                                                    ) => (
                                                                        <div
                                                                            ref={
                                                                                provided.innerRef
                                                                            }
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided
                                                                                    .draggableProps
                                                                                    .style
                                                                            )}
                                                                        >
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
                                                                                    <Col
                                                                                        md={
                                                                                            2
                                                                                        }
                                                                                    >
                                                                                        <Dropdown
                                                                                            overlay={() =>
                                                                                                menuSubGuide(
                                                                                                    sub
                                                                                                )
                                                                                            }
                                                                                            placement={
                                                                                                "bottomLeft"
                                                                                            }
                                                                                        >
                                                                                            <SettingOutlined
                                                                                                className="edit_guide_btn"
                                                                                                style={{
                                                                                                    visibility:
                                                                                                        match
                                                                                                            .params
                                                                                                            .id ==
                                                                                                            sub.id &&
                                                                                                        title ==
                                                                                                            sub.sub_title
                                                                                                            ? "initial"
                                                                                                            : "hidden",
                                                                                                    marginTop:
                                                                                                        "10px"
                                                                                                }}
                                                                                                onClick={e =>
                                                                                                    e.stopPropagation()
                                                                                                }
                                                                                            />
                                                                                        </Dropdown>{" "}
                                                                                    </Col>
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
                                                                                                            sub.id &&
                                                                                                        title ==
                                                                                                            sub.sub_title
                                                                                                            ? "#FE6933"
                                                                                                            : "black"
                                                                                                }}
                                                                                                to={`/admin-guides/${card.id}/sub/${sub.id}`}
                                                                                            >
                                                                                                -{" "}
                                                                                                {
                                                                                                    sub.sub_title
                                                                                                }{" "}
                                                                                            </Link>
                                                                                            <span
                                                                                                style={{
                                                                                                    fontSize:
                                                                                                        "12px",
                                                                                                    color:
                                                                                                        "#40a9ff"
                                                                                                }}
                                                                                                className="add_guide_btn"
                                                                                                onClick={e =>
                                                                                                    showModalAddSubSub(
                                                                                                        e,
                                                                                                        sub
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <PlusCircleOutlined />{" "}
                                                                                            </span>
                                                                                            <span
                                                                                                style={{
                                                                                                    fontSize:
                                                                                                        "13px",
                                                                                                    color:
                                                                                                        "#40a9ff"
                                                                                                }}
                                                                                                onClick={e =>
                                                                                                    showModalMoveSub(
                                                                                                        e,
                                                                                                        sub
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                <DragOutlined />
                                                                                            </span>

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
                                                                                    .length !=
                                                                                    0 && (
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
                                                                                        <DragDropContext
                                                                                            onDragEnd={e =>
                                                                                                onDragEndSubSub(
                                                                                                    e,
                                                                                                    key,
                                                                                                    subkey
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            <Droppable droppableId="droppable3">
                                                                                                {(
                                                                                                    provided,
                                                                                                    snapshot
                                                                                                ) => (
                                                                                                    <div
                                                                                                        {...provided.droppableProps}
                                                                                                        ref={
                                                                                                            provided.innerRef
                                                                                                        }
                                                                                                        style={getListStyle(
                                                                                                            snapshot.isDraggingOver
                                                                                                        )}
                                                                                                    >
                                                                                                        {sub.merchant_guide_sub_subs.map(
                                                                                                            (
                                                                                                                subsub,
                                                                                                                subsubkey
                                                                                                            ) => (
                                                                                                                <Draggable
                                                                                                                    key={
                                                                                                                        "" +
                                                                                                                        subsub.id
                                                                                                                    }
                                                                                                                    draggableId={
                                                                                                                        "" +
                                                                                                                        subsub.id
                                                                                                                    }
                                                                                                                    index={
                                                                                                                        subsubkey
                                                                                                                    }
                                                                                                                >
                                                                                                                    {(
                                                                                                                        provided,
                                                                                                                        snapshot
                                                                                                                    ) => (
                                                                                                                        <div
                                                                                                                            ref={
                                                                                                                                provided.innerRef
                                                                                                                            }
                                                                                                                            {...provided.draggableProps}
                                                                                                                            {...provided.dragHandleProps}
                                                                                                                            style={getItemStyle(
                                                                                                                                snapshot.isDragging,
                                                                                                                                provided
                                                                                                                                    .draggableProps
                                                                                                                                    .style
                                                                                                                            )}
                                                                                                                        >
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
                                                                                                                                    >
                                                                                                                                        <Dropdown
                                                                                                                                            overlay={() =>
                                                                                                                                                menuSubSubGuide(
                                                                                                                                                    subsub
                                                                                                                                                )
                                                                                                                                            }
                                                                                                                                            placement={
                                                                                                                                                "bottomLeft"
                                                                                                                                            }
                                                                                                                                        >
                                                                                                                                            <SettingOutlined
                                                                                                                                                className="edit_guide_btn"
                                                                                                                                                style={{
                                                                                                                                                    visibility:
                                                                                                                                                        match
                                                                                                                                                            .params
                                                                                                                                                            .id ==
                                                                                                                                                            subsub.id &&
                                                                                                                                                        title ==
                                                                                                                                                            subsub.sub_sub_title
                                                                                                                                                            ? "initial"
                                                                                                                                                            : "hidden",
                                                                                                                                                    marginTop:
                                                                                                                                                        "10px"
                                                                                                                                                }}
                                                                                                                                                onClick={e =>
                                                                                                                                                    e.stopPropagation()
                                                                                                                                                }
                                                                                                                                            />
                                                                                                                                        </Dropdown>{" "}
                                                                                                                                    </Col>
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
                                                                                                                                                to={`/admin-guides/${card.id}/sub/${sub.id}/sub-sub/${subsub.id}`}
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
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </Draggable>
                                                                                                            )
                                                                                                        )}
                                                                                                        {
                                                                                                            provided.placeholder
                                                                                                        }
                                                                                                    </div>
                                                                                                )}
                                                                                            </Droppable>
                                                                                        </DragDropContext>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        )}

                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

            <ModalUpdateTitle
                setShowUpdateTile={setShowUpdateTile}
                showUpdateTitle={showUpdateTitle}
                showUpdateTitleData={showUpdateTitleData}
                showUpdateTitleId={showUpdateTitleId}
                url={url}
                text={text}
                getGuides={getGuides}
            />

            <PageGuideConentAddEditModal
                showAddeEditContentModal={showAddeEditContentModal}
                setShowAddEditContentModal={setShowAddEditContentModal}
                addOnly={addOnly}
                params={showAddeEditContentId}
            />

            <PageGuideSubAddEditModal
                showAddeSub={showAddeSub}
                setShowAddAddeSub={setShowAddAddeSub}
                addOnlySub={addOnlySub}
                params={showAddeSubId}
                getGuides={getGuides}
                updateDataSub={updateDataSub}
                refetchsub={refetchsub}
            />

            <PageGuideSubConentAddEditModal
                showAddeEditContentModal={showAddeEditContentModalSub}
                setShowAddEditContentModal={setShowAddEditContentModalSub}
                addOnly={contentSubAdd}
                updateData={contentSubData}
                params={contentSubId}
            />

            <PageGuideSubSubAddEditModal
                showAddeSub={showAddeSubSub}
                setShowAddAddeSub={setShowAddAddeSubSub}
                addOnlySub={addOnlySubSub}
                updateDataSub={updateDataSubSub}
                params={showAddeSubSubId}
                getGuides={getGuides}
                refetchsub={refetchsub}
            />

            <PageGuideSubSubConentAddEditModal
                showAddeEditContentModal={showAddeEditContentModalSubSub}
                setShowAddEditContentModal={setShowAddEditContentModalSubSub}
                addOnly={contentSubSubAdd}
                updateData={contentSubSubData}
                params={contentSubSubId}
            />
            <ModalMoveSub
                setModalMoveSub={setModalMoveSub}
                modalMoveSub={modalMoveSub}
                cardGuides={cardGuides}
                modalMoveSubData={modalMoveSubData}
                history={history}
            />
        </div>
    );
};

export default PageGuideSideBar;
