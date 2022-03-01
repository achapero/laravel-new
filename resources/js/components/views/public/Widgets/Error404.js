import React from "react";
import { Result, Button } from 'antd';
import { useHistory } from "react-router";
const Error404 = () => {
    let history = useHistory();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, something went wrong."
            extra={<Button type="primary" onClick={e => history.push("/")}>Back Home</Button>}
        />
    )
}

export default Error404;