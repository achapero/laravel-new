import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageGuideSubAddModal = ({
    showGuideSubAddModal,
    setShowGuideSubAddModal,
    showGuideSubAddModalId,
    setCardGuidesContent,
    getGuides,
    setIdClassName,
    setChildrenIsOpen
}) => {
    const [inputTitle, setInputTitle] = useState("");
    const {
        mutate: mutateAddNewGuideSub,
        isLoading: isLoadingAddNewGuideSub
    } = useAxiosQuery("POST", "api/v1/guide_subs", "mutate_add_new_guide_subs");

    const handleAddNewGuideSub = () => {
        mutateAddNewGuideSub(
            { guide_id: showGuideSubAddModalId, sub_title: inputTitle },
            {
                onSuccess: res => {
                    notification.success({
                        message: "Sub Guide Title Created Successfully "
                    });
                    getGuides();
                    setCardGuidesContent([res.merchant_guide_sub]);
                    setShowGuideSubAddModal(false);
                },
                onError: err => {
                    console.log(err);
                    notification.error({
                        message: "Sub Guide Title Required"
                    });
                }
            }
        );

        setTimeout(() => {
            setIdClassName(showGuideSubAddModalId);
            setChildrenIsOpen(true);
        }, 2000);
    };
    return (
        <>
            <Modal
                visible={showGuideSubAddModal}
                onCancel={() => {
                    setShowGuideSubAddModal(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowGuideSubAddModal(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="submit"
                        onClick={() => {
                            handleAddNewGuideSub();
                        }}
                        loading={isLoadingAddNewGuideSub}
                    >
                        Submit
                    </Button>
                ]}
                title="Add Sub Guide title"
            >
                <Row>
                    <Col md={24}>
                        <Input
                            type="text"
                            style={{
                                height: "100%",
                                width: "100%"
                            }}
                            name="search"
                            placeholder="Title"
                            onChange={e => setInputTitle(e.target.value)}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PageGuideSubAddModal;
