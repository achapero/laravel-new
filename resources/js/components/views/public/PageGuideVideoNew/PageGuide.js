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
    Tooltip
} from "antd";
import { useLocation } from "react-router-dom";
import {
    Link,
    DirectLink,
    Element,
    Events,
    animateScroll as scroll,
    scrollSpy,
    scroller
} from "react-scroll";

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
    EyeInvisibleOutlined,
    RiseOutlined
} from "@ant-design/icons";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import { duration } from "moment";
import getUserData from "../../../providers/getUserData";
import PageGuideHeader from "./PageGuideHeader";

const PageGuide = ({ history }) => {
    let userdata = getUserData();

    const [cardGuides, setCardGuides] = useState([]);

    const {
        data: dataGuides,
        isLoading: isLoadingDataGuidesTable,
        refetch: getGuides,
        isFetching: isFetchingDataGuidesTable
    } = useAxiosQuery("GET", `api/v1/guides_new_video`, "guides_new", res => {
        console.log("@guides", res);

        if (userdata) {
            if (userdata.role != "Merchant") {
                setCardGuides(res.data);
            } else {
                var arr = [];
                res.data.forEach(element => {
                    if (element.visible == "All" || element.visible == null) {
                        arr.push(element);
                    }
                });
                setCardGuides(arr);
            }
        } else {
            var arr = [];
            res.data.forEach(element => {
                if (element.visible == "All" || element.visible == null) {
                    arr.push(element);
                }
            });
            setCardGuides(arr);
        }
    });

    const showContent = id => {
        history.push("/video-guides/" + id);
    };

    const [showAddeEditModal, setShowAddEditModal] = useState(false);
    const [addOnly, setAddOnly] = useState(true);

    const showModalAddGuide = () => {
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

    return (
        <div
            className="app"
            style={{
                paddingLeft: "7%",
                paddingRight: "7%",
                background: "white"
            }}
        >
            <div>
                <PageGuideHeader history={history} />
            </div>
            <div className="pageguidecardtitle">
                <Row>
                    <Col xs={24} md={24}>
                        <Card style={{ border: "none" }}>
                            <div>
                                <div
                                    style={{
                                        width: "100%",
                                        padding: "20px",
                                        paddingTop: "0px"
                                    }}
                                >
                                    <Row>
                                        <Col md={24}>
                                            <div
                                                style={{
                                                    fontSize: "35px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                <>
                                                    <RiseOutlined /> VIDEO
                                                    GUIDES
                                                </>
                                            </div>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row gutter={20}>
                                        {cardGuides.length != 0 &&
                                            cardGuides.map((card, index) => {
                                                if (card.video_url) {
                                                    var yt_id = "no id";
                                                    var vid_id = card.video_url;

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
                                                    <Col md={8} key={index}>
                                                        <Card
                                                            style={{
                                                                marginBottom: 10,
                                                                cursor:
                                                                    "pointer",
                                                                minHeight:
                                                                    "355px",
                                                                backgroundColor:
                                                                    card.visible ==
                                                                    "Admin"
                                                                        ? "rgb(232,232,232)"
                                                                        : "white",
                                                                marginTop:
                                                                    "10px"
                                                            }}
                                                            className={
                                                                "hover-item box-shadow-card-guide"
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
                                                                    style={{
                                                                        position:
                                                                            "absolute",
                                                                        right: 0,
                                                                        top: 0,
                                                                        right: 30,
                                                                        top: 6
                                                                    }}
                                                                >
                                                                    <Tooltip title="Visible only by Admins">
                                                                        <EyeInvisibleOutlined />
                                                                    </Tooltip>
                                                                </div>
                                                            )}

                                                            <Row>
                                                                <Col md={24}>
                                                                    {" "}
                                                                    <img
                                                                        style={{
                                                                            width:
                                                                                "100%",
                                                                            marginTop:
                                                                                "10px",
                                                                            textAlign:
                                                                                "center"
                                                                        }}
                                                                        src={`http://img.youtube.com/vi/${yt_id}/hqdefault.jpg`}
                                                                    ></img>
                                                                </Col>
                                                                <Col md={24}>
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
                                            })}
                                    </Row>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PageGuide;
