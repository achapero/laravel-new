import React, { useState, useRef, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    Form,
    AutoComplete,
    Select,
    Checkbox,
    Upload,
    notification,
    Typography
} from "antd";
import queryString from "query-string";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import getUserData from "../../../../providers/getUserData";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
Quill.register("modules/imageResize", ImageResize);
import "react-quill/dist/quill.snow.css";

import {
    DeleteFilled,
    EditFilled,
    PlusCircleOutlined,
    UploadOutlined,
    SettingOutlined,
    FileExcelOutlined
} from "@ant-design/icons";

const PageTicketsAdd = ({ location, history }) => {
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
    const { Title } = Typography;
    const [form] = Form.useForm();
    const { Option } = AutoComplete;
    const userdata = getUserData();
    let subject = "";
    let params = queryString.parse(location.search);

    subject = params.subject;
    const [TicketData, setTicketData] = useState({
        full_name: params.name ? params.name : "",
        email: params.email ? params.email : "",
        ticket_subject: subject
    });
    const [buttonSubmiteText, setButtonSubmiteText] = useState("Submit");
    const [userList, setUserList] = useState([]);

    const {
        data: dataUsersListTicket,
        isLoading: isLoadingUsersListTicket,
        refetch: getUsersListTicket,
        isFetching: isFetchingUsersListTicket
    } = useAxiosQuery("GET", `api/v1/users`, "users_list_ticket", res => {
        console.log("@userslistticketadd", res.data);
        setUserList(res.data);
    });

    useEffect(() => {
        //console.log(userdata);
        if (userdata) {
            if (userdata.role != "Super Admin") {
                setTicketData({
                    ...TicketData,
                    full_name: userdata.name,
                    email: userdata.email
                });
            }
        }
        return () => {};
    }, []);

    useEffect(() => {
        console.log(TicketData);
        return () => {};
    }, [TicketData]);

    const handleEditorChange = e => {
        setTicketData({
            ...TicketData,
            ticket_description: e
        });
    };

    const {
        mutate: mutatePublicTicket,
        isLoading: isLoadingPublicTicket
    } = useAxiosQuery(
        "POST_FILE",
        "api/v1/publicticket",
        "mutate_public_ticket"
    );

    const handleSubmit = e => {
        const formData = new FormData();
        formData.append("attachment_url", TicketData.attachment_url);
        formData.append("full_name", TicketData.full_name);
        formData.append("email", TicketData.email);
        formData.append(
            "ticket_type",
            TicketData.ticket_type ? TicketData.ticket_type : "None"
        );
        formData.append(
            "ticket_priority",
            TicketData.ticket_priority ? TicketData.ticket_priority : "None"
        );
        formData.append("ticket_subject", TicketData.ticket_subject);
        formData.append("ticket_description", TicketData.ticket_description);
        formData.append("is_sensitive", TicketData.is_sensitive);

        mutatePublicTicket(formData, {
            onSuccess: res => {
                notification.success({
                    message: "Ticket Created Successfully"
                });

                history.push("/tickets/awaitingsupportreply");
                if (params.id) {
                    window.location.href =
                        window.location.origin + "/profiles/" + params.id;
                }
            },
            onError: err => {
                console.log(err);
            }
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            ...TicketData
        });

        return () => {};
    }, [TicketData]);

    const [checkSen, setCheckSen] = useState(false);

    const onCheckboxChange = e => {
        setCheckSen(e.target.checked);
    };

    return (
        <div style={{ marginTop: 30 }} id="ticketadd">
            <div>
                <Row>
                    <Col md={5}></Col>
                    <Col md={14}>
                        <Card>
                            <div>
                                <Form
                                    form={form}
                                    onFinish={e => handleSubmit(e)}
                                    layout="vertical"
                                    initialValues={{
                                        ...TicketData,
                                        ticket_priority: "None",
                                        ticket_type: "None",
                                    }}
                                    onValuesChange={(
                                        changedValues,
                                        allValues
                                    ) => {
                                        console.log(changedValues);

                                        if (changedValues.email) {
                                            let obj = userList.find(
                                                el =>
                                                    el.email ==
                                                    changedValues.email
                                            );

                                            setTicketData({
                                                ...TicketData,
                                                ...changedValues,
                                                full_name: obj
                                                    ? obj.name
                                                    : TicketData.full_name
                                            });
                                        } else {
                                            setTicketData({
                                                ...TicketData,
                                                ...changedValues
                                            });
                                        }
                                    }}
                                >
                                    <h2>Submit a ticket</h2>

                                    <div>
                                        <Form.Item
                                            label="Subject"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Ticket Subject Required"
                                                }
                                            ]}
                                            name="ticket_subject"
                                        >
                                            <Input
                                                type="text"
                                                placeholder="Subject"
                                            />
                                        </Form.Item>
                                        <Form.Item label="Description">
                                            <ReactQuill
                                                onChange={e => {
                                                    handleEditorChange(e);
                                                }}
                                                style={{ height: 200 }}
                                                modules={modulesToolBar}
                                                formats={formats}
                                            />
                                        </Form.Item>
                                    </div>
                                    {userdata && userdata.role != "Merchant" && (
                                        <>
                                            <div style={{ paddingTop: "40px" }}>
                                                <Title level={5}>
                                                    User Information
                                                </Title>
                                                <Row gutter={4}>
                                                    <Col md={12}>
                                                        <Form.Item
                                                            label="Full Name"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message:
                                                                        "Full Name Required"
                                                                }
                                                            ]}
                                                            name="full_name"
                                                        >
                                                            <Input
                                                                type="text"
                                                                placeholder="Full Name"
                                                                name="full_name"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Item
                                                            label="Email"
                                                            rules={[
                                                                {
                                                                    required: true
                                                                }
                                                            ]}
                                                            name="email"
                                                        >
                                                            <AutoComplete
                                                                filterOption={(
                                                                    input,
                                                                    option
                                                                ) =>
                                                                    option.children
                                                                        .toLowerCase()
                                                                        .indexOf(
                                                                            input.toLowerCase()
                                                                        ) >= 0
                                                                }
                                                                placeholder="Email"
                                                            >
                                                                {userList.map(
                                                                    el => (
                                                                        <Option
                                                                            key={
                                                                                el.id
                                                                            }
                                                                            value={
                                                                                el.email
                                                                            }
                                                                        >
                                                                            {
                                                                                el.email
                                                                            }
                                                                        </Option>
                                                                    )
                                                                )}
                                                            </AutoComplete>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </>
                                    )}
                                    <div style={{ paddingTop: "40px" }}>
                                        <Title level={5}>
                                            Additional Information
                                        </Title>

                                        <Form.Item
                                            label="Priority"
                                            name="ticket_priority"
                                        >
                                            <Select
                                                placeholder="Priority"
                                                name="ticket_priority"
                                                // defaultValue={"None"}
                                            >
                                                <Select.Option value="None">
                                                    -None-
                                                </Select.Option>
                                                <Select.Option value="High">
                                                    High
                                                </Select.Option>
                                                <Select.Option value="Medium">
                                                    Medium
                                                </Select.Option>
                                                <Select.Option value="Low">
                                                    Low
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Classification"
                                            name="ticket_type"
                                        >
                                            <Select
                                                name="ticket_type"
                                                // defaultValue={"None"}
                                            >
                                                <Select.Option value="None">
                                                    -None-
                                                </Select.Option>
                                                <Select.Option value="Training">
                                                    Training
                                                </Select.Option>
                                                <Select.Option value="POS Software">
                                                    POS Software
                                                </Select.Option>
                                                <Select.Option value="Credit Card">
                                                    Credit Card
                                                </Select.Option>
                                                <Select.Option value="Workstation">
                                                    Workstation
                                                </Select.Option>
                                                <Select.Option value="Service Requested">
                                                    Service Requested
                                                </Select.Option>
                                                <Select.Option value="Sales">
                                                    Sales
                                                </Select.Option>
                                                <Select.Option value="Gift Cards">
                                                    Gift Cards
                                                </Select.Option>
                                                <Select.Option value="AdaptPAY">
                                                    AdaptPAY
                                                </Select.Option>
                                                <Select.Option value="CC Terminal">
                                                    CC Terminal
                                                </Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </div>

                                    <Form.Item>
                                        <Checkbox
                                            checked={checkSen}
                                            onChange={e => onCheckboxChange(e)}
                                        >
                                            Sensitve?
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item label="Attach a file">
                                        <Upload
                                            onChange={e => {
                                                var file = e.fileList[0];
                                                file.status = "done";
                                            }}
                                            maxCount={1}
                                            customRequest={({
                                                onSuccess,
                                                onError,
                                                file
                                            }) => {
                                                setTicketData({
                                                    ...TicketData,
                                                    attachment_url: file
                                                });
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />}>
                                                Select File
                                            </Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={isLoadingPublicTicket}
                                        >
                                            Submit
                                        </Button>
                                    </Form.Item>

                                    <div></div>
                                </Form>
                            </div>
                        </Card>
                    </Col>
                    <Col md={5}></Col>
                </Row>
            </div>
        </div>
    );
};

export default PageTicketsAdd;
