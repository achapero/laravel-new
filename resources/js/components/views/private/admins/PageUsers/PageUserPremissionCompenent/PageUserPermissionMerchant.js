import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import moment, { isMoment } from "moment";

import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../providers/getUserData";

import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Checkbox,
    notification,
    Divider,
    Menu,
    Dropdown
} from "antd";
import ComponentCheckBox from "./componentCheckBox";

const PageUserPermissionMerchant = ({
    user_id,
    user_role,
    click,
    dataPermission,
    setDataPermission,
    handleSuperAdmin,
    handleAdmin,
    handleManager,
    handlePANAdmin,
    handleMerchantTicketsOnly,
    handleGiftOnly,
    handleMerchant
}) => {
    // const [dataPermission, setDataPermission] = useState([]);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // handlePermission()
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [dataPermission]);

    const [MarketplaceVP, setMarketplaceVP] = useState(0);

    const [BoardingVP, setBoardingVP] = useState(0);
    const [BoardingABTN, setBoardingABTN] = useState(0);
    const [BoardingVBTN, setBoardingVBTN] = useState(0);

    const [FilesVP, setFilesVP] = useState(0);
    const [FilesABTN, setFilesABTN] = useState(0);
    const [FilesDBTN, setFilesDBTN] = useState(0);

    const [GuidesVP, setGuidesVP] = useState(0);

    const [GiftCardVP, setGiftCardVP] = useState(0);
    const [GiftCardABTN, setGiftCardABTN] = useState(0);
    const [GiftCardDBTN, setGiftCardDBTN] = useState(0);
    const [GiftCardVBTN, setGiftCardVBTN] = useState(0);
    const [GiftCardVDash, setGiftCardVDash] = useState(0);
    const [GiftCardVCM, setGiftCardVCM] = useState(0);
    const [GiftCardVTM, setGiftCardVTM] = useState(0);
    const [GiftCardVR, setGiftCardVR] = useState(0);
    const [GiftCardVDM, setGiftCardVDM] = useState(0);
    const [GiftCardVAS, setGiftCardVAS] = useState(0);

    const [DisableGCVP, setDisableGCVP] = useState(0);
    const [DisableGCEBTN, setDisableGCEBTN] = useState(0);

    const [ClearentVP, setClearentVP] = useState(0);
    const [PaysafeVP, setPaysafeVP] = useState(0);

    const [TicketsVP, setTicketsVP] = useState(0);
    const [TicketsABTN, setTicketsABTN] = useState(0);
    const [TicketsVBTN, setTicketsVBTN] = useState(0);

    const [PanRequestVP, setPanRequestVP] = useState(0);

    const [ProfileVP, setProfileVP] = useState(0);
    const [ProfileRequest, setProfileRequest] = useState(0);

    const [TerminalsVP, setTerminalsVP] = useState(0);

    const {
        data: dataGetPermission,
        isLoading: isLoadingGetPermission
    } = useAxiosQuery(
        "GET",
        `api/v1/user_permission?user_id=${user_id}`,
        "users_permission_admin",
        res => {
            if (res.success) {
                console.log("users_permission_admin", res);
                res.data.map((data, index) => {
                    // console.log('defaultChecked', true)

                    if (
                        data.permission == "Marketplace" &&
                        data.permission_type == "view_page"
                    ) {
                        setMarketplaceVP(1);
                    }

                    if (
                        data.permission == "Boarding" &&
                        data.permission_type == "view_page"
                    ) {
                        setBoardingVP(1);
                    }
                    if (
                        data.permission == "Boarding" &&
                        data.permission_type == "add_btn"
                    ) {
                        setBoardingABTN(1);
                    }
                    if (
                        data.permission == "Boarding" &&
                        data.permission_type == "view_btn"
                    ) {
                        setBoardingVBTN(1);
                    }

                    if (
                        data.permission == "Files" &&
                        data.permission_type == "view_page"
                    ) {
                        setFilesVP(1);
                    }
                    if (
                        data.permission == "Files" &&
                        data.permission_type == "add_btn"
                    ) {
                        setFilesABTN(1);
                    }
                    if (
                        data.permission == "Files" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setFilesDBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "view_page"
                    ) {
                        setGuidesVP(1);
                    }

                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_page"
                    ) {
                        setGiftCardVP(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "add_btn"
                    ) {
                        setGiftCardABTN(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setGiftCardDBTN(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_btn"
                    ) {
                        setGiftCardVBTN(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_dashboard"
                    ) {
                        setGiftCardVDash(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_card_management"
                    ) {
                        setGiftCardVCM(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_terminal_management"
                    ) {
                        setGiftCardVTM(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_reports"
                    ) {
                        setGiftCardVR(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_data_management"
                    ) {
                        setGiftCardVDM(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_account_settings"
                    ) {
                        setGiftCardVAS(1);
                    }
                    if (
                        data.permission == "Disabled Gift Cards" &&
                        data.permission_type == "view_page"
                    ) {
                        setDisableGCVP(1);
                    }
                    if (
                        data.permission == "Disabled Gift Cards" &&
                        data.permission_type == "edit_btn"
                    ) {
                        setDisableGCEBTN(1);
                    }
                    if (
                        data.permission == "Clearent" &&
                        data.permission_type == "view_page"
                    ) {
                        setClearentVP(1);
                    }
                    if (
                        data.permission == "Paysafe" &&
                        data.permission_type == "view_page"
                    ) {
                        setPaysafeVP(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "view_page"
                    ) {
                        setTicketsVP(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "add_btn"
                    ) {
                        setTicketsABTN(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "view_btn"
                    ) {
                        setTicketsVBTN(1);
                    }
                    if (
                        data.permission == "PAN Request" &&
                        data.permission_type == "view_page"
                    ) {
                        setPanRequestVP(1);
                    }

                    if (
                        data.permission == "Profile" &&
                        data.permission_type == "view_page"
                    ) {
                        setProfileVP(1);
                    }
                    if (
                        data.permission == "Profile" &&
                        data.permission_type == "request_change_info"
                    ) {
                        setProfileRequest(1);
                    }
                    if (
                        data.permission == "Terminals" &&
                        data.permission_type == "view_page"
                    ) {
                        setTerminalsVP(1);
                    }
                });
            }
        }
    );
    const {
        mutate: mutateAddNewUser,
        isLoading: isLoadingAddNewUser
    } = useAxiosQuery(
        "POST",
        "api/v1/user_permission",
        "users_permission_admin"
    );
    const handleCheckChange = value => {
        console.log("handleCheckChange status", value);
        setDataPermission([...dataPermission, value]);
    };

    const handleFinist = () => {
        mutateAddNewUser(
            { value: dataPermission },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Permission Successfully Saved"
                    });
                }
            }
        );
    };

    const menu = (
        <Menu>
            <Menu.Item key={1}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleSuperAdmin("Super Admin")}
                >
                    Super Admin
                </Button>
            </Menu.Item>
            <Menu.Item key={2}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleAdmin("Super Admin")}
                >
                    Admin
                </Button>
            </Menu.Item>
            <Menu.Item key={3}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleManager("Manager")}
                >
                    Manager
                </Button>
            </Menu.Item>
            <Menu.Item key={4}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handlePANAdmin("PAN Admin")}
                >
                    PAN Admin
                </Button>
            </Menu.Item>
            <Menu.Item key={5}>
                <Button
                    block={true}
                    type="link"
                    onClick={() =>
                        handleMerchantTicketsOnly("Merchant: Tickets Only")
                    }
                >
                    Merchant: Tickets Only
                </Button>
            </Menu.Item>
            <Menu.Item key={6}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleGiftOnly("Gift Only")}
                >
                    Gift Only
                </Button>
            </Menu.Item>
            <Menu.Item key={7}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleMerchant("Merchant")}
                >
                    Merchant
                </Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={menu} placement="bottomLeft" arrow>
                <Button type="primary">Account Roles Presets</Button>
            </Dropdown>
            <Button style={{ marginLeft: "5px" }} onClick={e => handleFinist()}>
                Save Permission
            </Button>
            <Divider />
            <Row gutter={24}>
                <Col className="gutter-row" md={6} sm={6} xs={8}>
                    <h3>Marketplace</h3>
                    <ComponentCheckBox
                        data={MarketplaceVP}
                        role={user_role}
                        permission={"Marketplace"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <br />

                    <h3>Boarding</h3>
                    <ComponentCheckBox
                        data={BoardingVP}
                        role={user_role}
                        permission={"Boarding"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <ComponentCheckBox
                        data={BoardingABTN}
                        role={user_role}
                        permission={"Boarding"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />

                    <ComponentCheckBox
                        data={BoardingVBTN}
                        role={user_role}
                        permission={"Boarding"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
                    />

                    <br />

                    <h3>Files</h3>
                    <ComponentCheckBox
                        data={FilesVP}
                        role={user_role}
                        permission={"Files"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <ComponentCheckBox
                        data={FilesABTN}
                        role={user_role}
                        permission={"Files"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />

                    <ComponentCheckBox
                        data={FilesDBTN}
                        role={user_role}
                        permission={"Files"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />

                    <br />
                    <h3>Guides</h3>

                    <ComponentCheckBox
                        data={GuidesVP}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                </Col>

                <Col className="gutter-row" md={6} sm={6} xs={8}>
                    <h3>Gift Cards</h3>

                    <ComponentCheckBox
                        data={GiftCardVP}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <ComponentCheckBox
                        data={GiftCardABTN}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />
                    <ComponentCheckBox
                        data={GiftCardDBTN}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />
                    <ComponentCheckBox
                        data={GiftCardVBTN}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
                    />
                    <ComponentCheckBox
                        data={GiftCardVDash}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_dashboard"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Dashboard"
                    />

                    <ComponentCheckBox
                        data={GiftCardVCM}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_card_management"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Card Management"
                    />
                    <ComponentCheckBox
                        data={GiftCardVTM}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_terminal_management"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Terminal Management"
                    />
                    <ComponentCheckBox
                        data={GiftCardVR}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_reports"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Reports"
                    />
                    <ComponentCheckBox
                        data={GiftCardVDM}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_data_management"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Data Management"
                    />
                    <ComponentCheckBox
                        data={GiftCardVAS}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_account_settings"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Account Settings"
                    />
                    <br />

                    <h3>Disabled Gift Cards</h3>

                    <ComponentCheckBox
                        data={DisableGCVP}
                        role={user_role}
                        permission={"Disabled Gift Cards"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <ComponentCheckBox
                        data={DisableGCEBTN}
                        role={user_role}
                        permission={"Disabled Gift Cards"}
                        permission_type={"edit_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Edit"
                    />
                </Col>

                <Col className="gutter-row" md={6} sm={6} xs={8}>
                    <h3>Clearent</h3>
                    <ComponentCheckBox
                        data={ClearentVP}
                        role={user_role}
                        permission={"Clearent"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <br />
                    <h3>Paysafe</h3>
                    <ComponentCheckBox
                        data={PaysafeVP}
                        role={user_role}
                        permission={"Paysafe"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <br />
                    <h3>Tickets</h3>
                    <ComponentCheckBox
                        data={TicketsVP}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={TicketsABTN}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />

                    <br />

                    <h3>PAN Request</h3>
                    <ComponentCheckBox
                        data={PanRequestVP}
                        role={user_role}
                        permission={"PAN Request"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <h3>Profile</h3>
                    <ComponentCheckBox
                        data={ProfileVP}
                        role={user_role}
                        permission={"Profile"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <ComponentCheckBox
                        data={ProfileRequest}
                        role={user_role}
                        permission={"Profile"}
                        permission_type={"request_change_info"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Request Change Info"
                    />

                    <br />
                </Col>
                <Col className="gutter-row" md={6} sm={6} xs={8}>
                    {" "}
                    <h3>Terminals</h3>
                    <ComponentCheckBox
                        data={TerminalsVP}
                        role={user_role}
                        permission={"Terminals"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Terminals"
                    />
                </Col>
            </Row>
        </>
    );
};

export default PageUserPermissionMerchant;
