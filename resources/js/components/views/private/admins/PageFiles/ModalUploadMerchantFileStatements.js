import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, notification, Select, Button, Upload } from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
// import Select from "react-select";
import getUserData from "../../../../providers/getUserData";
const { Option } = Select;

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    EditOutlined,
    EyeOutlined,
    MergeCellsOutlined,
    CheckCircleOutlined,
    PrinterOutlined,
    SearchOutlined,
    InboxOutlined
} from "@ant-design/icons";

const ModalUploadMerchantFileStatements = ({
    showModalUploadMerchantFileStatements,
    setShowModalUploadMerchantFileStatements
}) => {
    const {
        mutate: mutateAddFileStatements,
        isLoading: isLoadingAddFileStatements
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/users/files/statements",
        "files_table"
    );

    const [statementFiles, setStatementFiles] = useState([]);
    const submitForm = e => {
        if (statementFiles.length == 0) {
            notification.error({
                message: "Select File"
            });
        }
        if (statementFiles.length != 0) {
            let data = new FormData();
            statementFiles.forEach(element => {
                data.append("files[]", element.originFileObj);
            });

            mutateAddFileStatements(data, {
                onSuccess: res => {
                    res.user_account_links_all.map((data, key) => {
                        notification.success({
                            message: `${data.file_name} Successfully Uploaded to ${data.merchant_name}`,
                            duration: 10
                        });
                        setStatementFiles([]);
                    });
                    setShowModalUploadMerchantFileStatements(false);
                },
                onError: err => {
                    console.log(err);
                    notificationErrors(err);
                }
            });
        }
    };

    return (
        <Modal
            visible={showModalUploadMerchantFileStatements}
            className="modal-md"
            onCancel={() => {
                setShowModalUploadMerchantFileStatements(false);
            }}
            title="Upload Merchant Statements"
            footer={[
                <Button
                    key="cancel"
                    onClick={() => {
                        setShowModalUploadMerchantFileStatements(false);
                    }}
                >
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoadingAddFileStatements}
                    onClick={() => {
                        submitForm();
                    }}
                >
                    Submit
                </Button>
            ]}
        >
            <Upload.Dragger
                beforeUpload={() => false}
                multiple={true}
                onChange={file => setStatementFiles(file.fileList)}
                accept=".pdf"
                fileList={statementFiles}
            >
                {/* <Button icon={<UploadOutlined />}>Select File</Button> */}
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                    Drag & Drop Multiple Statements Below. Each will be
                    auto-assigned to the merchant profile with matching MID from
                    the filename.
                </p>
            </Upload.Dragger>
        </Modal>
    );
};

export default ModalUploadMerchantFileStatements;
