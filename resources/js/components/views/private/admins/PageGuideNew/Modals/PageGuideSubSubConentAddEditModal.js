import React, { useState, useEffect, useRef } from "react";
import {
    Row,
    Col,
    Card,
    Modal,
    Button,
    Input,
    notification,
    Menu,
    Dropdown
} from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import { options } from "../PageGuideOptionIcons";
import ReactQuill, { Quill } from "react-quill-with-table";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);

import * as QuillTableUI from "quill-table-ui";
Quill.register(
    {
        "modules/tableUI": QuillTableUI.default
    },
    true
);

import "react-quill-with-table/dist/quill.snow.css";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined,
    DownOutlined,
    RightOutlined,
    EyeOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import Select from "rc-select";

import PageGuideFiles from "../PageGuideFiles";

const PageGuideConentAddEditModal = ({
    showAddeEditContentModal,
    setShowAddEditContentModal,
    addOnly,
    updateData,
    params,
    getGuides
}) => {
    useEffect(() => {
        if (addOnly) {
            setGuideContent("");
            setGuideContentTitle("");
            getMerchantGuideFiles(0);
        } else {
            console.log(updateData);
            setGuideContentTitle(updateData.title);
            setGuideContent(updateData.content);
            getMerchantGuideFiles(updateData.id);
        }
    }, [addOnly, updateData]);

    const {
        mutate: mutateSubmitGuideContent,
        isLoading: isLoadingSubmitGuideContent
    } = useAxiosQuery(
        "POST",
        addOnly ? "api/v1/guide_contents" : "api/v1/guide_contents/edit",
        `guide_sub_sub_new_conent_${params}`
    );

    const submitAddEditGuideContent = e => {
        console.log(guideContent);
        // if (!guideContentTitle) {
        //     notification.error({
        //         message: "Content Block Title Required"
        //     });
        // }

        if (!guideContent) {
            notification.error({
                message: "Content Block Required"
            });
        }

        if (guideContent) {
            mutateSubmitGuideContent(
                {
                    id: addOnly ? params : updateData.id,
                    type: "Child-Child",
                    content: guideContent,
                    title: guideContentTitle
                },
                {
                    onSuccess: res => {
                        notification.success({
                            message: addOnly
                                ? "Content Block Created Successfully "
                                : "Content Block Updated Successfully "
                        });

                        setShowAddEditContentModal(false);
                    },
                    onError: err => {
                        console.log(err);
                    }
                }
            );
        }
    };

    const [uploadingImage, setUploadingImage] = useState(false);
    const {
        mutate: mutateParseEditorImages,
        isLoading: isLoadingParseEditorImages
    } = useAxiosQuery(
        "POST",
        "api/v1/ticketresponses/response/upload",
        "mutate_add_parse_editor_images"
    );

    const parseEditorImages = _editor => {
        let editor = $(_editor);
        let imgs = editor.find("img");
        if (imgs.length > 0) {
            $.each(imgs, (key, img) => {
                //console.log($(img).attr("src"));
                let src = $(img).attr("src");
                if (src.indexOf("data:image") !== -1) {
                    setUploadingImage(true);
                    mutateParseEditorImages(
                        {
                            image: src
                        },
                        {
                            onSuccess: res => {
                                let _guideContent = guideContent;
                                _guideContent = _guideContent.replace(
                                    src,
                                    location.origin + "/" + res.data
                                );
                                console.log(_guideContent);
                                setUploadingImage(false);
                            },
                            onError: err => {
                                console.log(err);
                            }
                        }
                    );
                }
            });
        } else {
            // return editor.prop("outerHTML");
        }
    };

    const [guideContent, setGuideContent] = useState("");
    const [guideContentTitle, setGuideContentTitle] = useState("");

    const handleEditorChange = val => {
        setGuideContent(val);
    };

    const handleTitleChange = val => {
        setGuideContentTitle(val);
    };

    useEffect(() => {
        if (guideContent) {
            parseEditorImages(guideContent);
        }
        return () => {};
    }, [guideContent]);

    const modulesToolBar = {
        table: true,
        tableUI: true,

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

    const [merchantGuideFiles, setMerchantGuideFiles] = useState([]);

    const {
        mutate: mutateMerchantGuideFiles,
        isLoading: isLoadingMerchantGuideFiles
    } = useAxiosQuery(
        "POST",
        "api/v1/guide_files/getMerchantGuideFiles",
        "merchant_guide_files"
    );

    const getMerchantGuideFiles = id => {
        mutateMerchantGuideFiles(
            {
                id: id
            },
            {
                onSuccess: res => {
                    setMerchantGuideFiles(res.data);
                },
                onError: err => {
                    console.log(err);
                }
            }
        );
    };

    const editor1 = useRef();

    const onInsert = () => {
        console.log(editor1);
        const table = editor1.current.getEditor().getModule("table");
        table.insertTable(3, 3);
        console.log(table);
    };

    const onInsertRowUp = () => {
        const table = editor1.current.getEditor().getModule("table");
        table.insertRowAbove();
    };

    const onInsertRowBellow = () => {
        const table = editor1.current.getEditor().getModule("table");
        table.insertRowBelow();
    };

    const onInsertColumnRight = () => {
        const table = editor1.current.getEditor().getModule("table");
        table.insertColumnRight();
    };

    const onInsertColumnLeft = () => {
        const table = editor1.current.getEditor().getModule("table");
        table.insertColumnLeft();
    };

    const onDeleteTable = () => {
        const table = editor1.current.getEditor().getModule("table");
        table.deleteTable();
    };

    const onDeleteRow = () => {
        const table = editor1.current.getEditor().getModule("table");
        table.deleteRow();
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <Button id="insert-table" onClick={() => onInsert()}>
                    Add Table
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button id="insert-table" onClick={() => onDeleteTable()}>
                    Delete Table
                </Button>
            </Menu.Item>

            <Menu.Item>
                <Button id="insert-table" onClick={() => onInsertRowUp()}>
                    Insert Row Up
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button id="insert-table" onClick={() => onInsertRowBellow()}>
                    Insert Row Bellow
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button id="insert-table" onClick={() => onDeleteRow()}>
                    Delete Row
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button id="insert-table" onClick={() => onInsertColumnRight()}>
                    Insert Column Right
                </Button>
            </Menu.Item>
            <Menu.Item>
                <Button id="insert-table" onClick={() => onInsertColumnLeft()}>
                    Insert Column Left
                </Button>
            </Menu.Item>
        </Menu>
    );

    const [disableButton, setDisableButton] = useState(true);

    const onDisable = () => {
        setDisableButton(false);
        console.log("wew");
    };

    return (
        <>
            <Modal
                visible={showAddeEditContentModal}
                onCancel={() => {
                    setShowAddEditContentModal(false);
                }}
                width={700}
                height={730}
                footer={[
                    <div style={{ marginTop: "25px" }}>
                        <Button
                            key="back"
                            onClick={() => {
                                setShowAddEditContentModal(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            key="submit"
                            onClick={() => {
                                submitAddEditGuideContent();
                            }}
                            loading={isLoadingSubmitGuideContent}
                        >
                            Submit
                        </Button>
                    </div>
                ]}
                title={addOnly ? "Add Content Block " : "Update Content Block"}
            >
                <Row>
                    <Col md={18}>
                        <Input
                            type="text"
                            required
                            style={{
                                height: "100%",
                                minWidth: 200
                            }}
                            value={guideContentTitle ? guideContentTitle : ""}
                            name="Content_title"
                            placeholder="Content Block Title"
                            onChange={e => handleTitleChange(e.target.value)}
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
                        <Dropdown
                            overlay={menu}
                            placement="bottomLeft"
                            disabled={disableButton}
                        >
                            <Button icon={<PlusCircleOutlined />}>
                                Table Options
                            </Button>
                        </Dropdown>
                        <ReactQuill
                            onFocus={() => onDisable()}
                            ref={editor1}
                            theme="snow"
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

                {/* <PageGuideFiles
                    merchantGuideFiles={merchantGuideFiles}
                    guideContentId={addOnly ? 0 : updateData.id}
                    getMerchantGuideFiles={getMerchantGuideFiles}
                /> */}
            </Modal>
        </>
    );
};

export default PageGuideConentAddEditModal;
