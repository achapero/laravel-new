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
    Form,
    Divider,
    Space,
    Menu,
    Dropdown
} from "antd";

import ComponentCheckBox from "./componentCheckBox";

const PageUserPermissionAdmin = ({
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
    handleMerchant,
    // superAdmin
}) => {
    const [form] = Form.useForm();

    const [RTADATA, setRTADATA] = useState(0)

    const {
        mutate: mutateAddNewUser,
        isLoading: isLoadingAddNewUser
    } = useAxiosQuery(
        "POST",
        "api/v1/user_permission",
        "users_permission_admin_pre_save"
    );

    const {
        mutate: mutateUpdateUser,
        isLoading: isLoadingUpdateUser
    } = useAxiosQuery(
        "POST",
        "api/v1/users/updateReceivedTicketAlert",
        "users_permission_admin_pre_save"
    );

    const handleCheckChange = value => {
        console.log("handleCheckChange status", value);
        // mutateAddNewUser(value, {
        //     onSuccess: res => {
        //         // notification.success({
        //         //     message: "Permission Successfully Saved"
        //         // });
        //     }
        // });
        setDataPermission([
            ...dataPermission,
            value
        ])
    };


    const handleFinist = () => {
        mutateAddNewUser({value :dataPermission}, {
            onSuccess: res => {
                notification.success({
                    message: "Permission Successfully Saved"
                });
            }
        });
        mutateUpdateUser(RTADATA, {
            onSuccess: res => {
                // notification.success({
                //     message: "Permission Successfully Saved"
                // });
            }
        });
    }


    useEffect(() => {
        console.log('handleCheckChange status', dataPermission)
    }, [dataPermission])


    // Marketplac
    const [MarketplaceVP, setMarketplaceVP] = useState(0);

    // DashboardVP
    const [DashboardVP, setDashboardVP] = useState(0);

    // Boarding
    const [BoardingVP, setBoardingVP] = useState(0);
    const [BoardingABTN, setBoardingABTN] = useState(0);
    const [BoardingVBTN, setBoardingVBTN] = useState(0);
    const [BoardingDBTN, setBoardingDBTN] = useState(0);
    const [BoardingRBTN, setBoardingRBTN] = useState(0);

    // Files
    const [FilesVP, setFilesVP] = useState(0);
    const [FilesABTN, setFilesABTN] = useState(0);
    const [FilesDBTN, setFilesDBTN] = useState(0);
    const [FilesVBTN, setFilesVBTN] = useState(0);
    const [FilesUSBTN, setFilesUSBTN] = useState(0);

    // Add New Form
    const [AddNewFormVP, setAddNewFormVP] = useState(0);

    // Form List
    const [FormListVP, setFormListVP] = useState(0);
    const [FormListVBTN, setFormListVBTN] = useState(0);
    const [FormListDBTN, setFormListDBTN] = useState(0);

    // Submitted List Forms
    const [SubmittedListFormsVP, setSubmittedListFormsVP] = useState(0);
    const [SubmittedListFormsVBTN, setSubmittedListFormsVBTN] = useState(0);
    const [SubmittedListFormsDBTN, setSubmittedListFormsDBTN] = useState(0);

    // Gift Cards
    const [GiftCardsVP, setGiftCardsVP] = useState(0);
    const [GiftCardsABTN, setGiftCardsABTN] = useState(0);
    const [GiftCardsDBTN, setGiftCardsDBTN] = useState(0);
    const [GiftCardsVBTN, setGiftCardsVBTN] = useState(0);
    const [GiftCardsVD, setGiftCardsVD] = useState(0);
    const [GiftCardsVCM, setGiftCardsVCM] = useState(0);
    const [GiftCardsVTM, setGiftCardsVTM] = useState(0);
    const [GiftCardsVR, setGiftCardsVR] = useState(0);
    const [GiftCardsVDM, setGiftCardsVDM] = useState(0);
    const [GiftCardsVAS, setGiftCardsVAS] = useState(0);
    const [GiftCardsVDGCBTN, setGiftCardsVDGCBTN] = useState(0);

    // Disabled Gift Cards
    const [DisabledGiftCardsVP, setDisabledGiftCardsVP] = useState(0);
    const [DisabledGiftCardsEBTN, setDisabledGiftCardsEBTN] = useState(0);

    // GiftCardLogsVP
    const [GiftCardLogsVP, setGiftCardLogsVP] = useState(0);

    // Guides
    const [GuidesVP, setGuidesVP] = useState(0);
    const [GuidesVGBTN, setGuidesVGBTN] = useState(0);
    const [GuidesAGBTN, setGuidesAGBTN] = useState(0);
    const [GuidesEGBTN, setGuidesEGBTN] = useState(0);
    const [GuidesVAGBTN, setGuidesVAGBTN] = useState(0);
    const [GuidesVVGBTN, setGuidesVVGBTN] = useState(0);
    const [GuidesAVGBTN, setGuidesAVGBTN] = useState(0);
    const [GuidesVAVGBTN, setGuidesVAVGBTN] = useState(0);
    const [GuidesEVGBTN, setGuidesEVGBTN] = useState(0);

    // Clearent
    const [ClearentVP, setClearentVP] = useState(0);
    const [ClearentVBTN, setClearentVBTN] = useState(0);

    // Paysafe
    const [PaysafeVP, setPaysafeVP] = useState(0);
    const [PaysafeVBTN, setPaysafeVBTN] = useState(0);

    // Tickets
    const [TicketsVP, setTicketsVP] = useState(0);
    const [TicketsABTN, setTicketsABTN] = useState(0);
    const [TicketsSABTN, setTicketsSABTN] = useState(0);
    const [TicketsATBTN, setTicketsATBTN] = useState(0);
    const [TicketsUSBTN, setTicketsUSBTN] = useState(0);
    const [TicketsDTBTN, setTicketsDTBTN] = useState(0);
    const [TicketsMTBTN, setTicketsMTBTN] = useState(0);
    const [TicketsVBTN, setTicketsVBTN] = useState(0);

    // PAN Request
    const [PANRequestVP, setPANRequestVP] = useState(0);

    // PAN List
    const [PANListVP, setPANListVP] = useState(0);
    const [PANListABTN, setPANListABTN] = useState(0);
    const [PANListEBTN, setPANListEBTN] = useState(0);
    const [PANListDBTN, setPANListDBTN] = useState(0);

    // Invite People
    const [InvitePeopleVP, setInvitePeopleVP] = useState(0);

    // Profiles
    const [ProfilesVP, setProfilesVP] = useState(0);
    const [ProfilesABTN, setProfilesABTN] = useState(0);
    const [ProfilesUSBTN, setProfilesUSBTN] = useState(0);
    const [ProfilesDBTN, setProfilesDBTN] = useState(0);
    const [ProfilesUPSBTN, setProfilesUPSBTN] = useState(0);
    const [ProfilesVBTN, setProfilesVBTN] = useState(0);
    const [ProfilesVPDBTN, setProfilesVPDBTN] = useState(0);
    const [ProfilesVPACBTN, setProfilesVPACBTN] = useState(0);
    const [ProfilesVADBTN, setProfilesVADBTN] = useState(0);
    const [ProfilesVTDBTN, setProfilesVTDBTN] = useState(0);
    const [ProfilesVFDBTN, setProfilesVFDBTN] = useState(0);
    const [ProfilesVANDBTN, setProfilesVANDBTN] = useState(0);
    const [ProfilesVEUNDBTN, setProfilesVEUNDBTN] = useState(0);

    // Assets Management
    const [AssetsManagementVP, setAssetsManagementVP] = useState(0);
    const [AssetsManagementABTN, setAssetsManagementABTN] = useState(0);
    const [AssetsManagementEBTN, setAssetsManagementEBTN] = useState(0);
    const [AssetsManagementDBTN, setAssetsManagementDBTN] = useState(0);

    // Virtual Page
    const [VirtualPageVP, setVirtualPageVP] = useState(0);

    // View As
    const [ViewAsVP, setViewAsVP] = useState(0);

    const {
        data: dataGetPermission,
        isLoading: isLoadingGetPermission
    } = useAxiosQuery(
        "GET",
        `api/v1/user_permission?user_id=${user_id}`,
        "users_permission_admin",
        res => {
            if (res.success) {
                // console.log('users_permission_admin', res)
                res.data.map((data, index) => {
                    // console.log('defaultChecked', true)

                    // Marketplace
                    if (
                        data.permission == "Marketplace" &&
                        data.permission_type == "view_page"
                    ) {
                        setMarketplaceVP(1);
                    }

                    // Dashboard
                    if (
                        data.permission == "Dashboard" &&
                        data.permission_type == "view_page"
                    ) {
                        setDashboardVP(1);
                    }

                    // Boarding
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
                        data.permission == "Boarding" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setBoardingDBTN(1);
                    }
                    if (
                        data.permission == "Boarding" &&
                        data.permission_type == "reserve_btn"
                    ) {
                        setBoardingRBTN(1);
                    }

                    // Files
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
                        data.permission == "Files" &&
                        data.permission_type == "view_btn"
                    ) {
                        setFilesVBTN(1);
                    }
                    if (
                        data.permission == "Files" &&
                        data.permission_type == "upload_statement_btn"
                    ) {
                        setFilesUSBTN(1);
                    }

                    // Add New Form
                    if (
                        data.permission == "Add New Form" &&
                        data.permission_type == "view_page"
                    ) {
                        setAddNewFormVP(1);
                    }

                    // Form List
                    if (
                        data.permission == "Form List" &&
                        data.permission_type == "view_page"
                    ) {
                        setFormListVP(1);
                    }
                    if (
                        data.permission == "Form List" &&
                        data.permission_type == "view_btn"
                    ) {
                        setFormListVBTN(1);
                    }
                    if (
                        data.permission == "Form List" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setFormListDBTN(1);
                    }

                    // Submitted List Forms
                    if (
                        data.permission == "Submitted List Forms" &&
                        data.permission_type == "view_page"
                    ) {
                        setSubmittedListFormsVP(1);
                    }
                    if (
                        data.permission == "Submitted List Forms" &&
                        data.permission_type == "view_btn"
                    ) {
                        setSubmittedListFormsVBTN(1);
                    }
                    if (
                        data.permission == "Submitted List Forms" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setSubmittedListFormsDBTN(1);
                    }

                    // Gift Cards
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_page"
                    ) {
                        setGiftCardsVP(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "add_btn"
                    ) {
                        setGiftCardsABTN(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setGiftCardsDBTN(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_btn"
                    ) {
                        setGiftCardsVBTN(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_dashboard"
                    ) {
                        setGiftCardsVD(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_card_management"
                    ) {
                        setGiftCardsVCM(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_terminal_management"
                    ) {
                        setGiftCardsVTM(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_report"
                    ) {
                        setGiftCardsVR(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_data_management"
                    ) {
                        setGiftCardsVDM(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_account_setting"
                    ) {
                        setGiftCardsVAS(1);
                    }
                    if (
                        data.permission == "Gift Cards" &&
                        data.permission_type == "view_disabled_gift_card_btn"
                    ) {
                        setGiftCardsVDGCBTN(1);
                    }

                    // Disabled Gift Cards
                    if (
                        data.permission == "Disabled Gift Cards" &&
                        data.permission_type == "view_page"
                    ) {
                        setDisabledGiftCardsVP(1);
                    }
                    if (
                        data.permission == "Disabled Gift Cards" &&
                        data.permission_type == "edit_btn"
                    ) {
                        setDisabledGiftCardsEBTN(1);
                    }

                    // DGiftCardLogsVP
                    if (
                        data.permission == "Gift Card Logs" &&
                        data.permission_type == "view_page"
                    ) {
                        setGiftCardLogsVP(1);
                    }

                    // Guides
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "view_page"
                    ) {
                        setGuidesVP(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "view_guide_btn"
                    ) {
                        setGuidesVGBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "add_guide_btn"
                    ) {
                        setGuidesAGBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "edit_guide_btn"
                    ) {
                        setGuidesEGBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "visible_admin_guide_btn"
                    ) {
                        setGuidesVAGBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "view_video_guide_btn"
                    ) {
                        setGuidesVVGBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "add_video_guide_btn"
                    ) {
                        setGuidesAVGBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "visible_admin_video_guide_btn"
                    ) {
                        setGuidesVAVGBTN(1);
                    }
                    if (
                        data.permission == "Guides" &&
                        data.permission_type == "edit_video_guide_btn"
                    ) {
                        setGuidesEVGBTN(1);
                    }

                    // Clearent
                    if (
                        data.permission == "Clearent" &&
                        data.permission_type == "view_page"
                    ) {
                        setClearentVP(1);
                    }
                    if (
                        data.permission == "Clearent" &&
                        data.permission_type == "view_btn"
                    ) {
                        setClearentVBTN(1);
                    }

                    // Paysafe
                    if (
                        data.permission == "Paysafe" &&
                        data.permission_type == "view_page"
                    ) {
                        setPaysafeVP(1);
                    }
                    if (
                        data.permission == "Paysafe" &&
                        data.permission_type == "view_btn"
                    ) {
                        setPaysafeVBTN(1);
                    }

                    // Tickets
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
                        data.permission_type == "archived_btn"
                    ) {
                        setTicketsSABTN(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "assigned_btn"
                    ) {
                        setTicketsATBTN(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "update_status_btn"
                    ) {
                        setTicketsUSBTN(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "delete_ticket_btn"
                    ) {
                        setTicketsDTBTN(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "merge_ticket_btn"
                    ) {
                        setTicketsMTBTN(1);
                    }
                    if (
                        data.permission == "Tickets" &&
                        data.permission_type == "view_btn"
                    ) {
                        setTicketsVBTN(1);
                    }

                    // PAN Request
                    if (
                        data.permission == "PAN Request" &&
                        data.permission_type == "view_page"
                    ) {
                        setPANRequestVP(1);
                    }

                    // PAN List
                    if (
                        data.permission == "PAN List" &&
                        data.permission_type == "view_page"
                    ) {
                        setPANListVP(1);
                    }
                    if (
                        data.permission == "PAN List" &&
                        data.permission_type == "add_btn"
                    ) {
                        setPANListABTN(1);
                    }
                    if (
                        data.permission == "PAN List" &&
                        data.permission_type == "edit_btn"
                    ) {
                        setPANListEBTN(1);
                    }
                    if (
                        data.permission == "PAN List" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setPANListDBTN(1);
                    }

                    // Invite People
                    if (
                        data.permission == "Invite People" &&
                        data.permission_type == "view_page"
                    ) {
                        setInvitePeopleVP(1);
                    }

                    //
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_page"
                    ) {
                        setProfilesVP(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "add_btn"
                    ) {
                        setProfilesABTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "permission_btn"
                    ) {
                        setProfilesUSBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setProfilesDBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "upload_statement_btn"
                    ) {
                        setProfilesUPSBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_btn"
                    ) {
                        setProfilesVBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_profile_btn"
                    ) {
                        setProfilesVPDBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_account_btn"
                    ) {
                        setProfilesVPACBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_asset_btn"
                    ) {
                        setProfilesVADBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_ticket_btn"
                    ) {
                        setProfilesVTDBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_file_btn"
                    ) {
                        setProfilesVFDBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_authnet_btn"
                    ) {
                        setProfilesVANDBTN(1);
                    }
                    if (
                        data.permission == "Profiles" &&
                        data.permission_type == "view_extra_user_btn"
                    ) {
                        setProfilesVEUNDBTN(1);
                    }

                    // Assets Management
                    if (
                        data.permission == "Assets Management" &&
                        data.permission_type == "view_page"
                    ) {
                        setAssetsManagementVP(1);
                    }
                    if (
                        data.permission == "Assets Management" &&
                        data.permission_type == "add_btn"
                    ) {
                        setAssetsManagementABTN(1);
                    }
                    if (
                        data.permission == "Assets Management" &&
                        data.permission_type == "edit_btn"
                    ) {
                        setAssetsManagementEBTN(1);
                    }
                    if (
                        data.permission == "Assets Management" &&
                        data.permission_type == "delete_btn"
                    ) {
                        setAssetsManagementDBTN(1);
                    }

                    // Virtual Page
                    if (
                        data.permission == "Virtual Page" &&
                        data.permission_type == "view_page"
                    ) {
                        setVirtualPageVP(1);
                    }

                    // View As
                    if (
                        data.permission == "View As" &&
                        data.permission_type == "view_page"
                    ) {
                        setViewAsVP(1);
                    }
                });
            }
        }
    );

    const menu = (
        <Menu>
            <Menu.Item key={1}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleSuperAdmin("Super Admin")}
                >Super Admin
                </Button>
            </Menu.Item>
            <Menu.Item key={2}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleAdmin("Super Admin")}
                >Admin</Button>
            </Menu.Item>
            <Menu.Item key={3}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleManager("Manager")}
                >Manager</Button>
            </Menu.Item>
            <Menu.Item key={4}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handlePANAdmin("PAN Admin")}
                >PAN Admin</Button>
            </Menu.Item>
            <Menu.Item key={5}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleMerchantTicketsOnly("Merchant: Tickets Only")}
                >Merchant: Tickets Only</Button>
            </Menu.Item>
            <Menu.Item key={6}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleGiftOnly("Gift Only")}
                >Gift Only</Button>
            </Menu.Item>
            <Menu.Item key={7}>
                <Button
                    block={true}
                    type="link"
                    onClick={() => handleMerchant("Merchant")}
                >Merchant</Button>
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        if (click == "Super Admin") {
            // Marketplace
            setMarketplaceVP(1);

            // Dashboard
            setDashboardVP(1);

            // Boarding
            setBoardingVP(1);
            setBoardingABTN(1);
            setBoardingVBTN(1);
            setBoardingDBTN(1);
            setBoardingRBTN(1);

            // Files
            setFilesVP(1);
            setFilesABTN(1);
            setFilesDBTN(1);
            setFilesVBTN(1);
            setFilesUSBTN(1);

            // Add New Form
            setAddNewFormVP(1);

            // Form List
            setFormListVP(1);
            setFormListVBTN(1);
            setFormListDBTN(1);

            // Submitted List Forms
            setSubmittedListFormsVP(1);
            setSubmittedListFormsVBTN(1);
            setSubmittedListFormsDBTN(1);

            // Gift Cards
            setGiftCardsVP(1);
            setGiftCardsABTN(1);
            setGiftCardsDBTN(1);
            setGiftCardsVBTN(1);
            setGiftCardsVD(1);
            setGiftCardsVCM(1);
            setGiftCardsVTM(1);
            setGiftCardsVR(1);
            setGiftCardsVDM(1);
            setGiftCardsVAS(1);
            setGiftCardsVDGCBTN(1);

            // Disabled Gift Cards
            setDisabledGiftCardsVP(1);
            setDisabledGiftCardsEBTN(1);

            // Disabled Gift Cards
            setGiftCardLogsVP(1);

            // Guides
            setGuidesVP(1);
            setGuidesVGBTN(1);
            setGuidesAGBTN(1);
            setGuidesEGBTN(1);
            setGuidesVAGBTN(1);
            setGuidesVVGBTN(1);
            setGuidesAVGBTN(1);
            setGuidesVAVGBTN(1);
            setGuidesEVGBTN(1);

            // Clearent
            setClearentVP(1);
            setClearentVBTN(1);

            // Paysafe
            setPaysafeVP(1);
            setPaysafeVBTN(1);

            // Tickets
            setTicketsVP(1);
            setTicketsABTN(1);
            setTicketsSABTN(1);
            setTicketsATBTN(1);
            setTicketsUSBTN(1);
            setTicketsDTBTN(1);
            setTicketsMTBTN(1);
            setTicketsVBTN(1);

            // PAN Request
            setPANRequestVP(1);

            // PAN List
            setPANListVP(1);
            setPANListABTN(1);
            setPANListEBTN(1);
            setPANListDBTN(1);

            // Invite People
            setInvitePeopleVP(1);

            // Profiles
            setProfilesVP(1);
            setProfilesABTN(1);
            setProfilesUSBTN(1);
            setProfilesDBTN(1);
            setProfilesUPSBTN(1);
            setProfilesVBTN(1);
            setProfilesVPDBTN(1);
            setProfilesVPACBTN(1);
            setProfilesVADBTN(1);
            setProfilesVTDBTN(1);
            setProfilesVFDBTN(1);
            setProfilesVANDBTN(1);
            setProfilesVEUNDBTN(1);

            // Assets Management
            setAssetsManagementVP(1);
            setAssetsManagementABTN(1);
            setAssetsManagementEBTN(1);
            setAssetsManagementDBTN(1);

            // Virtual Page
            setVirtualPageVP(1);

            // View As
            setViewAsVP(1);
        } else if (click == "Admin") {
            alert("asd");

            // Marketplace
            setMarketplaceVP(1);

            // Dashboard
            setDashboardVP(1);

            // Boarding
            setBoardingVP(1);
            setBoardingABTN(1);
            setBoardingVBTN(1);
            setBoardingDBTN(1);
            setBoardingRBTN(1);

            // Files
            setFilesVP(1);
            setFilesABTN(1);
            setFilesDBTN(1);
            setFilesVBTN(1);
            setFilesUSBTN(1);

            // Add New Form
            setAddNewFormVP(1);

            // Form List
            setFormListVP(1);
            setFormListVBTN(1);
            setFormListDBTN(1);

            // Submitted List Forms
            setSubmittedListFormsVP(1);
            setSubmittedListFormsVBTN(1);
            setSubmittedListFormsDBTN(1);

            // Gift Cards
            setGiftCardsVP(1);
            setGiftCardsABTN(1);
            setGiftCardsDBTN(1);
            setGiftCardsVBTN(1);
            setGiftCardsVD(1);
            setGiftCardsVCM(1);
            setGiftCardsVTM(1);
            setGiftCardsVR(1);
            setGiftCardsVDM(1);
            setGiftCardsVAS(1);
            setGiftCardsVDGCBTN(1);

            // Disabled Gift Cards
            setDisabledGiftCardsVP(1);
            setDisabledGiftCardsEBTN(1);

            // Disabled Gift Cards
            setGiftCardLogsVP(1);

            // Guides
            setGuidesVP(1);
            setGuidesVGBTN(1);
            setGuidesAGBTN(1);
            setGuidesEGBTN(1);
            setGuidesVAGBTN(1);
            setGuidesVVGBTN(1);
            setGuidesAVGBTN(1);
            setGuidesVAVGBTN(1);
            setGuidesEVGBTN(1);

            // Clearent
            setClearentVP(1);
            setClearentVBTN(1);

            // Paysafe
            setPaysafeVP(1);
            setPaysafeVBTN(1);

            // Tickets
            setTicketsVP(1);
            setTicketsABTN(1);
            setTicketsSABTN(1);
            setTicketsATBTN(1);
            setTicketsUSBTN(1);
            setTicketsDTBTN(1);
            setTicketsMTBTN(1);
            setTicketsVBTN(1);

            // PAN Request
            setPANRequestVP(1);

            // PAN List
            setPANListVP(1);
            setPANListABTN(1);
            setPANListEBTN(1);
            setPANListDBTN(1);

            // Invite People
            setInvitePeopleVP(1);

            // Profiles
            setProfilesVP(1);
            setProfilesABTN(1);
            setProfilesUSBTN(1);
            setProfilesDBTN(1);
            setProfilesUPSBTN(1);
            setProfilesVBTN(1);
            setProfilesVPDBTN(1);
            setProfilesVPACBTN(1);
            setProfilesVADBTN(1);
            setProfilesVTDBTN(1);
            setProfilesVFDBTN(1);
            setProfilesVANDBTN(1);
            setProfilesVEUNDBTN(1);

            // Assets Management
            setAssetsManagementVP(1);
            setAssetsManagementABTN(1);
            setAssetsManagementEBTN(1);
            setAssetsManagementDBTN(1);

            // Virtual Page
            setVirtualPageVP(1);

            // View As
            setViewAsVP(1);
        } else if (click == "Manager") {
            // Marketplace
            setMarketplaceVP(0);

            // Dashboard
            setDashboardVP(0);

            // Boarding
            setBoardingVP(0);
            setBoardingABTN(0);
            setBoardingVBTN(0);
            setBoardingDBTN(0);
            setBoardingRBTN(0);

            // Files
            setFilesVP(1);
            setFilesABTN(1);
            setFilesDBTN(1);
            setFilesVBTN(1);
            setFilesUSBTN(1);

            // Add New Form
            setAddNewFormVP(0);

            // Form List
            setFormListVP(0);
            setFormListVBTN(0);
            setFormListDBTN(0);

            // Submitted List Forms
            setSubmittedListFormsVP(0);
            setSubmittedListFormsVBTN(0);
            setSubmittedListFormsDBTN(0);

            // Gift Cards
            setGiftCardsVP(1);
            setGiftCardsABTN(1);
            setGiftCardsDBTN(1);
            setGiftCardsVBTN(1);
            setGiftCardsVD(1);
            setGiftCardsVCM(1);
            setGiftCardsVTM(1);
            setGiftCardsVR(1);
            setGiftCardsVDM(1);
            setGiftCardsVAS(1);
            setGiftCardsVDGCBTN(1);

            // Disabled Gift Cards
            setDisabledGiftCardsVP(1);
            setDisabledGiftCardsEBTN(1);

            // Gift Cards Logs
            setGiftCardLogsVP(0);

            // Guides
            setGuidesVP(1);
            setGuidesVGBTN(1);
            setGuidesAGBTN(1);
            setGuidesEGBTN(1);
            setGuidesVAGBTN(1);
            setGuidesVVGBTN(1);
            setGuidesAVGBTN(1);
            setGuidesVAVGBTN(1);
            setGuidesEVGBTN(1);

            // Clearent
            setClearentVP(1);
            setClearentVBTN(1);

            // Paysafe
            setPaysafeVP(1);
            setPaysafeVBTN(1);

            // Tickets
            setTicketsVP(1);
            setTicketsABTN(1);
            setTicketsSABTN(1);
            setTicketsATBTN(1);
            setTicketsUSBTN(1);
            setTicketsDTBTN(1);
            setTicketsMTBTN(1);
            setTicketsVBTN(1);

            // PAN Request
            setPANRequestVP(1);

            // PAN List
            setPANListVP(0);
            setPANListABTN(0);
            setPANListEBTN(0);
            setPANListDBTN(0);

            // Invite People
            setInvitePeopleVP(0);

            // Profiles
            setProfilesVP(1);
            setProfilesABTN(1);
            setProfilesUSBTN(1);
            setProfilesDBTN(1);
            setProfilesUPSBTN(1);
            setProfilesVBTN(1);
            setProfilesVPDBTN(1);
            setProfilesVPACBTN(1);
            setProfilesVADBTN(1);
            setProfilesVTDBTN(1);
            setProfilesVFDBTN(1);
            setProfilesVANDBTN(1);
            setProfilesVEUNDBTN(1);

            // Assets Management
            setAssetsManagementVP(0);
            setAssetsManagementABTN(0);
            setAssetsManagementEBTN(0);
            setAssetsManagementDBTN(0);

            // Virtual Page
            setVirtualPageVP(0);

            // View As
            setViewAsVP(0);
        } else if (click == "PAN Admin") {
            // Marketplace
            setMarketplaceVP(1);

            // Dashboard
            setDashboardVP(1);

            // Boarding
            setBoardingVP(1);
            setBoardingABTN(1);
            setBoardingVBTN(1);
            setBoardingDBTN(1);
            setBoardingRBTN(1);

            // Files
            setFilesVP(1);
            setFilesABTN(1);
            setFilesDBTN(1);
            setFilesVBTN(1);
            setFilesUSBTN(1);

            // Add New Form
            setAddNewFormVP(1);

            // Form List
            setFormListVP(1);
            setFormListVBTN(1);
            setFormListDBTN(1);

            // Submitted List Forms
            setSubmittedListFormsVP(1);
            setSubmittedListFormsVBTN(1);
            setSubmittedListFormsDBTN(1);

            // Gift Cards
            setGiftCardsVP(1);
            setGiftCardsABTN(1);
            setGiftCardsDBTN(1);
            setGiftCardsVBTN(1);
            setGiftCardsVD(1);
            setGiftCardsVCM(1);
            setGiftCardsVTM(1);
            setGiftCardsVR(1);
            setGiftCardsVDM(1);
            setGiftCardsVAS(1);
            setGiftCardsVDGCBTN(1);

            // Disabled Gift Cards
            setDisabledGiftCardsVP(1);
            setDisabledGiftCardsEBTN(1);

            // Disabled Gift Cards
            setGiftCardLogsVP(0);

            // Guides
            setGuidesVP(1);
            setGuidesVGBTN(1);
            setGuidesAGBTN(1);
            setGuidesEGBTN(1);
            setGuidesVAGBTN(1);
            setGuidesVVGBTN(1);
            setGuidesAVGBTN(1);
            setGuidesVAVGBTN(1);
            setGuidesEVGBTN(1);

            // Clearent
            setClearentVP(1);
            setClearentVBTN(1);

            // Paysafe
            setPaysafeVP(1);
            setPaysafeVBTN(1);

            // Tickets
            setTicketsVP(1);
            setTicketsABTN(1);
            setTicketsSABTN(1);
            setTicketsATBTN(1);
            setTicketsUSBTN(1);
            setTicketsDTBTN(1);
            setTicketsMTBTN(1);
            setTicketsVBTN(1);

            // PAN Request
            setPANRequestVP(1);

            // PAN List
            setPANListVP(0);
            setPANListABTN(0);
            setPANListEBTN(0);
            setPANListDBTN(0);

            // Invite People
            setInvitePeopleVP(1);

            // Profiles
            setProfilesVP(0);
            setProfilesABTN(0);
            setProfilesUSBTN(0);
            setProfilesDBTN(0);
            setProfilesUPSBTN(0);
            setProfilesVBTN(0);
            setProfilesVPDBTN(0);
            setProfilesVPACBTN(0);
            setProfilesVADBTN(0);
            setProfilesVTDBTN(0);
            setProfilesVFDBTN(0);
            setProfilesVANDBTN(0);
            setProfilesVEUNDBTN(0);

            // Assets Management
            setAssetsManagementVP(0);
            setAssetsManagementABTN(0);
            setAssetsManagementEBTN(0);
            setAssetsManagementDBTN(0);

            // Virtual Page
            setVirtualPageVP(0);

            // View As
            setViewAsVP(0);
        } else if (click == "Merchant: Tickets Only") {
            // Marketplace
            setMarketplaceVP(0);

            // Dashboard
            setDashboardVP(0);

            // Boarding
            setBoardingVP(0);
            setBoardingABTN(0);
            setBoardingVBTN(0);
            setBoardingDBTN(0);
            setBoardingRBTN(0);

            // Files
            setFilesVP(0);
            setFilesABTN(0);
            setFilesDBTN(0);
            setFilesVBTN(0);
            setFilesUSBTN(0);

            // Add New Form
            setAddNewFormVP(0);

            // Form List
            setFormListVP(0);
            setFormListVBTN(0);
            setFormListDBTN(0);

            // Submitted List Forms
            setSubmittedListFormsVP(0);
            setSubmittedListFormsVBTN(0);
            setSubmittedListFormsDBTN(0);

            // Gift Cards
            setGiftCardsVP(0);
            setGiftCardsABTN(0);
            setGiftCardsDBTN(0);
            setGiftCardsVBTN(0);
            setGiftCardsVD(0);
            setGiftCardsVCM(0);
            setGiftCardsVTM(0);
            setGiftCardsVR(0);
            setGiftCardsVDM(0);
            setGiftCardsVAS(0);
            setGiftCardsVDGCBTN(0);

            // Disabled Gift Cards
            setDisabledGiftCardsVP(0);
            setDisabledGiftCardsEBTN(0);

            // Disabled Gift Cards
            setGiftCardLogsVP(0);

            // Guides
            setGuidesVP(0);
            setGuidesVGBTN(0);
            setGuidesAGBTN(0);
            setGuidesEGBTN(0);
            setGuidesVAGBTN(0);
            setGuidesVVGBTN(0);
            setGuidesAVGBTN(0);
            setGuidesVAVGBTN(0);
            setGuidesEVGBTN(0);

            // Clearent
            setClearentVP(0);
            setClearentVBTN(0);

            // Paysafe
            setPaysafeVP(0);
            setPaysafeVBTN(0);

            // Tickets
            setTicketsVP(1);
            setTicketsABTN(1);
            setTicketsSABTN(1);
            setTicketsATBTN(1);
            setTicketsUSBTN(1);
            setTicketsDTBTN(1);
            setTicketsMTBTN(1);
            setTicketsVBTN(1);

            // PAN Request
            setPANRequestVP(1);

            // PAN List
            setPANListVP(0);
            setPANListABTN(0);
            setPANListEBTN(0);
            setPANListDBTN(0);

            // Invite People
            setInvitePeopleVP(0);

            // Profiles
            setProfilesVP(0);
            setProfilesABTN(0);
            setProfilesUSBTN(0);
            setProfilesDBTN(0);
            setProfilesUPSBTN(0);
            setProfilesVBTN(0);
            setProfilesVPDBTN(0);
            setProfilesVPACBTN(0);
            setProfilesVADBTN(0);
            setProfilesVTDBTN(0);
            setProfilesVFDBTN(0);
            setProfilesVANDBTN(0);
            setProfilesVEUNDBTN(0);

            // Assets Management
            setAssetsManagementVP(0);
            setAssetsManagementABTN(0);
            setAssetsManagementEBTN(0);
            setAssetsManagementDBTN(0);

            // Virtual Page
            setVirtualPageVP(0);

            // View As
            setViewAsVP(0);
        } else if (click == "Gift Only") {
            // Marketplace
            setMarketplaceVP(1);

            // Dashboard
            setDashboardVP(0);

            // Boarding
            setBoardingVP(0);
            setBoardingABTN(0);
            setBoardingVBTN(0);
            setBoardingDBTN(0);
            setBoardingRBTN(0);

            // Files
            setFilesVP(0);
            setFilesABTN(0);
            setFilesDBTN(0);
            setFilesVBTN(0);
            setFilesUSBTN(0);

            // Add New Form
            setAddNewFormVP(0);

            // Form List
            setFormListVP(0);
            setFormListVBTN(0);
            setFormListDBTN(0);

            // Submitted List Forms
            setSubmittedListFormsVP(0);
            setSubmittedListFormsVBTN(0);
            setSubmittedListFormsDBTN(0);

            // Gift Cards
            setGiftCardsVP(1);
            setGiftCardsABTN(1);
            setGiftCardsDBTN(1);
            setGiftCardsVBTN(1);
            setGiftCardsVD(1);
            setGiftCardsVCM(1);
            setGiftCardsVTM(1);
            setGiftCardsVR(1);
            setGiftCardsVDM(1);
            setGiftCardsVAS(1);
            setGiftCardsVDGCBTN(1);

            // Disabled Gift Cards
            setDisabledGiftCardsVP(1);
            setDisabledGiftCardsEBTN(1);

            // Gift Cards Logs
            setGiftCardLogsVP(1);

            // Guides
            setGuidesVP(0);
            setGuidesVGBTN(0);
            setGuidesAGBTN(0);
            setGuidesEGBTN(0);
            setGuidesVAGBTN(0);
            setGuidesVVGBTN(0);
            setGuidesAVGBTN(0);
            setGuidesVAVGBTN(0);
            setGuidesEVGBTN(0);

            // Clearent
            setClearentVP(0);
            setClearentVBTN(0);

            // Paysafe
            setPaysafeVP(0);
            setPaysafeVBTN(0);

            // Tickets
            setTicketsVP(1);
            setTicketsABTN(1);
            setTicketsSABTN(1);
            setTicketsATBTN(1);
            setTicketsUSBTN(1);
            setTicketsDTBTN(1);
            setTicketsMTBTN(1);
            setTicketsVBTN(1);

            // PAN Request
            setPANRequestVP(1);

            // PAN List
            setPANListVP(0);
            setPANListABTN(0);
            setPANListEBTN(0);
            setPANListDBTN(0);

            // Invite People
            setInvitePeopleVP(0);

            // Profiles
            setProfilesVP(0);
            setProfilesABTN(0);
            setProfilesUSBTN(0);
            setProfilesDBTN(0);
            setProfilesUPSBTN(0);
            setProfilesVBTN(0);
            setProfilesVPDBTN(0);
            setProfilesVPACBTN(0);
            setProfilesVADBTN(0);
            setProfilesVTDBTN(0);
            setProfilesVFDBTN(0);
            setProfilesVANDBTN(0);
            setProfilesVEUNDBTN(0);

            // Assets Management
            setAssetsManagementVP(0);
            setAssetsManagementABTN(0);
            setAssetsManagementEBTN(0);
            setAssetsManagementDBTN(0);

            // Virtual Page
            setVirtualPageVP(0);

            // View As
            setViewAsVP(0);
        }
    }, [click]);

    const [RTA, setRTA] = useState(0)
    const handleRTA = (value) => {
        let data = {
            receive_alerts : value.status,
            user_id: user_id
        }
        console.log('data', data)
        setRTADATA(data)
    }

    const {
        data: dataget,
        isLoading: isLoadingget
    } = useAxiosQuery(
        'GET',
        `api/v1/users_getReceivedTicketAlert?user_id=${user_id}`,
        'users_getReceivedTicketAlert',
        res => {
            if (res.success) {
                console.log('users_getReceivedTicketAlert', res)
                setRTA(res.user[0].receive_alerts ? 1 : 0)
            }
        }
    )


    return (
        <>
            <Dropdown overlay={menu} placement="bottomLeft" arrow>
                <Button type="primary">Account Roles Presets</Button>
            </Dropdown>
            <Button
                style={{ marginLeft: '5px'}}
                onClick={e=> handleFinist()}
            >
                Save Permission
            </Button>
            <Divider/>
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
                    <h3>Dashboard</h3>
                    <ComponentCheckBox
                        data={DashboardVP}
                        role={user_role}
                        permission={"Dashboard"}
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
                    <ComponentCheckBox
                        data={BoardingDBTN}
                        role={user_role}
                        permission={"Boarding"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete Details"
                    />
                    <ComponentCheckBox
                        data={BoardingRBTN}
                        role={user_role}
                        permission={"Boarding"}
                        permission_type={"reserve_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Reserve MID"
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
                        data={FilesVBTN}
                        role={user_role}
                        permission={"Files"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Download"
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
                    <ComponentCheckBox
                        data={FilesUSBTN}
                        role={user_role}
                        permission={"Files"}
                        permission_type={"upload_statement_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Upload Statement"
                    />

                    <br />
                    <h3>Add New Form</h3>
                    <ComponentCheckBox
                        data={AddNewFormVP}
                        role={user_role}
                        permission={"Add New Form"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <br />
                    <h3>Form List</h3>
                    <ComponentCheckBox
                        data={FormListVP}
                        role={user_role}
                        permission={"Form List"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={FormListVBTN}
                        role={user_role}
                        permission={"Form List"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
                    />
                    <ComponentCheckBox
                        data={FormListDBTN}
                        role={user_role}
                        permission={"Form List"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />
                </Col>

                <Col className="gutter-row" md={6} sm={6} xs={8}>
                    <h3>Submitted List Forms</h3>
                    <ComponentCheckBox
                        data={SubmittedListFormsVP}
                        role={user_role}
                        permission={"Submitted List Forms"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={SubmittedListFormsVBTN}
                        role={user_role}
                        permission={"Submitted List Forms"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
                    />
                    <ComponentCheckBox
                        data={SubmittedListFormsDBTN}
                        role={user_role}
                        permission={"Submitted List Forms"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />

                    <br />
                    <h3>Gift Cards</h3>
                    <ComponentCheckBox
                        data={GiftCardsVP}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={GiftCardsABTN}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />
                    <ComponentCheckBox
                        data={GiftCardsDBTN}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVBTN}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVD}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_dashboard"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Dashboard"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVCM}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_card_management"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Card Management"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVTM}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_terminal_management"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Terminal Management"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVR}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_report"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Reports"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVDM}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_data_management"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Data Management"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVAS}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_account_setting"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Account Settings"
                    />
                    <ComponentCheckBox
                        data={GiftCardsVDGCBTN}
                        role={user_role}
                        permission={"Gift Cards"}
                        permission_type={"view_disabled_gift_card_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Disabled Gift Card List"
                    />

                    <br />
                    <h3>View Disabled Gift Card List</h3>
                    <ComponentCheckBox
                        data={DisabledGiftCardsVP}
                        role={user_role}
                        permission={"Disabled Gift Cards"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={DisabledGiftCardsEBTN}
                        role={user_role}
                        permission={"Disabled Gift Cards"}
                        permission_type={"edit_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Edit"
                    />

                    <br />
                    <h3>Gift Card Logs</h3>
                    <ComponentCheckBox
                        data={GiftCardLogsVP}
                        role={user_role}
                        permission={"Gift Card Logs"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
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
                    <ComponentCheckBox
                        data={GuidesVGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"view_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Guides"
                    />
                    <ComponentCheckBox
                        data={GuidesAGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"add_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add Guides"
                    />
                    <ComponentCheckBox
                        data={GuidesEGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"edit_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Edit Guides"
                    />
                    <ComponentCheckBox
                        data={GuidesVAGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"visible_admin_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Visible Admin Guides"
                    />
                    <ComponentCheckBox
                        data={GuidesVVGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"view_video_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Video Guides"
                    />
                    <ComponentCheckBox
                        data={GuidesAVGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"add_video_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add Video Guides"
                    />
                    <ComponentCheckBox
                        data={GuidesVAVGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"visible_admin_video_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Visible Admin Video Guides"
                    />
                    <ComponentCheckBox
                        data={GuidesEVGBTN}
                        role={user_role}
                        permission={"Guides"}
                        permission_type={"edit_video_guide_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Edit Video Guides"
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
                    <ComponentCheckBox
                        data={ClearentVBTN}
                        role={user_role}
                        permission={"Clearent"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
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
                    <ComponentCheckBox
                        data={PaysafeVBTN}
                        role={user_role}
                        permission={"Paysafe"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
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
                    <ComponentCheckBox
                        data={TicketsSABTN}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"archived_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Show Archived"
                    />
                    <ComponentCheckBox
                        data={TicketsATBTN}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"assigned_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Assigned To"
                    />
                    <ComponentCheckBox
                        data={TicketsUSBTN}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"update_status_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Update Status"
                    />
                    <ComponentCheckBox
                        data={TicketsDTBTN}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"delete_ticket_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete Ticket"
                    />
                    <ComponentCheckBox
                        data={TicketsMTBTN}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"merge_ticket_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Merge Ticket"
                    />
                    <ComponentCheckBox
                        data={TicketsVBTN}
                        role={user_role}
                        permission={"Tickets"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
                    />

                    <br />
                    <h3>PAN Request</h3>
                    <ComponentCheckBox
                        data={PANRequestVP}
                        role={user_role}
                        permission={"PAN Request"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <br />
                    <h3>PAN List</h3>
                    <ComponentCheckBox
                        data={PANListVP}
                        role={user_role}
                        permission={"PAN List"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={PANListABTN}
                        role={user_role}
                        permission={"PAN List"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />
                    <ComponentCheckBox
                        data={PANListEBTN}
                        role={user_role}
                        permission={"PAN List"}
                        permission_type={"edit_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Edit"
                    />
                    <ComponentCheckBox
                        data={PANListDBTN}
                        role={user_role}
                        permission={"PAN List"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />

                    <br />
                    <h3>Invite People</h3>
                    <ComponentCheckBox
                        data={InvitePeopleVP}
                        role={user_role}
                        permission={"Invite People"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                </Col>

                <Col className="gutter-row" md={6} sm={6} xs={8}>
                    <h3>Profiles</h3>
                    <ComponentCheckBox
                        data={ProfilesVP}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={ProfilesABTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />
                    <ComponentCheckBox
                        data={ProfilesUSBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"permission_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="User Permission"
                    />
                    <ComponentCheckBox
                        data={ProfilesDBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />
                    <ComponentCheckBox
                        data={ProfilesUPSBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"upload_statement_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Upload Statement"
                    />
                    <ComponentCheckBox
                        data={ProfilesVBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Details"
                    />
                    <ComponentCheckBox
                        data={ProfilesVPDBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_profile_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Profile Details"
                    />
                    <ComponentCheckBox
                        data={ProfilesVPACBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_account_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Accounts"
                    />
                    <ComponentCheckBox
                        data={ProfilesVADBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_asset_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Assets Details"
                    />
                    <ComponentCheckBox
                        data={ProfilesVTDBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_ticket_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Tickets Details"
                    />
                    <ComponentCheckBox
                        data={ProfilesVFDBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_file_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Files Details"
                    />
                    <ComponentCheckBox
                        data={ProfilesVANDBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_authnet_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View AuthNet Details"
                    />
                    <ComponentCheckBox
                        data={ProfilesVEUNDBTN}
                        role={user_role}
                        permission={"Profiles"}
                        permission_type={"view_extra_user_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Extra Users Details"
                    />

                    <br />
                    <h3>Assets Management</h3>
                    <ComponentCheckBox
                        data={AssetsManagementVP}
                        role={user_role}
                        permission={"Assets Management"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />
                    <ComponentCheckBox
                        data={AssetsManagementABTN}
                        role={user_role}
                        permission={"Assets Management"}
                        permission_type={"add_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Add"
                    />
                    <ComponentCheckBox
                        data={AssetsManagementEBTN}
                        role={user_role}
                        permission={"Assets Management"}
                        permission_type={"edit_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Edit"
                    />
                    <ComponentCheckBox
                        data={AssetsManagementDBTN}
                        role={user_role}
                        permission={"Assets Management"}
                        permission_type={"delete_btn"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="Delete"
                    />

                    <br />
                    <h3>Virtual Page</h3>
                    <ComponentCheckBox
                        data={VirtualPageVP}
                        role={user_role}
                        permission={"Virtual Page"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <br />
                    <h3>View As</h3>
                    <ComponentCheckBox
                        data={ViewAsVP}
                        role={user_role}
                        permission={"View As"}
                        permission_type={"view_page"}
                        user_id={user_id}
                        handleCheckChange={handleCheckChange}
                        title="View Page"
                    />

                    <br />
                    <h3>Receive Ticket Alerts</h3>
                    <ComponentCheckBox
                        data={RTA}
                        role={user_role}
                        permission={"Receive Ticket Alerts"}
                        permission_type={"receive_alerts"}
                        user_id={user_id}
                        handleCheckChange={handleRTA}
                        title="Receive Ticket Alerts"
                    />
                </Col>
            </Row>
        </>
    );
};


export default PageUserPermissionAdmin;
