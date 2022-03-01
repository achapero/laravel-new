import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Input,
    Button,
    Modal,
    Form,
    Typography
} from "antd";

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

const PageGuideCardContent = ({
    cardGuidesContent,
    onDragEndContent,
    getListStyle,
    editContent,
    deleteContent,
    showModalAdd,
    showLoadingContent,
    getItemStyle,
    closeContent,
    onSelectGuide,
    onSelectGuideSub
}) => {
    // notify();

    const { Title } = Typography;
    return (
        <>
            {cardGuidesContent.map((cardContent, key) => (
                <Card key={key} className="guide_content_card">
                    <div
                        style={{
                            backgroundColor: "#1e9ecb",
                            borderColor: "#187da0",
                            color: "#fff",
                            padding: "18px"
                        }}
                    >
                        <Row>
                            <Col md={14}>
                                {cardContent.title && cardContent.title}
                                {cardContent.sub_title && cardContent.sub_title}
                                {cardContent.sub_sub_title &&
                                    cardContent.sub_sub_title}
                            </Col>

                            <Col md={10}>
                                <a
                                    target="_blank"
                                    href={`${window.location.origin}/guide`}
                                    style={{
                                        color: "white",
                                        fontSize: "11px",
                                        fontStyle: "oblique",
                                        textDecoration: "underline",
                                        textAlign: "right"
                                    }}
                                >
                                    go to: {`${window.location.origin}/guide`}
                                </a>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ backgroundColor: "#f7f7f7", padding: 10 }}>
                        <div
                            style={{
                                position: "relative",
                                width: "100%"
                            }}
                        >
                            {/* {showLoadingContent && (
                                <div className="overlay">
                                    <LoadingOutlined
                                        style={{
                                            position: "absolute",
                                            fontSize: "60px",
                                            left: "50%",
                                            top: "30%"
                                        }}
                                    />
                                </div>
                            )} */}
                            <Row>
                                <Col md={24}>
                                    <DragDropContext
                                        onDragEnd={e => onDragEndContent(e)}
                                    >
                                        <Droppable droppableId="droppable">
                                            {(provided, snapshot) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    style={getListStyle(
                                                        snapshot.isDraggingOver
                                                    )}
                                                >
                                                    {cardContent.merhant_guide_contents &&
                                                        cardContent.merhant_guide_contents.map(
                                                            (contents, key) => (
                                                                <Draggable
                                                                    key={
                                                                        "" +
                                                                        contents.id
                                                                    }
                                                                    draggableId={
                                                                        "" +
                                                                        contents.id
                                                                    }
                                                                    index={key}
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
                                                                                className={
                                                                                    "CardGuideContent" +
                                                                                    contents.id
                                                                                }
                                                                                style={{
                                                                                    cursor:
                                                                                        "pointer"
                                                                                }}
                                                                                id={
                                                                                    "CardGuideContent" +
                                                                                    contents.id
                                                                                }
                                                                            >
                                                                                <Card
                                                                                    style={{
                                                                                        padding:
                                                                                            "20px"
                                                                                    }}
                                                                                >
                                                                                    <Row>
                                                                                        <Col
                                                                                            md={
                                                                                                22
                                                                                            }
                                                                                        >
                                                                                            {" "}
                                                                                            <Title
                                                                                                level={
                                                                                                    4
                                                                                                }
                                                                                                style={{
                                                                                                    borderBottomColor:
                                                                                                        "grey"
                                                                                                }}
                                                                                            >
                                                                                                {" "}
                                                                                                {
                                                                                                    contents.title
                                                                                                }
                                                                                            </Title>
                                                                                            <span>
                                                                                                <a
                                                                                                    onClick={() =>
                                                                                                        editContent(
                                                                                                            contents.id,
                                                                                                            contents.title,
                                                                                                            contents.content
                                                                                                        )
                                                                                                    }
                                                                                                    style={{
                                                                                                        fontSize:
                                                                                                            "11px",
                                                                                                        textDecoration:
                                                                                                            "underline",
                                                                                                        color:
                                                                                                            "#20a8d8",
                                                                                                        textAlign:
                                                                                                            "left",
                                                                                                        cursor:
                                                                                                            "pointer"
                                                                                                    }}
                                                                                                >
                                                                                                    edit
                                                                                                </a>
                                                                                                <a
                                                                                                    onClick={() =>
                                                                                                        deleteContent(
                                                                                                            contents.id,
                                                                                                            contents.merchant_guide_contentable_id,
                                                                                                            contents.merchant_guide_contentable_type
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
                                                                                                            "8px",
                                                                                                        cursor:
                                                                                                            "pointer"
                                                                                                    }}
                                                                                                >
                                                                                                    delete
                                                                                                </a>
                                                                                            </span>
                                                                                        </Col>

                                                                                        <Col
                                                                                            md={
                                                                                                2
                                                                                            }
                                                                                            style={{
                                                                                                textAlign:
                                                                                                    "right"
                                                                                            }}
                                                                                        >
                                                                                            <div
                                                                                                onClick={() =>
                                                                                                    closeContent(
                                                                                                        contents.id
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {" "}
                                                                                                <DownOutlined
                                                                                                    style={{
                                                                                                        textAlign:
                                                                                                            "right",
                                                                                                        cursor:
                                                                                                            "pointer"
                                                                                                    }}
                                                                                                    className={
                                                                                                        "contentIconGuide" +
                                                                                                        contents.id
                                                                                                    }
                                                                                                ></DownOutlined>
                                                                                                <RightOutlined
                                                                                                    style={{
                                                                                                        textAlign:
                                                                                                            "right",
                                                                                                        cursor:
                                                                                                            "pointer"
                                                                                                    }}
                                                                                                    className={
                                                                                                        "contentIconGuideRight" +
                                                                                                        contents.id +
                                                                                                        " hide"
                                                                                                    }
                                                                                                ></RightOutlined>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <br></br>
                                                                                    <div
                                                                                        className={
                                                                                            "CardGuideContents" +
                                                                                            contents.id
                                                                                        }
                                                                                    >
                                                                                        <Row>
                                                                                            <Col
                                                                                                md={
                                                                                                    24
                                                                                                }
                                                                                                style={{
                                                                                                    width:
                                                                                                        "100%",
                                                                                                    overflow:
                                                                                                        "hidden"
                                                                                                }}
                                                                                            >
                                                                                                <div
                                                                                                    className="dynamic-content-div"
                                                                                                    dangerouslySetInnerHTML={{
                                                                                                        __html:
                                                                                                            contents.content
                                                                                                    }}
                                                                                                ></div>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                </Card>
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
                                </Col>
                            </Row>

                            <Row>
                                <Col md={24}>
                                    {" "}
                                    {cardContent.title != "Search Result" && (
                                        <div>
                                            {" "}
                                            <Button
                                                type="primary"
                                                style={{
                                                    width: "150px",
                                                    float: "right",
                                                    marginLeft: "20px"
                                                }}
                                                onClick={() =>
                                                    showModalAdd(
                                                        cardContent.id,
                                                        cardContent.title
                                                            ? "Parent"
                                                            : cardContent.sub_title
                                                            ? "Child"
                                                            : "Child-Child"
                                                    )
                                                }
                                            >
                                                Add Content
                                            </Button>{" "}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Card>
            ))}
        </>
    );
};

export default PageGuideCardContent;
