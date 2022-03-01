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
    Breadcrumb,
    message,
    Table
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
import copyToClipboard from "../../../../providers/copyToClipboard";

const PageSubSubGuideContent = ({ history, match, permission }) => {
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

    const [uploadNewFileContainer, setUploadNewFileContainer] = useState(false);

    const toggleUploadNewFileContainer = () => {
        setUploadNewFileContainer(!uploadNewFileContainer);
    };

    const [newGuideFiles, setNewGuideFiles] = useState({
        file_name: "",
        file: null
    });

    const {
        mutate: mutateAddGuideFile,
        isLoading: isLoadingAddGuideFile
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/guide_files",
        "merchant_guide_files"
    );

    const submitUpload = card_content => {
        if (newGuideFiles.file) {
            let data = new FormData();
            data.append("file", newGuideFiles.file);
            data.append("guide_id", card_content.id);

            mutateAddGuideFile(data, {
                onSuccess: res => {
                    notification.success({
                        message: "File Successfully Created"
                    });

                    toggleUploadNewFileContainer();
                    refetchGuideContent();
                },
                onError: err => {
                    console.log(err);
                    notificationErrors(err);
                }
            });
        }
    };

    const columns = [
        {
            title: "File Name",
            dataIndex: "file_name",
            key: "file_name"
        },
        {
            title: "File Url",
            dataIndex: "file_url",
            key: "file_url",
            render: file_url => (
                <a
                    href="#"
                    onClick={e => {
                        copyToClipboard(
                            window.location.origin + "/" + file_url
                        );
                        let _message =
                            "File Url Successfully Copied to Clipboard";
                        message.success({
                            content: _message,
                            duration: 2
                        });
                    }}
                >
                    Copy
                </a>
            )
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (text, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this File?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={e => handleDeleteFile(record.id)}
                >
                    <Button
                        loading={isLoadingDeleteFile}
                        type="primary"
                        danger
                        title="Delete"
                        icon={<DeleteFilled />}
                    ></Button>
                </Popconfirm>
            )
        }
    ];

    const {
        mutate: mutateDeleteFile,
        isLoading: isLoadingDeleteFile
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_files/delete_file",
        "delete_merchant_guide_file"
    );

    const handleDeleteFile = id => {
        mutateDeleteFile(
            { id: id },
            {
                onSuccess: res => {
                    if (res.success) {
                        notification.success({
                            message: "File Successfully Deleted"
                        });
                        refetchGuideContent();
                    }
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
                        to={"/guides"}
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
                                    permission={permission}
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
                                            <Link to={"/admin-guides"}>
                                                {" "}
                                                Home{" "}
                                            </Link>
                                        </Breadcrumb.Item>
                                        {cardGuidesParent && (
                                            <>
                                                <Breadcrumb.Item>
                                                    <Link
                                                        to={
                                                            "/admin-guides/" +
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
                                                            "/admin-guides/" +
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
                                <Col md={20}>
                                    <Title>{cardGuidesTitle} </Title>
                                </Col>
                                <Col md={4}>
                                    <Button
                                        type="primary"
                                        icon={<PlusCircleOutlined />}
                                        onClick={() =>
                                            showModalAddGuideContent()
                                        }
                                        style={{
                                            float: "right",
                                            marginTop: "5px"
                                        }}
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
                                                <Col md={24} key={key}>
                                                    <Card
                                                        style={{
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

                                                    <div
                                                        style={{
                                                            // marginBottom: 10,
                                                            // cursor: "pointer",
                                                            // minHeight: "138px",
                                                            border: "none",
                                                            paddingLeft: "24px",
                                                            paddingRight: "24px"
                                                        }}
                                                    >
                                                        <div>
                                                            <Button
                                                                color="primary"
                                                                onClick={e =>
                                                                    toggleUploadNewFileContainer()
                                                                }
                                                            >
                                                                Upload New File
                                                            </Button>
                                                            <br />
                                                            {uploadNewFileContainer && (
                                                                <Card>
                                                                    <h4>
                                                                        Upload
                                                                        File
                                                                        (.pdf,.jpg,.png,.jpeg)
                                                                    </h4>
                                                                    {/* <div >
                                                                        Upload File (.pdf)
                                                                    </div> */}
                                                                    <Input
                                                                        type="file"
                                                                        id="inputUploadDocument"
                                                                        name="file"
                                                                        accept=".pdf,.jpg,.png,.jpeg"
                                                                        required
                                                                        onChange={e =>
                                                                            setNewGuideFiles(
                                                                                {
                                                                                    ...newGuideFiles,
                                                                                    file:
                                                                                        e
                                                                                            .target
                                                                                            .files[0]
                                                                                }
                                                                            )
                                                                        }
                                                                    />
                                                                    <br />{" "}
                                                                    <br />
                                                                    <Button
                                                                        type="primary"
                                                                        onClick={e =>
                                                                            submitUpload(
                                                                                cardContent
                                                                            )
                                                                        }
                                                                        loading={
                                                                            isLoadingAddGuideFile
                                                                        }
                                                                    >
                                                                        Upload
                                                                    </Button>
                                                                </Card>
                                                            )}
                                                            <br />
                                                            {/* {console.log("content_id", guideContentId)} */}
                                                            <Table
                                                                dataSource={
                                                                    cardContent
                                                                        ? cardContent.merchant_guide_files
                                                                        : []
                                                                }
                                                                loading={
                                                                    isLoadingAddGuideFile
                                                                }
                                                                columns={
                                                                    columns
                                                                }
                                                                pagination={
                                                                    false
                                                                }
                                                                rowKey={record =>
                                                                    record.id
                                                                }
                                                            />
                                                        </div>
                                                    </div>
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
