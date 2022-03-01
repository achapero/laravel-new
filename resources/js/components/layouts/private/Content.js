import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, title } from "react-router-dom";
import { Layout, notification, Button, message, Row, Col } from "antd";
// import { store } from "react-notifications-component";
// import useAxiosQuery from "../../../providers/useAxiosQuery";
// import getUserData from "../../../providers/getUserData";

import Sidemenu from "./Sidemenu";
import Header from "./Header";

import Footer from "./Footer";
// import IdleTimer from "react-idle-timer";

// import { socketio } from "../../../../socketio";

// import getCheckPermission from "../../../providers/getCheckPermission";
// import getPermission from "../../../providers/getPermission";

export default function Content(props) {
    const { Content } = Layout;
    const [state, setState] = React.useState({ collapsed: false });
    const history = useHistory();

    const toggle = () => setState({ collapsed: !state.collapsed });

    useEffect(()=>{
        console.log('props', props)
    }, [])

    return (
        <Layout hasSider>
            <title>
                {" "}
                CELIYA
            </title>
            {props && (
                <>
                    <Sidemenu
                        history={history}
                        state={state}
                        // permission={props.children.props.permission}
                        // dataPermission={getPermission()}
                    />
                    <Layout className="site-layout" style={{ marginLeft: 200 }}>
                        <Header state={state} toggle={toggle} />
                        <br />
                        <br />
                        <br />
                        <Content
                            // permission={props.children.props.permission}
                        >
                            {props.children}
                        </Content>

                        <Footer />
                        {/* <IdleTimer
                            ref={ref => {
                                idleTimer = ref;
                            }}
                            element={document}
                            onActive={onActive}
                            onIdle={onIdle}
                            onAction={onAction}
                            debounce={250}
                            timeout={timerState.timeout}
                        /> */}
                    </Layout>
                </>
            )}
        </Layout>
    );
}
