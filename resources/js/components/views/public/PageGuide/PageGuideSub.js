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
                <div key={subkey}>
                    <div
                        // key={
                        //     subkey
                        // }
                        onClick={() => onSelectGuideSub(sub.id)}
                        style={{
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
                                {" "}
                                <p
                                    style={{
                                        padding: "5px",
                                        borderBottom: "1px solid #0000000f",
                                        lineHeight: 1.5,
                                        marginBottom: 0,

                                        marginLeft: "30px",
                                        wordBreak: "break-all",
                                        paddingBottom: "30px"
                                    }}
                                >
                                    {sub.sub_title}
                                </p>
                            </Col>
                            <Col md={3}>
                                {sub.merchant_guide_sub_subs.length != 0 && (
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
                                                " hide"
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
                                                ""
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
                                className={"cardChildrenSub" + sub.id + " hide"}
                            >
                                <div
                                    style={{
                                        marginLeft: "35px",
                                        background: "#f7f7f7",
                                        marginRight: "20px"
                                    }}
                                >
                                    <PageGuideSubSub
                                        sub={sub}
                                        getItemStyle={getItemStyle}
                                        addSubSub={addSubSub}
                                        deleteGuideSub={deleteGuideSub}
                                        editGuideSub={editGuideSub}
                                        editSubSub={editSubSub}
                                        deleteGuideSubSub={deleteGuideSubSub}
                                        onSelectGuideSubSub={
                                            onSelectGuideSubSub
                                        }
                                        visible={visible}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default PageGuideCardTitle;
