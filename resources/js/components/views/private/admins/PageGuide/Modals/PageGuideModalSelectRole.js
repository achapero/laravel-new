import React, { useState, useEffect } from "react";
import { Container, Row, Col, Input, Modal, Form, Button, Select } from "antd";

const PageGuideModalSelectRole = ({
    showViewRole,
    showViewRoleModal,
    submitVisibleBy,
    submitButtonTextRole,
    updateField,
    selectedRole,
    setShowViewRole,
    isLoadingSubmitVisibleBy
}) => {
    const { Option } = Select;
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
