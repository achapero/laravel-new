import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Input, Button, Modal, Form } from "antd";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

const PageGuideSubSub = ({
    sub,
    getItemStyle,
    addSubSub,
    editGuideSub,
    deleteGuideSub,
    editSubSub,
    deleteGuideSubSub,
    onSelectGuideSubSub,
    visible
}) => {
    return (
        <>
            {sub.merchant_guide_sub_subs.map((subsub, subsubkey) => (
                <div
                    key={
                        subsubkey
                    }
                    onClick={e => onSelectGuideSubSub(e, subsub.id)}
                    style={{
                        // borderBottom: "1px solid #0000000f",
                        cursor: "pointer",
                        background:
                            visible == "Admin" ? "rgb(232,232,232)" : "white"
                    }}
                >
                    <p
                        style={{
                            padding: "5px",
                            borderBottom: "1px solid #0000000f",
                            lineHeight: 1.5,
                            marginBottom: 0,

                            marginLeft: "20px",
                            wordBreak: "break-all",
                            paddingBottom: "30px",
                            marginRight: "20px"
                        }}
                    >
                        {subsub.sub_sub_title}
                    </p>
                </div>
            ))}
        </>
    );
};

export default PageGuideSubSub;
