import {
    DeleteOutlined,
    DownloadOutlined,
    Loading3QuartersOutlined,
    RightOutlined,
    UploadOutlined
} from "@ant-design/icons";
import {
    Button,
    Card,
    Divider,
    notification,
    Popconfirm,
    Table,
    Select,
    Input,
    Row,
    Col
} from "antd";
import FileSaver from "file-saver";
import moment from "moment";
import React, { useEffect, useState } from "react";
import getUserData from "../../../../../../providers/getUserData";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import StepDocumentsModalDriverLicense from "./StepDocumentsModalDriverLicense";

const StepDocuments = ({
    formData,
    inputData,
    stepsStatuses,
    setStepsStatuses,
    currentStep,
    setCurrentStep
}) => {
    let userdata = getUserData();

    useEffect(() => {
        if (currentStep == 8) {
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }
        }
        return () => {};
    }, [currentStep]);

    const [showUploadDocument, setShowUploadDocument] = useState(false);

    const {
        data: dataDocuments,
        isLoading: isLoadingDataDocuments,
        refetch: refetchDocuments,
        isFetching: isFetchingDataDocuments
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/document/${formData.clearent_boarding.merchantNumber}`,
        `clearent_boarding_documents_${formData.clearent_boarding.merchantNumber}`,
        res => {
            console.log("documents", res);
            if (res.success) {
                if (res.data.content) {
                    if (res.data.content.length > 0) {
                        let drivers_license = res.data.content.filter(
                            p => p.category == 21
                        );
                        let voided_check = res.data.content.filter(
                            p => p.category == 12
                        );
                        let count = 0;
                        if (drivers_license.length > 0) {
                            count++;
                        }
                        if (voided_check.length > 0) {
                            count++;
                        }

                        let _steps = [...stepsStatuses];
                        _steps[8] = {
                            ..._steps[8],
                            title: (
                                <>
                                    Documents ({count}
                                    /~)
                                </>
                            ),
                            status: count == 2 ? "finish" : "progress"
                        };
                        setStepsStatuses(_steps);
                    }
                }
            }
        }
    );

    const {
        mutate: mutateDeleteDocument,
        isLoading: isLoadingDeleteDocument
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/document/delete",
        `clearent_boarding_documents_${formData.clearent_boarding.merchantNumber}`
    );
    const handleDeleteDocument = record => {
        let data = {
            merchantNumber: formData.clearent_boarding.merchantNumber,
            documentId: record.documentId
        };

        mutateDeleteDocument(data, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Document Successfully Deleted!"
                    });
                }
            }
        });
    };

    const {
        mutate: mutateDownloadFile,
        isLoading: isLoadingDataDownloadFile
    } = useAxiosQuery("POST", `api/v1/users/files/downloadFromBoarding`, "");

    const handleDownloadFile = record => {
        console.log(record);
        let fileName = record.fileName + record.fileExtension;
        mutateDownloadFile(
            {
                fileName: fileName
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        console.log("res", res);
                        // console.log(
                        //     `${window.location.origin}/storage/${res.data.file_url}`
                        // );
                        FileSaver.saveAs(
                            `${window.location.origin}/storage/${res.data.file_url}`,
                            fileName
                        );
                        // setDownloadFileName("");
                    } else {
                        notification.error({ message: "File not found" });
                    }
                }
            }
        );
        // setDownloadFileName(record.fileName + record.fileExtension);
    };

    const {
        data: dataDocumentCategories,
        isLoading: isLoadingDataDocumentCategories
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/getDocumentCategories",
        "clearent_boarding_document_categories",
        res => {
            console.log("document categories", res);
        }
    );

    const [uploadDocumentData, setUploadDocumentData] = useState({
        category: null,
        file: null
    });

    useEffect(() => {
        console.log("uploadDocumentData", uploadDocumentData);
        return () => {};
    }, [uploadDocumentData]);

    const {
        mutate: mutateUploadDocument,
        isLoading: isLoadingMutateUploadDocument
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/clearent/document/upload",
        `clearent_boarding_documents_${formData.clearent_boarding.merchantNumber}`
    );
    const handleUploadDocument = () => {
        let data = new FormData();
        data.append("file", uploadDocumentData.file);
        data.append("category", uploadDocumentData.category);
        data.append(
            "merchantNumber",
            formData.clearent_boarding.merchantNumber
        );
        console.log("@file", uploadDocumentData.file);
        mutateUploadDocument(data, {
            onSuccess: res => {
                if (res.success) {
                    notification.success({
                        message: "Upload Success, Thank you!"
                    });
                    setShowUploadDocument(false);
                }
            },
            onError: err => {
                notification.error({
                    message: "Upload Error, please try again..."
                });
            }
        });
    };
    const [showModalDriversLicense, setShowModalDriversLicense] = useState(
        false
    );
    return !showUploadDocument ? (
        <Card
            title="Documents"
            extra={
                <Button
                    type="primary"
                    onClick={e => setShowUploadDocument(true)}
                >
                    Upload Document
                </Button>
            }
        >
            Don't see something you've already uploaded? Click refresh to double
            check{" "}
            <Button
                type="primary"
                icon={<Loading3QuartersOutlined />}
                size="small"
                onClick={e => refetchDocuments()}
            >
                Refresh
            </Button>
            {dataDocuments &&
                dataDocuments.data.content &&
                dataDocuments.data.content.filter(p => p.category == 21)
                    .length == 0 && (
                    <>
                        <br />
                        <small>
                            required: Driver's License{" "}
                            <span style={{ color: "red" }}>*</span>
                            <br />
                            <span style={{ color: "red" }}>
                                Please Add Merchant's Driver's License{" "}
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={e =>
                                        setShowModalDriversLicense(true)
                                    }
                                >
                                    Add
                                </Button>
                            </span>
                        </small>
                        <br />
                    </>
                )}
            {dataDocuments &&
                dataDocuments.data.content &&
                dataDocuments.data.content.filter(p => p.category == 12)
                    .length == 0 && (
                    <>
                        <br />
                        <small>
                            <span>
                                required: Voided Check{" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                            <br></br>
                            <b style={{ color: "#f86c6b" }}>
                                Please Upload Merchant's Voided Check
                            </b>
                        </small>
                    </>
                )}
            <Divider />
            <Table
                dataSource={dataDocuments ? dataDocuments.data.content : []}
                loading={isLoadingDataDocuments || isFetchingDataDocuments}
                rowKey={record => record.documentId}
            >
                <Table.Column
                    title="File Name"
                    key="fileName"
                    dataIndex="fileName"
                />
                <Table.Column
                    title="Category"
                    key="description"
                    dataIndex="description"
                />
                <Table.Column
                    title="Date Uploaded"
                    key="date_uploaded"
                    render={(text, record) => {
                        let _dateUpload = record.metaData.find(
                            p =>
                                p.metadataKey == "DateUploaded" ||
                                p.metadataKey == "dateuploaded"
                        );
                        if (_dateUpload) {
                            _dateUpload = moment(
                                _dateUpload.metadataValue
                            ).format("lll");
                        } else {
                            _dateUpload = "";
                        }
                        return _dateUpload;
                    }}
                />
                <Table.Column
                    title="Action"
                    key="action"
                    render={(text, record) => {
                        return (
                            <>
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={e => handleDownloadFile(record)}
                                ></Button>
                                <Popconfirm
                                    title="Are you sure you want to delete this Document?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={e =>
                                        handleDeleteDocument(record)
                                    }
                                >
                                    <Button
                                        type="primary"
                                        icon={<DeleteOutlined />}
                                        danger
                                        loading={isLoadingDeleteDocument}
                                    ></Button>
                                </Popconfirm>
                            </>
                        );
                    }}
                />
            </Table>
            {dataDocuments &&
                dataDocuments.data.content &&
                dataDocuments.data.content.filter(p => p.category == 21)
                    .length > 0 &&
                dataDocuments &&
                dataDocuments.data.content &&
                dataDocuments.data.content.filter(p => p.category == 12)
                    .length > 0 && (
                    <>
                        <Divider />
                        <Button
                            type="primary"
                            style={{ float: "right" }}
                            icon={<RightOutlined />}
                            onClick={e =>
                                setCurrentStep(
                                    userdata.role == "Merchant"
                                        ? 10
                                        : currentStep + 1
                                )
                            }
                        >
                            Next
                        </Button>
                    </>
                )}
            <StepDocumentsModalDriverLicense
                merchantNumber={formData.clearent_boarding.merchantNumber}
                showModalDriversLicense={showModalDriversLicense}
                setShowModalDriversLicense={setShowModalDriversLicense}
            />
        </Card>
    ) : (
        <Card
            title="Upload a Document"
            extra={
                <Button
                    type="primary"
                    onClick={e => setShowUploadDocument(false)}
                >
                    Back
                </Button>
            }
        >
            {dataDocuments &&
                dataDocuments.data.content &&
                dataDocuments.data.content.filter(p => p.category == 21)
                    .length == 0 && (
                    <>
                        <br />
                        <small>
                            required: Driver's License{" "}
                            <span style={{ color: "red" }}>*</span>
                            <br />
                            <span style={{ color: "red" }}>
                                Please Add Merchant's Driver's License{" "}
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={e =>
                                        setShowModalDriversLicense(true)
                                    }
                                >
                                    Add
                                </Button>
                            </span>
                        </small>
                        <br />
                    </>
                )}
            {dataDocuments &&
                dataDocuments.data.content &&
                dataDocuments.data.content.filter(p => p.category == 12)
                    .length == 0 && (
                    <>
                        <br />
                        <small>
                            <span>
                                required: Voided Check{" "}
                                <span style={{ color: "red" }}>*</span>
                            </span>
                            <br></br>
                            <b style={{ color: "#f86c6b" }}>
                                Please Upload Merchant's Voided Check
                            </b>
                        </small>
                    </>
                )}
            <Divider />
            <Row gutter={12}>
                <Col xs={24}>
                    Select Document Category
                    <Select
                        style={{ width: "100%" }}
                        loading={isLoadingDataDocumentCategories}
                        placeholder="Select Document Category"
                        value={uploadDocumentData.category}
                        onChange={e =>
                            setUploadDocumentData({
                                ...uploadDocumentData,
                                category: e
                            })
                        }
                    >
                        {dataDocumentCategories &&
                            dataDocumentCategories.documentCategories.content.map(
                                (category, key) => {
                                    return (
                                        <Select.Option
                                            key={key}
                                            value={category.documentCategoryID}
                                        >
                                            {category.documentCategoryName}
                                        </Select.Option>
                                    );
                                }
                            )}
                    </Select>
                </Col>
                <Col xs={24}>
                    <br />
                    <br />
                    Upload Document <small>(.jpeg, .pdf) (up to 5mb)</small>
                    <Input
                        type="file"
                        accept=".jpg,.pdf"
                        // value={uploadDocumentData.file}
                        onChange={e =>
                            setUploadDocumentData({
                                ...uploadDocumentData,
                                file: e.target.files[0]
                            })
                        }
                    />
                </Col>
            </Row>
            <br />
            <br />
            <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={e => handleUploadDocument()}
                loading={isLoadingMutateUploadDocument}
            >
                Upload
            </Button>
            <StepDocumentsModalDriverLicense
                merchantNumber={formData.clearent_boarding.merchantNumber}
                showModalDriversLicense={showModalDriversLicense}
                setShowModalDriversLicense={setShowModalDriversLicense}
            />
        </Card>
    );
};

export default StepDocuments;
