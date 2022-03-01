import {
    Layout,
    Card,
    Button,
    Row,
    Col,
    Input,
    Table,
    Popconfirm,
    Divider,
    notification,
    Image,
    Tooltip,
    Drawer,
    Space,
    Modal,
    Form,
    Checkbox,
    Typography,
    Tag,
    Select
} from "antd";
import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    FileExcelOutlined,
    SettingOutlined,
    EyeOutlined,
    UsergroupDeleteOutlined,
    UserAddOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import React, { useEffect, useState, useRef, Component, Fragment } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import getUserData from "../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import moment, { isMoment } from "moment";
import { arrayColumn } from "../../../../../providers/arrayColumn";

const ModalApiKey = ({
    selectedMerchant,
    setShowModalApiKey,
    showModalApiKey,
    toggleShowModalApiKey
}) => {
    const [merchantApiKey, setMerchantApiKey] = useState();
    const [payloads, setPayloads] = useState();

    const {
        data: dataMerchant,
        isLoading: isLoadingMerchant,
        isFetching: isFetchingMerchant
    } = useAxiosQuery(
        `GET`,
        `api/v1/clearent/api_keys?merchantNumber=${selectedMerchant.merchantNumber}`,
        `merchantNumber_${selectedMerchant.merchantNumber}`,
        res => {
            if (res.success) {
                setMerchantApiKey(res.data);
                setPayloads(
                    res.data.payload ? JSON.parse(res.data.payload) : []
                );
            }
        }
    );

    const showApiKey = (target, terminal) => {
        // console.log(target, terminal)
        $(target).html(terminal.apiKey);
    };

    const showpublicKey = (target, terminal) => {
        $(target).html(terminal.publicKey);
    };

    const [terminals, setTerminals] = useState([]);
    const [terminals2, setTerminals2] = useState(false);
    const getSearialNumber = (target, terminal) => {
        let button = $(target);
        //console.log(button.html());
        // alert(terminal.apiKey);
        if (
            button.html() ==
            '<i classname="fa fa-eye" aria-hidden="true"></i> Show Serial'
        ) {
            setTerminals(terminal);
            setTerminals2(true);
        } else {
            button.html(
                '<i classname="fa fa-eye" aria-hidden="true"></i> Show Serial'
            );
        }
    };

    const {
        data: dataSerial,
        isFetching: isFetchingSerial,
        refetch: refetchSerial
    } = useAxiosQuery(
        `GET`,
        `api/v1/clearent/api_keys/${terminals.apiKey}`,
        `clearent_api_keys_${terminals.apiKey}`,
        res => {
            if (terminals2 == true) {
                if (res.data.code == "200") {
                    let SerialNum = res.data.payload.device.metadata.SerialNum;
                    button.html(SerialNum);
                } else {
                    notification.error({
                        message: "Error",
                        description:
                            "Device is not configured yet, please try again later."
                    });
                }
                setTerminals2(false);
            }
        }
    );

    useEffect(() => {
        if (terminals2 == true) {
            refetchSerial();
        }
    }, [terminals]);

    const handleCancel = () => {
        setShowModalApiKey(false);
    };

    const handleOk = () => {
        setShowModalApiKey(false);
    };

    return (
        <Modal
            title="Merchant Boarding Info"
            visible={showModalApiKey}
            onCancel={handleCancel}
            onOk={handleOk}
            centered
            width={1000}
            footer={null}
        >
            Order Id: {merchantApiKey && merchantApiKey.orderId}
            <br />
            Terminals:
            {console.log("payloads", payloads)}
            {payloads && (
                <Table
                    className="table-boarding-clearent"
                    dataSource={payloads.terminals}
                    rowKey={record => record.terminalId}
                    pagination={false}
                    scroll={{ x: 1500 }}
                >
                    <Table.Column title="Name" key="name1" dataIndex="name" />
                    <Table.Column
                        title="API Key"
                        key="api_key1"
                        render={(text, record) => {
                            return (
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        showApiKey(e.currentTarget, record);
                                    }}
                                >
                                    <i className="fa fa-eye"></i> Show Key
                                </a>
                            );
                        }}
                    />
                    <Table.Column
                        title="Public Key"
                        key="public_key1"
                        render={(text, record) => {
                            return (
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        showpublicKey(e.currentTarget, record);
                                    }}
                                >
                                    <i className="fa fa-eye"></i> Show Key
                                </a>
                            );
                        }}
                    />
                    <Table.Column
                        title="Store Number"
                        key="storeNumber"
                        dataIndex="storeNumber"
                    />
                    <Table.Column
                        title="Terminal ID"
                        key="terminalId"
                        dataIndex="terminalId"
                    />
                    <Table.Column
                        title="Serial #"
                        key="serial_#1"
                        render={(text, record) => {
                            return (
                                <a
                                    href="#"
                                    onClick={e => {
                                        e.preventDefault();
                                        getSearialNumber(
                                            e.currentTarget,
                                            record
                                        );
                                    }}
                                >
                                    <i className="fa fa-eye"></i> Show Serial
                                </a>
                            );
                        }}
                    />
                </Table>
            )}
        </Modal>
    );
};

export default ModalApiKey;
