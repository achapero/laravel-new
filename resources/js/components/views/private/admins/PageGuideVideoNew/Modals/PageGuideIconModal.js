import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button } from "antd";

const PageGuideIconModal = ({
    showSelectIcons,
    setShowSelectIcons,
    options,
    selectIcons
}) => {
    return (
        <>
            <Modal
                visible={showSelectIcons}
                onCancel={() => {
                    setShowSelectIcons(false);
                }}
                footer={[
                    <Button
                        key="back"
                        onClick={() => {
                            setShowSelectIcons(false);
                        }}
                    >
                        Cancel
                    </Button>
                ]}
                width={750}
            >
                <div className="pre-line">
                    <Row>
                        <Col>
                            <div>
                                {options.map((option, key) => {
                                    return (
                                        <span
                                            onClick={() =>
                                                selectIcons(option.value)
                                            }
                                            className="selectIconsModal"
                                            key={key}
                                            style={{
                                                backgroundColor: "#fff",
                                                boxShadow:
                                                    "0 0 5px 2px rgba(0,0,0,0.1)",

                                                fontSize: "25px",
                                                marginLeft: "15px",
                                                marginBottom: "20px",
                                                paddingRight: "10px",
                                                paddingLeft: "10px",
                                                width: "50px"
                                            }}
                                        >
                                            {option.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};

export default PageGuideIconModal;
