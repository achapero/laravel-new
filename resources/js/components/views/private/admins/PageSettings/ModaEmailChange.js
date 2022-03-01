import React, { useState, useEffect } from "react";
import { 
    Card, Row, Col, Button, Table, Input, Divider, Popconfirm, notification, Modal, Typography, Upload, Space, Form, Tabs, Popover, Alert,
} from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../providers/arrayColumn";
import { number_format } from "../../../../providers/number_format";
import moment from "moment";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import getUserData from "../../../../providers/getUserData";

const ModaEmailChange = ({
    isModalVisible,
    setIsModalVisible,
    emailError,
    setEmailError,
    OldEmail,
    setOldEmail,
}) => {

    const changeEmailHandler = (data) => {
        console.log(data)
        mutateCheckEmail(data, {
            onSuccess: res => {
                if (res.success) {
                    console.log(res)
                    setEmailError(1)
                }
            },
            onError: res => {
                setEmailError(false)
                mutateUpdateEmail({
                    'email_old': OldEmail,
                    'email': data.email,
                    'password': data.password
                }, {
                    onSuccess: res => {
                        if (res.success) {
                            console.log(res)
                            setEmailError(false)
                            setIsModalVisible(false)
                            notification.success({
                                message: 'Successfully updated email'
                            })
                        }
                    },onError: res => {
                        setEmailError(2)
                    }
                })
            }
        })
    }

    const {
        mutate : mutateCheckEmail,
        isLoading: isLoadingCheckEmail
    } = useAxiosQuery('POST', 'api/v1/users/check_email', 'setting_user_data')

    const {
        mutate : mutateUpdateEmail,
        isLoading: isLoadingUpdateEmail
    } = useAxiosQuery('POST', 'api/v1/update_email', 'setting_user_data')

    return(
        <Modal title="Change Email Form" 
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
        >
            <Form
                layout="vertical"
                onFinish={changeEmailHandler}
            >   
                {emailError == 1 && (<>
                    <Alert
                        message="Error"
                        description="This Email is already been used"
                        type="error"
                        closable
                    /><br/>
                </>)}
                {emailError == 2 && (<>
                    <Alert
                        message="Error"
                        description="Password is incorrect"
                        type="error"
                        closable
                    />
                    <br/>
                </>)}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: "email", message: 'Please input emails only!'}
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Current Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your  current password!' }]}
                >
                    <Input.Password/>
                </Form.Item>
                <div style={{ textAlign: "right" }}>
                    <Button 
                        style={{ 
                            width: "30%", 
                        }}
                        type="primary"
                        htmlType="submit"
                    >
                        Updata Email
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default ModaEmailChange;