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
    Modal,
    Select
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
const PageGiftCardManagementModalDeactiivate = ({
    deactivateCardShowValue,
    setDeactivateCardShowValue,
    cardId,
    match,
    userdata,
    cardnumber
}) => {
    const [value, setValue] = useState(0);

    const {
        mutate: mutattegetGiftCard,
        isLoading: isLoadingGetGiftCard
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_management/deactivate",
        `gift_card_account_cards_table_${match.params.id}`
    );

    const submit = () => {
        mutattegetGiftCard(
            { id: cardId, user_id: userdata.id },
            {
                onSuccess: res => {
                    console.log(res);
                    if (res.success) {
                        notification.success({
                            message: "Card Successfully Deactivated"
                        });
                        setDeactivateCardShowValue(false);
                    }
                }
            }
        );
    };

    return (
        <>
            <Modal
                visible={deactivateCardShowValue}
                onCancel={() => {
                    setDeactivateCardShowValue(false);
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
                            setDeactivateCardShowValue(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Deactivate Card"
            >
                <Row>
                    <Col md={24}>
                        Do you want to Deactivate this card ({cardnumber}) ?
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PageGiftCardManagementModalDeactiivate;
