import React, { useRef, useEffect, useState } from "react";
import { FormeoRenderer } from "formeo";
import "formeo/dist/formeo.min.css";
import { instanceOf } from "prop-types";
import moment from "moment";
import getUserData from "../../../providers/getUserData";

const FormRender = ({
    formData,
    currentPage,
    setDisabledNext,
    disabledNext,
    formval,
    prevPage,
    formDetails
}) => {
    const userdata = getUserData();
    const rendererRef = useRef();
    const [reRender, setReRender] = useState(false);

    useEffect(() => {
        if (formData != "") {
            const formeoOptions = {
                renderContainer: rendererRef.current
            };
            const renderer = new FormeoRenderer(formeoOptions);

            if (currentPage == 1) {
                renderer.render(JSON.parse(formData[0]));
                $(".formeo-stage .f-field-group")
                    .find("input")
                    .addClass("activeinput");
                $(".formeo-stage .f-field-group")
                    .find("textarea")
                    .addClass("activeinput");

                $(".formeo-stage .f-field-group")
                    .find(".activeinput")
                    .each(function() {
                        if ($(this).attr("make-required") == "true") {
                            if ($(this).attr("type") == "checkbox") {
                                $(this).attr("required", false);
                            } else {
                                $(this).attr("required", true);
                            }
                        } else {
                            $(this).attr("required", false);
                        }
                    });
            } else {
                renderer.render(JSON.parse(formData[currentPage - 1]));
                $(".formeo-stage .f-field-group")
                    .find("input")
                    .addClass("activeinput");

                $(".formeo-stage .f-field-group")
                    .find("textarea")
                    .addClass("activeinput");

                $(".formeo-stage .f-field-group")
                    .find(".activeinput")
                    .each(function() {
                        if ($(this).attr("make-required") == "true") {
                            if ($(this).attr("type") == "checkbox") {
                                $(this).attr("required", false);
                            } else {
                                $(this).attr("required", true);
                                if (
                                    $(this).attr("fieldname") ==
                                        "DateBusineeSstarted" ||
                                    $(this).attr("fieldname") == "DateOfBirth"
                                ) {
                                    var a = moment().format("YYYY-MM-DD");
                                    $(this).attr("max", a);
                                }
                            }
                        } else {
                            $(this).attr("required", false);
                        }
                    });
            }

            let inputs = $(".formeo-stage .activeinput");
            let merged = {};
            formval.forEach(element => {
                merged = { ...merged, ...element };
            });

            let input_count = 0;

            inputs.map((key, input) => {
                if ($(input).attr("ref")) {
                    let fieldname = $(input).attr("ref");
                    let value = $(input).attr("val");
                    let ref = $('input[fieldname="' + fieldname + '"]');

                    if (ref.length == 0) {
                        if (merged[fieldname] != value) {
                            input_count++;
                            $(input).attr("required", false);
                            if (
                                $(input).attr("type") == "radio" ||
                                $(input).attr("type") == "checkbox"
                            ) {
                                $(input)
                                    .parents(".f-field-group")
                                    .eq(1)
                                    .addClass("hide");
                            } else {
                                $(input)
                                    .closest(".f-field-group")
                                    .addClass("hide");
                            }
                        }
                    } else {
                        let ref_val;
                        if (
                            ref.attr("type") == "radio" ||
                            ref.attr("type") == "checkbox"
                        ) {
                            ref_val = $(
                                'input[fieldname="' + fieldname + '"]:checked'
                            ).val();
                        } else {
                            ref_val = $(
                                'input[fieldname="' + fieldname + '"]'
                            ).val();
                        }

                        if (ref_val != value) {
                            input_count++;
                            $(input)
                                .closest(".f-field-group")
                                .addClass("hide");
                            $(input).attr("required", false);
                        }
                    }
                }
            });

            if (inputs.length == input_count) {
                if (currentPage > prevPage) {
                    if (currentPage == formDetails.form_pages) {
                        $(".btnPrevPage").trigger("click");
                    }
                    $('button[type="submit"]').trigger("click");
                } else {
                    $(".btnPrevPage").trigger("click");
                }
            }
        }
        return () => {};
    }, [currentPage]);

    useEffect(() => {
        $('input[fieldname="constant_email"]').val(
            userdata ? userdata.email : ""
        );
    });

    useEffect(() => {
        $("body").on("change", ".activeinput", function() {
            let inputs = $(".formeo-stage .activeinput");

            inputs.map((key, input) => {
                if ($(input).attr("ref")) {
                    let fieldname = $(input).attr("ref");
                    let value = $(input).attr("val");

                    let ref = $('input[fieldname="' + fieldname + '"]');
                    if (ref.length > 0) {
                        let ref_val;
                        if (
                            ref.attr("type") == "radio" ||
                            ref.attr("type") == "checkbox"
                        ) {
                            ref_val = $(
                                'input[fieldname="' + fieldname + '"]:checked'
                            ).val();
                        } else {
                            ref_val = $(
                                'input[fieldname="' + fieldname + '"]'
                            ).val();
                        }

                        if (ref_val == value) {
                            $(input)
                                .closest(".f-field-group")
                                .removeClass("hide");
                        } else {
                            $(input)
                                .closest(".f-field-group")
                                .addClass("hide");
                        }
                    }
                }
            });
        });
        return () => {};
    }, []);
    return <div ref={rendererRef} />;
};

export default FormRender;
