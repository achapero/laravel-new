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
    const [cardGuidesVideo, setCardGuidesVideo] = useState([]);
    const {
        data: dataGuides,
        isLoading: isLoadingDataGuidesTable,
        refetch: getGuides,
        isFetching: isFetchingDataGuidesTable
    } = useAxiosQuery("GET", `api/v1/guides_new`, "guides_new", res => {
        // console.log("@guides", res);
        setTimeout(() => getCheckPermission(permission), 500);
        setCardGuides(res.data);
    });

    const showContent = id => {
        history.push("/admin-guides/" + id);
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
                <PageGuideHeader
                    history={history}
                    permission={permission}
                    getCheckPermission={getCheckPermission}
                />
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
                            to={"/guides"}
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            Live Link
                        </Link>
                        <Button
                            style={{ float: "right" }}
                            type="primary"
                            name="add_guide_btn"
                            icon={<PlusCircleOutlined />}
                            onClick={() => showModalAddGuide()}
                        >
                            Add Guide
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
                                                                            "170px",
                                                                        backgroundColor:
                                                                            card.visible ==
                                                                            "Admin"
                                                                                ? "rgb(232,232,232)"
                                                                                : "white",
                                                                        marginTop:
                                                                            "10px"
                                                                    }}
                                                                    className={
                                                                        "hover-item box-shadow-card-guide view_guide_btn"
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
                                                                            className="visible_admin_guide_btn"
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
                                                                            <Tooltip
                                                                                title="Visible only by Admins"
                                                                                className="visible_admin_guide_btn"
                                                                            >
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
                                                                        style={{
                                                                            position:
                                                                                "absolute",
                                                                            right: 0,
                                                                            top: 0,
                                                                            right: 10,
                                                                            top: 2,
                                                                            padding: 5
                                                                        }}
                                                                        className="edit_guide_btn"
                                                                    >
                                                                        {" "}
                                                                        <Dropdown
                                                                            className="edit_guide_btn"
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
                                                                                5
                                                                            }
                                                                        >
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
                                                                            md={
                                                                                19
                                                                            }
                                                                        >
                                                                            {" "}
                                                                            <b>
                                                                                {
                                                                                    card.title
                                                                                }
                                                                            </b>{" "}
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
