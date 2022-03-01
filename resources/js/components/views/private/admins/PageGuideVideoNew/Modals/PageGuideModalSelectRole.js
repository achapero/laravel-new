import React, { useState, useEffect } from "react";
import { Container, Row, Col, Input, Modal, Form, Button, Select } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
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
    LoadingOutlined
} from "@ant-design/icons";
const PageGuideModalSelectRole = ({
    showViewRole,
    setShowViewRole,
    roleData
}) => {
    useEffect(() => {
        setSelectedRole(roleData.visible);
    }, [roleData]);

    const { Option } = Select;
    const {
        mutate: mutateSubmitVisibleBy,
        isLoading: isLoadingSubmitVisibleBy
    } = useAxiosQuery("POST", "api/v1/guide/editRole", "guides_new");

    const submitVisibleBy = e => {
        mutateSubmitVisibleBy(
            {
                id: roleData.id,
                role: selectedRole
            },
            {
                onSuccess: res => {
                    setShowViewRole(false);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const [selectedRole, setSelectedRole] = useState("");
    const updateField = e => {
        setSelectedRole(e);
    };

    return (
        <>
            <Modal
                visible={showViewRole}
                onCancel={() => {
                    setShowViewRole(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowViewRole(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="submit"
                        onClick={() => {
                            submitVisibleBy();
                        }}
                        loading={isLoadingSubmitVisibleBy}
                    >
                        Submit
                    </Button>
                ]}
                width={300}
            >
                <div>
                    <Row>
                        <Col md={24}>
                            <h1>Visible by ?</h1>{" "}
                            <Select
                                required
                                name="role"
                                defaultValue="All"
                                value={selectedRole}
                                onChange={e => updateField(e)}
                                style={{ width: "250px" }}
                            >
                                <Option value="All">All</Option>
                                <Option value="Admin">Admin</Option>
                            </Select>
                            <br></br>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};

export default PageGuideModalSelectRole;
