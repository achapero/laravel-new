import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Input, notification, Select, Button, Upload } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
// import Select from "react-select";
import getUserData from "../../../../../providers/getUserData";

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
    SearchOutlined
} from "@ant-design/icons";

const ModalUploadMerchantFile = ({
    showModalUploadMerchantFile,
    toggleModalUploadMerchantFile,

    setShowModalUploadMerchantFile,
    user_id
}) => {
    const [form] = Form.useForm();
    const userdata = getUserData();

    const [fileDetails, setFileDetails] = useState({
        user_id: user_id,
        category: "",
        file: []
    });
    const [submitButtonText, setSubmitButtonText] = useState("Upload");
    const [merchantSelectOptions, setMerchantSelectOptions] = useState([]);

    const {
        mutate: mutateAddFile,
        isLoading: isLoadingAddFile
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/users/files/multiple",
        `users_files_${user_id}`
    );

    const submitForm = e => {
        if (fileDetails.file.length == 0) {
            notification.error({
                message: "Select File"
            });
        }
        if (!fileDetails.category) {
            notification.error({
                message: "Insert Category"
            });
        }

        if (fileDetails.file.length != 0 && fileDetails.category) {
            let data = new FormData();
            data.append("category", fileDetails.category);
            fileDetails.file.forEach(element => {
                data.append("files[]", element.originFileObj);
            });
            data.append("user_id", fileDetails.user_id);

            mutateAddFile(data, {
                onSuccess: res => {
                    notification.success({
                        message: "File Successfully Created"
                    });
                    setShowModalUploadMerchantFile(false);

                    console.log(res);
                },
                onError: err => {
                    console.log(err);
                    notificationErrors(err);
                }
            });
        }
        form.resetFields()
        setFileDetails({
            user_id: user_id,
            category: "",
            file: []
        })
        console.log(fileDetails);
    };

    const {
        data: dataMerchantOption,
        isLoading: isLoadingMerchantOption,
        refetch: refetchMerchantOptions,
        isFetching: isFetchingMerchantOption
    } = useAxiosQuery("GET", "api/v1/users?only=name", "option_table", res => {
        let options = [];
        res.data.map((user, key) => {
            options.push({
                value: user.id,
                label: (user.name || "") + " (" + user.email + ")"
            });
        });
        setMerchantSelectOptions(options);
        console.log("@option", options);
    });

    useEffect(() => {
        refetchMerchantOptions();
        return () => {};
    }, []);

    const handleChange = e => {
        setFileDetails({
            ...fileDetails,
            [e.target.name]:
                e.target.type != "file" ? e.target.value : e.target.files[0]
        });
    };

    return (
        <Modal
            visible={showModalUploadMerchantFile}
            className="modal-md"
            onCancel={() => {
                setShowModalUploadMerchantFile(false);
            }}
            title="Upload Merchant File"
            // footer={[
            //     <Button
            //         key="cancel"
            //         onClick={() => {
            //             setShowModalUploadMerchantFile(false);
            //         }}
            //     >
            //         Cancel
            //     </Button>,
            //     <Button
            //         key="submit"
            //         type="primary"
            //         loading={isLoadingAddFile}
            //         onClick={() => {
            //             submitForm();
            //         }}
            //     >
            //         Submit
            //     </Button>
            // ]}
            onOk={() => {
                form
                .validateFields()
                .then(values => {
                    submitForm(values);
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
            }}
        >
            <Form method="POST"
                // onFinish={e => submitForm(e)}
                form={form}
            >
                <div>
                    <Form.Item label="Category">
                        <Input
                            type="text"
                            name="category"
                            required
                            value={fileDetails.category}
                            onChange={e => handleChange(e)}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <>
                                Upload Document
                                <small>(.jpeg, .pdf) (up to 5mb)</small>{" "}
                            </>
                        }
                    >
                        <Upload
                            beforeUpload={() => false}
                            multiple={true}
                            fileList={fileDetails.file}
                            onChange={({ file, fileList }) => {
                                console.log(file);
                                console.log(fileList);
                                let sizeChar = (file.size / (1024*1024)).toFixed(2)
                                if (sizeChar <= 5.00) {
                                    setFileDetails({
                                        ...fileDetails,
                                        file: [...fileList]
                                    });
                                } else {
                                    fileList.filter(function( obj ) {
                                        return obj.uid !== file.uid;
                                    });
                                    notification.error({
                                        message: 'Error',
                                        description: 'Document '+file.name+' exceeds to 5mb'
                                    });
                                    // console.log('fileList', fileList)
                                }
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                Select File
                            </Button>
                        </Upload>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalUploadMerchantFile;
