import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Autosuggest from "react-autosuggest";
import {
    Layout,
    Card,
    Row,
    Col,
    Button,
    Form,
    Input,
    Select,
    InputNumber,
    Space,
    DatePicker,
    Divider,
    notification,
    Label
} from "antd";

import useAxiosQuery from "../../../../providers/useAxiosQuery";
import notificationErrors from "../../../../providers/notificationErrors";

import {
    ArrowLeftOutlined,
    UserOutlined,
    LockOutlined,
    HomeOutlined,
    UserAddOutlined
} from "@ant-design/icons";

import getUserData from "../../../../providers/getUserData";

const PageInvite = () => {
    const userdata = getUserData();
    const [formData, setFormData] = useState({
        email: "",
        firstname: "",
        lastname: "",
        company: "",
        password: "",
        requestMID: true,
        inviteBy: userdata.name
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [submitButtonText, setSubmitButtonText] = useState("Send Invitation");
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionValue, setSuggestionValue] = useState("");
    const [emailList, setEmailList] = useState([]);

    const {
        data: dataUsersUnveri,
        isLoading: isLoadingTblUserUnveri,
        refetch: refetchUsersUnveri,
        isFetching: isFetchingTblUserUnveri
    } = useAxiosQuery(
        "GET",
        "api/v1/users?unverified=1",
        "users_table_unveri",
        res => {
            setEmailList(res.data);
        }
    );

    useEffect(() => {
        refetchUsersUnveri();

        return () => {};
    }, []);

    const getSuggestions = email => {
        return emailList.filter(
            obj =>
                obj["email"]
                    .toLocaleLowerCase()
                    .startsWith(email.trim().toLocaleLowerCase()) ||
                obj["name"]
                    .toLocaleLowerCase()
                    .startsWith(email.trim().toLocaleLowerCase())
        );
    };

    const {
        mutate: mutateAddInvite,
        isLoading: isLoadingAddInvite
    } = useAxiosQuery("POST", "api/v1/invitepeople", "invite_table");

    const SendInvitation = () => {
        console.log(formData);

        mutateAddInvite(formData, {
            onSuccess: res => {
                notification.success({
                    message: "Invitation Sent Successfully "
                });

                // history.push("/users");
            },
            onError: err => {
                console.log(err);
                notificationErrors(err);
            }
        });
    };

    const {
        mutate: mutateAddInviteMore,
        isLoading: isLoadingAddInviteMore
    } = useAxiosQuery("POST", "api/v1/invitepeople/more", "invite_more_table");

    const SendMoreInvitation = () => {
        console.log(newFormData);

        mutateAddInviteMore(newFormData, {
            onSuccess: res => {
                notification.success({
                    message: "Invitation Sent Successfully"
                });

                // history.push("/users");
            },
            onError: err => {
                console.log(err);
                notificationErrors(err);
            }
        });
    };

    const updateField = e => {
        if (addCol == false) {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        } else {
            if (e.target.id) {
                var arrayA = newFormData["company"];
                arrayA[e.target.id].name = e.target.value;

                console.log(arrayA);
                setNewFormData({
                    ...newFormData,
                    company: arrayA
                });
            } else {
                setNewFormData({
                    ...newFormData,
                    [e.target.name]: e.target.value
                });
                setFormData({
                    ...formData,
                    [e.target.name]: e.target.value
                });
            }
        }
    };
    const [addCol, setAddCol] = useState(false);

    const [newFormData, setNewFormData] = useState({
        email: "",
        firstname: "",
        lastname: "",
        company: [{ name: "", requestMID: true }],
        password: ""
    });

    const AddMultipleLocation = () => {
        setAddCol(true);
        setNewFormData({
            ...formData,
            company: [...newFormData["company"], { name: "", requestMID: true }]
        });
    };

    const removeDba = key => {
        console.log("index", key);
        var arrayA = newFormData;
        arrayA["company"].splice(key, 1);
        console.log("splice", arrayA);
        setNewFormData({
            ...arrayA
        });
    };

    useEffect(() => {
        console.log("new", newFormData);
        return () => {};
    }, [newFormData]);

    useEffect(() => {
        console.log("notnew", formData);
        return () => {};
    }, [formData]);

    return (
        <div
            className="animated fadeIn"
            id="invitepeoplePage"
            style={{
                padding: "24px 16px"
            }}
        >
            <Row>
                <Col xl={24}>
                    <Form
                        onFinish={e =>
                            addCol == false
                                ? SendInvitation(e)
                                : SendMoreInvitation(e)
                        }
                    >
                        <Card
                            className="invitepeoplecard"
                            style={{ width: "50%", margin: "auto" }}
                        >
                            <div style={{ textAlign: "center" }}>
                                <span>
                                    <UserAddOutlined />
                                </span>
                                <span> Invite People </span>
                            </div>
                            <br></br>
                            <div style={{ textAlign: "center" }}>
                                <Row>
                                    <Col md={24}>
                                        <Form.Item name="firstname">
                                            <Input
                                                required
                                                name="firstname"
                                                onChange={e => updateField(e)}
                                                placeholder="First Name"
                                                prefix={<UserOutlined />}
                                            />
                                        </Form.Item>
                                        <Form.Item name="lastname">
                                            <Input
                                                name="lastname"
                                                onChange={e => updateField(e)}
                                                required
                                                placeholder="Last Name"
                                                prefix={<UserOutlined />}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            className="mb-3 emailAutosuggest"
                                            style={{ textAlign: "center" }}
                                        >
                                            {/* <Input
                                                required
                                                type="email"
                                                autoComplete="email"
                                                name="email"
                                                placeholder="Email Address"
                                                onChange={e => updateField(e)}
                                            /> */}
                                            <div className="at-prefix">
                                                {" "}
                                                {"@"}
                                            </div>
                                            <Autosuggest
                                                required
                                                placeholder="Email"
                                                suggestions={suggestions}
                                                onSuggestionsClearRequested={() =>
                                                    setSuggestions([])
                                                }
                                                onSuggestionsFetchRequested={({
                                                    value
                                                }) => {
                                                    setSuggestionValue(value);
                                                    setSuggestions(
                                                        getSuggestions(value)
                                                    );
                                                    //console.log(getSuggestions(value));
                                                }}
                                                onSuggestionSelected={(
                                                    _,
                                                    { suggestionValue }
                                                ) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: suggestionValue
                                                    })
                                                }
                                                getSuggestionValue={suggestion =>
                                                    suggestion["email"]
                                                }
                                                renderSuggestion={suggestion => (
                                                    <span>
                                                        {suggestion["email"]} (
                                                        {suggestion["name"]})
                                                    </span>
                                                )}
                                                inputProps={{
                                                    placeholder: "Email",
                                                    value: suggestionValue,
                                                    className:
                                                        "ant-input modify-ant-input",
                                                    onChange: (
                                                        _,
                                                        { newValue, method }
                                                    ) => {
                                                        setSuggestionValue(
                                                            newValue
                                                        );

                                                        setFormData({
                                                            ...formData,
                                                            email: newValue
                                                        });
                                                        setNewFormData({
                                                            ...newFormData,
                                                            email: newValue
                                                        });
                                                    }
                                                }}
                                                highlightFirstSuggestion={true}
                                            />
                                        </Form.Item>
                                        <Form.Item name="password">
                                            <Input
                                                required
                                                name="password"
                                                onChange={e => updateField(e)}
                                                placeholder="Password"
                                                prefix={<LockOutlined />}
                                            />
                                        </Form.Item>
                                        {addCol == false && (
                                            <Row>
                                                <Col md={16}>
                                                    <Form.Item name="company">
                                                        <Input
                                                            name="company"
                                                            onChange={e =>
                                                                updateField(e)
                                                            }
                                                            prefix={
                                                                <HomeOutlined />
                                                            }
                                                            placeholder="Company"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col md={8}>
                                                    <Form.Item name="request_Mid">
                                                        <div>
                                                            <Input
                                                                type="checkbox"
                                                                checked={
                                                                    formData.requestMID
                                                                }
                                                                onChange={e => {
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            requestMID:
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                        }
                                                                    );
                                                                }}
                                                                name="request_Mid"
                                                            />
                                                            Request MID
                                                        </div>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        )}

                                        {addCol == true &&
                                            newFormData.company.map(
                                                (data, index) => (
                                                    <>
                                                        <Row gutter={8}>
                                                            <Col md={16}>
                                                                <Form.Item
                                                                    style={{
                                                                        textAlign:
                                                                            "center"
                                                                    }}
                                                                >
                                                                    <Input
                                                                        type="text"
                                                                        autoComplete="company"
                                                                        prefix={
                                                                            <HomeOutlined />
                                                                        }
                                                                        name={
                                                                            index
                                                                        }
                                                                        id={
                                                                            index
                                                                        }
                                                                        value={
                                                                            data.name
                                                                        }
                                                                        placeholder="DBA / Location Name"
                                                                        onChange={e =>
                                                                            updateField(
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col md={8}>
                                                                <Form.Item
                                                                    style={{
                                                                        float:
                                                                            "left"
                                                                    }}
                                                                >
                                                                    <div>
                                                                        <Input
                                                                            type="checkbox"
                                                                            checked={
                                                                                newFormData
                                                                                    .company[
                                                                                    index
                                                                                ]
                                                                                    .requestMID
                                                                            }
                                                                            onChange={e => {
                                                                                var arrayA =
                                                                                    newFormData[
                                                                                        "company"
                                                                                    ];
                                                                                arrayA[
                                                                                    index
                                                                                ].requestMID =
                                                                                    e.target.checked;

                                                                                setNewFormData(
                                                                                    {
                                                                                        ...newFormData,
                                                                                        company: arrayA
                                                                                    }
                                                                                );
                                                                            }}
                                                                        />
                                                                        Request
                                                                        MID
                                                                    </div>
                                                                </Form.Item>

                                                                <div
                                                                    onClick={() =>
                                                                        removeDba(
                                                                            index
                                                                        )
                                                                    }
                                                                    style={{
                                                                        marginTop: 4,
                                                                        color:
                                                                            "red"
                                                                    }}
                                                                >
                                                                    <div>x</div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )
                                            )}

                                        <Row>
                                            <Col>
                                                <a
                                                    href="#"
                                                    onClick={() =>
                                                        AddMultipleLocation()
                                                    }
                                                >
                                                    Add Multiple Locations
                                                </a>
                                            </Col>
                                        </Row>

                                        {success && (
                                            <Alert
                                                color="success"
                                                className="mt-4"
                                            >
                                                Invitation Sent Successfully
                                            </Alert>
                                        )}
                                        {error && (
                                            <Alert
                                                color="danger"
                                                className="mt-4"
                                            >
                                                This email is already Active
                                            </Alert>
                                        )}
                                        {addCol ? (
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="px-5"
                                                style={{ marginTop: "15px" }}
                                                loading={isLoadingAddInviteMore}
                                            >
                                                Submit
                                            </Button>
                                        ) : (
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                className="px-5"
                                                style={{ marginTop: "15px" }}
                                                loading={isLoadingAddInvite}
                                            >
                                                Submit
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                            <br></br>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default PageInvite;
