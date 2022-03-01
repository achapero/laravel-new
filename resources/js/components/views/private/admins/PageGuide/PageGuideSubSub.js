import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Input, Button, Modal, Form } from "antd";

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

const PageGuideSubSub = ({
    sub,
    getItemStyle,
    addSubSub,
    editGuideSub,
    deleteGuideSub,
    editSubSub,
    deleteGuideSubSub,
    onSelectGuideSubSub,
    visible
}) => {
    return (
        <>
            {sub.merchant_guide_sub_subs.map((subsub, subsubkey) => (
                <Draggable
                    key={"" + subsub.id}
                    draggableId={"" + subsub.id}
                    index={subsubkey}
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
                                onClick={e => onSelectGuideSubSub(e, subsub.id)}
                                style={{
                                    boxShadow: "0 0 5px 2px rgba(0,0,0,0.1)",
                                    cursor: "pointer",
                                    background:
                                        visible == "Admin"
                                            ? "rgb(232,232,232)"
                                            : "white"
                                }}
                            >
                                <p
                                    style={{
                                        padding: "5px",

                                        lineHeight: 1.5,
                                        marginBottom: 0,
                                        fontWeight: "lighter",
                                        marginLeft: "10px",
                                        wordBreak: "break-all"
                                    }}
                                >
                                    {subsub.sub_sub_title}
                                </p>

                                <a
                                    onClick={() => editSubSub(subsub.id)}
                                    style={{
                                        fontSize: "11px",
                                        textDecoration: "underline",
                                        color: "#20a8d8",
                                        marginLeft: "17px"
                                    }}
                                >
                                    edit
                                </a>
                                <a
                                    onClick={() => deleteGuideSubSub(subsub.id)}
                                    style={{
                                        fontSize: "11px",
                                        textDecoration: "underline",

                                        color: "#f86c6b",

                                        marginLeft: "8px"
                                    }}
                                >
                                    delete
                                </a>
                            </div>
                        </div>
                    )}
                </Draggable>
            ))}
        </>
    );
};

export default PageGuideSubSub;
