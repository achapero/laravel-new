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
    Select,
    Alert,
    Form
} from "antd";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import copyToClipboard from "../../../../providers/copyToClipboard";
import queryString from "query-string";
import { Content } from "antd/lib/layout/layout";
import moment, { isMoment } from "moment";
import ButtonGroup from "antd/es/button/button-group";
import Search from "antd/lib/input/Search";
import { CSVLink } from "react-csv";

const PageFormSubmittedDetail = ({ match }) => {
    let form_data_id = match.params.id;
    let { Option } = Select;
    const { TextArea } = Input;

    const [inputData, setInputData] = useState([]);

    const {
        data: dataFormData,
        isLoading: isLoadingFormData,
        refetch: refetchFormData
    } = useAxiosQuery(
        `GET`,
        `api/v1/formdata/${form_data_id}`,
        `form_data_${form_data_id}`,
        res => {
            if (res.success) {
                console.log("form_data_", res);
                setInputData(res.data.inputs);
            }
        }
    );

    const [notesView, setNotesView] = useState(false);
    const [notesValue, setNotesValue] = useState();

    const {
        mutate: mutateUpdateFormData,
        isLoading: isLoadingUpdateFormData
    } = useAxiosQuery("UPDATE", "api/v1/formdata", `form_data_${form_data_id}`);

    const updateHandler = value => {
        console.log(value);
        mutateUpdateFormData(value, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Notes Successfully Updated"
                    });
                }
            }
        });
    };

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            {dataFormData && (
                <Row gutter={24}>
                    <Col span={8}>
                        <Card
                            title="Form Details"
                            headStyle={{
                                backgroundColor: "#20a8d8",
                                color: "white"
                            }}
                        >
                            <h1>
                                <b>Email : {dataFormData.data.email}</b>
                            </h1>
                            {dataFormData.data.inputs != 0 ? (
                                <Alert
                                    message={
                                        <b>
                                            {dataFormData.data.inputs[0].field}
                                        </b>
                                    }
                                    description={
                                        <b style={{ color: "#20a8d8" }}>
                                            {dataFormData.data.inputs[0].value}
                                        </b>
                                    }
                                    type="info"
                                />
                            ) : (
                                <Alert message="" description="" type="info" />
                            )}
                            {dataFormData.data.inputs != 0 &&
                                Object.values(dataFormData.data.inputs).map(
                                    (field, field_key) => {
                                        return (
                                            <Row gutter={12}>
                                                <Col xs={24} md={14}>
                                                    <span style={{fontSize: '13px'}}>
                                                     {field.field}
                                                    </span>
                                                </Col>
                                                <Col xs={24} md={10}>
                                                    <a
                                                        href="#"
                                                        style={{fontSize: '13px'}}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            copyToClipboard(
                                                                field.value
                                                            );
                                                        }}
                                                    >
                                                        {field.value}
                                                    </a>
                                                </Col>
                                            </Row>
                                        );
                                    }
                                )}
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card
                            title={
                                <div>
                                    Notes{" "}
                                    {!notesView && (
                                        <a
                                            href="#"
                                            onClick={e =>
                                                setNotesView(!notesView)
                                            }
                                        >
                                            <i className="fa fa-edit"></i> Edit
                                        </a>
                                    )}
                                </div>
                            }
                        >
                            {notesView == false ? (
                                <span>{dataFormData.data.notes}</span>
                            ) : (
                                <Form
                                    layout="vertical"
                                    initialValues={dataFormData.data}
                                    onFinish={updateHandler}
                                >
                                    <Form.Item name="id" className="hide">
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="notes">
                                        <TextArea
                                            // defaultValue={dataFormData.data.notes}
                                            rows={5}
                                            onChange={e =>
                                                setNotesValue(
                                                    e.target.defaultValue
                                                )
                                            }
                                        />
                                    </Form.Item>

                                    <Button onClick={e => setNotesView(false)}>
                                        Cancel
                                    </Button>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{
                                            background: "#0cc2aa",
                                            borderColor: "#0cc2aa",
                                            marginTop: "10px",
                                            marginLeft: "5px"
                                        }}
                                        // onClick={e => updateHandler(e)}
                                    >
                                        Save
                                    </Button>
                                </Form>
                            )}
                        </Card>
                    </Col>
                </Row>
            )}
        </Content>
    );
};

export default PageFormSubmittedDetail;
("");
