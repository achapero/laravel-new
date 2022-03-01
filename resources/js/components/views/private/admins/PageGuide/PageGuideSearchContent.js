import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "antd";

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

const PageGuideSearchContent = ({
    onSearchGuide,
    onSelectGuide,
    onSelectGuideSub,
    closeContent,
    searchText,
    onSelectGuideSubSub
}) => {
    // notify();
    function Exqoute(str) {
        return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }
    function textHighlight(text) {
        let str = text;

        console.log(str);
        str = "<div>" + str + "</div>";

        let a = searchText;
        var re = new RegExp(Exqoute(a), "i");
        let ht = str.match(re);
        let n = str
            .split(re)
            .join('<span className="textHighlight">' + ht + "</span>");

        return n;
    }

    return (
        <>
            <Card className="guide_content_card">
                <div
                    style={{
                        backgroundColor: "#1e9ecb",
                        borderColor: "#187da0",
                        color: "#fff",
                        padding: "18px"
                    }}
                >
                    <Row>
                        <Col md={14}>Search Result</Col>

                        <Col md={10}>
                            <a
                                target="_blank"
                                href={`${window.location.origin}/guide`}
                                style={{
                                    color: "white",
                                    fontSize: "11px",
                                    fontStyle: "oblique",
                                    textDecoration: "underline",
                                    textAlign: "right"
                                }}
                            >
                                go to: {`${window.location.origin}/guide`}
                            </a>
                        </Col>
                    </Row>
                </div>

                {onSearchGuide.map((cardContent, key) => (
                    <div key={key} style={{ backgroundColor: "#f7f7f7" }}>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                cursor: "pointer"
                            }}
                        >
                            <Row>
                                <Col md={24}>
                                    {cardContent.icon && (
                                        <div
                                            style={{
                                                backgroundColor: "#fff",
                                                boxShadow:
                                                    "0 0 5px 2px rgba(0,0,0,0.1)",
                                                padding: "30px"
                                            }}
                                            onClick={() =>
                                                onSelectGuide(cardContent.id)
                                            }
                                        >
                                            <div
                                                style={{
                                                    fontSize: "22px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: textHighlight(
                                                            cardContent.title
                                                        )
                                                    }}
                                                ></div>
                                            </div>
                                            <br></br>
                                            {cardContent.merhant_guide_contents.map(
                                                (contents, ckey) => {
                                                    return (
                                                        <div
                                                            className={
                                                                "CardGuideContent" +
                                                                contents.id
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#fff",
                                                                boxShadow:
                                                                    "0 0 5px 2px rgba(0,0,0,0.1)",
                                                                padding: "20px",
                                                                marginBottom:
                                                                    "10px",
                                                                cursor:
                                                                    "context-menu"
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col md={18}>
                                                                    <h4
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: textHighlight(
                                                                                contents.title
                                                                            )
                                                                        }}
                                                                    ></h4>
                                                                </Col>
                                                                <Col md={6}>
                                                                    {/* <div
                                                                        onClick={() =>
                                                                            closeContent(
                                                                                contents.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <DownOutlined
                                                                            style={{
                                                                                textAlign:
                                                                                    "right",
                                                                                cursor:
                                                                                    "pointer"
                                                                            }}
                                                                            className={
                                                                                "contentIconGuide" +
                                                                                contents.id
                                                                            }
                                                                        ></DownOutlined>

                                                                        <RightOutlined
                                                                            style={{
                                                                                textAlign:
                                                                                    "right",
                                                                                cursor:
                                                                                    "pointer"
                                                                            }}
                                                                            className={
                                                                                "contentIconGuideRight" +
                                                                                contents.id +
                                                                                " hide"
                                                                            }
                                                                        ></RightOutlined>
                                                                    </div> */}
                                                                </Col>
                                                            </Row>
                                                            <br></br>
                                                            <div
                                                                className={
                                                                    "CardGuideContents" +
                                                                    contents.id
                                                                }
                                                            >
                                                                <div
                                                                    className="dynamic-content-div"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: textHighlight(
                                                                            contents.content
                                                                        )
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}

                                    {cardContent.sub_title && (
                                        <div
                                            style={{
                                                backgroundColor: "#fff",
                                                boxShadow:
                                                    "0 0 5px 2px rgba(0,0,0,0.1)",
                                                padding: "30px"
                                            }}
                                            onClick={() =>
                                                onSelectGuideSub(cardContent.id)
                                            }
                                        >
                                            <div
                                                style={{
                                                    fontSize: "22px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: textHighlight(
                                                            cardContent.sub_title
                                                        )
                                                    }}
                                                ></div>
                                            </div>
                                            <br></br>
                                            {cardContent.merhant_guide_contents.map(
                                                (contents, ckey) => {
                                                    return (
                                                        <div
                                                            className={
                                                                "CardGuideContent" +
                                                                contents.id
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#fff",
                                                                boxShadow:
                                                                    "0 0 5px 2px rgba(0,0,0,0.1)",
                                                                padding: "20px",
                                                                marginBottom:
                                                                    "10px",
                                                                cursor:
                                                                    "context-menu"
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col md={18}>
                                                                    <h4
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: textHighlight(
                                                                                contents.title
                                                                            )
                                                                        }}
                                                                    ></h4>
                                                                </Col>
                                                                <Col md={6}>
                                                                    {/* <div
                                                                        onClick={() =>
                                                                            closeContent(
                                                                                contents.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i
                                                                            style={{
                                                                                textAlign:
                                                                                    "right",
                                                                                cursor:
                                                                                    "pointer",
                                                                                marginTop:
                                                                                    "5px"
                                                                            }}
                                                                            className={
                                                                                cardContent
                                                                                    .merhant_guide_contents
                                                                                    .length !=
                                                                                    1 &&
                                                                                "contentIconGuide" +
                                                                                    contents.id +
                                                                                    " cui-chevron-bottom icons d-block"
                                                                            }
                                                                        ></i>
                                                                    </div> */}
                                                                </Col>
                                                            </Row>
                                                            <br></br>
                                                            <div
                                                                className={
                                                                    "CardGuideContents" +
                                                                    contents.id
                                                                }
                                                            >
                                                                <div
                                                                    className="dynamic-content-div"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: textHighlight(
                                                                            contents.content
                                                                        )
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}

                                    {cardContent.sub_sub_title && (
                                        <div
                                            style={{
                                                backgroundColor: "#fff",
                                                boxShadow:
                                                    "0 0 5px 2px rgba(0,0,0,0.1)",
                                                padding: "30px"
                                            }}
                                            onClick={e =>
                                                onSelectGuideSubSub(
                                                    e,
                                                    cardContent.id
                                                )
                                            }
                                        >
                                            <div
                                                style={{
                                                    fontSize: "22px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: textHighlight(
                                                            cardContent.sub_sub_title
                                                        )
                                                    }}
                                                ></div>
                                            </div>
                                            <br></br>
                                            {cardContent.merhant_guide_contents.map(
                                                (contents, ckey) => {
                                                    return (
                                                        <div
                                                            className={
                                                                "CardGuideContent" +
                                                                contents.id
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    "#fff",
                                                                boxShadow:
                                                                    "0 0 5px 2px rgba(0,0,0,0.1)",
                                                                padding: "20px",
                                                                marginBottom:
                                                                    "10px",
                                                                cursor:
                                                                    "context-menu"
                                                            }}
                                                        >
                                                            <Row>
                                                                <Col md={18}>
                                                                    <h4
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: textHighlight(
                                                                                contents.title
                                                                            )
                                                                        }}
                                                                    ></h4>
                                                                </Col>
                                                                <Col md={6}>
                                                                    {/* <div
                                                                        onClick={() =>
                                                                            closeContent(
                                                                                contents.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i
                                                                            style={{
                                                                                textAlign:
                                                                                    "right",
                                                                                cursor:
                                                                                    "pointer",
                                                                                marginTop:
                                                                                    "5px"
                                                                            }}
                                                                            className={
                                                                                cardContent
                                                                                    .merhant_guide_contents
                                                                                    .length !=
                                                                                    1 &&
                                                                                "contentIconGuide" +
                                                                                    contents.id +
                                                                                    " cui-chevron-bottom icons d-block"
                                                                            }
                                                                        ></i>
                                                                    </div> */}
                                                                </Col>
                                                            </Row>
                                                            <br></br>
                                                            <div
                                                                className={
                                                                    "CardGuideContents" +
                                                                    contents.id
                                                                }
                                                            >
                                                                <div
                                                                    className="dynamic-content-div"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: textHighlight(
                                                                            contents.content
                                                                        )
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}

                                    {cardContent.merchant_guide_contentable_id && (
                                        <div
                                            style={{
                                                backgroundColor: "#fff",
                                                boxShadow:
                                                    "0 0 5px 2px rgba(0,0,0,0.1)",
                                                padding: "30px"
                                            }}
                                            onClick={e =>
                                                cardContent.merchant_guide_contentable_type ==
                                                "App\\MerchantGuide"
                                                    ? onSelectGuide(
                                                          cardContent.merchant_guide_contentable_id,
                                                          null,
                                                          null,
                                                          null,
                                                          "CardGuideContent" +
                                                              cardContent.id
                                                      )
                                                    : cardContent.merchant_guide_contentable_type ==
                                                      "App\\MerchantGuideSub"
                                                    ? onSelectGuideSub(
                                                          cardContent.merchant_guide_contentable_id,
                                                          "CardGuideContent" +
                                                              cardContent.id
                                                      )
                                                    : onSelectGuideSubSub(
                                                          e,
                                                          cardContent.merchant_guide_contentable_id,
                                                          "CardGuideContent" +
                                                              cardContent.id
                                                      )
                                            }
                                        >
                                            <div
                                                style={{
                                                    fontSize: "22px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: textHighlight(
                                                            cardContent
                                                                .parent[0].title
                                                                ? cardContent
                                                                      .parent[0]
                                                                      .title
                                                                : cardContent
                                                                      .parent[0]
                                                                      .sub_title
                                                                ? cardContent
                                                                      .parent[0]
                                                                      .sub_title
                                                                : cardContent
                                                                      .parent[0]
                                                                      .sub_sub_title
                                                        )
                                                    }}
                                                ></div>
                                            </div>
                                            <br></br>

                                            <div
                                                className={
                                                    "CardGuideContent" +
                                                    cardContent.id
                                                }
                                                style={{
                                                    backgroundColor: "#fff",
                                                    boxShadow:
                                                        "0 0 5px 2px rgba(0,0,0,0.1)",
                                                    padding: "20px",
                                                    marginBottom: "10px",
                                                    cursor: "context-menu"
                                                }}
                                            >
                                                <Row>
                                                    <Col md={18}>
                                                        <h4
                                                            dangerouslySetInnerHTML={{
                                                                __html: textHighlight(
                                                                    cardContent.title
                                                                )
                                                            }}
                                                        ></h4>
                                                    </Col>
                                                    <Col md={6}>
                                                        {/* <div
                                                            onClick={() =>
                                                                closeContent(
                                                                    cardContent.id
                                                                )
                                                            }
                                                        >
                                                            <i
                                                                style={{
                                                                    textAlign:
                                                                        "right",
                                                                    cursor:
                                                                        "pointer",
                                                                    marginTop:
                                                                        "5px"
                                                                }}
                                                                className={
                                                                    cardContent
                                                                        .parent[0]
                                                                        .merhant_guide_contents
                                                                        .length !=
                                                                        1 &&
                                                                    "contentIconGuide" +
                                                                        cardContent.id +
                                                                        " cui-chevron-bottom icons d-block"
                                                                }
                                                            ></i>
                                                        </div> */}
                                                    </Col>
                                                </Row>
                                                <br></br>
                                                <div
                                                    className={
                                                        "CardGuideContents" +
                                                        cardContent.id
                                                    }
                                                >
                                                    <div
                                                        className="dynamic-content-div"
                                                        dangerouslySetInnerHTML={{
                                                            __html: textHighlight(
                                                                cardContent.content
                                                            )
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </div>
                    </div>
                ))}
            </Card>
        </>
    );
};

export default PageGuideSearchContent;
