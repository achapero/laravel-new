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

const ModalUpdateTitle = ({
    setShowUpdateTile,
    showUpdateTitle,
    showUpdateTitleData,
    showUpdateTitleId,
    url,
    text,
    getGuides
}) => {
    useEffect(() => {
        setInputTitle(showUpdateTitleData);
        console.log(showUpdateTitleData);
    }, [showUpdateTitleData]);

    const {
        mutate: mutateAddEditGuide,
        isLoading: isLoadingAddEditGuide
    } = useAxiosQuery("POST", url, `guide_new_conent_${showUpdateTitleId}`);

    const [inputTitle, setInputTitle] = useState("");
    const submit = id => {
        if (!inputTitle) {
            notification.error({
                message: `${text} Title Content Required`
            });
        }

        if (inputTitle) {
            mutateAddEditGuide(
                {
                    id: showUpdateTitleId,
                    title: inputTitle
                },
                {
                    onSuccess: res => {
                        console.log(res);
                        notification.success({
                            message: `${text} Title Updated Successfully`
                        });
                        setShowUpdateTile(false);
                        getGuides();
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
                visible={showUpdateTitle}
                onCancel={() => {
                    setShowUpdateTile(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowUpdateTile(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="submit"
                        onClick={() => {
                            submit();
                        }}
                        loading={isLoadingAddEditGuide}
                    >
                        Submit
                    </Button>
                ]}
                title={`Update ${text} Title`}
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
                            placeholder="Title"
                            onChange={e => setInputTitle(e.target.value)}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default ModalUpdateTitle;
