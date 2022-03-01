import React from "react";
import { Layout, Card, Button, Row, Col, Checkbox, notification, Form } from "antd";

const componentCheckBox = ({
    data,
    role,
    permission,
    permission_type,
    user_id,
    handleCheckChange,
    title,
}) => {
    return <div>
        {data == 1 && (
            <Checkbox
                onChange={e=> handleCheckChange({
                    status: e.target.checked ? 1 : 0,
                    presave_checked: 1,
                    role: role,
                    permission: permission,
                    permission_type: permission_type,
                    user_id: user_id
                })}
                defaultChecked={true}
            >
                {title}
            </Checkbox>
        )} {data == 0 && (
            <Checkbox
                onChange={e=> handleCheckChange({
                    status: e.target.checked ? 1 : 0,
                    presave_checked: 1,
                    role: role,
                    permission: permission,
                    permission_type: permission_type,
                    user_id: user_id
                })}
                // defaultChecked={true}
            >
                {title}
            </Checkbox>
        )}
        <br />
    </div>
}

export default componentCheckBox;
