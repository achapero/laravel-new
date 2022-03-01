import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Input, Button, Modal, Form } from "antd";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PageGuideSubSub from "./PageGuideSubSub";
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
    card,
    getItemStyle,
    addSubSub,
    editGuideSub,
    deleteGuideSub,
    getListStyle,
    editSubSub,
    onSelectGuideSub,
    deleteGuideSubSub,
    onSelectGuideSubSub,
    onSelectGuideSubChevron,
    onDragEndSubSub,
    index,
    visible
}) => {
    return (
        <>
            {card.merchant_guide_subs.map((sub, subkey) => (
                <Draggable
                    key={"" + sub.id}
                    draggableId={"" + sub.id}
                    index={subkey}
                >
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}
                        >
                            <div
                                // key={
                                //     subkey
                                // }
                                onClick={() => onSelectGuideSub(sub.id)}
                                style={{
                                    boxShadow: "0 0 5px 2px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                    background:
                                        visible == "Admin"
                                            ? "rgb(232,232,232)"
                                            : "white"
                                }}
                                className={"CardGuideSub" + sub.id}
                            >
                                <Row>
                                    <Col md={21}>
                                        <p
                                            style={{
                                                padding: "5px",

                                                lineHeight: 1.5,
                                                marginBottom: 0,
                                                fontWeight: "lighter",
                                                marginLeft: "30px",
                                                wordBreak: "break-all"
                                            }}
                                        >
                                            {sub.sub_title}
                                        </p>
                                        <a
                                            onClick={() => editGuideSub(sub.id)}
                                            style={{
                                                fontSize: "11px",
                                                textDecoration: "underline",
                                                color: "#20a8d8",
                                                marginLeft: "35px"
                                            }}
                                        >
                                            edit
                                        </a>
                                        <a
                                            onClick={() =>
                                                deleteGuideSub(sub.id)
                                            }
                                            style={{
                                                fontSize: "11px",
                                                textDecoration: "underline",

                                                color: "#f86c6b",

                                                marginLeft: "8px"
                                            }}
                                        >
                                            delete
                                        </a>
                                        <a
                                            onClick={() => addSubSub(sub.id)}
                                            style={{
                                                fontSize: "11px",
                                                textDecoration: "underline",
                                                color: "rgb(76, 189, 116)",
                                                marginLeft: "8px"
                                            }}
                                        >
                                            add sub{" "}
                                        </a>
                                    </Col>
                                    <Col md={3}>
                                        {sub.merchant_guide_sub_subs.length !=
                                            0 && (
                                            <span>
                                                {" "}
                                                <DownOutlined
                                                    style={{
                                                        lineHeight: 2.4,
                                                        marginTop: 2
                                                    }}
                                                    onClick={e =>
                                                        onSelectGuideSubChevron(
                                                            e,
                                                            sub.id,
                                                            "",
                                                            "icon"
                                                        )
                                                    }
                                                    // className="cui-chevron-right icons d-block "
                                                    className={
                                                        "iconGuideSub" +
                                                        sub.id +
                                                        ""
                                                    }
                                                ></DownOutlined>
                                                <RightOutlined
                                                    style={{
                                                        lineHeight: 2.4,
                                                        marginTop: 2
                                                    }}
                                                    onClick={e =>
                                                        onSelectGuideSubChevron(
                                                            e,
                                                            sub.id,
                                                            "",
                                                            "icon"
                                                        )
                                                    }
                                                    // className="cui-chevron-right icons d-block "
                                                    className={
                                                        "iconGuideSubright" +
                                                        sub.id +
                                                        " hide"
                                                    }
                                                ></RightOutlined>
                                            </span>
                                        )}
                                    </Col>
                                </Row>

                                {sub.merchant_guide_sub_subs.length != 0 && (
                                    <div
                                        style={{
                                            marginTop: "10px",
                                            paddingBottom: "20px"
                                        }}
                                        className={
                                            "cardChildrenSub" + sub.id + ""
                                        }
                                    >
                                        <DragDropContext
                                            onDragEnd={e =>
                                                onDragEndSubSub(
                                                    e,
                                                    index,
                                                    subkey
                                                )
                                            }
                                        >
                                            <Droppable droppableId="droppable3">
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.droppableProps}
                                                        ref={provided.innerRef}
                                                        style={getListStyle(
                                                            snapshot.isDraggingOver
                                                        )}
                                                        style={{
                                                            marginLeft: "35px",
                                                            background:
                                                                "#f7f7f7",
                                                            marginRight: "20px"
                                                        }}
                                                    >
                                                        <PageGuideSubSub
                                                            sub={sub}
                                                            getItemStyle={
                                                                getItemStyle
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
                                                            deleteGuideSubSub={
                                                                deleteGuideSubSub
                                                            }
                                                            onSelectGuideSubSub={
                                                                onSelectGuideSubSub
                                                            }
                                                            visible={visible}
                                                        />

                                                        {provided.placeholder}
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
            ))}
        </>
    );
};

export default PageGuideCardTitle;
