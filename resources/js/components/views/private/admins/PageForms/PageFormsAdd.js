import React, { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Input, Button, Form, Alert, notification } from "antd";

import getUserData from "../../../../providers/getUserData";
import useAxiosQuery from "../../../../providers/useAxiosQuery";
import PageFormsFormeoEditor from "./PageFormsFormeoEditor";
const PageFormsAdd = ({ match }) => {
    const [formeoEditor, setFormeoEditor] = useState();
    const [inputPages, setInputPages] = useState([]);

    const userdata = getUserData();
    const [currentPage, setCurrentPage] = useState(1);
    const [submitButtonText, setSubmitButtonText] = useState("Save");
    const [showFormSuccess, setShowFormSuccess] = useState(false);
    const [showFormError, setShowFormError] = useState(false);
    const [formDetails, setFormDetails] = useState({
        form_name: "",
        form_shortname: "",
        form_title: "",
        form_description: "",
        submit_header: "",
        submit_message: "",
        redirect_to: "thankyou",
        form_pages: 1,
        created_by: userdata.id,
        input: ""
    });
    const [formPages, setFormPages] = useState([
        {
            page: 1,
            groups: [
                {
                    input_number: 1,
                    input_name: "",
                    input_placeholder: "Your Answer",
                    input_required: true,
                    input_type: "text",
                    input_choices: "",
                    input_conditions: "",
                    page: 1
                }
            ]
        }
    ]);
    useEffect(() => {
        if (match.params.id) {
            getForm(match.params.id);
        }

        return () => {};
    }, []);

    const {
        data: getForm,
        isLoading: isLoadingGetForm,
        refetch: refetchGetGetForm,
        isFetching: isFetchingGetForm
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/cases/" + match.params.id,
        "table_clearent_cases_" + match.params.id,
        res => {
            // setCaseList(res.data.merchantCases);
        }
    );

    // const arrayColumn = (arr, n) => arr.map(x => x[n]);
    // const getForm = id => {
    //     fetchData("GET", `forms/${id}`).then(res => {
    //         if (res.success) {
    //             let form_inputs = [];
    //             // let _inputs = "";
    //             res.inputs.forEach(element => {
    //                 // _inputs = element.inputs;
    //                 // form_inputs.push(
    //                 //     JSON.parse(element.inputs.replace(/\\\//g, ""))
    //                 // );
    //                 form_inputs = JSON.parse(
    //                     element.inputs.replace(/\\\//g, "")
    //                 );
    //             });
    //             setInputPages(form_inputs);
    //             setFormDetails({ ...res.data });

    //             // setFormPages(form_inputs);
    //         }
    //     });
    // };

    const generatePagesPaginate = () => {
        let pagesPaginate = [];
        for (let index = 1; index <= formDetails.form_pages; index++) {
            pagesPaginate.push(
                <Button
                    key={index}
                    type={currentPage == index && "primary"}
                    onClick={e => handleClickPaginateButton(index)}
                >
                    {index}
                </Button>
            );
        }
        return pagesPaginate;
    };

    const handleChangeFormPages = pages => {
        let initPages = [...formPages];

        for (let index = 0; index <= pages; index++) {
            if (!initPages[index]) {
                initPages.push({
                    page: index,
                    groups: [
                        {
                            input_number: 1,
                            input_name: "",
                            input_placeholder: "Your Answer",
                            input_required: true,
                            input_type: "text",
                            input_choices: ""
                        }
                    ]
                });
            }
        }
        //console.log(initPages);

        setFormPages(initPages);
    };

    const handleClickPaginateButton = page => {
        setCurrentPage(page);
    };

    const updateField = e => {
        if (e.target.name == "form_pages") {
            handleChangeFormPages();
        }
        if (e.target.name == "form_name") {
            let form_name = e.target.value;
            form_name = form_name.replace(/ /g, "");
            form_name = form_name.toLowerCase();
            setFormDetails({
                ...formDetails,
                ["form_shortname"]: form_name,
                [e.target.name]: e.target.value
            });
        } else {
            setFormDetails({
                ...formDetails,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleChangeFormName = e => {
        updateField(e);
    };

    const {
        mutate: mutateAddForm,
        isLoading: isLoadingAddForm
    } = useAxiosQuery("POST", "api/v1/forms", "add_form");

    const handleSubmitForm = val => {
        let data = val;
        data.input = JSON.stringify(inputPages);
        data.created_by = userdata.id;

        mutateAddForm(data, {
            onSuccess: res => {
                console.log(res);
                notification.success({
                    message: "Form Created Successfully "
                });

                setTimeout(() => {
                    location.href =
                        location.origin + "/forms/list/" + res.data.id;
                }, 1000);
            },
            onError: err => {
                console.log(err);
                notificationErrors(err);
            }
        });
    };
    return (
        <div
            className="animated fadeIn account"
            id="formAdd"
            style={{
                padding: "24px 16px"
            }}
        >
            <Card id="addnewform" title="Add New Form">
                <div>
                    <Row gutter={16}>
                        <Col md={8}>
                            <Form
                                layout="vertical"
                                onFinish={handleSubmitForm}
                                className="formAddVertical"
                                initialValues={formDetails}
                            >
                                <Form.Item
                                    label="Form Name"
                                    name="form_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Form Name Required"
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Form Name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={
                                        <div>
                                            Form Shortname *{" "}
                                            <a
                                                href={`${window.location.origin}/form/${formDetails.form_shortname}`}
                                                target="_blank"
                                            >
                                                <small>
                                                    {`${window.location.origin}/form/${formDetails.form_shortname}`}
                                                </small>
                                            </a>
                                        </div>
                                    }
                                    name="form_shortname"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Form Name Required"
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Form Shortname"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Form Title"
                                    name="form_title"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Form Title Required"
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Form Title"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Form Description"
                                    name="form_description"
                                >
                                    <Input.TextArea
                                        placeholder="Form Title"
                                        rows="3"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Form Pages"
                                    name="form_pages"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Form Title Required"
                                        }
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Form Pages"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Submit Header"
                                    name="submit_header"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Submit Header Required"
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Submit Header"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Submit Message"
                                    name="submit_message"
                                >
                                    <Input.TextArea
                                        placeholder="Submit Message"
                                        rows="3"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label=" Redirect To Page after submit (Default:
                                        thank you page)"
                                    name="redirect_to"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Submit Header Required"
                                        }
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        placeholder="Redirect To Page after submit (Default:
                                            thank you page)"
                                    />
                                </Form.Item>

                                <div className="text-center">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={isLoadingAddForm}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                        <Col md={16} className="editor_forms_add">
                            <div style={{ marginBottom: "10px" }}>
                                <div>
                                    <Button
                                        type="danger"
                                        style={{ marginRight: "5px" }}
                                        onClick={e =>
                                            setFormDetails({
                                                ...formDetails,
                                                form_pages:
                                                    parseInt(
                                                        formDetails.form_pages
                                                    ) - 1
                                            })
                                        }
                                    >
                                        -
                                    </Button>

                                    {formDetails && generatePagesPaginate()}

                                    <Button
                                        style={{ marginLeft: "5px" }}
                                        type="danger"
                                        onClick={e =>
                                            setFormDetails({
                                                ...formDetails,
                                                form_pages:
                                                    parseInt(
                                                        formDetails.form_pages
                                                    ) + 1
                                            })
                                        }
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <PageFormsFormeoEditor
                                    formDetails={formDetails}
                                    setFormDetails={setFormDetails}
                                    formeoEditor={formeoEditor}
                                    setFormeoEditor={setFormeoEditor}
                                    currentPage={currentPage}
                                    inputPages={inputPages}
                                    setInputPages={setInputPages}
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        </div>
    );
};

export default PageFormsAdd;
