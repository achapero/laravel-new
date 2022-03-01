import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Title from "antd/lib/typography/Title";
import React from "react";
// 19d619
const GiftStatus = () => {
    let status = true;
    return (
        <div className="text-center">
            <br />
            <br />
            <Row>
                <Col xs={0} md={8}></Col>
                <Col xs={24} md={8}>
                    <Card
                        style={{
                            border: status
                                ? "2px solid #19d619"
                                : "2px solid red"
                        }}
                    >
                        <Title>GiftCard Processing</Title>
                        <Title style={{ color: status ? "#19d619" : "red" }}>
                            {status ? "Online" : "Offline"}
                        </Title>

                        {status ? (
                            <CheckCircleFilled
                                style={{
                                    color: "#19d619",
                                    fontSize: 50
                                }}
                            />
                        ) : (
                            <CloseCircleFilled
                                style={{
                                    color: "red",
                                    fontSize: 50
                                }}
                            />
                        )}
                        <br />
                        <br />
                        {status && (
                            <Text>
                                If you are experiencing issues, please contact
                                support
                            </Text>
                        )}
                    </Card>
                </Col>
                <Col xs={0} md={8}></Col>
            </Row>
        </div>
    );
};

export default GiftStatus;
