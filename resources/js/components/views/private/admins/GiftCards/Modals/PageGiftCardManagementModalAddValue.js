import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Table,
    Input,
    Divider,
    Popconfirm,
    notification,
    Modal
} from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../../providers/arrayColumn";
import { number_format } from "../../../../../providers/number_format";
import moment from "moment";
import { CSVLink } from "react-csv";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    ReloadOutlined
} from "@ant-design/icons";
const PageGiftCardManagementModalAddValue = ({
    showAddValue,
    setShowAddValue,
    cardId,
    match,
    userdata
}) => {
    const [value, setValue] = useState(0);

    const {
        mutate: mutattegetGiftCard,
        isLoading: isLoadingGetGiftCard
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_management/addValue",
        `gift_card_account_cards_table_${match.params.id}`
    );

    const submit = () => {
        if (value >= 0) {
            mutattegetGiftCard(
                { id: cardId, value: value, user_id: userdata.id },
                {
                    onSuccess: res => {
                        notification.success({
                            message: "Added Successfully "
                        });
                        setShowAddValue(false);
                    }
                }
            );
        } else {
            notification.error({
                message: "Cannot Add Negative Value"
            });
        }
    };

    return (
        <>
            <Modal
                visible={showAddValue}
                onCancel={() => {
                    setShowAddValue(false);
                }}
                width={350}
                footer={[
                    <Button
                        key="submit"
                        onClick={() => {
                            submit();
                        }}
                        loading={isLoadingGetGiftCard}
                        type="primary"
                    >
                        Submit
                    </Button>,
                    <Button
                        key="back"
                        onClick={() => {
                            setShowAddValue(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Add Value"
            >
                <Row>
                    <Col md={24}>
                        <Input
                            placeholder="value"
                            type="number"
                            onChange={e => setValue(e.target.value)}
                        />
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PageGiftCardManagementModalAddValue;
