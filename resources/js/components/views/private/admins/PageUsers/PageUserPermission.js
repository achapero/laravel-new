import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import moment, { isMoment } from "moment";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import getUserData from "../../../../providers/getUserData";

import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    notification,
    Space,
    Divider,
    Menu,
    Dropdown
} from "antd";

import PageUserPermissionMerchant from "./PageUserPremissionCompenent/PageUserPermissionMerchant";
import PageUserPermissionAdmin from "./PageUserPremissionCompenent/PageUserPermissionAdmin";
const PageUserPermission = ({ match }) => {
    let user_data = getUserData();
    const [role, setRole] = useState();
    const [click, setClick] = useState();
    const [userRole, setUserRole] = useState();
    const {
        data: dataUser,
        isLoading: isLoadingDataUser,
        isFetching: isFetchingDataUser
    } = useAxiosQuery(
        "GET",
        `api/v1/users/${match.params.id}`,
        `edit_user_permission${match.params.id}`,
        res => {
            if (res.success) {
                // console.log("set data", res);
                setRole(res.data.role);
                setUserRole(res.data.role);
            }
        }
    );

    console.log('click', click)

    const [dataPermission, setDataPermission] = useState([]);
    const handleSuperAdmin = (value) => {
        setRole(value);
        setClick(value);
        setDataPermission([
            {
                status: 1,
                role: userRole,
                permission: 'Marketplace',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Dashboard',
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'reserve_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Add New Form",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_dashboard',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_card_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_terminal_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_report',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_data_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_account_setting',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_disabled_gift_card_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Card Logs",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_video_guide_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'archived_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'assigned_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'update_status_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'delete_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'merge_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "PAN Request",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Invite People",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'permission_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_profile_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_account_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_asset_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_file_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_authnet_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_extra_user_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Virtual Page",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "View As",
                permission_type: 'view_page',
                user_id: match.params.id
            },
        ])
    }
    const handleAdmin = (value) => {
        setRole(value);
        setClick(value);
        setDataPermission([
            {
                status: 1,
                role: userRole,
                permission: 'Marketplace',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Dashboard',
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'reserve_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Add New Form",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_dashboard',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_card_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_terminal_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_report',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_data_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_account_setting',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_disabled_gift_card_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Card Logs",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_video_guide_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'archived_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'assigned_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'update_status_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'delete_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'merge_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "PAN Request",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "PAN List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Invite People",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'permission_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_profile_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_account_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_asset_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_file_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_authnet_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_extra_user_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Virtual Page",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "View As",
                permission_type: 'view_page',
                user_id: match.params.id
            },
        ])
    }
    const handleManager = (value) => {
        setRole(value);
        setClick(value);
        setDataPermission([
            {
                status: 0,
                role: userRole,
                permission: 'Marketplace',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Dashboard',
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'reserve_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Add New Form",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_dashboard',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_card_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_terminal_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_report',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_data_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_account_setting',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_disabled_gift_card_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Gift Card Logs",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_video_guide_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'archived_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'assigned_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'update_status_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'delete_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'merge_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "PAN Request",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Invite People",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'permission_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_profile_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_account_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_asset_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_file_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_authnet_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_extra_user_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Virtual Page",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "View As",
                permission_type: 'view_page',
                user_id: match.params.id
            },
        ])
    }
    const handlePANAdmin = (value) => {
        setRole(value);
        setClick(value);
        setDataPermission([
            {
                status: 1,
                role: userRole,
                permission: 'Marketplace',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Dashboard',
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'reserve_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Add New Form",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Form List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_dashboard',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_card_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_terminal_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_report',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_data_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_account_setting',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_disabled_gift_card_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Gift Card Logs",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_video_guide_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'archived_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'assigned_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'update_status_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'delete_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'merge_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "PAN Request",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Invite People",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'permission_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_profile_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_account_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_asset_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_file_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_authnet_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_extra_user_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Virtual Page",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "View As",
                permission_type: 'view_page',
                user_id: match.params.id
            },
        ])
    }
    const handleMerchantTicketsOnly = (value) => {
        setRole(value);
        setClick(value);
        setDataPermission([
            {
                status: 0,
                role: userRole,
                permission: 'Marketplace',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Dashboard',
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'reserve_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Add New Form",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_dashboard',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_card_management',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_terminal_management',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_report',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_data_management',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_account_setting',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_disabled_gift_card_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Gift Card Logs",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_video_guide_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'archived_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'assigned_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'update_status_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'delete_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'merge_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "PAN Request",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Invite People",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'permission_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_profile_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_account_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_asset_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_file_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_authnet_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_extra_user_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Virtual Page",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "View As",
                permission_type: 'view_page',
                user_id: match.params.id
            },
        ])
    }
    const handleGiftOnly = (value) => {
        setRole(value);
        setClick(value);
        setDataPermission([
            {
                status: 1,
                role: userRole,
                permission: 'Marketplace',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Dashboard',
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'reserve_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: 'Files',
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Add New Form",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Form List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Submitted List Forms",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_dashboard',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_card_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_terminal_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_report',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_data_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_account_setting',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_disabled_gift_card_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Card Logs",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'add_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'visible_admin_video_guide_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Guides",
                permission_type: 'edit_video_guide_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'archived_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'assigned_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'update_status_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'delete_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'merge_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "PAN Request",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "PAN List",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Invite People",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'permission_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'upload_statement_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_profile_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_account_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_asset_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_ticket_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_file_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_authnet_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_extra_user_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },
            {
                status: 0,
                role: userRole,
                permission: "Assets Management",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "Virtual Page",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 0,
                role: userRole,
                permission: "View As",
                permission_type: 'view_page',
                user_id: match.params.id
            },
        ])

    }
    const handleMerchant = (value) => {
        setRole(value);
        setClick(value);
        setDataPermission([
            {
                status: 1,
                role: userRole,
                permission: 'Marketplace',
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Boarding',
                permission_type: 'view_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: 'Files',
                permission_type: 'delete_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Guides",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'add_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'delete_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_btn',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_dashboard',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_card_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_terminal_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_report',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_data_management',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_account_setting',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Gift Cards",
                permission_type: 'view_disabled_gift_card_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Disabled Gift Cards",
                permission_type: 'edit_btn',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Clearent",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Paysafe",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Tickets",
                permission_type: 'add_btn',
                user_id: match.params.id
            },


            {
                status: 1,
                role: userRole,
                permission: "PAN Request",
                permission_type: 'view_page',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'view_page',
                user_id: match.params.id
            },
            {
                status: 1,
                role: userRole,
                permission: "Profiles",
                permission_type: 'request_change_info',
                user_id: match.params.id
            },

            {
                status: 1,
                role: userRole,
                permission: "Terminals",
                permission_type: 'view_page',
                user_id: match.params.id
            },
        ])
    }

    return (
        <Layout
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            <Card title="Permissions">
                {/* <Row gutter={24}>
                    <Col className="gutter-row" span={24}>
                    </Col>
                </Row> */}

                {/* <Divider /> */}

                {role != "Merchant" && (
                    <PageUserPermissionAdmin
                        user_id={match.params.id}
                        user_role={userRole}
                        click={click}
                        dataPermission={dataPermission}
                        setDataPermission={setDataPermission}
                        handleSuperAdmin={handleSuperAdmin}
                        handleAdmin={handleAdmin}
                        handleManager={handleManager}
                        handlePANAdmin={handlePANAdmin}
                        handleMerchantTicketsOnly={handleMerchantTicketsOnly}
                        handleGiftOnly={handleGiftOnly}
                        handleMerchant={handleMerchant}

                        // click={click}
                        // setClick={setClick}
                    />
                )}
                {role == "Merchant" && (
                    <PageUserPermissionMerchant
                        user_id={match.params.id}
                        user_role={userRole}
                        click={click}
                        dataPermission={dataPermission}
                        setDataPermission={setDataPermission}
                        handleSuperAdmin={handleSuperAdmin}
                        handleAdmin={handleAdmin}
                        handleManager={handleManager}
                        handlePANAdmin={handlePANAdmin}
                        handleMerchantTicketsOnly={handleMerchantTicketsOnly}
                        handleGiftOnly={handleGiftOnly}
                        handleMerchant={handleMerchant}
                        // click={click}
                        // setClick={setClick}
                    />
                )}
            </Card>
        </Layout>
    );
};

export default PageUserPermission;
