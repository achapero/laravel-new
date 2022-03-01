import React, { useState } from "react";
import {
    Button,
    Card,
    Col,
    Input,
    Row,
    Table,
    notification,
    message
} from "antd";
import useAxiosQuery from "../../../../providers/useAxiosQuery";

// import customNotification from "../../../../../providers/customNotification";
// import { loadingIcon } from "../../../../../providers/loading";
import copyToClipboard from "../../../../providers/copyToClipboard";

const PageGuideFiles = ({
    merchantGuideFiles,
    guideContentId,
    getMerchantGuideFiles
}) => {
    const [newGuideFiles, setNewGuideFiles] = useState({
        file_name: "",
        file: null
    });

    const [uploadNewFileContainer, setUploadNewFileContainer] = useState(false);

    const toggleUploadNewFileContainer = () => {
        setUploadNewFileContainer(!uploadNewFileContainer);
    };

    const {
        mutate: mutateAddGuideFile,
        isLoading: isLoadingAddGuideFile
    } = useAxiosQuery("POST_FILE", "api/v1/guide_files", "guides_files_table");

    const submitUpload = () => {
        if (newGuideFiles.file) {
            let data = new FormData();
            data.append("file", newGuideFiles.file);
            data.append("guide_id", guideContentId);

            console.log(guideContentId);

            mutateAddGuideFile(data, {
                onSuccess: res => {
                    notification.success({
                        message: "File Successfully Created"
                    });

                    toggleUploadNewFileContainer();
                    getMerchantGuideFiles(guideContentId);
                },
                onError: err => {
                    console.log(err);
                    notificationErrors(err);
                }
            });
        }
    };

    const columns = [
        {
            title: "File Name",
            dataIndex: "file_name",
            key: "file_name"
        },
        {
            title: "File Url",
            dataIndex: "file_url",
            key: "file_url",
            render: file_url => (
                <a
                    href="#"
                    onClick={e => {
                        copyToClipboard(
                            window.location.origin + "/" + file_url
                        );
                        let _message =
                            "File Url Successfully Copied to Clipboard";
                        message.success({
                            content: _message,
                            duration: 2
                        });
                    }}
                >
                    Copy
                </a>
            )
        }
    ];
    return (
        <div style={{ marginTop: "60px" }}>
            <Row>
                <Col md={24}>
                    <Card>
                        <div>
                            <Button
                                color="primary"
                                onClick={e => toggleUploadNewFileContainer()}
                            >
                                Upload New File
                            </Button>
                            <br /> <br />
                            {uploadNewFileContainer && (
                                <div>
                                    <h4>Upload File</h4>
                                    <div for="inputUploadDocument">
                                        Upload File (.pdf)
                                    </div>
                                    <Input
                                        type="file"
                                        id="inputUploadDocument"
                                        name="file"
                                        accept=".pdf"
                                        required
                                        onChange={e =>
                                            setNewGuideFiles({
                                                ...newGuideFiles,
                                                file: e.target.files[0]
                                            })
                                        }
                                    />
                                    <br /> <br />
                                    <Button
                                        type="primary"
                                        onClick={e => submitUpload()}
                                        loading={isLoadingAddGuideFile}
                                    >
                                        Upload
                                    </Button>
                                </div>
                            )}
                            <hr />
                            {console.log(merchantGuideFiles)}
                            <Table
                                dataSource={merchantGuideFiles}
                                columns={columns}
                                pagination={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PageGuideFiles;
