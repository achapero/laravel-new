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

import useAxiosQuery from "../../../providers/useAxiosQuery";
import { duration } from "moment";
import getUserData from "../../../providers/getUserData";

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
                        if (userdata) {
                            if (
                                userdata.role == "Admin" ||
                                userdata.role == "Super Admin" ||
                                userdata.role == "Manager"
                            ) {
                                console.log("@search", res);
                                setDataSearch(res.data);
                            } else {
                                var arr = [];
                                console.log("@search", res);
                                res.data.forEach(element => {
                                    if (element.icon) {
                                        if (element.visible) {
                                            if (element.visible == "All") {
                                                arr.push(element);
                                            }
                                        }
                                    }
                                    if (element.sub_title) {
                                        if (element.merchant_guide) {
                                            if (
                                                element.merchant_guide
                                                    .visible == "All"
                                            ) {
                                                arr.push(element);
                                            }
                                        }
                                    }
                                    if (element.sub_sub_title) {
                                        if (element.merchant_guide) {
                                            if (
                                                element.merchant_guide
                                                    .visible == "All"
                                            ) {
                                                arr.push(element);
                                            }
                                        }
                                    }
                                    if (element.merchant_guide_contentable_id) {
                                        if (element.parent[0].visible) {
                                            if (
                                                element.parent[0].visible ==
                                                "All"
                                            ) {
                                                arr.push(element);
                                            }
                                        }
                                    }
                                });
                                setDataSearch(arr);
                            }
                        } else {
                            var arr = [];
                            res.data.forEach(element => {
                                if (element.icon) {
                                    if (element.visible) {
                                        if (element.visible == "All") {
                                            arr.push(element);
                                        }
                                    }
                                }
                                if (element.sub_title) {
                                    if (element.merchant_guide) {
                                        if (
                                            element.merchant_guide.visible ==
                                            "All"
                                        ) {
                                            arr.push(element);
                                        }
                                    }
                                }
                                if (element.sub_sub_title) {
                                    if (element.merchant_guide) {
                                        if (
                                            element.merchant_guide.visible ==
                                            "All"
                                        ) {
                                            arr.push(element);
                                        }
                                    }
                                }
                                if (element.merchant_guide_contentable_id) {
                                    if (element.parent[0].visible) {
                                        if (
                                            element.parent[0].visible == "All"
                                        ) {
                                            arr.push(element);
                                        }
                                    }
                                }
                            });
                            setDataSearch(arr);
                        }
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
                background: "white",
                marginRight: "40px",
                marginLeft: "40px",
                paddingBottom: "20px",
                paddingTop: "40px"
            }}
        >
            <Row>
                <Col md={18}>
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
                <Col md={6}>
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
                        {dataSearch &&
                            dataSearch.map((row, item) => {
                                var label = "";
                                var value = "";
                                var tag = "";
                                var root = "";

                                //guide

                                if (row.visible) {
                                    root =
                                        row.type == "guide"
                                            ? "guides"
                                            : "video-guides";

                                    label = row.title;
                                    value = `/${root}/` + row.id;
                                    tag = "";
                                }
                                //sub guide

                                if (row.sub_title) {
                                    root =
                                        row.merchant_guide.type == "guide"
                                            ? "guides"
                                            : "video-guides";

                                    label = row.sub_title;
                                    value = `/${root}/${row.merchant_guide.id}/sub/${row.id}`;
                                    tag = row.merchant_guide.title;
                                }
                                //sub sub guide
                                if (row.sub_sub_title) {
                                    root =
                                        row.merchant_guide.type == "guide"
                                            ? "guides"
                                            : "video-guides";

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
                                                ? "guides"
                                                : "video-guides";

                                        value = `/${root}/` + row.parent[0].id;
                                    }
                                    if (row.parent[0].sub_title) {
                                        root =
                                            row.parent[0].merchant_guide.type ==
                                            "guide"
                                                ? "guides"
                                                : "video-guides";

                                        value = `/${root}/${row.parent[0].merchant_guide.id}/sub/${row.parent[0].id}`;
                                    }

                                    if (row.parent[0].sub_sub_title) {
                                        root =
                                            row.parent[0].merchant_guide.type ==
                                            "guide"
                                                ? "guides"
                                                : "video-guides";

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
                            key="Guides"
                            onClick={() => {
                                history.push("/guides");
                            }}
                        >
                            Guides
                        </Menu.Item>
                        <Menu.Item
                            key="Video Guides"
                            onClick={() => {
                                history.push("/video-guides");
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
