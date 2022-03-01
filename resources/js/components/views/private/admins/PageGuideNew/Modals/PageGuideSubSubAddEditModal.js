import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageGuideSubSubAddEditModal = ({
    showAddeSub,
    setShowAddAddeSub,
    addOnlySub,
    updateDataSub,
    params,
    getGuides,
    refetchsub
}) => {
    useEffect(() => {
        if (addOnlySub) {
            setInputTitle("");
        } else {
            setInputTitle(updateDataSub.sub_sub_title);
        }
    }, [addOnlySub, updateDataSub]);

    const [inputTitle, setInputTitle] = useState("");
    const {
        mutate: mutateAddNewGuideSub,
        isLoading: isLoadingAddNewGuideSub
    } = useAxiosQuery(
        "POST",
        addOnlySub ? "api/v1/guide_sub_subs" : "api/v1/guide_sub_sub/edit",
        `guide_sub_sub_new_conent_${params}`
    );

    const handleAddNewGuideSub = () => {
        if (!inputTitle) {
            notification.error({
                message: "Sub Guide Title Required"
            });
        } else {
            mutateAddNewGuideSub(
                {
                    sub_id: params,
                    sub_sub_title: inputTitle,
                    id: addOnlySub ? null : updateDataSub.id
                },
                {
                    onSuccess: res => {
                        notification.success({
                            message: addOnlySub
                                ? "Sub-Sub Guide Title Created Successfully "
                                : "Sub-Sub Guide Title Updated Successfully "
                        });
                        setShowAddAddeSub(false);
                        getGuides();
                        if (addOnlySub) {
                            refetchsub();
                        }
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
                visible={showAddeSub}
                onCancel={() => {
                    setShowAddAddeSub(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowAddAddeSub(false);
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
                title={
                    addOnlySub
                        ? "Add Sub Sub Guide title"
                        : "Update Sub Sub Guide title"
                }
            >
                <Row>
                    <Col md={24}>
                        <Input
                            type="text"
                            style={{
                                height: "100%",
                                width: "100%"
                            }}
                            value={inputTitle}
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

export default PageGuideSubSubAddEditModal;
