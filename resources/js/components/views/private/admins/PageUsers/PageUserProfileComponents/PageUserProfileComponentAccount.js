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
    Modal,
    Form,
    Checkbox,
    Typography,
    Tag,
    Select
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
    ArrowLeftOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";
import { arrayColumn } from "../../../../../providers/arrayColumn";
import { arrayColumn1 } from "../../../../../providers/arrayColumn1";
import ModalApiKey from "./ModalApiKey";

const PageUserProfileComponentAccount = ({ user_id, dataUser }) => {
    const { Option } = Select;
    const { TextArea } = Input;
    const { Title } = Typography;
    const [form] = Form.useForm();

    const [options, setOptions] = useState({
        profiles: [],
        boarding: [],
        paysafe: [],
        clearent: [],
        gift: []
    });
    const [values, setValues] = useState({
        paysafe: [],
        clearent: [],
        gift: [],
        boarding: [],
        profile: []
    });

    const [reservedMIDS, setReservedMIDS] = useState([]);
    const [userDetails, setUserDetails] = useState();

    const [profiles, setProfiles] = useState();
    const [paysafe, setPaysafe] = useState();
    const [clearent, setClearent] = useState();
    const [boarding, setBoarding] = useState();
    const [gift, setGift] = useState();

    const {
        data: dataUserLink,
        isLoading: isLoadingUserLink,
        isFetching: isFetchingUserLink,
        refetch: refetchUserLink
    } = useAxiosQuery(
        "GET",
        `api/v1/user_account_links?user_id=${user_id}`,
        `user_account_links_${user_id}`,
        res => {
            console.log("dataUserLink", res);

            // var a = arrayColumn1(res.values.gift, "value", res.options.gift);
            // console.log("atay", a);
        }
    );

    const {
        mutate: mutateUpdateUserLink,
        isLoading: isLoadingUpadateUserLink
    } = useAxiosQuery(
        `POST`,
        `api/v1/user_account_links`,
        `user_account_links_${user_id}`
    );

    const onSelectHandler = (data, type, post_type) => {
        mutateUpdateUserLink(
            { user_id, data, type, post_type },
            {
                onSuccess: res => {
                    refetchUserLink();
                    notification.success({
                        message: "Success",
                        description: type + " has been successfully updated!"
                    });
                    // console.log(res)
                }
            }
        );
    };

    const deSelectHandler = (data, type) => {
        // console.log(user_id, data, type)
        mutateUpdateUserLink(
            { user_id, data, type },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Success",
                        description: type + " has been successfully Delete!"
                    });
                    // console.log(res);
                }
            }
        );
    };

    const {
        data: dataAccount,
        isLoading: isLoadingAccount,
        refetch: refetchAccount
    } = useAxiosQuery(
        `GET`,
        `api/v1/user_account_links?user_id=${user_id}`,
        `user_account_links_user_id_${user_id}`,
        res => {
            if (res.success) {
                let _paysafe = res.options.paysafe;

                _paysafe.map((data, key) => {
                    let id = data.merchant_number;

                    if (id.length > 5) {
                        id = id.substring(
                            id.length - 5 < 0 ? 0 : id.length - 5,
                            id.length
                        );
                    }
                    if (id.length == 5) {
                        id = `**********${id}`;
                    }

                    data.label = data.label + " (" + id + ")";
                });

                setOptions({ ...res.options, ..._paysafe });
                setUserDetails(res.user);

                let values = res.values;
                values.gift.map((gift, key) => {
                    let _option_gift = res.options.gift.find(
                        p => p.value == gift.value
                    );
                    if (_option_gift) {
                        gift["label"] = _option_gift.label;
                    }
                });

                values.paysafe.map((data, key) => {
                    let id = data.merchant_number;

                    if (id.length > 5) {
                        id = id.substring(
                            id.length - 5 < 0 ? 0 : id.length - 5,
                            id.length
                        );
                    }
                    if (id.length == 5) {
                        id = `**********${id}`;
                    }

                    data.label = data.label + " (" + id + ")";
                });

                setValues({ ...values });
            }
        }
    );

    const autoLink = type => {
        let owner = userDetails.name;

        let new_values = [...values[type]];
        options[type].map((option, key) => {
            let option_owner = option.owner;
            if (option_owner.toLowerCase() == owner.toLowerCase()) {
                let _temp = new_values.find(p => p.value == option.value);
                if (!_temp) {
                    new_values.push({
                        value: option.value,
                        label: option.label
                    });
                }
            }

            let label = userDetails.user_fields.merchant_name;
            let option_label = option.label;
            if (label) {
                if (option_label.toLowerCase() == label.toLowerCase()) {
                    let _temp = new_values.find(p => p.value == option.value);
                    if (!_temp) {
                        new_values.push({
                            value: option.value,
                            label: option.label
                        });
                    }
                }
            }

            let email = userDetails.email;
            // console.log("userDetails", userDetails, userDetails.email);
            if (option_label.toLowerCase() == email.toLowerCase()) {
                let _temp = new_values.find(p => p.value == option.value);
                if (!_temp) {
                    new_values.push({
                        value: option.value,
                        label: option.label
                    });
                }
            }
        });
        // console.log("new_values", new_values);
        // console.log("new_type", type);
        if (new_values.length > 0) {
            onSelectHandler(new_values, type, "autolink");
            // setValues({ ...values, [type]: new_values });
        }
    };

    const [showModalApiKey, setShowModalApiKey] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState();
    const toggleShowModalApiKey = record => {
        setSelectedMerchant(record);
        setShowModalApiKey(true);
        // console.log(record);
    };

    const {
        data: dataReserveMids,
        isLoading: isLoadingReserveMids,
        refetch: refetchReserveMids
    } = useAxiosQuery(
        `GET`,
        `api/v1/clearent/reservemids?user_id=${user_id}`,
        `reservemids_${user_id}`,
        res => {
            if (res.success) {
                let mids = [];
                res.data.map((mid, key) => {
                    mids.push(mid.merchantNumber);
                });
                setReservedMIDS(mids);
            }
        }
    );

    useEffect(() => {
        // getAccounts();
        refetchReserveMids();
        return () => {};
    }, []);

    const [btnReserveMIDText, setbtnReserveMIDText] = useState("Reserve MID");
    const reseveMid = () => {
        setbtnReserveMIDText(
            <div>
                <i className="fa fa-spin fa-circle-o-notch"></i>
            </div>
        );
        mutateReverse(
            { user_id: user_id },
            {
                onSuccess: res => {
                    if (res.success) {
                        setbtnReserveMIDText("Reserve MID");
                        // getReserveMids();
                    }
                }
            }
        );
    };

    const {
        mutate: mutateReverse,
        isLoading: isLoadingReverse
    } = useAxiosQuery(
        `POST`,
        `api/v1/clearent/reservemids`,
        `reservemids_${user_id}`
    );

    return (
        <Form name="Overview" layout="vertical">
            <Divider orientation="right" plain>
                <Title level={2}>Accounts</Title>
            </Divider>

            {dataUserLink &&
                dataUserLink.user.role === "Merchant: Tickets Only" && (
                    <Row gutter={24}>
                        <Col className="gutter-row" span={24}>
                            <Form.Item
                                label={
                                    <span>
                                        <b>Merchants Ticket Access</b>
                                    </span>
                                }
                            >
                                {dataUserLink && (
                                    <Select
                                        mode="multiple"
                                        placeholder="Merchants Ticket Access..."
                                        value={arrayColumn(
                                            dataUserLink.values.merchantTickets,
                                            "value"
                                        )}
                                        onSelect={e =>
                                            onSelectHandler(
                                                e,
                                                "merchantTickets"
                                            )
                                        }
                                        onDeselect={e =>
                                            deSelectHandler(
                                                e,
                                                "merchantTickets"
                                            )
                                        }
                                        loading={isLoadingUpadateUserLink}
                                        filterOption={(input, option) =>
                                            option.children[1]
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >=
                                            0
                                        }
                                        showSearch
                                    >
                                        {dataUserLink.options.merchantTickets.map(
                                            (merchantTickets, key) => {
                                                return (
                                                    <Select.Option
                                                        key={
                                                            "merchantTickets_" +
                                                            key
                                                        }
                                                        value={
                                                            merchantTickets.value
                                                        }
                                                    >
                                                        {" "}
                                                        {
                                                            merchantTickets.label
                                                        }{" "}
                                                    </Select.Option>
                                                );
                                            }
                                        )}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                )}

            <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                    <Form.Item
                        label={
                            <span>
                                <b>PN Sub Profiles</b>
                            </span>
                        }
                    >
                        {dataUserLink && (
                            <Select
                                mode="multiple"
                                placeholder="PN Sub Profiles..."
                                value={arrayColumn1(
                                    dataUserLink.values.profile,
                                    "value",
                                    dataUserLink.options.profiles
                                )}
                                onSelect={e => onSelectHandler(e, "profile")}
                                onDeselect={e => deSelectHandler(e, "profile")}
                                loading={isLoadingUpadateUserLink}
                                filterOption={(input, option) =>
                                    option.children[1]
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                            >
                                {dataUserLink.options.profiles.map(
                                    (profile, key) => {
                                        return (
                                            <Select.Option
                                                key={"profile_" + key}
                                                value={profile.value}
                                            >
                                                {" "}
                                                {profile.label}{" "}
                                            </Select.Option>
                                        );
                                    }
                                )}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                    <div
                        style={{
                            width: "100%",
                            marginLeft: "0px",
                            position: "absolute"
                        }}
                    >
                        <Button
                            key="PaySafe"
                            type="Auto Link"
                            className="pull-right"
                            style={{
                                float: "right",
                                right: "24px",
                                top: "-5px",
                                zIndex: "1",
                                background: "#13c2c2",
                                color: "#ffffff",
                                border: "1px solid #13c2c2"
                            }}
                            onClick={e => autoLink("paysafe")}
                        >
                            Auto Link
                        </Button>
                    </div>
                    <Form.Item
                        label={
                            <span>
                                <b>PaySafe</b>
                            </span>
                        }
                    >
                        {dataUserLink && (
                            <Select
                                mode="multiple"
                                placeholder="Search PaySafe Account..."
                                value={arrayColumn1(
                                    dataUserLink.values.paysafe,
                                    "value",
                                    dataUserLink.options.paysafe
                                )}
                                onSelect={e => onSelectHandler(e, "paysafe")}
                                onDeselect={e => deSelectHandler(e, "paysafe")}
                                loading={isLoadingUpadateUserLink}
                                filterOption={(input, option) =>
                                    option.children[1]
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                            >
                                {dataUserLink.options.paysafe.map(
                                    (paysafe, key) => {
                                        return (
                                            <Select.Option
                                                key={"paysafe_" + key}
                                                value={paysafe.value}
                                            >
                                                {" "}
                                                {`${paysafe.label +
                                                    " (" +
                                                    paysafe.merchant_number +
                                                    ")"}`}
                                            </Select.Option>
                                        );
                                    }
                                )}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                    <div
                        style={{
                            width: "100%",
                            marginLeft: "0px",
                            position: "absolute"
                        }}
                    >
                        <Button
                            key="Clearent_Reporting"
                            type="Auto Link"
                            className="pull-right"
                            style={{
                                float: "right",
                                right: "24px",
                                top: "-5px",
                                zIndex: "1",
                                background: "#13c2c2",
                                color: "#ffffff",
                                border: "1px solid #13c2c2"
                            }}
                            onClick={e => autoLink("clearent")}
                        >
                            Auto Link
                        </Button>
                    </div>
                    <Form.Item
                        label={
                            <div>
                                <span style={{ marginRight: "5px" }}>
                                    <b>Clearent Reporting</b>{" "}
                                    <span>(approved accounts only)</span>
                                </span>
                                {dataUserLink && (
                                    <Space>
                                        {dataUserLink.values.clearent.map(
                                            (clearent, key) => {
                                                return (
                                                    <Button
                                                        key={`clearent_api_key_button_${clearent.value}`}
                                                        type="primary"
                                                        size="small"
                                                        style={{
                                                            background:
                                                                "#d48806",
                                                            border:
                                                                "1px solid #d48806",
                                                            color: "#ffffff"
                                                        }}
                                                        onClick={e =>
                                                            toggleShowModalApiKey(
                                                                {
                                                                    merchantNumber:
                                                                        clearent.value
                                                                }
                                                            )
                                                        }
                                                    >
                                                        API Key:{" "}
                                                        {clearent.label}
                                                    </Button>
                                                );
                                            }
                                        )}
                                    </Space>
                                )}
                            </div>
                        }
                    >
                        {dataUserLink && (
                            <Select
                                mode="multiple"
                                placeholder="Search Clearent Reporting Account..."
                                value={arrayColumn1(
                                    dataUserLink.values.clearent,
                                    "value",
                                    dataUserLink.options.clearent
                                )}
                                onSelect={e => onSelectHandler(e, "clearent")}
                                onDeselect={e => deSelectHandler(e, "clearent")}
                                loading={isLoadingUpadateUserLink}
                                filterOption={(input, option) =>
                                    option.children[1]
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                            >
                                {dataUserLink.options.clearent.map(
                                    (clearent, key) => {
                                        return (
                                            <Select.Option
                                                key={"clearent_" + key}
                                                value={clearent.value}
                                            >
                                                {" "}
                                                {`${clearent.label +
                                                    " (" +
                                                    clearent.value +
                                                    ")"}`}
                                            </Select.Option>
                                        );
                                    }
                                )}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                    <div
                        style={{
                            width: "100%",
                            marginLeft: "0px",
                            position: "absolute"
                        }}
                    >
                        <Button
                            key="PN_Sub_Profiles_1"
                            type="Auto Link"
                            className="pull-right"
                            style={{
                                float: "right",
                                right: "24px",
                                top: "-5px",
                                zIndex: "1",
                                background: "#13c2c2",
                                color: "#ffffff",
                                border: "1px solid #13c2c2"
                            }}
                            onClick={e => autoLink("boarding")}
                        >
                            Auto Link
                        </Button>
                        <Button
                            key="PN_Sub_Profiles_2"
                            type="Auto Link"
                            className="pull-right"
                            style={{
                                float: "right",
                                right: "24px",
                                top: "-5px",
                                zIndex: "1",
                                background: "#13c2c2",
                                color: "#ffffff",
                                border: "1px solid #13c2c2",
                                marginRight: "5px"
                            }}
                            onClick={e => reseveMid()}
                        >
                            {btnReserveMIDText}
                        </Button>
                        <small
                            className="pull-right"
                            style={{
                                fontSize: "12px",
                                lineHeight: "2.3",
                                marginRight: "33px"
                            }}
                        >
                            {reservedMIDS.length > 0 && (
                                <div>({reservedMIDS.join(", ")})</div>
                            )}
                        </small>
                    </div>
                    <Form.Item
                        label="PN Sub Profiles"
                        label={
                            <div>
                                <span style={{ marginRight: "5px" }}>
                                    <b>Clearent Boarding</b>
                                </span>
                                {dataUserLink && (
                                    <Space>
                                        {dataUserLink.values.boarding.map(
                                            (boarding, key) => {
                                                return (
                                                    <Button
                                                        key={`boarding_api_key_button_${boarding.value}`}
                                                        type="primary"
                                                        size="small"
                                                        style={{
                                                            background:
                                                                "#d48806",
                                                            border:
                                                                "1px solid #d48806",
                                                            color: "#ffffff"
                                                        }}
                                                        onClick={e =>
                                                            toggleShowModalApiKey(
                                                                {
                                                                    merchantNumber:
                                                                        boarding.value
                                                                }
                                                            )
                                                        }
                                                    >
                                                        API Key:{" "}
                                                        {boarding.label}
                                                    </Button>
                                                );
                                            }
                                        )}
                                    </Space>
                                )}
                            </div>
                        }
                    >
                        {dataUserLink && (
                            <Select
                                mode="multiple"
                                placeholder="Search Clearent Boarding Account..."
                                value={arrayColumn1(
                                    dataUserLink.values.boarding,
                                    "value",
                                    dataUserLink.options.boarding
                                )}
                                onSelect={e => onSelectHandler(e, "boarding")}
                                onDeselect={e => deSelectHandler(e, "boarding")}
                                loading={isLoadingUpadateUserLink}
                                filterOption={(input, option) =>
                                    option.children[1]
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                            >
                                {dataUserLink.options.boarding.map(
                                    (boarding, key) => {
                                        return (
                                            <Select.Option
                                                key={"boarding_" + key}
                                                value={boarding.value}
                                            >
                                                {" "}
                                                {`${boarding.label +
                                                    " (" +
                                                    boarding.value +
                                                    ")"}`}
                                            </Select.Option>
                                        );
                                    }
                                )}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col className="gutter-row" span={24}>
                    <div
                        style={{
                            width: "100%",
                            marginLeft: "0px",
                            position: "absolute"
                        }}
                    >
                        <Button
                            key="Gift_Card"
                            type="Auto Link"
                            className="pull-right"
                            style={{
                                float: "right",
                                right: "24px",
                                top: "-5px",
                                zIndex: "1",
                                background: "#13c2c2",
                                color: "#ffffff",
                                border: "1px solid #13c2c2"
                            }}
                            onClick={e => autoLink("gift")}
                        >
                            Auto Link
                        </Button>
                    </div>
                    <Form.Item
                        label="PN Sub Profiles"
                        label={
                            <span>
                                <b>Gift Card</b>
                            </span>
                        }
                    >
                        {dataUserLink && (
                            <Select
                                mode="multiple"
                                placeholder="Search Gift Card Account..."
                                value={arrayColumn1(
                                    dataUserLink.values.gift,
                                    "value",
                                    dataUserLink.options.gift
                                )}
                                onSelect={e => onSelectHandler(e, "gift")}
                                onDeselect={e => deSelectHandler(e, "gift")}
                                loading={isLoadingUpadateUserLink}
                                filterOption={(input, option) =>
                                    option.children[1]
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                            >
                                {dataUserLink.options.gift.map((gift, key) => {
                                    return (
                                        <Select.Option
                                            key={"gift_" + key}
                                            value={gift.value}
                                        >
                                            {" "}
                                            {`${gift.label +
                                                " (" +
                                                gift.guid +
                                                ")"}`}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>

            {showModalApiKey && (
                <ModalApiKey
                    showModalApiKey={showModalApiKey}
                    setShowModalApiKey={setShowModalApiKey}
                    toggleShowModalApiKey={toggleShowModalApiKey}
                    selectedMerchant={selectedMerchant}
                />
            )}
        </Form>
    );
};

export default PageUserProfileComponentAccount;
