import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Input, Button, Modal, Form } from "antd";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PageGuideSub from "./PageGuideSub";
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
                <div>
                    <div
                        style={{
                            position: "relative",
                            width: "100%"
                        }}
                    >
                        {cardGuides.length != 0 &&
                            cardGuides.map((card, index) => (
                                <div key={index}>
                                    <Card
                                        style={{
                                            backgroundColor:
                                                card.visible == "Admin"
                                                    ? "rgb(232,232,232)"
                                                    : "white",

                                            marginBottom: 10,
                                            cursor: "pointer"
                                        }}
                                        className={"CardGuide" + card.id}
                                    >
                                        <div
                                            style={{
                                                backgroundColor:
                                                    card.visible == "Admin"
                                                        ? "rgb(232,232,232)"
                                                        : "white",
                                                paddingTop: "10px"
                                            }}
                                        >
                                            <div
                                                onClick={() =>
                                                    onSelectGuide(
                                                        card.id,
                                                        "CardGuide" + card.id,
                                                        card.merchant_guide_subs
                                                            .length,
                                                        "guide"
                                                    )
                                                }
                                                style={{
                                                    marginBottom: "5px"
                                                }}
                                            >
                                                <Row>
                                                    <Col md={3}>
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
                                                        ></i>
                                                    </Col>
                                                    <Col
                                                        md={18}
                                                        style={{
                                                            borderLeft:
                                                                "1px solid grey"
                                                        }}
                                                    >
                                                        {" "}
                                                        <div
                                                            style={{
                                                                paddingLeft: 15,
                                                                fontSize: "16px"
                                                            }}
                                                        >
                                                            {" "}
                                                            <b>
                                                                {card.title}
                                                            </b>{" "}
                                                        </div>
                                                    </Col>

                                                    <Col md={3}>
                                                        {card
                                                            .merchant_guide_subs
                                                            .length != 0 && (
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
                                                                        " hide"
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
                                                                        card.id
                                                                    }
                                                                ></RightOutlined>
                                                            </span>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </div>

                                            {card.merchant_guide_subs.length !=
                                                0 && (
                                                <div
                                                    style={{
                                                        marginTop: "10px"
                                                    }}
                                                    className={
                                                        "cardChildren" +
                                                        card.id +
                                                        " hide"
                                                    }
                                                >
                                                    <div
                                                        style={{
                                                            marginLeft: "45px",
                                                            background:
                                                                "#f7f7f7"
                                                        }}
                                                    >
                                                        <PageGuideSub
                                                            card={card}
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
                                                            index={index}
                                                            visible={
                                                                card.visible
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            ))}
                    </div>
                </div>
            </Card>
        </>
    );
};

export default PageGuideCardTitle;
