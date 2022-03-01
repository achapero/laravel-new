import { Modal, Form, Input, notification } from "antd";
import React, { useEffect } from "react";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";

import * as htmlToImage from "html-to-image";
import { jsPDF } from "jspdf";
const StepDocumentsModalDriverLicense = ({
    showModalDriversLicense,
    setShowModalDriversLicense,
    merchantNumber
}) => {
    const [form] = Form.useForm();
    useEffect(() => {
        if (showModalDriversLicense) {
            form.resetFields();
        }
        return () => {};
    }, [showModalDriversLicense]);
    const {
        mutate: mutateUploadDriversLicense,
        isLoading: isLoadingMutateUploadDriversLicense
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/clearent/document/uploadBlob",
        `clearent_boarding_documents_${merchantNumber}`
    );

    const handleUploadDriversLicense = () => {
        htmlToImage
            .toPng(document.getElementById("modalLicense"), {
                quality: 0.95
            })
            .then(function(dataUrl) {
                const pdf = new jsPDF();
                pdf.addImage(dataUrl, "PNG", 0, 0);
                let modalLicense = pdf.output("blob");

                // console.log(dataUrl);
                // console.log(modalLicense);
                let file = modalLicense;
                let data = new FormData();
                data.append("file", file);
                data.append("category", "21");
                data.append("merchantNumber", merchantNumber);

                mutateUploadDriversLicense(data, {
                    onSuccess: res => {
                        if (res.success) {
                            notification.success({
                                message: "Upload Success, Thank you!"
                            });
                            setShowModalDriversLicense(false);
                        }
                    },
                    onError: err => {
                        notification.error({
                            message: "Upload Faied, please try again..."
                        });
                    }
                });
            });
    };
    return (
        <Modal
            visible={showModalDriversLicense}
            onCancel={e => setShowModalDriversLicense(false)}
            title="Add Merchant's Driver's License"
            okText="Upload"
            onOk={e => handleUploadDriversLicense()}
            confirmLoading={isLoadingMutateUploadDriversLicense}
        >
            <div id="modalLicense" style={{ padding: 35 }}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address">
                        <Input />
                    </Form.Item>
                    <Form.Item label="License Issue Date">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="License Expiration Date">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item label="License No.">
                        <Input />
                    </Form.Item>
                    <Form.Item label="State Issued">
                        <Input />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default StepDocumentsModalDriverLicense;
