import React, { useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Button,
    Progress
} from "reactstrap";
// import { fetchData } from "../../../../providers/fetch";

const FormFooter = props => {
    const handleClickNext = () => {
        if (props.checkIfRequired()) {
            props.setCurrentPage(props.currentPage + 1);
        }
    };

    const handleClickPrev = () => {
        if (props.currentPage == 2) {
            location.reload();
        } else {
            props.setCurrentPage(props.currentPage - 1);
        }
    };
    return (
        <div className="mx-4 my-2">
            <Row>
                <Col md={props.formDetails.form_pages != 1 ? "8" : "10"}>
                    {props.formDetails.form_pages != 1 &&
                    props.formDetails.form_pages != props.currentPage ? (
                        <Button
                            color="primary"
                            size="sm"
                            onClick={e => handleClickNext()}
                        >
                            Next
                        </Button>
                    ) : (
                        <>
                            {props.currentPage ==
                            props.formDetails.form_pages ? (
                                props.formDetails.form_pages != 1 && (
                                    <Button
                                        color="primary"
                                        size="sm"
                                        onClick={e => props.handleClickSubmit()}
                                    >
                                        Submit
                                    </Button>
                                )
                            ) : (
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={e =>
                                        props.setCurrentPage(
                                            props.currentPage + 1
                                        )
                                    }
                                >
                                    Next
                                </Button>
                            )}
                            {props.formDetails.form_pages != 1 && (
                                <Button
                                    color="primary"
                                    className="mx-2"
                                    size="sm"
                                    onClick={e => handleClickPrev()}
                                >
                                    Previous
                                </Button>
                            )}
                        </>
                    )}
                </Col>
                <Col md={props.formDetails.form_pages != 1 ? "4" : "2"}>
                    {props.formDetails.form_pages == 1 ? (
                        <Button
                            onClick={e => props.handleClickSubmit()}
                            color="primary"
                        >
                            Submit
                        </Button>
                    ) : (
                        <Progress
                            className="mt-2"
                            value={
                                props.currentPage *
                                (100 / props.formDetails.form_pages)
                            }
                        >
                            Page {props.currentPage} of{" "}
                            {props.formDetails.form_pages}
                        </Progress>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default FormFooter;
