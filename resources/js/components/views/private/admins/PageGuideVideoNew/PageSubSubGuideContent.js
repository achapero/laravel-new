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
    Typography,
    Popconfirm,
    notification,
    Divider,
    Breadcrumb
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
    LoadingOutlined,
    EditOutlined,
    FileTextOutlined
} from "@ant-design/icons";

import { Link, useLocation, useHistory } from "react-router-dom";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { duration } from "moment";
import getUserData from "../../../../providers/getUserData";

import PageGuideSubSubConentAddEditModal from "./Modals/PageGuideSubSubConentAddEditModal";
import PageGuideSubSubAddEditModal from "./Modals/PageGuideSubSubAddEditModal";
import PageGuideHeader from "./PageGuideHeader";
import PageGuideSideBar from "./PageGuideSideBar";
const PageSubSubGuideContent = ({ history, match }) => {
    const { Title } = Typography;
    const [cardGuidesContent, setCardGuidesContent] = useState([]);
    const [cardGuidesTitle, setCardGuidesTitle] = useState("");
    const [cardGuidesParent, setCardGuidesParent] = useState("");
    const {
        data: guideContent,
        refetch: refetchGuideContent,
        isLoading: isLoadingGuideContent
    } = useAxiosQuery(
        "GET",
        `api/v1/guide_sub_sub_new_content/${match.params.id}`,
        `guide_sub_sub_new_conent_${match.params.id}`,
        res => {
            console.log(res);
            setCardGuidesContent(res.data);
            setCardGuidesTitle(res.title.sub_sub_title);
            setCardGuidesParent(res.parent[0]);
        }
    );

    const [showAddeEditContentModal, setShowAddEditContentModal] = useState(
        false
    );
    const [addOnly, setAddOnly] = useState(true);

    const showModalAddGuideContent = () => {
        setShowAddEditContentModal(!showAddeEditContentModal);
        setAddOnly(true);
    };

    const [updateData, setUpdateData] = useState({});
    const showModalEditGuide = data => {
        setAddOnly(false);
        setUpdateData(data);
        setShowAddEditContentModal(!showAddeEditContentModal);
    };

    const {
        mutate: mutateDeleteContent,
        isLoading: isLoadingDeleteContent
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_contents/delete",
        `guide_sub_sub_new_conent_${match.params.id}`
    );

    const deleteContent = (id, guide_id, type) => {
        mutateDeleteContent(
            {
                id: id,
                guide_id: guide_id,
                type: type
            },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Content Deleted Successfully "
                    });
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    return (
        <div className="app">
            {/* <div onClick={() => ScrollTo()}>click me</div> */}
            <div>
                <PageGuideHeader history={history} />
            </div>
            <div
                style={{
                    marginLeft: "10px",
                    background: "white",
                    padding: "30px",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "16px",
                    fontWeight: "500"
                }}
            >
                <div style={{ width: "100%" }}>
                    <Link
                        to={"/video-guides"}
                        style={{ textDecoration: "underline" }}
                    >
                        Live Link
                    </Link>
                </div>
            </div>
            <div
                style={{
                    marginLeft: "10px",
                    background: "white",
                    padding: "30px",
                    paddingTop: "5px"
                }}
                className="pageguidecardcontent"
            >
                <Row style={{ paddingTop: "10px" }} gutter={24}>
                    <Col md={7}>
                        <div className="sidebarSticky">
                            {cardGuidesParent && (
                                <PageGuideSideBar
                                    history={history}
                                    match={match}
                                    match_id={
                                        cardGuidesParent.merchant_guide.id
                                    }
                                    title={cardGuidesTitle}
                                    refetchsub={[]}
                                />
                            )}
                        </div>
                    </Col>
                    <Col md={17}>
                        <>
                            <Row>
                                <Col md={24}>
                                    <Breadcrumb>
                                        <Breadcrumb.Item>
                                            <Link to={"/admin-video-guides"}>
                                                {" "}
                                                Home{" "}
                                            </Link>
                                        </Breadcrumb.Item>
                                        {cardGuidesParent && (
                                            <>
                                                <Breadcrumb.Item>
                                                    <Link
                                                        to={
                                                            "/admin-video-guides/" +
                                                            cardGuidesParent
                                                                .merchant_guide
                                                                .id
                                                        }
                                                    >
                                                        {
                                                            cardGuidesParent
                                                                .merchant_guide
                                                                .title
                                                        }{" "}
                                                    </Link>
                                                </Breadcrumb.Item>
                                                <Breadcrumb.Item>
                                                    <Link
                                                        to={
                                                            "/admin-video-guides/" +
                                                            cardGuidesParent
                                                                .merchant_guide
                                                                .id +
                                                            "/sub/" +
                                                            cardGuidesParent
                                                                .merchant_sub_guide
                                                                .id
                                                        }
                                                    >
                                                        {
                                                            cardGuidesParent
                                                                .merchant_sub_guide
                                                                .sub_title
                                                        }{" "}
                                                    </Link>
                                                </Breadcrumb.Item>
                                            </>
                                        )}

                                        <Breadcrumb.Item>
                                            {cardGuidesTitle}
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col md={24}>
                                    <Title>{cardGuidesTitle} </Title>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={24}>
                                    <Button
                                        type="primary"
                                        icon={<PlusCircleOutlined />}
                                        onClick={() =>
                                            showModalAddGuideContent()
                                        }
                                        style={{ float: "right" }}
                                    >
                                        Content Block
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                {cardGuidesContent.length != 0 &&
                                    cardGuidesContent.map(
                                        (cardContent, key) => {
                                            return (
                                                <Col md={24}>
                                                    <Card
                                                        style={{
                                                            marginBottom: 10,
                                                            cursor: "pointer",
                                                            minHeight: "138px",
                                                            border: "none"
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: cardContent.title
                                                                    ? "block"
                                                                    : "none"
                                                            }}
                                                        >
                                                            <Title level={4}>
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "10px",
                                                                        position:
                                                                            "relative",
                                                                        top:
                                                                            "-2px"
                                                                    }}
                                                                >
                                                                    <i className="fa fa-circle"></i>
                                                                </span>{" "}
                                                                {
                                                                    cardContent.title
                                                                }
                                                            </Title>
                                                        </div>
                                                        <div
                                                            style={{
                                                                paddingLeft:
                                                                    "16px"
                                                            }}
                                                        >
                                                            <div
                                                                className="dynamic-content-div"
                                                                dangerouslySetInnerHTML={{
                                                                    __html:
                                                                        cardContent.content
                                                                }}
                                                            ></div>
                                                            <span>
                                                                <Button
                                                                    icon={
                                                                        <EditOutlined />
                                                                    }
                                                                    type="primary"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        showModalEditGuide(
                                                                            cardContent
                                                                        )
                                                                    }
                                                                ></Button>
                                                                <Popconfirm
                                                                    title="Are you sure you want to delete this Content?"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onConfirm={e =>
                                                                        deleteContent(
                                                                            cardContent.id,
                                                                            null,
                                                                            null
                                                                        )
                                                                    }
                                                                >
                                                                    <Button
                                                                        type="primary"
                                                                        icon={
                                                                            <DeleteFilled />
                                                                        }
                                                                        style={{
                                                                            background:
                                                                                "rgb(248, 107, 107)",
                                                                            borderColor:
                                                                                " rgb(248, 107, 107)",
                                                                            marginLeft:
                                                                                "3px"
                                                                        }}
                                                                        size="small"
                                                                    ></Button>
                                                                </Popconfirm>
                                                            </span>
                                                        </div>
                                                    </Card>
                                                </Col>
                                            );
                                        }
                                    )}
                            </Row>
                        </>
                    </Col>
                </Row>
            </div>
            <PageGuideSubSubConentAddEditModal
                showAddeEditContentModal={showAddeEditContentModal}
                setShowAddEditContentModal={setShowAddEditContentModal}
                addOnly={addOnly}
                updateData={updateData}
                params={match.params.id}
            />
        </div>
    );
};

export default PageSubSubGuideContent;
