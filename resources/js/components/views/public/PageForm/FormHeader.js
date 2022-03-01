import React, { useEffect } from "react";
import {
    Layout, Card, Button, Row, Col, Input, Table, Popconfirm, Divider, notification, Image, Tooltip,
    Drawer, Space, Select, Alert, Form
} from "antd";
import {
    DeleteFilled, EditFilled, PlusCircleOutlined, FileExcelOutlined, SettingOutlined, EyeOutlined, UsergroupDeleteOutlined,
    UserAddOutlined
} from "@ant-design/icons"; 
import { Content } from "antd/lib/layout/layout";

const FormHeader = props => {
    useEffect(() => {
        // props.refEmail.current.focus();
        return () => {};
    }, []);
    return (
        <div>
            <Card>
                <h1 className="text-center">
                    {props.formDetails.form_name}
                </h1>
            </Card>
            <Card
                title=" "
                className="ant-card-small"
                headStyle={{backgroundColor: '#20a8d8'}}
                style={{marginTop: '5px'}}
            >   
                <div style={{paddingLeft: '10px', paddingRight: '10px'}}>
                    <h2>{props.formDetails.form_title}</h2>
                    {props.currentPage == 1 && (
                        <p className="pre-line">
                            {props.formDetails.form_description}
                        </p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default FormHeader;
