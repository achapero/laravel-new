import React, { useState, useEffect } from "react";
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
    AutoComplete
} from "antd";

import { Link, useLocation, useHistory } from "react-router-dom";
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
    EyeInvisibleOutlined
} from "@ant-design/icons";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { duration } from "moment";
import getUserData from "../../../../providers/getUserData";

import PageGuideAddEditModal from "./Modals/PageGuideAddEditModal";
import PageGuideModalSelectRole from "./Modals/PageGuideModalSelectRole";
import PageGuideHeader from "./PageGuideHeader";

import getCheckPermission from "../../../../providers/getCheckPermission";

const PageGuide = ({ history, permission }) => {
    const { Option } = AutoComplete;
    let userdata = getUserData();

    const [cardGuides, setCardGuides] = useState([]);

    const {
        data: dataGuides,
        isLoading: isLoadingDataGuidesTable,
        refetch: getGuides,
        isFetching: isFetchingDataGuidesTable
    } = useAxiosQuery("GET", `api/v1/guides_new_video`, "guides_new", res => {
        // console.log("@guides", res);
        setTimeout(() => getCheckPermission(permission), 500);
        setCardGuides(res.data);
    });

    const showContent = id => {
        history.push("/admin-video-guides/" + id);
    };

    const [showAddeEditModal, setShowAddEditModal] = useState(false);
    const [addOnly, setAddOnly] = useState(true);

    const showModalAddGuide = type => {
        setShowAddEditModal(!showAddeEditModal);
        setAddOnly(true);
    };

    const [updateData, setUpdateData] = useState({});
    const showModalEditGuide = (e, data) => {
        e.stopPropagation();
        setAddOnly(false);
        setUpdateData(data);
        setShowAddEditModal(!showAddeEditModal);
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
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const [roleData, setRoleData] = useState({});
    const [showViewRole, setShowViewRole] = useState(false);
    const showModaVisibility = (e, data) => {
        e.stopPropagation();
        setRoleData(data);
        setShowViewRole(!showViewRole);
    };

    const menu = data => (
        <Menu>
            <Menu.Item key="0">
                <Button
                    icon={<EyeOutlined />}
                    type="link"
                    onClick={e => showModaVisibility(e, data)}
                >
                    Visibility{" "}
                </Button>
            </Menu.Item>
            <Menu.Item key="1">
                <Button
                    icon={<EditOutlined />}
                    onClick={e => showModalEditGuide(e, data)}
                    type="link"
                >
                    Update Guide{" "}
                </Button>
            </Menu.Item>

            <Menu.Item key="2">
                <Button
                    icon={<DeleteFilled />}
                    type="link"
                    style={{ color: "rgb(248, 107, 1)" }}
                    onClick={e => deleteGuide(e, data.id)}
                    loading={isLoadingDeleteGuide}
                >
                    Delete Guide{" "}
                </Button>
            </Menu.Item>
        </Menu>
    );

    const [searchText, setSearchText] = useState("");
    const [dataSearch, setDataSearch] = useState([]);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            mutateSearch(
                {
                    search: searchText
                },
                {
                    onSuccess: res => {
                        console.log("@search", res);
                        setDataSearch(res.data);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchText]);

    const { mutate: mutateSearch, isLoading: isLoadingSearch } = useAxiosQuery(
        "POST",
        "api/v1/guide/filter_admin_new",
        "mutate_search"
    );

    return (
        <div className="app">
            {/* <div onClick={() => ScrollTo()}>click me</div> */}

            <div>
                <PageGuideHeader history={history} />
            </div>
            <div>
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
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            Live Link
                        </Link>
                        <Button
                            style={{ float: "right" }}
                            type="primary"
                            className="add_video_guide_btn"
                            icon={<PlusCircleOutlined />}
                            onClick={() => showModalAddGuide()}
                        >
                            Add Video Guide
                        </Button>
                    </div>
                </div>

                <div
                    style={{ marginLeft: "10px" }}
                    className="pageguidecardtitle"
                >
                    <Row>
                        <Col xs={24} md={24}>
                            <Card>
                                <div>
                                    <div
                                        style={{
                                            width: "100%"
                                        }}
                                    >
                                        {/* loop here */}

                                        <div>
                                            <Row gutter={20}>
                                                {cardGuides.map(
                                                    (card, index) => {
                                                        if (card.video_url) {
                                                            var yt_id = "no id";
                                                            var vid_id =
                                                                card.video_url;

                                                            var is_yt = vid_id.search(
                                                                "youtube.com"
                                                            );

                                                            if (is_yt !== -1) {
                                                                var _url = vid_id.split(
                                                                    "v="
                                                                );
                                                                yt_id = _url[1];
                                                            }
                                                        }

                                                        return (
                                                            <Col
                                                                md={8}
                                                                key={index}
                                                            >
                                                                <Card
                                                                    style={{
                                                                        marginBottom: 10,
                                                                        cursor:
                                                                            "pointer",
                                                                        minHeight:
                                                                            "369px",
                                                                        backgroundColor:
                                                                            card.visible ==
                                                                            "Admin"
                                                                                ? "rgb(232,232,232)"
                                                                                : "white",
                                                                        marginTop:
                                                                            "10px"
                                                                    }}
                                                                    className={
                                                                        "hover-item box-shadow-card-guide view_video_guide_btn"
                                                                    }
                                                                    onClick={() =>
                                                                        showContent(
                                                                            card.id
                                                                        )
                                                                    }
                                                                >
                                                                    {card.visible ==
                                                                        "Admin" && (
                                                                        <div
                                                                            className="visible_admin_video_guide_btn"
                                                                            style={{
                                                                                position:
                                                                                    "absolute",
                                                                                right: 0,
                                                                                top: 0,
                                                                                right: 28,
                                                                                top: 2,
                                                                                padding: 5
                                                                            }}
                                                                        >
                                                                            <Tooltip title="Visible only by Admins">
                                                                                <EyeInvisibleOutlined
                                                                                    onClick={e =>
                                                                                        showModaVisibility(
                                                                                            e,
                                                                                            card
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </Tooltip>
                                                                        </div>
                                                                    )}

                                                                    <div
                                                                        className="edit_video_guide_btn"
                                                                        style={{
                                                                            position:
                                                                                "absolute",
                                                                            right: 0,
                                                                            top: 0,
                                                                            right: 10,
                                                                            top: 2,
                                                                            padding: 5
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        <Dropdown
                                                                            overlay={() =>
                                                                                menu(
                                                                                    card
                                                                                )
                                                                            }
                                                                            placement={
                                                                                "bottomRight"
                                                                            }
                                                                        >
                                                                            <SettingOutlined
                                                                                onClick={e =>
                                                                                    e.stopPropagation()
                                                                                }
                                                                            />
                                                                        </Dropdown>
                                                                    </div>
                                                                    <Row
                                                                        onClick={() =>
                                                                            showContent(
                                                                                card.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <Col
                                                                            md={
                                                                                24
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <img
                                                                                style={{
                                                                                    width:
                                                                                        "100%",
                                                                                    marginTop:
                                                                                        "20px",
                                                                                    textAlign:
                                                                                        "center"
                                                                                }}
                                                                                src={`http://img.youtube.com/vi/${yt_id}/hqdefault.jpg`}
                                                                            ></img>
                                                                        </Col>
                                                                        <Col
                                                                            md={
                                                                                24
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <div
                                                                                style={{
                                                                                    fontSize:
                                                                                        "16px",
                                                                                    marginTop:
                                                                                        "5px"
                                                                                }}
                                                                            >
                                                                                <b>
                                                                                    {
                                                                                        card.title
                                                                                    }
                                                                                </b>{" "}
                                                                            </div>
                                                                            <div>
                                                                                {
                                                                                    card.description
                                                                                }
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Card>
                                                            </Col>
                                                        );
                                                    }
                                                )}
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            <PageGuideAddEditModal
                showAddeEditModal={showAddeEditModal}
                setShowAddEditModal={setShowAddEditModal}
                addOnly={addOnly}
                updateData={updateData}
            />
            <PageGuideModalSelectRole
                showViewRole={showViewRole}
                setShowViewRole={setShowViewRole}
                roleData={roleData}
            />
        </div>
    );
};

export default PageGuide;
