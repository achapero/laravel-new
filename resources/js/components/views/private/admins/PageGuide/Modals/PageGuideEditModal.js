import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageGuideEditModal = ({
    showGuideEditModal,
    setShowGuideEditModal,
    showGuideEditModalId,
    setCardGuidesContent,
    getGuides,
    iconGuideSelected
}) => {
    const {
        mutate: mutateEditGuide,
        isLoading: isLoadingEditGuide
    } = useAxiosQuery("POST", "api/v1/guide/edit", "mutate_edit_guide");

    const [inputTitle, setInputTitle] = useState("");

    const submitEditGuide = id => {
        if (!inputTitle) {
            notification.error({
                message: " Guide Title Content Required"
            });
        } else {
            mutateEditGuide(
                {
                    id: showGuideEditModalId,
                    title: inputTitle,
                    icon: iconGuideSelected
                },
                {
                    onSuccess: res => {
                        console.log(res);
                        notification.success({
                            message: "Guide Title Updated Successfully "
                        });
                        setCardGuidesContent([res.data[0]]);
                        getGuides();
                        setShowGuideEditModal(false);
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
                visible={showGuideEditModal}
                onCancel={() => {
                    setShowGuideEditModal(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowGuideEditModal(false);
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
                        loading={isLoadingEditGuide}
                    >
                        Submit
                    </Button>
                ]}
                title="Update Guide title"
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

export default PageGuideEditModal;
