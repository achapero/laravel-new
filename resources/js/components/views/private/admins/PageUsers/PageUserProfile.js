import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Input,
    Table,
    Popconfirm,
    Divider,
    notification,
    Image,
    Tooltip,
    Drawer,
    Space,
    Tabs,
    Menu,
    Typography,
    Dropdown
} from "antd";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    UserAddOutlined,
    ArrowLeftOutlined,
    AuditOutlined ,
    MailOutlined,
    AppstoreOutlined,
    TagOutlined,
    LockOutlined,
    UsergroupAddOutlined,
    RedEnvelopeOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";
import { values } from "lodash";
import ChangePassword from "./Modals/ChangePassword";
import ChangeEmail from "./Modals/ChangeEmail";
import PageUserProfileComponentOverview from "./PageUserProfileComponents/PageUserProfileComponentOverview";
import PageUserProfileComponentAccount from "./PageUserProfileComponents/PageUserProfileComponentAccount";
import PageUserProfileComponentAsset from "./PageUserProfileComponents/PageUserProfileComponentAsset";
import PageUserProfileComponentTickets from "./PageUserProfileComponents/PageUserProfileComponentTickets";
import PageUserProfileComponentFiles from "./PageUserProfileComponents/PageUserProfileComponentFiles";
import PageUserProfileComponentAutNet from "./PageUserProfileComponents/PageUserProfileComponentAutNet";
import ModaEmailChange from "../PageSettings/ModaEmailChange";
import Title from "antd/lib/typography/Title";
import PageUserProfileComponentExtraUsers from "./PageUserProfileComponents/PageUserProfileComponentExtraUsers";
import getCheckPermission from "../../../../providers/getCheckPermission";
const PageUserProfile = ({ match, permission }) => {
    const { TabPane } = Tabs;
    let user_id = match.params.id;
    const [Name, setName] = useState();
    const [userProfileData, setUserProfileData] = useState({});

    const obj = getUserData();
    const [OldEmail, setOldEmail] = useState(obj.email);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [emailError, setEmailError] = useState(0);

    const {
        data: dataUser,
        isLoading: isLoadingDataUser,
        isFetching: isFetchingDataUser
    } = useAxiosQuery(
        "GET",
        `api/v1/users/${user_id}`,
        `edit_user_${user_id}`,
        res => {
            // console.log('@user_id', user_id);
            console.log("@profile", res.data.merchant_name);
            localStorage.setItem("merchantNameTitle", res.data.merchant_name);
            setOldEmail(res.data.email);
            setUserProfileData(res.data);
            setName(res.data.name);
            getMids();
            setTimeout(() => getCheckPermission(permission), 500);
        }
    );

    const {
        mutate: mutateUsertGetMids,
        isLoading: isLoadingUserGetMids
    } = useAxiosQuery("POST", "api/v1/users/getMids", "mutate_user_getmids");

    const {
        mutate: mutateUserRecent,
        isLoading: isLoadingUserRecent
    } = useAxiosQuery("POST", "api/v1/user/recent", "mutate_users_rcent");

    let init = 1;

    const getMids = () => {
        mutateUsertGetMids(
            { id: user_id },
            {
                onSuccess: res => {
                    var record = res.data[0];
                    // console.log('record["gift"]', res.data);
                    let _mids = [];

                    if (record.user_links) {
                        record.user_links.map((row, key) => {
                            let type = row.type;
                            // console.log(row.type)
                            let id;
                            if (type == "paysafe") {
                                id = record["paysafe"]
                                    ? record["paysafe"].merchant_number
                                    : "";
                            } else if (type == "clearent") {
                                id = record["clearent"]
                                    ? record["clearent"].merchantNumber
                                    : "";
                            } else {
                                // id = record["gift"].id;
                                id = row.id;
                            }
                            id = id.toString();
                            if (id.length > 4) {
                                id = id.substring(
                                    id.length - 4 < 0 ? 0 : id.length - 4,
                                    id.length
                                );
                            }
                            if (id.length == 4) {
                                id = `****${id}`;
                            }
                            _mids.push(id);
                        });
                    }
                    _mids = _mids.join(",, ");
                    _mids = _mids.split(", ");
                    if (_mids.length) {
                        var merchantNumber = "";
                        _mids.map(id => {
                            merchantNumber += "" + id + "";
                        });
                        var merchantNumberFinal = merchantNumber
                            ? "(" + merchantNumber + ")"
                            : "";
                    }
                    if (_mids.length) {
                        merchantNumber = "none";
                        merchantName = "";
                    }
                    if (record.user_fields) {
                        var a = record.user_fields.merchant_name
                            ? record.user_fields.merchant_name
                            : "no merchant name";
                        var merchantName =
                            "<div style='font-weight:bold;'>" + a + " </div>";
                    } else {
                        merchantName =
                            " <div style='font-weight:bold;'> no merchant name  </div>";
                        merchantNumber = "";
                    }
                    console.log(_mids);
                    if (init) {
                        let data = {
                            title:
                                " " +
                                merchantName +
                                " " +
                                merchantNumberFinal +
                                "",
                            type: "Profile",
                            url: `${window.location.origin}/profiles/${match.params.id}`
                        };
                        mutateUserRecent(data, {
                            onSuccess: res => {}
                        });

                        init = 0;
                    }
                }
            }
        );
    };

    function callback(key) {}

    const myRefProfile = useRef(null);
    const executeScrollProfile = () =>
        myRefProfile.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    const myRefAccount = useRef(null);
    const executeScrollAccount = () =>
        myRefAccount.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    const myRefAsset = useRef(null);
    const executeScrollAsset = () =>
        myRefAsset.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    const myRefTicket = useRef(null);
    const executeScrollTicket = () =>
        myRefTicket.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    const myRefFile = useRef(null);
    const executeScrollFile = () =>
        myRefFile.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    const myRefAuthNet = useRef(null);
    const executeScrollAuthNet = () =>
        myRefAuthNet.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    const myRefExtraUsers = useRef(null);
    const executeScrollExtraUsers = () =>
        myRefExtraUsers.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    const [State, setState] = useState();

    const [modalChangePassword, setModalChangePassword] = useState(false);
    const [modalChangeEmail, setModalChangeEmail] = useState(false);

    const toggleModalChangePassword = (e = null) => {
        setModalChangePassword(true);
    };

    const toggleModalChangeEmail = (e = null) => {
        setModalChangeEmail(true);
    };

    const {
        mutate: mutateResendInvite,
        isLoading: isLoadingResendInvite
    } = useAxiosQuery("POST", "api/v1/resend_invite", "mutate_resend_invite");

    const resendInvite = () => {
        mutateResendInvite(
            { email: userProfileData.email, name: userProfileData.name },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Invitation Sent Successfully"
                    });
                }
            }
        );
    };

    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Button
                    icon={<MailOutlined />}
                    type="link"
                    // style={{
                    // fontSize: "10px",
                    // marginRight: "5px",
                    // background: "rgb(248, 107, 107)",
                    // borderColor: " rgb(248, 107, 107)"
                    // }}
                    onClick={e => toggleModalChangeEmail()}
                >
                    Change Email{" "}
                </Button>
            </Menu.Item>
            <Menu.Item key="1">
                <Button
                    icon={<LockOutlined />}
                    type="link"
                    // style={{
                    // fontSize: "10px",
                    // marginRight: "5px",
                    // background: "rgb(248, 107, 107)",
                    // borderColor: " rgb(248, 107, 107)"
                    // }}
                    onClick={e => {
                        toggleModalChangePassword();
                    }}
                >
                    Change Password{" "}
                </Button>
            </Menu.Item>
            <Menu.Item key="2">
                <Button
                    icon={<TagOutlined />}
                    type="link"
                    // style={{
                    //     fontSize: "10px",
                    //     marginRight: "5px",
                    //     background: "rgb(255, 193, 9)",
                    //     borderColor: " rgb(255, 193, 9)"
                    // }}
                    onClick={() => {
                        window.location.href =
                            "/tickets/add?email=" +
                            userProfileData.email +
                            "&name=" +
                            userProfileData.name +
                            "&id=" +
                            userProfileData.id;
                    }}
                >
                    Create Ticket For This Merchant
                </Button>
            </Menu.Item>
            <Menu.Item key="3">
                <Button
                    icon={<UsergroupAddOutlined />}
                    type="link"
                    // style={{
                    //     fontSize: "10px",
                    //     marginRight: "5px",
                    //     background: "rgb(76, 189, 116)",
                    //     borderColor: " rgb(76, 189, 116)"
                    // }}
                    loading={isLoadingResendInvite}
                    onClick={() => resendInvite()}
                >
                    Resend Invite
                </Button>
            </Menu.Item>
            <Menu.Item key="3">
                <Button
                    type="link"
                    title="Permission"
                    name="permission_btn"
                    icon={<AuditOutlined  />}
                    onClick={e => {
                        // if ( record.role == "Advisor" ) {
                        //     history.push(
                        //         `/advisor/edit/${record.id}`
                        //     );
                        // } else {
                        // }
                        history.push(
                            `/profiles/permission/${record.id}`
                        );
                    }}

                >Permissions</Button>
            </Menu.Item>
            <Menu.Item key="4">
                <Link to="/profiles">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="link"
                        onClick={e => {
                            toggleModalChangePassword();
                        }}
                    >
                        Back to list
                    </Button>
                </Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Content
            className="site-layout-background pageuserprofile"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            <Row gutter={24}>
                <Col className="gutter-row" span={16} offset={4}>
                    {dataUser && (
                        <Card
                            title={
                                <Typography.Title
                                    level={3}
                                    style={{
                                        textOverflow: "ellipsis",
                                        overflow: "hidden"
                                    }}
                                >
                                    {Name + " Profile "}{" "}
                                    {userProfileData.merchant_name &&
                                        "-" + userProfileData.merchant_name}
                                </Typography.Title>
                            }
                            extra={
                                <>
                                    {userProfileData && (
                                        <Dropdown
                                            overlay={menu}
                                            placement="topRight"
                                        >
                                            <Button type="primary">
                                                <SettingOutlined />
                                                Options
                                            </Button>
                                        </Dropdown>
                                    )}
                                </>
                            }
                        >
                            <br></br>
                            <br></br>
                            <Menu mode="horizontal" selectedKeys={"Profiles"}>
                                <Menu.Item
                                    key="Profiles"
                                    onClick={executeScrollProfile}
                                    className="view_profile_btn"
                                >
                                    Profiles
                                </Menu.Item>
                                <Menu.Item
                                    key="Accounts"
                                    onClick={executeScrollAccount}
                                    className="view_account_btn"
                                >
                                    Accounts
                                </Menu.Item>
                                <Menu.Item
                                    key="Assets"
                                    onClick={executeScrollAsset}
                                    className="view_asset_btn"
                                >
                                    Assets
                                </Menu.Item>
                                <Menu.Item
                                    key="Tickets"
                                    onClick={executeScrollTicket}
                                    className="view_ticket_btn"
                                >
                                    Tickets
                                </Menu.Item>
                                <Menu.Item
                                    key="Files"
                                    onClick={executeScrollFile}
                                    className="view_file_btn"
                                >
                                    Files
                                </Menu.Item>
                                <Menu.Item
                                    key="AuthNets"
                                    onClick={executeScrollAuthNet}
                                    className="view_authnet_btn"
                                >
                                    AuthNet
                                </Menu.Item>
                                <Menu.Item
                                    key="ExtraUsers"
                                    onClick={executeScrollExtraUsers}
                                    className="view_extra_user_btn"
                                >
                                    Extra Users
                                </Menu.Item>
                            </Menu>

                            <div
                                ref={myRefProfile}
                                className="view_profile_btn"
                            >
                                <PageUserProfileComponentOverview
                                    Name={Name}
                                    user_id={user_id}
                                    dataUser={dataUser}
                                />
                            </div>

                            <div
                                ref={myRefAccount}
                                className="view_account_btn"
                            >
                                <PageUserProfileComponentAccount
                                    user_id={user_id}
                                    dataUser={dataUser}
                                />
                            </div>

                            <div ref={myRefAsset} className="view_asset_btn">
                                <PageUserProfileComponentAsset
                                    user_id={user_id}
                                    dataUser={dataUser}
                                />
                            </div>

                            <div ref={myRefTicket} className="view_ticket_btn">
                                <PageUserProfileComponentTickets
                                    user_id={user_id}
                                    dataUser={dataUser}
                                />
                            </div>

                            <div ref={myRefFile} className="view_file_btn">
                                <PageUserProfileComponentFiles
                                    user_id={user_id}
                                    dataUser={dataUser}
                                />
                            </div>

                            <div
                                ref={myRefAuthNet}
                                className="view_authnet_btn"
                            >
                                <PageUserProfileComponentAutNet
                                    user_id={user_id}
                                    dataUser={dataUser}
                                />
                            </div>
                            <div
                                ref={myRefExtraUsers}
                                className="view_extra_user_btn"
                            >
                                <PageUserProfileComponentExtraUsers
                                    user_id={user_id}
                                    dataUser={dataUser}
                                />
                            </div>
                        </Card>
                    )}
                </Col>
            </Row>
            <br></br>
            <ChangePassword
                modalChangePassword={modalChangePassword}
                setModalChangePassword={setModalChangePassword}
                userProfileData={userProfileData}
            />
            <ChangeEmail
                modalChangeEmail={modalChangeEmail}
                setModalChangeEmail={setModalChangeEmail}
                userProfileData={userProfileData}
            />
        </Content>
    );
};

export default PageUserProfile;
