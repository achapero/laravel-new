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
    Typography,
    Form,
    Select,
    DatePicker
} from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import { arrayColumn } from "../../../../providers/arrayColumn";
import { number_format } from "../../../../providers/number_format";
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
const PageAssetManagmentModal = ({
    modalForm,
    setModalForm,
    toggleModalForm,
    selectedRecord,
    addOnly,
    displayDeviceMgmtList
}) => {
    const {
        mutate: mutateAssetAdd,
        isLoading: isLoadingAssetAdd
    } = useAxiosQuery("POST", "api/v1/devicemgmt", "mutate_asset_add");

    const handleSubmit = data => {
        // console.log(data);

        let _data = {
            ...data,
            date_assigned: moment(data.date_assigned).format("YYYY-MM-DD"),
            given_date: moment(data.date_assigned).format("YYYY-MM-DD")
        };

        mutateAssetAdd(_data, {
            onSuccess: res => {
                notification.success({
                    message: "Assets Created Successfully"
                });
                displayDeviceMgmtList();
                setModalForm(false);
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    const {
        mutate: mutateUpdateAsset,
        isLoading: isLoadingUpdateAsset
    } = useAxiosQuery("UPDATE", `api/v1/devicemgmt`, `devicemgmt_update`);

    const handleUpdate = data => {
        let _data = {
            ...data,
            date_assigned: moment(data.date_assigned).format("YYYY-MM-DD"),
            given_date: moment(data.date_assigned).format("YYYY-MM-DD"),
            id: selectedRecord.id
        };

        mutateUpdateAsset(_data, {
            onSuccess: res => {
                notification.success({
                    message: "Assets Updated Successfully"
                });
                displayDeviceMgmtList();
                setModalForm(false);
            },
            onError: err => {
                // console.log(err);
            }
        });
    };

    const [form] = Form.useForm();
    const { TextArea } = Input;

    const [merchantSelectOptions, setMerchantSelectOptions] = useState([]);
    const {
        data: dataUsers,
        isLoading: isLoadingDataUsers,
        refetch: refetchUsers,
        isFetching: isFetchingDataUsers
    } = useAxiosQuery("GET", `api/v1/users`, "asset_users", res => {
        // console.log("res", res);
        let options = [];
        res.data.map((user, key) => {
            options.push({
                value: user.id,
                label: (user.name || "") + " (" + user.email + ")"
            });
        });
        setMerchantSelectOptions(options);
    });

    useEffect(() => {
        if (modalForm) {
            if (!addOnly) {
                // console.log("selected", selectedRecord);

                form.setFieldsValue({
                    ...selectedRecord,
                    given_date: moment(selectedRecord.given_date),
                    date_assigned: moment(selectedRecord.date_assigned)
                });
            } else {
                // console.log("selected", selectedRecord);
                form.setFieldsValue({
                    ...selectedRecord
                });
            }
        }
    }, [modalForm]);

    return (
        <Modal
            visible={modalForm}
            title={addOnly ? "Add New Asset" : "Asset Details"}
            okText="Submit"
            cancelText="Cancel"
            width={600}
            onCancel={() => setModalForm(false)}
            onOk={() => {
                form
                .validateFields()
                .then(values => {
                    if(addOnly){
                        handleSubmit(values)
                    } else {
                        handleUpdate(values)
                    }
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
            }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                >
                    <Form.Item
                        label="Asset Name"
                        rules={[
                            {
                                required: true,
                                message: "Asset Name Required"
                            }
                        ]}
                        name="device_name"
                    >
                        <Input
                            type="text"
                            placeholder="Asset Name"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Serial Number"
                        rules={[
                            {
                                required: true,
                                message: "Serial Number Required"
                            }
                        ]}
                        name="serial_number"
                    >
                        <Input
                            type="text"
                            placeholder="Serial Number"
                        />
                    </Form.Item>

                    <Form.Item
                        name="device_type"
                        label="Asset Type"
                        rules={[
                            {
                                required: true
                            }
                        ]}
                    >
                        <Select placeholder="Select Asset Type">
                            <Select.Option value="Workstation" key="1">
                                Workstation
                            </Select.Option>
                            <Select.Option value="Thermal Printer" key="2">
                                Thermal Printer
                            </Select.Option>
                            <Select.Option value="Impact Printer" key="3">
                                Impact Printer
                            </Select.Option>
                            <Select.Option value="Cash Drawer" key="4">
                                Cash Drawer
                            </Select.Option>
                            <Select.Option value="Router" key="5">
                                Router
                            </Select.Option>
                            <Select.Option value="Switch" key="6">
                                Switch
                            </Select.Option>
                            <Select.Option value="Server" key="7">
                                Server
                            </Select.Option>
                            <Select.Option value="VAR Sheet" key="8">
                                VAR Sheet
                            </Select.Option>
                            <Select.Option value="New Terminal" key="9">
                                New Terminal
                            </Select.Option>
                            <Select.Option value="Reinjected Terminal" key="10">
                                Reinjected Terminal
                            </Select.Option>
                            <Select.Option value="Loaner Terminal" key="11">
                                Loaner Terminal
                            </Select.Option>
                            <Select.Option value="No Load Terminal" key="12">
                                No Load Terminal
                            </Select.Option>
                            <Select.Option value="Customer Supplied" key="13">
                                Customer Supplied
                            </Select.Option>
                            <Select.Option value="Shipped to KIF" key="14">
                                Shipped to KIF
                            </Select.Option>
                            <Select.Option value="Tampered" key="15">
                                Tampered
                            </Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Given Date"
                        rules={[
                            {
                                required: true,
                                message: "Given Date Required"
                            }
                        ]}
                        name="given_date"
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format={"YYYY-MM-DD"}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Manufacturer"
                        rules={[
                            {
                                required: true,
                                message: "Manufacturer Required"
                            }
                        ]}
                        name="manufacturer"
                    >
                        <Input
                            type="text"
                            placeholder="Manufacturer"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Assigned Merchant"
                        name="assigned_merchant"
                    >
                        <Select
                            showSearch
                            placeholder="Select Assigned Merchant"
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >=
                                0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children
                                    .toLowerCase()
                                    .localeCompare(
                                        optionB.children.toLowerCase()
                                    )
                            }
                        >
                            {merchantSelectOptions.map(
                                (el, key) => {
                                    return (
                                        <Select.Option
                                            key={key}
                                            value={el.value}
                                        >
                                            {el.label}
                                        </Select.Option>
                                    );
                                }
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Date Assigned"
                        rules={[
                            {
                                required: true,
                                message: "Date Assigned Required"
                            }
                        ]}
                        name="date_assigned"
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format={"YYYY-MM-DD"}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Notes"
                        rules={[
                            {
                                required: true,
                                message: "NotesRequired"
                            }
                        ]}
                        name="notes"
                    >
                        <TextArea placeholder="Notes" rows="3" />
                    </Form.Item>
                </Form>
        </Modal>
    );
};

export default PageAssetManagmentModal;
