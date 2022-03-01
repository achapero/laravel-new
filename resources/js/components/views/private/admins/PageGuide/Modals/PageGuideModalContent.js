import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Modal, Form } from "antd";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);
import "react-quill/dist/quill.snow.css";

import PageGuideFiles from "../PageGuideFiles";
const PageGuideModalContent = ({
    showSubmitModal,
    showModalAdd,
    submitGuideContent,
    handleTitleChange,
    handleEditorChange,
    submitButtonTextDis,
    submitButtonText,
    submitCloseModal,
    showSubmitModalEdit,
    editContent,
    submitGuideContentEdit,
    merchantGuideFiles,
    guideContentId,
    getMerchantGuideFiles,
    editCloseModal,
    uploadingImage,
    guideContentTitle,
    guideContent,
    contentable,
    setShowSubmitModal,
    isLoadingSubmitGuideContent,
    isLoadingSubmitGuideContentEdit
}) => {
    const modulesToolBar = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" }
            ],
            ["link", "image", "video"],
            ["clean"]
        ],

        imageResize: {
            // parchment: Quill.import('parchment'),
            modules: ["Resize", "DisplaySize"]
        }
    };

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video"
    ];

    return (
        <>
            <Modal
                visible={showSubmitModal}
                onCancel={() => submitCloseModal()}
                width={700}
                height={720}
                footer={[
                    <>
                        <Button
                            type="secondary"
                            onClick={() => submitCloseModal()}
                        >
                            Close
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => submitGuideContent()}
                            loading={isLoadingSubmitGuideContent}
                        >
                            Submit
                        </Button>
                    </>
                ]}
            >
                <div className="pre-line">
                    <Row>
                        <Col md={18}>
                            <Input
                                type="text"
                                required
                                style={{
                                    height: "100%",
                                    minWidth: 200
                                }}
                                value={
                                    guideContentTitle ? guideContentTitle : ""
                                }
                                name="Content_title"
                                placeholder="Content Title"
                                onChange={e => handleTitleChange(e)}
                            />
                            {uploadingImage && (
                                <>
                                    Uploading Image please wait...{" "}
                                    <i className="fa fa-spin fa-spinner"></i>
                                </>
                            )}
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col md={24}>
                            <ReactQuill
                                value={guideContent ? guideContent : ""}
                                onChange={e => {
                                    handleEditorChange(e);
                                }}
                                style={{ height: 450 }}
                                modules={modulesToolBar}
                                formats={formats}
                            />
                        </Col>
                    </Row>

                    <PageGuideFiles
                        merchantGuideFiles={merchantGuideFiles}
                        guideContentId={0}
                        getMerchantGuideFiles={getMerchantGuideFiles}
                    />
                </div>
            </Modal>

            <Modal
                visible={showSubmitModalEdit}
                onCancel={() => editCloseModal()}
                width={700}
                height={720}
                footer={[
                    <>
                        <div>
                            <Button
                                type="secondary"
                                onClick={() => editCloseModal()}
                            >
                                Close
                            </Button>{" "}
                            <Button
                                type="primary"
                                onClick={() => submitGuideContentEdit()}
                                loading={isLoadingSubmitGuideContentEdit}
                            >
                                Submit
                            </Button>{" "}
                        </div>
                    </>
                ]}
            >
                <div className="pre-line">
                    <Row>
                        <Col md={18}>
                            <Input
                                value={
                                    guideContentTitle ? guideContentTitle : ""
                                }
                                type="text"
                                required
                                style={{
                                    height: "100%",
                                    minWidth: 200
                                }}
                                name="Content_title"
                                placeholder="Content Title"
                                onChange={e => handleTitleChange(e)}
                            />

                            {uploadingImage && (
                                <div className="p-2">
                                    Uploading Image please wait...{" "}
                                    <i className="fa fa-spin fa-spinner"></i>
                                </div>
                            )}
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col md={24}>
                            <ReactQuill
                                value={guideContent ? guideContent : ""}
                                onChange={e => {
                                    handleEditorChange(e);
                                }}
                                style={{ height: 450 }}
                                modules={modulesToolBar}
                                formats={formats}
                            />
                        </Col>
                    </Row>
                    <PageGuideFiles
                        guideContentId={guideContentId}
                        merchantGuideFiles={merchantGuideFiles}
                        getMerchantGuideFiles={getMerchantGuideFiles}
                    />
                </div>
            </Modal>
        </>
    );
};

export default PageGuideModalContent;
