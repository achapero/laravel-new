import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Layout,
    Card,
    Row,
    Col,
    Table,
    Popconfirm,
    Divider,
    notification,
    Image,
    Tooltip,
    Drawer,
    Space,
    Select,
    Alert,
    Form,
    Modal,
    Button
} from "antd";
import { Content } from "antd/lib/layout/layout";
import { Container, Input } from "reactstrap";
// import { fetchData } from "../../../../providers/fetch";
// import { loadingIcon } from "../../../../providers/loading";
import "./forms.css";
import FormHeader from "./FormHeader";
import FormFormeoRenderer from "./FormsFormeoRenderer";
import "formeo/dist/formeo.min.css";
import Swal from "sweetalert2";
import blobToBase64 from "blob-to-base64";

import useAxiosQuery from "../../../providers/useAxiosQuery";
import getUserData from "../../../providers/getUserData";

const Forms = ({ match, history }) => {
    const shortname = match.params.shortname;
    const [formDetails, setFormDetails] = useState([]);
    const [formData, setFormData] = useState("");
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [formEmail, setFormEmail] = useState("");
    const refEmail = useRef(null);
    const [emailError, setEmailError] = useState("");
    const [formFormeoData, setFormFormeoData] = useState({});
    const [buttonSubmitText, setButtonSubmitText] = useState("Submit");
    const [currentPage, setCurrentPage] = useState(1);
    const [disabledNext, setDisabledNext] = useState("");
    const [error1, setError] = useState([]);
    const [prevPage, setPrevPage] = useState(1);

    const [formval, setFormval] = useState([]);

    useEffect(() => {
        refetchForm();
        return () => {};
    }, []);

    const {
        data: dataForm,
        isLoading: isLoadingForm,
        refetch: refetchForm
    } = useAxiosQuery(
        `GET`,
        `api/v1/forms-public?shortname=${shortname}`,
        `show_form_${shortname}`,
        res => {
            if (res.success) {
                setFormDetails(res.data[0]);
                // console.log('@show_form', res)
                let form_inputs = res.data[0].form_inputs;
                form_inputs.forEach(input => {
                    let a = JSON.parse(input.inputs.replace(/\\\//g, ""));
                    setFormData(a);
                });
            }
        }
    );

    const handleToggleSubmitModal = () => {
        setShowSubmitModal(!showSubmitModal);
    };

    const requiredPrevClick = e => {
        var map = {};
        $(".activeinput").each(function() {
            if ($(this).val() != "") {
                map[$(this).attr("fieldname")] = $(this).val();
            }
        });

        let _formval = formval;
        _formval[currentPage] = map;
        setFormval(_formval);

        setCurrentPage(currentPage - 1);
        setPrevPage(currentPage);

        let aa = currentPage - 1;
        updateFormHistory(aa);
        // //console.log(aa, formval, formval[aa]);
    };

    const handleFormSubmit = e => {
        var map = {};
        $(".activeinput").each(function() {
            if (
                $(this).attr("type") == "radio" ||
                $(this).attr("type") == "checkbox"
            ) {
                if ($(this).is(":checked")) {
                    if ($(this).attr("type") == "checkbox") {
                        let value = $(this).attr("value");
                        map[
                            $(this).attr("fieldname") +
                                "_" +
                                value.replace(/ /g, "")
                        ] = "checked";
                    } else {
                        map[$(this).attr("fieldname")] = $(this).val();
                    }
                }
            } else {
                if ($(this).val() != "") {
                    if ($(this).attr("type") == "file") {
                        let file = $(this).prop("files")[0];
                        // console.log(file);
                        let fieldname = $(this).attr("fieldname");
                        blobToBase64(file, function(error, base64) {
                            if (!error) {
                                map[fieldname] = base64;
                                // console.log(file);
                            }
                        });
                    } else {
                        map[$(this).attr("fieldname")] = $(this).val();
                    }
                }
            }
        });

        let _formval = formval;
        _formval[currentPage] = map;
        setFormval(_formval);
        // console.log("formval", formval);

        // if (currentPage == formDetails.form_pages) {
        let secret =
            shortname == "ratequoterequest" || shortname == "testing_map"
                ? formDetails.form_pages - 1
                : formDetails.form_pages;
        if (currentPage == secret) {
            let inputs_in_page = $("label").closest(".f-field-group");
            let inputs_in_page_hide = $("label").closest(".hide");
            if (inputs_in_page.length == inputs_in_page_hide.length) {
                $(".btnPrevPage").trigger("click");
            }
            handleToggleSubmitModal();
        } else {
            setCurrentPage(currentPage + 1);
            setPrevPage(currentPage);
            let aa = currentPage + 1;
            updateFormHistory(aa);

            // console.log("formval", formval);
        }
        // console.log("currentPage", currentPage);
        // console.log("formDetails.form_pages", formDetails.form_pages);
    };

    useEffect(() => {
        handleFormSubmit;
        return () => {};
    }, [currentPage]);

    const updateFormHistory = aa => {
        let inputs = formval[aa];
        //console.log(inputs);
        if (formval[aa]) {
            Object.keys(inputs).map((fieldname, ind) => {
                setTimeout(() => {
                    let input;
                    let checkbox_value;
                    if (
                        fieldname.indexOf("_") !== -1 &&
                        fieldname != "constant_email"
                    ) {
                        let temp = fieldname.split("_");
                        fieldname = temp[0];
                        checkbox_value = temp[1];
                        input = $("input[fieldname=" + fieldname + "]");
                    } else {
                        input = $("input[fieldname=" + fieldname + "]");
                    }
                    if (
                        $(input).attr("type") == "radio" ||
                        $(input).attr("type") == "checkbox"
                    ) {
                        let boxes = $(input);
                        boxes.map((key, box) => {
                            if (
                                $(box).attr("value") ==
                                ($(input).attr("type") == "radio"
                                    ? inputs[fieldname]
                                    : checkbox_value)
                            ) {
                                $(box).attr("checked", true);
                            }
                        });
                    } else {
                        $(input).val(inputs[fieldname]);
                    }
                }, 500);
            });
        }
    };

    const submitData = () => {
        let _data = {};
        let merged = {};
        formval.forEach(element => {
            merged = { ...merged, ...element };
        });
        _data["form_id"] = formDetails.id;
        _data["user_id"] = getUserData().id;
        if (merged["constant_email"]) {
            _data["email"] = merged["constant_email"];
            delete merged["constant_email"];
        }
        _data["data"] = merged;
        // console.log('@_data', _data);

        mutateFormSubmit(_data, {
            onSuccess: res => {
                if (res.success) {
                    // console.log('@return data', res)
                    history.push("/" + formDetails.redirect_to);
                    setButtonSubmitText("Submit");
                    handleToggleSubmitModal;

                    // handleNextPrevPage()
                } else {
                    console.log("@res", res);
                }
            },
            onError: res => {
                // console.log('@erro', res)
                // Swal.fire({
                //     title: "Error",
                //     html: res.message,
                //     icon: "error"
                // });
                notification.error({
                    message: res.message
                });
                setButtonSubmitText("Submit");
                setShowSubmitModal(false);
            }
        });
    };

    const {
        mutate: mutateFormSubmit,
        isLoading: isLoadingFormSubmit
    } = useAxiosQuery("POST", "api/v1/formsubmit", "formsubmit");

    const handleNextPrevPage = page => {
        setCurrentPage(page);
    };

    return (
        <div className="app flex-row align-items-center pointofsuccess forminputs">
            <Content
                className="site-layout-background"
                style={{
                    margin: "24px 16px",
                    minHeight: 280,
                    background: "transparent"
                }}
            >
                <Row gutter={24}>
                    <Col span={8} offset={8}>
                        <br />
                        <FormHeader
                            formDetails={formDetails}
                            formEmail={formEmail}
                            setFormEmail={setFormEmail}
                            refEmail={refEmail}
                            emailError={emailError}
                            currentPage={currentPage}
                        />

                        {/* {//console.log(formval)} */}

                        {formData.length > 0 && (
                            <Card style={{ marginTop: "5px" }}>
                                <Form
                                    // method="POST"
                                    // onSubmit={e => handleFormSubmit(e)}
                                    // id="formFormeo"
                                    onFinish={e => handleFormSubmit(e)}
                                >
                                    <FormFormeoRenderer
                                        formData={formData}
                                        currentPage={currentPage}
                                        setDisabledNext={setDisabledNext}
                                        disabledNext={disabledNext}
                                        formval={formval}
                                        prevPage={prevPage}
                                        formDetails={formDetails}
                                    />
                                    <br />

                                    {formDetails &&
                                    formDetails.form_pages > 1 ? (
                                        <div>
                                            {currentPage ==
                                            formDetails.form_pages ? (
                                                <div>
                                                    <Button
                                                        color={
                                                            disabledNext
                                                                ? "danger"
                                                                : "primary"
                                                        }
                                                        className="mt-4 btnPrevPage"
                                                        type="button"
                                                        onClick={e => {
                                                            requiredPrevClick();
                                                        }}
                                                        disabled={
                                                            currentPage > 1
                                                                ? false
                                                                : true
                                                        }
                                                    >
                                                        Prev
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        className="mt-4"
                                                        htmlType="submit"
                                                    >
                                                        Submit
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    {}
                                                    <Button
                                                        color={"primary"}
                                                        className="mt-4 btnPrevPage"
                                                        type="button"
                                                        onClick={e => {
                                                            requiredPrevClick();
                                                        }}
                                                        disabled={
                                                            currentPage > 1
                                                                ? false
                                                                : true
                                                        }
                                                    >
                                                        Prev
                                                    </Button>

                                                    <Button
                                                        color="primary"
                                                        className="mt-4"
                                                        htmlType="submit"
                                                        // onClick={e => {
                                                        //     // requiredNextClick();
                                                        // }}
                                                        disabled={
                                                            currentPage ==
                                                            formDetails.form_pages
                                                                ? true
                                                                : false
                                                        }
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Button
                                            color="primary"
                                            className="mt-4"
                                            // type="submit"
                                            htmlType="submit"
                                        >
                                            Submit
                                        </Button>
                                    )}
                                </Form>
                                <br></br>
                                {error1.map((error, index) => {
                                    return (
                                        <Alert color="danger" key={index}>
                                            *please fill up '{error}' field
                                        </Alert>
                                    );
                                })}
                            </Card>
                        )}

                        {/* <FormFooter
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            formDetails={formDetails}
                        /> */}
                    </Col>
                </Row>
                <Modal
                    width={1000}
                    title={formDetails.submit_header}
                    visible={showSubmitModal}
                    onOk={e => submitData()}
                    onCancel={handleToggleSubmitModal}
                >
                    <p>{formDetails.submit_message}</p>
                </Modal>
            </Content>
        </div>
    );
};

export default Forms;
