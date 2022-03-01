import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageGuideSubEditModal = ({
    showGuideSubEditModal,
    setShowGuideSubEditModal,
    showGuideSubEditModalId,
    setCardGuidesContent,
    getGuides
}) => {
    const {
        mutate: mutateEditGuideSub,
        isLoading: isLoadingEditGuideSub
    } = useAxiosQuery("POST", "api/v1/guide_sub/edit", "mutate_edit_guide_sub");

    const [inputTitle, setInputTitle] = useState("");

    const submitEditGuide = () => {
        if (!inputTitle) {
            notification.error({
                message: "Sub Guide Title Content Required"
            });
        } else {
            mutateEditGuideSub(
                {
                    id: showGuideSubEditModalId,
                    sub_title: inputTitle
                },
                {
                    onSuccess: res => {
                        notification.success({
                            message: "Sub Guide Title Updated Successfully "
                        });
                        console.log(res);
                        setCardGuidesContent([res.data[0]]);
                        getGuides();
                        setShowGuideSubEditModal(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    return (
        <>
            <Modal
                visible={showGuideSubEditModal}
                onCancel={() => {
                    setShowGuideSubEditModal(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowGuideSubEditModal(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="submit"
                        onClick={() => {
                            submitEditGuide();
                        }}
                        loading={isLoadingEditGuideSub}
                    >
                        Submit
                    </Button>
                ]}
                title="Update Sub Guide title"
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

export default PageGuideSubEditModal;
