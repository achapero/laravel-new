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
    AutoComplete,
    Tag
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

const PageGuideHeader = ({ history }) => {
    const { Option } = AutoComplete;
    let userdata = getUserData();

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
        <div
            className="newguide-header"
            style={{
                marginTop: "30px",
                background: "white",
                padding: "20px",
                marginLeft: "10px",
                paddingTop: "40px"
            }}
        >
            <Row>
                <Col md={16}>
                    <div
                        style={{ display: "flex", cursor: "pointer" }}
                        onClick={() => {
                            history.push("/");
                        }}
                    >
                        <img
                            src="/assets/favicon.ico"
                            alt="Promise Network Logo"
                            border="0"
                            width="55"
                        />
                        <div
                            style={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginTop: "5px"
                            }}
                        >
                            {process.env.MIX_APP_NAME}
                        </div>
                    </div>
                </Col>
                <Col md={8}>
                    <AutoComplete
                        dropdownClassName="certain-category-search-dropdown"
                        style={{ width: "100%", marginTop: "7px" }}
                        placeholder="Search..."
                        onSearch={e => {
                            setSearchText(e);
                        }}
                        // onSelect={e => {
                        //     history.push(e);
                        // }}
                        allowClear={true}
                    >
                        {dataSearch.length != 0 &&
                            dataSearch.map((row, item) => {
                                var label = "";
                                var value = "";
                                var tag = "";
                                var root = "";

                                //guide

                                if (row.visible) {
                                    root =
                                        row.type == "guide"
                                            ? "admin-guides"
                                            : "admin-video-guides";

                                    label = row.title;
                                    value = `/${root}/` + row.id;
                                    tag = "";
                                }
                                //sub guide

                                if (row.sub_title) {
                                    root =
                                        row.merchant_guide.type == "guide"
                                            ? "admin-guides"
                                            : "admin-video-guides";

                                    label = row.sub_title;
                                    value = `/${root}/${row.merchant_guide.id}/sub/${row.id}`;
                                    tag = row.merchant_guide.title;
                                }
                                //sub sub guide
                                if (row.sub_sub_title) {
                                    root =
                                        row.merchant_guide.type == "guide"
                                            ? "admin-guides"
                                            : "admin-video-guides";

                                    label = row.sub_sub_title;
                                    value = `/${root}/${row.merchant_guide.id}/sub/${row.merchant_sub_guide.id}/sub-sub/${row.id}`;
                                    tag = row.merchant_sub_guide.sub_title;
                                }
                                //content

                                if (row.parent) {
                                    label = row.title;

                                    if (row.parent[0].visible) {
                                        root =
                                            row.parent[0].type == "guide"
                                                ? "admin-guides"
                                                : "admin-video-guides";

                                        value = `/${root}/` + row.parent[0].id;
                                    }
                                    if (row.parent[0].sub_title) {
                                        root =
                                            row.parent[0].merchant_guide.type ==
                                            "guide"
                                                ? "admin-guides"
                                                : "admin-video-guides";

                                        value = `/${root}/${row.parent[0].merchant_guide.id}/sub/${row.parent[0].id}`;
                                    }

                                    if (row.parent[0].sub_sub_title) {
                                        root =
                                            row.parent[0].merchant_guide.type ==
                                            "guide"
                                                ? "admin-guides"
                                                : "admin-video-guides";

                                        value = `/${root}/${row.parent[0].merchant_guide.id}/sub/${row.parent[0].merchant_sub_guide.id}/sub-sub/${row.parent[0].id}`;
                                    }
                                }

                                return (
                                    <Option
                                        key={item}
                                        value={label}
                                        style={{
                                            display: row.parent
                                                ? row.title
                                                    ? "block"
                                                    : "none"
                                                : "block"
                                        }}
                                    >
                                        <Link to={value}>
                                            <span> {label} </span>{" "}
                                        </Link>
                                        {/* {tag && (
                                            <span>
                                                <Tag color="#2db7f5">{tag}</Tag>
                                            </span>
                                        )} */}
                                    </Option>
                                );
                            })}
                    </AutoComplete>
                </Col>
            </Row>
            <Row>
                <Col md={24}>
                    <Menu
                        mode="horizontal"
                        selectedKeys={"Video Guides"}
                        style={{
                            borderBottom: "none",
                            fontWeight: "bold",

                            marginTop: "10px"
                        }}
                    >
                        <Menu.Item
                            className="view_guide_btn"
                            key="Guides"
                            onClick={() => {
                                history.push("/admin-guides");
                            }}
                        >
                            Guides
                        </Menu.Item>
                        <Menu.Item
                            className="view_video_guide_btn"
                            key="Video Guides"
                            onClick={() => {
                                history.push("/admin-video-guides");
                            }}
                        >
                            Video Guides
                        </Menu.Item>
                    </Menu>
                </Col>
            </Row>
        </div>
    );
};

export default PageGuideHeader;
