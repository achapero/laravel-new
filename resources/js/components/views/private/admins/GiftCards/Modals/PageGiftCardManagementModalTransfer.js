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
const PageGiftCardManagementModalTransfer = ({
    transferShowValue,
    setTransferShowValue,
    cardId,
    match,
    userdata,
    selectdata
}) => {
    const [value, setValue] = useState(0);

    const {
        mutate: mutattegetGiftCard,
        isLoading: isLoadingGetGiftCard
    } = useAxiosQuery(
        "POST",
        "api/v1/gift_card_management/transfer",
        `gift_card_account_cards_table_${match.params.id}`
    );

    const submit = () => {
        mutattegetGiftCard(
            { id: cardId, transfer_to: value, user_id: userdata.id },
            {
                onSuccess: res => {
                    console.log(res);
                    if (res.success) {
                        notification.success({
                            message: "Balance Successfully Transfer "
                        });
                        setTransferShowValue(false);
                    } else {
                        notification.error({
                            message: "Cant transfer on the same Card"
                        });
                    }
                }
            }
        );
    };

    const changeSelect = e => {
        setValue(e);
    };

    return (
        <>
            <Modal
                visible={transferShowValue}
                onCancel={() => {
                    setTransferShowValue(false);
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
                            setTransferShowValue(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                title="Transfer"
            >
                <Row>
                    <Col md={24}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Select Card Number"
                            onChange={e => changeSelect(e)}
                        >
                            {selectdata &&
                                selectdata.map((d, key) => {
                                    return (
                                        <Select.Option
                                            value={d.id}
                                            key={key}
                                            // style={{
                                            //     display:
                                            //         cardId == d.id
                                            //             ? "none"
                                            //             : "block"
                                            // }}
                                        >
                                            {d.card_number}
                                        </Select.Option>
                                    );
                                })}
                        </Select>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PageGiftCardManagementModalTransfer;
