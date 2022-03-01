import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Input, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import { options } from "../PageGuideOptionIcons";
import PageGuideIconModal from "./PageGuideIconModal";
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
import Select from "rc-select";

const PageGuideAddEditModal = ({
    showAddeEditModal,
    setShowAddEditModal,
    addOnly,
    updateData
}) => {
    useEffect(() => {
        if (addOnly) {
            setInputTitle("");
            setInputDescription("");
            setSelectedIcon("");
        } else {
            setInputTitle(updateData.title);
            setInputDescription(updateData.description);
            setSelectedIcon(updateData.icon);
        }
    }, [addOnly, updateData]);

    const {
        mutate: mutateAddEditGuide,
        isLoading: isLoadingAddEditGuide
    } = useAxiosQuery(
        "POST",
        addOnly ? "api/v1/guide_new_add" : "api/v1/guide_new_edit",
        "guides_new"
    );

    const [inputTitle, setInputTitle] = useState("");
    const [inputDescription, setInputDescription] = useState("");

    const submitEditGuide = id => {
        if (!inputTitle) {
            notification.error({
                message: " Guide Title Content Required"
            });
        }

        if (inputTitle) {
            mutateAddEditGuide(
                {
                    id: addOnly ? null : updateData.id,
                    title: inputTitle,
                    description: inputDescription,
                    icon: selectedIcon ? selectedIcon : "question",
                    video_url: null,
                    type: "guide"
                },
                {
                    onSuccess: res => {
                        console.log(res);
                        notification.success({
                            message: addOnly
                                ? "Guide Title Created Successfully "
                                : "Guide Title Updated Successfully "
                        });
                        setShowAddEditModal(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    const [showSelectIcons, setShowSelectIcons] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState("");
    const showIconModal = () => {
        setShowSelectIcons(!showSelectIcons);
    };
    const selectIcons = val => {
        console.log(val);
        setSelectedIcon(val);
        setShowSelectIcons(false);
    };

    return (
        <>
            <Modal
                visible={showAddeEditModal}
                onCancel={() => {
                    setShowAddEditModal(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowAddEditModal(false);
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
                        loading={isLoadingAddEditGuide}
                    >
                        Submit
                    </Button>
                ]}
                title={addOnly ? "Add Guide " : "Update Guide "}
            >
                <Row style={{ marginBottom: "10px" }}>
                    <Col md={24}>
                        <div style={{ marginBottom: "2px" }}> Title:</div>
                    </Col>
                    <Col md={24}>
                        {" "}
                        <Input
                            type="text"
                            style={{
                                height: "100%",
                                width: "100%"
                            }}
                            value={inputTitle}
                            placeholder="Title"
                            onChange={e => setInputTitle(e.target.value)}
                        />{" "}
                    </Col>
                </Row>

                <Row style={{ marginBottom: "10px" }}>
                    <Col md={24}>
                        {" "}
                        <div style={{ marginBottom: "2px" }}>Description:</div>
                    </Col>
                    <Col md={24}>
                        <Input.TextArea
                            value={inputDescription}
                            placeholder="Description"
                            rows={4}
                            onChange={e => setInputDescription(e.target.value)}
                        />
                    </Col>
                </Row>

                <Row style={{ marginBottom: "10px" }}>
                    <Col md={24}>
                        <div style={{ marginBottom: "2px" }}>Icon:</div>
                    </Col>
                    <Col md={24}>
                        {" "}
                        <Button
                            type="primary"
                            onClick={() => {
                                showIconModal();
                            }}
                            icon={<PlusCircleOutlined />}
                        >
                            Select Icon
                        </Button>
                        <span style={{ marginLeft: "10px" }}>
                            {selectedIcon && (
                                <>
                                    <span>{selectedIcon}</span>{" "}
                                    <span>
                                        ({" "}
                                        <i
                                            className={`fa fa-${selectedIcon}`}
                                            style={{
                                                fontSize: "15",
                                                color: "#20a8d8",
                                                marginTop: "5px"
                                            }}
                                        ></i>{" "}
                                        )
                                    </span>
                                </>
                            )}
                        </span>
                    </Col>
                </Row>
            </Modal>

            <PageGuideIconModal
                showSelectIcons={showSelectIcons}
                setShowSelectIcons={setShowSelectIcons}
                options={options}
                selectIcons={selectIcons}
            />
        </>
    );
};

export default PageGuideAddEditModal;
