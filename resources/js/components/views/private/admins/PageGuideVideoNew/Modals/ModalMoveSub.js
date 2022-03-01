import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Modal,
    Button,
    Input,
    notification,
    Select
} from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";

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

const ModalMoveSub = ({
    setModalMoveSub,
    modalMoveSub,
    cardGuides,
    modalMoveSubData,
    history
}) => {
    const { Option } = Select;

    const [selectedItem, setSelectedItem] = useState(0);
    const handleSelectItem = id => {
        setSelectedItem(id);
        console.log(id);
    };

    const {
        mutate: mutateAddEditGuide,
        isLoading: isLoadingAddEditGuide
    } = useAxiosQuery(
        "POST",
        "api/v1/guidesidebar/moveSubItem",
        `guides_page_sidebar`
    );

    const submit = () => {
        mutateAddEditGuide(
            {
                sub_id: modalMoveSubData.id,
                selected_id: selectedItem
            },
            {
                onSuccess: res => {
                    console.log(res);
                    setModalMoveSub(false);
                    notification.success({
                        message: `Sub Guide Successfully Updated`
                    });
                    history.push("/admin-video-guides/" + selectedItem);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    return (
        <>
            <Modal
                width={500}
                visible={modalMoveSub}
                onCancel={() => {
                    setModalMoveSub(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setModalMoveSub(false);
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
                        Save
                    </Button>
                ]}
                title={`Want to Move this Sub Guide(${modalMoveSubData &&
                    modalMoveSubData.sub_title}) ?`}
            >
                <Row>
                    <Col md={24}>
                        <Select
                            placeholder="Select Guide"
                            style={{ width: "100%" }}
                            onChange={e => handleSelectItem(e)}
                        >
                            {cardGuides.map((card, index) => {
                                return (
                                    <Option value={card.id}>
                                        {card.title}
                                    </Option>
                                );
                            })}
                        </Select>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default ModalMoveSub;
