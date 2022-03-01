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
const PageGiftCardManagementModalRedeemValue = ({
    redeemShowValue,
    setReddemShowValue,
    cardId,
    match,
    userdata
}) => {
    const [value, setValue] = useState(0);

    const {
        mutate: mutattegetGiftCard,
        isLoading: isLoadingGetGiftCardAdd
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_management/redeemValue",
        `gift_card_account_cards_table_${match.params.id}`
    );

    const submit = () => {
        mutattegetGiftCard(
            { id: cardId, value: value, user_id: userdata.id },
            {
                onSuccess: res => {
                    console.log(res);
                    if (!res.success) {
                        notification.error({
                            message: "Insufficient Balance "
                        });
                    } else {
                        notification.success({
                            message: "Redeem Successfully"
                        });
                        setReddemShowValue(false);
                    }
                }
            }
        );
    };

    return (
        <>
            <Modal
                visible={redeemShowValue}
                onCancel={() => {
                    setReddemShowValue(false);
                }}
                width={350}
                footer={[
                    <Button
                        key="submit"
                        onClick={() => {
                            submit();
                        }}
                        loading={isLoadingGetGiftCardAdd}
                        type="primary"
                    >
                        Submit
                    </Button>,
                    <Button
                        key="back"
                        onClick={() => {
                            setReddemShowValue(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Redeem Value"
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

export default PageGiftCardManagementModalRedeemValue;
