import {
    Layout, Card, Button, Row, Col, Input, Table, Popconfirm, Divider, notification, Image, Tooltip,
    Drawer, Space, Modal, Form, Select, Checkbox, Typography, Menu
} from "antd";
import {
    DeleteFilled, EditFilled, PlusCircleOutlined, FileExcelOutlined, SettingOutlined, EyeOutlined, UsergroupDeleteOutlined, UserAddOutlined,
    ArrowLeftOutlined, MailOutlined, PlusOutlined, MinusCircleOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";

const PageUserProfileComponentOverviewOwner = ({
    ownerFields,
    setOwnerFields
}) => {

    const handleDeleteOwner = () => {

    }

    return (
        // <Form.List name="owner" onChange={e => setOwnerFields({...ownerFields, owner: e})}>
        <Form.List name="owner">
            {(form, { add, remove }) => (<>
                <Row gutter={24} style={{marginBottom: '14px!important'}} key="row_form">
                    {form.map(({ key, name, fieldKey, ...restField }) => (<div key={key} style={{width: '100%', display: 'flex'}}>
                        <Col className="gutter-row" xs={24} md={6}>
                            <Form.Item
                                {...restField}
                                name={[name, 'merchant_name']}
                                fieldKey={[fieldKey, 'merchant_name']}
                            >
                                <Input
                                    placeholder="Merchant Name"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={24} md={6}>
                            <Form.Item
                                {...restField}
                                name={[name, 'merchant_number']}
                                fieldKey={[fieldKey, 'merchant_number']}
                            >
                                <Input
                                    placeholder="Merchant Number"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={24} md={6}>
                            <Form.Item
                                {...restField}
                                name={[name, 'percentage_of_ownership']}
                                fieldKey={[fieldKey, 'percentage_of_ownership']}

                            >
                                <Input
                                    placeholder="Percentage of Ownership"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={24} md={4}>
                            <Form.Item
                                {...restField}
                                name={[name, 'ssn_last_4_digits']}
                                fieldKey={[fieldKey, 'ssn_last_4_digits']}
                            >
                                <Input
                                    placeholder="SSN last 4 digits"
                                />
                            </Form.Item>
                        </Col>
                        <Col className="gutter-row" xs={24} md={2}>
                            <Form.Item
                                name="ssn_last_4_digits"
                            >
                                <Button
                                    style={{background: '#f86b6b', color: '#ffffff'}}
                                    icon={<DeleteFilled/>}
                                    onClick={() => {
                                        remove(name)
                                    }}
                                >
                                </Button>
                            </Form.Item>
                        </Col>
                    </div>))}
                    <Col className="gutter-row" xs={24} md={6}>
                        <Space>
                            <Form.Item >
                                <Button
                                    type="dashed" onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                    style={{background: '#13c2c2', color: '#ffffff'}}
                                >
                                    Add More Owners
                                </Button>
                            </Form.Item>
                        </Space>
                    </Col>
                </Row>
            </>)}
        </Form.List>
    )
}

export default PageUserProfileComponentOverviewOwner;
