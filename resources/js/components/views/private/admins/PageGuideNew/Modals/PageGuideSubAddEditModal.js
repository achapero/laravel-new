import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageGuideSubAddEditModal = ({
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
            setInputTitle(updateDataSub.sub_title);
            console.log(updateDataSub);
        }
    }, [addOnlySub, updateDataSub]);

    const [inputTitle, setInputTitle] = useState("");
    const {
        mutate: mutateAddNewGuideSub,
        isLoading: isLoadingAddNewGuideSub
    } = useAxiosQuery(
        "POST",
        addOnlySub ? "api/v1/guide_subs" : "api/v1/guide_sub/edit",
        `guide_sub_new_conent_${params}`
    );

    const handleAddNewGuideSub = () => {
        if (!inputTitle) {
            notification.error({
                message: "Sub Guide Title Required"
            });
        } else {
            mutateAddNewGuideSub(
                {
                    guide_id: params,
                    sub_title: inputTitle,
                    id: addOnlySub ? null : updateDataSub.id
                },
                {
                    onSuccess: res => {
                        notification.success({
                            message: addOnlySub
                                ? "Sub Guide Title Created Successfully "
                                : "Sub Guide Title Updated Successfully "
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
                width={500}
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
                        ? "Add Sub Guide title"
                        : "Update Sub Guide title"
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

export default PageGuideSubAddEditModal;
