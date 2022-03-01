import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageGuideSubSubAddModal = ({
    showGuideSubSubAddModal,
    setShowGuideSubSubAddModal,
    showGuideSubSubAddModalId,
    setCardGuidesContent,
    getGuides,
    setIdClassNameSub,
    setChildrenChildIsOpen
}) => {
    const [inputTitle, setInputTitle] = useState("");
    const {
        mutate: mutateAddNewGuideSubSub,
        isLoading: isLoadingAddNewGuideSubSub
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_sub_subs",
        "mutate_add_new_guide_subs_subs"
    );

    const handleAddNewGuideSubSub = () => {
        if (!inputTitle) {
            notification.error({
                message: "Sub-Sub Guide Title Required"
            });
        } else {
            mutateAddNewGuideSubSub(
                {
                    sub_id: showGuideSubSubAddModalId,
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
                        setShowGuideSubSubAddModal(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
            setTimeout(() => {
                setIdClassNameSub(showGuideSubSubAddModalId);
                setChildrenChildIsOpen(true);
            }, 2000);
        }
    };
    return (
        <>
            <Modal
                visible={showGuideSubSubAddModal}
                onCancel={() => {
                    setShowGuideSubSubAddModal(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowGuideSubSubAddModal(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="submit"
                        onClick={() => {
                            handleAddNewGuideSubSub();
                        }}
                        loading={isLoadingAddNewGuideSubSub}
                    >
                        Submit
                    </Button>
                ]}
                title="Add Sub-Sub Guide title"
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

export default PageGuideSubSubAddModal;
