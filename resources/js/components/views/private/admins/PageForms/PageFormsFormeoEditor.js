import React, { useRef, useEffect, useState } from "react";
import { FormeoEditor } from "formeo";
import "formeo/dist/formeo.min.css";

import moment from "moment";

const PageFormsFormeoEditor = ({
    formDetails,
    setFormDetails,
    formeoEditor,
    setFormeoEditor,
    currentPage,
    inputPages,
    setInputPages
}) => {
    const editorRef = useRef();

    function hashCode(str) {
        let myHash = Array.from(str).reduce(
            (s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0,
            0
        );

        return Math.abs(myHash);
    }

    useEffect(() => {
        $("body").on("click", ".item-remove", function() {
            // //console.log("click");
            setTimeout(() => {
                $(".save-form").trigger("click");
            }, 100);
        });
        return () => {};
    }, []);

    useEffect(() => {
        let _inputPages = [...inputPages];
        console.log(inputPages);
        for (let index = 0; index < formDetails.form_pages; index++) {
            if (!_inputPages[index]) {
                _inputPages[index] =
                    '{"id":"' +
                    hashCode(moment().unix() + index + "id") +
                    '","stages":{"' +
                    hashCode(moment().unix() + index + "stage") +
                    '":{"children":[],"id":"' +
                    hashCode(moment().unix() + index + "stage") +
                    '"}},"rows":{},"columns":{},"fields":{}}';
            }
        }
        setInputPages(_inputPages);

        const controlOptions = {
            elements: [
                {
                    tag: "input", // HTML tag used to render the element
                    config: {
                        label: "Email",
                        disabledAttrs: ["type", "makeRequired", "fieldname"], // Attributes hidden from the user
                        lockedAttrs: ["ref", "val"] // Attributes that cannot be deleted
                    },
                    meta: {
                        group: "common",
                        id: "email_verification",
                        icon: "text-input" // Icon name in icon set
                    },
                    attrs: {
                        // actual attributes on the HTML element, and their default values
                        type: "email", // type field is important if tag==input
                        makeRequired: true,
                        fieldname: "constant_email",
                        ref: "",
                        val: ""
                    }
                },
                {
                    tag: "input", // HTML tag used to render the element
                    config: {
                        label: "Alternate Email",
                        disabledAttrs: ["type"], // Attributes hidden from the user
                        lockedAttrs: ["makeRequired", "fieldname", "ref", "val"] // Attributes that cannot be deleted
                    },
                    meta: {
                        group: "common",
                        id: "email",
                        icon: "text-input" // Icon name in icon set
                    },
                    attrs: {
                        // actual attributes on the HTML element, and their default values
                        type: "email", // type field is important if tag==input
                        makeRequired: true,
                        fieldname: "alternate_email",
                        ref: "",
                        val: ""
                    }
                }
            ],
            elementOrder: {
                // Must be set in conjunction or it may not appear in the group
                common: ["email" /* ...rest of the elements */]
            }
        };
        const formeoOptions = {
            controls: controlOptions,
            editorContainer: editorRef.current,
            events: {
                onSave: e => {
                    let _formData = JSON.stringify(e.formData);
                    let _inputPages = [...inputPages];
                    _inputPages[currentPage - 1] = _formData;
                    setInputPages(_inputPages);
                },
                onUpdate: e => {
                    $('.field-edit-attrs input[placeholder="Required"]')
                        .closest(".prop-wrap")
                        .addClass("hidden-property");
                    $(
                        '.field-edit-options input[placeholder="Make Required"]'
                    ).addClass("hide");
                    $(
                        '.field-edit-options input[placeholder="Fieldname"]'
                    ).addClass("hide");
                    $('.field-edit-options input[placeholder="Ref"]').addClass(
                        "hide"
                    );
                    $('.field-edit-options input[placeholder="Val"]').addClass(
                        "hide"
                    );

                    let inputfields = $(".attrs-panel .prop-wrap .field-prop");
                    inputfields.map((key, field) => {
                        if ($(field).find("label").length == 0) {
                            let input = $(field).find("input");
                            let placeHolder = $(input).attr("placeholder");

                            $(field)
                                .find(".attrs-prop-inputs")
                                .prepend("<label>" + placeHolder + "</label>");
                        }
                    });

                    // $(".save-form").addClass("hide");

                    $(".form-actions").removeClass("f-btn-group");
                    $(".panel-labels h5:contains(Conditions)").addClass("hide");
                    //console.log("update");
                    if (e.detail) {
                        let fields = e.detail.fields;
                        let field_count = Object.keys(fields).length;
                        if (field_count > 0) {
                            let last_field =
                                fields[Object.keys(fields)[field_count - 1]];
                            if (last_field.attrs.makeRequired == null) {
                                delete last_field.attrs.className;

                                last_field.attrs["makeRequired"] = true;
                                last_field.attrs["fieldname"] = "";
                                last_field.attrs["ref"] = "";
                                last_field.attrs["val"] = "";

                                let _formeoEditor = new FormeoEditor(
                                    formeoOptions,
                                    e.detail
                                );
                                setFormeoEditor(_formeoEditor);
                            }

                            Object.values(fields).map((val, ind) => {
                                if (
                                    val.meta.id == "radio" ||
                                    val.meta.id == "checkbox"
                                ) {
                                    val.options.map((option, key) => {
                                        option["makeRequired"] =
                                            val.attrs.makeRequired;
                                        option["fieldname"] =
                                            val.attrs.fieldname;
                                        option["ref"] = val.attrs.ref;
                                        option["val"] = val.attrs.val;
                                    });
                                }
                            });
                        }

                        let _formData = JSON.stringify(e.detail);
                        let _inputPages = [...inputPages];
                        _inputPages[currentPage - 1] = _formData;
                        setInputPages(_inputPages);
                    }
                }
            }
        };

        let _formeoEditor = new FormeoEditor(
            formeoOptions,
            _inputPages[currentPage - 1]
        );
        setFormeoEditor(_formeoEditor);
        return () => {};
    }, [formDetails.form_pages, currentPage]);

    return <div ref={editorRef} />;
};

export default PageFormsFormeoEditor;
