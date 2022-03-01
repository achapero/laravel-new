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
                            <Row>
                                <Col md={24}>
                                    <div>
                                        {cardContent.merhant_guide_contents &&
                                            cardContent.merhant_guide_contents.map(
                                                (contents, key) => (
                                                    <div key={key}>
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
                                                                        md={22}
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
                                                                    </Col>

                                                                    <Col
                                                                        md={2}
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
                                                )
                                            )}
                                    </div>
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
