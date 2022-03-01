import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Input, Button, Modal, Form } from "antd";
import PageGuideSub from "./PageGuideSub";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
    LoadingOutlined
} from "@ant-design/icons";

const PageGuideCardTitle = ({
    getListStyle,
    getItemStyle,
    onSelectGuide,
    onSelectGuideSub,
    search,
    handleAddNewGuide,
    iconGuideSelected,
    showSelectIconsModal,
    newGuideDetails,
    setNewGuideDetails,
    onDragEnd,
    cardGuides,
    showViewRoleModal,
    editGuideSub,
    editGuide,
    deleteGuide,
    onDragEndSub,
    deleteGuideSub,
    handleAddNewGuideSub,
    showLoading,
    isLoadingAddNewGuide,
    isLoadingDeleteGuide,
    isLoadingAddNewGuideSub,
    isLoadingDeleteGuideSub,
    addSub,
    addSubSub,
    editSubSub,
    deleteGuideSubSub,
    onSelectGuideSubSub,
    onSelectGuideSubChevron,
    onSelectGuideChevron,
    onDragEndSubSub
}) => {
    // notify();
    return (
        <>
            {/* {isLoadingAddNewGuide ||
                (isLoadingDeleteGuide && (
                    <div className="overlay">
                        <LoadingOutlined className="loading-center" />
                    </div>
                ))} */}
            <div
                style={{
                    backgroundColor: "#1e9ecb",
                    borderColor: "#187da0",
                    color: "#fff",
                    padding: "15px"
                }}
            >
                <span>
                    <Input
                        type="text"
                        style={{
                            height: "100%",
                            minWidth: 200
                        }}
                        name="search"
                        placeholder="Search"
                        onChange={e => search(e)}
                    />
                </span>
            </div>
            <Card>
                <div style={{ backgroundColor: "#f7f7f7" }}>
                    <div
                        style={{
                            position: "relative",
                            width: "100%"
                        }}
                    >
                        <Card
                            style={{
                                backgroundColor: "#fff",
                                boxShadow: "0 0 5px 2px rgba(0,0,0,0.1)",
                                marginBottom: 5
                            }}
                        >
                            <div style={{ display: "flex" }}>
                                {iconGuideSelected ? (
                                    <i
                                        className={`fa fa-${iconGuideSelected}`}
                                        style={{
                                            fontSize: "32px",
                                            paddingRight: 13,
                                            paddingLeft: 5,
                                            paddingTop: 5,
                                            width: 55,
                                            color: "#20a8d8"
                                        }}
                                        onClick={e =>
                                            showSelectIconsModal(null, "add")
                                        }
                                    ></i>
                                ) : (
                                    // <img
                                    //     src="https://img.icons8.com/color/48/000000/image.png"
                                    // style={{
                                    //     paddingRight: 15,
                                    //     height: 40,
                                    //     width: 55,
                                    //     cursor: "pointer"
                                    // }}
                                    // onClick={e =>
                                    //     showSelectIconsModal(
                                    //         null,
                                    //         "add"
                                    //     )
                                    // }
                                    // />

                                    <i
                                        className={`fa fa-plus`}
                                        style={{
                                            fontSize: "32px",
                                            paddingRight: 13,
                                            paddingLeft: 5,
                                            paddingTop: 5,
                                            width: 55,
                                            color: "#20a8d8",
                                            cursor: "pointer"
                                        }}
                                        onClick={e =>
                                            showSelectIconsModal(null, "add")
                                        }
                                    ></i>
                                )}

                                <p
                                    style={{
                                        lineHeight: 2.4,
                                        marginBottom: 0,
                                        borderLeft: "1px solid grey",
                                        paddingLeft: 15
                                    }}
                                >
                                    <Input
                                        style={{
                                            height: "100%",
                                            minWidth: 220
                                        }}
                                        value={newGuideDetails.title}
                                        onChange={e =>
                                            setNewGuideDetails({
                                                ...newGuideDetails,
                                                title: e.target.value
                                            })
                                        }
                                        placeholder="New Top Level Guide Title"
                                        className="pageguidecardtitleinput"
                                    />
                                </p>
                                <div
                                    className="text-right"
                                    style={{ width: "100%" }}
                                >
                                    <a
                                        style={{
                                            lineHeight: 2.4,
                                            backgroundColor: "transparent",
                                            border: "none",
                                            color: "#20a8d8",
                                            cursor: "pointer",
                                            marginRight: "15px"
                                        }}
                                        onClick={e => {
                                            handleAddNewGuide(e);
                                        }}
                                    >
                                        add{" "}
                                        {isLoadingAddNewGuide ? (
                                            <LoadingOutlined />
                                        ) : (
                                            <PlusCircleOutlined />
                                        )}
                                    </a>
                                </div>
                            </div>
                        </Card>

                        {/* loop here */}
                        <DragDropContext onDragEnd={e => onDragEnd(e)}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(
                                            snapshot.isDraggingOver
                                        )}
                                    >
                                        {cardGuides.length != 0 &&
                                            cardGuides.map((card, index) => (
                                                <Draggable
                                                    key={"" + card.id}
                                                    draggableId={"" + card.id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
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
                                                            <Card
                                                                style={{
                                                                    backgroundColor:
                                                                        card.visible ==
                                                                        "Admin"
                                                                            ? "rgb(232,232,232)"
                                                                            : "white",
                                                                    boxShadow:
                                                                        "0 0 5px 2px rgba(0,0,0,0.1)",
                                                                    marginBottom: 10,
                                                                    cursor:
                                                                        "pointer"
                                                                }}
                                                                className={
                                                                    "CardGuide" +
                                                                    card.id
                                                                }
                                                            >
                                                                <div
                                                                    style={{
                                                                        backgroundColor:
                                                                            card.visible ==
                                                                            "Admin"
                                                                                ? "rgb(232,232,232)"
                                                                                : "white",
                                                                        paddingTop:
                                                                            "10px"
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            position:
                                                                                "absolute",
                                                                            right:
                                                                                "0",
                                                                            marginRight:
                                                                                "10px",
                                                                            marginTop:
                                                                                "-10px",
                                                                            top:
                                                                                "18px"
                                                                        }}
                                                                        onClick={() => {
                                                                            showViewRoleModal(
                                                                                card.id,
                                                                                card.visible
                                                                            );
                                                                        }}
                                                                    >
                                                                        <EyeOutlined
                                                                            className="fa fa-eye"
                                                                            aria-hidden="true"
                                                                            style={{
                                                                                color:
                                                                                    card.visible ==
                                                                                    "Admin"
                                                                                        ? "#e75480"
                                                                                        : "black"
                                                                            }}
                                                                        ></EyeOutlined>
                                                                    </div>

                                                                    <div
                                                                        onClick={() =>
                                                                            onSelectGuide(
                                                                                card.id,
                                                                                "CardGuide" +
                                                                                    card.id,
                                                                                card
                                                                                    .merchant_guide_subs
                                                                                    .length,
                                                                                "guide"
                                                                            )
                                                                        }
                                                                        style={{
                                                                            marginBottom:
                                                                                "5px"
                                                                        }}
                                                                    >
                                                                        <Row>
                                                                            <Col
                                                                                md={
                                                                                    3
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                <i
                                                                                    className={`fa fa-${card.icon}`}
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "32px",
                                                                                        paddingRight: 13,
                                                                                        paddingLeft: 5,
                                                                                        paddingTop: 5,
                                                                                        width: 55,
                                                                                        color:
                                                                                            "#20a8d8",
                                                                                        marginRight:
                                                                                            "6px"
                                                                                    }}
                                                                                    onClick={e =>
                                                                                        showSelectIconsModal(
                                                                                            index,
                                                                                            "update"
                                                                                        )
                                                                                    }
                                                                                ></i>
                                                                            </Col>
                                                                            <Col
                                                                                md={
                                                                                    18
                                                                                }
                                                                                style={{
                                                                                    borderLeft:
                                                                                        "1px solid grey"
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                <div
                                                                                    style={{
                                                                                        paddingLeft: 15,
                                                                                        fontSize:
                                                                                            "16px"
                                                                                    }}
                                                                                >
                                                                                    {" "}
                                                                                    <b>
                                                                                        {
                                                                                            card.title
                                                                                        }
                                                                                    </b>{" "}
                                                                                </div>
                                                                                <a
                                                                                    onClick={() =>
                                                                                        editGuide(
                                                                                            card.id,
                                                                                            card.icon
                                                                                        )
                                                                                    }
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "11px",
                                                                                        textDecoration:
                                                                                            "underline",
                                                                                        color:
                                                                                            "#20a8d8",

                                                                                        marginLeft:
                                                                                            "8px"
                                                                                    }}
                                                                                >
                                                                                    edit
                                                                                </a>
                                                                                <a
                                                                                    onClick={() =>
                                                                                        deleteGuide(
                                                                                            card.id
                                                                                        )
                                                                                    }
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "11px",
                                                                                        textDecoration:
                                                                                            "underline",

                                                                                        color:
                                                                                            "#f86c6b",

                                                                                        marginLeft:
                                                                                            "8px"
                                                                                    }}
                                                                                >
                                                                                    delete{" "}
                                                                                </a>
                                                                                <a
                                                                                    onClick={() =>
                                                                                        addSub(
                                                                                            card.id
                                                                                        )
                                                                                    }
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "11px",
                                                                                        textDecoration:
                                                                                            "underline",
                                                                                        color:
                                                                                            "rgb(76, 189, 116)",
                                                                                        marginLeft:
                                                                                            "8px"
                                                                                    }}
                                                                                >
                                                                                    add
                                                                                    sub{" "}
                                                                                </a>
                                                                            </Col>

                                                                            <Col
                                                                                md={
                                                                                    3
                                                                                }
                                                                            >
                                                                                {card
                                                                                    .merchant_guide_subs
                                                                                    .length !=
                                                                                    0 && (
                                                                                    <span
                                                                                        style={{
                                                                                            float:
                                                                                                "right"
                                                                                        }}
                                                                                    >
                                                                                        {" "}
                                                                                        <DownOutlined
                                                                                            style={{
                                                                                                lineHeight: 2.4
                                                                                            }}
                                                                                            onClick={e =>
                                                                                                onSelectGuideChevron(
                                                                                                    e,
                                                                                                    card.id
                                                                                                )
                                                                                            }
                                                                                            // className="cui-chevron-right icons d-block "
                                                                                            className={
                                                                                                "iconGuide" +
                                                                                                card.id +
                                                                                                ""
                                                                                            }
                                                                                        ></DownOutlined>
                                                                                        <RightOutlined
                                                                                            style={{
                                                                                                lineHeight: 2.4
                                                                                            }}
                                                                                            onClick={e =>
                                                                                                onSelectGuideChevron(
                                                                                                    e,
                                                                                                    card.id
                                                                                                )
                                                                                            }
                                                                                            // className="cui-chevron-right icons d-block "
                                                                                            className={
                                                                                                "iconGuideright" +
                                                                                                card.id +
                                                                                                " hide"
                                                                                            }
                                                                                        ></RightOutlined>
                                                                                    </span>
                                                                                )}
                                                                            </Col>
                                                                        </Row>
                                                                    </div>

                                                                    {card
                                                                        .merchant_guide_subs
                                                                        .length !=
                                                                        0 && (
                                                                        <div
                                                                            style={{
                                                                                marginTop:
                                                                                    "10px"
                                                                            }}
                                                                            className={
                                                                                "cardChildren" +
                                                                                card.id +
                                                                                ""
                                                                            }
                                                                        >
                                                                            <DragDropContext
                                                                                onDragEnd={e =>
                                                                                    onDragEndSub(
                                                                                        e,
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Droppable droppableId="droppable2">
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
                                                                                            style={{
                                                                                                marginLeft:
                                                                                                    "45px",
                                                                                                background:
                                                                                                    "#f7f7f7"
                                                                                            }}
                                                                                        >
                                                                                            <PageGuideSub
                                                                                                card={
                                                                                                    card
                                                                                                }
                                                                                                getItemStyle={
                                                                                                    getItemStyle
                                                                                                }
                                                                                                getListStyle={
                                                                                                    getListStyle
                                                                                                }
                                                                                                addSubSub={
                                                                                                    addSubSub
                                                                                                }
                                                                                                deleteGuideSub={
                                                                                                    deleteGuideSub
                                                                                                }
                                                                                                editGuideSub={
                                                                                                    editGuideSub
                                                                                                }
                                                                                                editSubSub={
                                                                                                    editSubSub
                                                                                                }
                                                                                                onSelectGuideSub={
                                                                                                    onSelectGuideSub
                                                                                                }
                                                                                                deleteGuideSubSub={
                                                                                                    deleteGuideSubSub
                                                                                                }
                                                                                                onSelectGuideSubSub={
                                                                                                    onSelectGuideSubSub
                                                                                                }
                                                                                                onSelectGuideSubChevron={
                                                                                                    onSelectGuideSubChevron
                                                                                                }
                                                                                                onDragEndSubSub={
                                                                                                    onDragEndSubSub
                                                                                                }
                                                                                                index={
                                                                                                    index
                                                                                                }
                                                                                                visible={
                                                                                                    card.visible
                                                                                                }
                                                                                            />

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
                                                            </Card>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </Card>
        </>
    );
};

export default PageGuideCardTitle;
