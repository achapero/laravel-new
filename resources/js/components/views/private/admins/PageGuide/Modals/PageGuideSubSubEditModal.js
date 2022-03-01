import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageGuideSubSubEditModal = ({
    showGuideSubSubEditModal,
    setShowGuideSubSubEditModal,
    showGuideSubSubEditModalId,
    setCardGuidesContent,
    getGuides
}) => {
    const [inputTitle, setInputTitle] = useState("");
    const {
        mutate: mutateEditGuideSubSub,
        isLoading: isLoadingEditGuideSubSub
    } = useAxiosQuery(
        "UPDATE",
        "api/v1/guide_sub_subs/" + showGuideSubSubEditModalId,
        "mutate_add_new_guide_subs_subs"
    );

    const handleEdit = () => {
        if (!inputTitle) {
            notification.error({
                message: " Sub-Sub Guide Title Content Required"
            });
        } else {
            mutateEditGuideSubSub(
                {
                    sub_sub_id: showGuideSubSubEditModalId,
                    sub_sub_title: inputTitle
                },
                {
                    onSuccess: res => {
                        notification.success({
                            message: "Sub-Sub Guide Title Created Successfully "
                        });
                        getGuides();
                        console.log(res);
                        setCardGuidesContent([res.data[0]]);
                        setShowGuideSubSubEditModal(false);
                    },
                    onError: err => {
                        console.log(err);
                        notification.error({
                            message: "Sub-Sub Guide Title Required"
                        });
                    }
                }
            );
        }
    };
    return (
        <>
            <Modal
                visible={showGuideSubSubEditModal}
                onCancel={() => {
                    setShowGuideSubSubEditModal(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowGuideSubSubEditModal(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="submit"
                        onClick={() => {
                            handleEdit();
                        }}
                        loading={isLoadingEditGuideSubSub}
                    >
                        Submit
                    </Button>
                ]}
                title="Edit Sub-Sub Guide title"
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

export default PageGuideSubSubEditModal;
