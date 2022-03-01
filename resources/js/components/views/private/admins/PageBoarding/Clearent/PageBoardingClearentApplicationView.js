import {
    DownCircleOutlined,
    LeftCircleOutlined,
    LeftOutlined,
    RightCircleOutlined
} from "@ant-design/icons";
import { Button, Card, Col, Input, List, notification, Row, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
import getUserData from "../../../../../providers/getUserData";
import { trimStr } from "../../../../../providers/trimStr";
import { putSpacesInFields } from "../../../../../providers/putSpacesInFields";
import { handleAutoCopy } from "../../../../../providers/handleAutoCopy";
import PageBoardingClearentBoardingProcess from "./PageBoardingClearentBoardingProcess";
import ModalApiKey from "../../PageUsers/PageUserProfileComponents/ModalApiKey";
import { useHistory } from "react-router";

import getCheckPermission from "../../../../../providers/getCheckPermission";

const PageBoardingClearentApplicationView = ({ match, permission }) => {
    useEffect(() => {
        console.log('PageBoardingClearentApplicationView permission', permission)

    }, [])
    let history = useHistory();
    let userdata = getUserData();
    let form_data_id = match.params.id;
    const [formNotes, setFormNotes] = useState("");
    // alert(form_data_id);
    let init = 1;
    let reserve = 1;
    const [inputData, setInputData] = useState();
    const {
        data: dataFormData,
        refetch: refetchFormData,
        isLoading: isLoadingFormData
    } = useAxiosQuery(
        "GET",
        `api/v1/formdata/${form_data_id}`,
        `form_data_${form_data_id}`,
        res => {
            // console.log(`form_data_${form_data_id}`, res);
            if (res.success) {
                setTimeout(() => getCheckPermission(permission), 500);
                if (userdata.role == "Merchant") {
                    if (res.data.email != userdata.email) {
                        history.push("/boarding/clearent");
                    }
                }
                setFormNotes(res.data.notes);
                // console.log('setSubmittedData', res.data);
                if (res.data.clearent_boarding != false) {
                    setShowFormDetails(false);
                    setShowFormNotes(false);
                } else {
                    if (reserve) {
                        console.log("reserve", reserve);
                        // mutateReservedMIDs(
                        //     {
                        //         from: "application",
                        //         form_data_id: form_data_id,
                        //         user_id: res.data.user.id
                        //     },
                        //     {
                        //         onSuccess: res => {
                        //             console.log(res);
                        //             // reserve = 0;
                        //             // if (res.success) {

                        //             // }
                        //         }
                        //     }
                        // );
                    }

                    // showForm();
                    // showNotes();
                }

                let merchantDbaName =
                    typeof res.data === "object"
                        ? ""
                        : JSON.parse(res.data.clearent_boarding.merchant);

                console.log("wew", merchantDbaName);
                merchantDbaName = merchantDbaName
                    ? merchantDbaName.dbaName
                    : "";

                var id = res.data.clearent_boarding
                    ? res.data.clearent_boarding.merchantNumber.toString()
                    : "";
                if (id.length > 4) {
                    id = id.substring(
                        id.length - 4 < 0 ? 0 : id.length - 4,
                        id.length
                    );
                }
                if (id.length == 4) {
                    id = `****${id}`;
                }

                if (init) {
                    let data = {
                        title: `<div style='font-weight:bold;'>${merchantDbaName}</div> (${trimStr(
                            id,
                            10
                        )})`,
                        type: "Boarding",
                        url: `${window.location.origin}/boarding/clearent/${form_data_id}`
                    };
                    mutateAddRecent(data);
                    // fetchData("POST", "user/recent", data).then(res => {
                    //     //console.log("activity logged", res);
                    // });

                    init = 0;
                }
                if (
                    typeof res.data.inputs === "object" &&
                    res.data.inputs !== null
                ) {
                    let arr = Object.keys(res.data.inputs).map(
                        k => res.data.inputs[k]
                    );
                    setInputData(arr);
                } else {
                    setInputData(res.data.inputs);
                }
            }
        }
    );

    const {
        mutate: mutateReservedMIDs,
        isLoading: isLoadingReservedMIDs
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/reservemids",
        `form_data_${form_data_id}`
    );

    const {
        mutate: mutateAddRecent,
        isLoading: isLoadingAddRecent
    } = useAxiosQuery("POST", "api/v1/user/recent");

    const {
        mutate: mutateSaveFormNotes,
        isLoading: isLoadingSaveFormNotes
    } = useAxiosQuery("UPDATE", "api/v1/formdata", `form_data_${form_data_id}`);

    const handleSaveNotes = () => {
        let data = { id: dataFormData.data.id, notes: formNotes };
        mutateSaveFormNotes(data, {
            onSuccess: res => {
                console.log(res);
                if (res.success) {
                    notification.success({
                        message: "Notes Successfully Saved"
                    });
                }
            }
        });
    };

    const [showFormDetails, setShowFormDetails] = useState(true);
    const [showFormNotes, setShowFormNotes] = useState(true);

    const {
        data: dataReserveMID,
        refetch: refetchReserveMID,
        isLoading: isLoadingMutateReserveMID,
        isFetching: isFetchingMutateReserveMID
    } = useAxiosQuery(
        "GET_MANUAL",
        `api/v1/clearent/reserveMID/${form_data_id}`,
        "",
        res => {
            console.log(res);
            if (res.success) {
                // refetchFormData();
                location.reload();
            }
        }
    );
    const handleReserveMID = () => {
        refetchReserveMID();
    };

    const [showModalApiKey, setShowModalApiKey] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState();
    const toggleShowModalApiKey = record => {
        setSelectedMerchant(record.clearent_boarding);
        setShowModalApiKey(true);
        console.log(record.clearent_boarding);
    };
    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            <Row gutter={12}>
                {showFormDetails ? (
                    <Col xs={24} md={8}>
                        <Card
                            headStyle={{
                                background: "#1FA8D8",
                                color: "white"
                            }}
                            title="Form Details"
                            extra={
                                <LeftCircleOutlined
                                    style={{
                                        color: "white",
                                        fontSize: 25,
                                        cursor: "pointer"
                                    }}
                                    onClick={e => setShowFormDetails(false)}
                                />
                            }
                        >
                            <Title level={4}>
                                Email: {dataFormData && dataFormData.data.email}
                            </Title>
                            <List>
                                {inputData &&
                                    inputData.map((input, key) => {
                                        return (
                                            <List.Item
                                                key={key}
                                                className="mb-1"
                                            >
                                                <span>
                                                    {putSpacesInFields(
                                                        input.field
                                                    )}
                                                    :{" "}
                                                    <a
                                                        href="#"
                                                        onClick={e =>
                                                            handleAutoCopy(
                                                                e,
                                                                input.value
                                                            )
                                                        }
                                                    >
                                                        {input.value}
                                                    </a>
                                                    <br></br>
                                                </span>
                                            </List.Item>
                                        );
                                    })}
                            </List>
                        </Card>
                    </Col>
                ) : (
                    <Col
                        xs={2}
                        md={1}
                        className="text-center"
                        style={{ paddingTop: 15 }}
                    >
                        <RightCircleOutlined
                            style={{
                                fontSize: 25,
                                cursor: "pointer"
                            }}
                            onClick={e => setShowFormDetails(true)}
                        />
                    </Col>
                )}

                <Col xs={24} md={showFormDetails ? 16 : 23}>
                    <Card
                        title={
                            <>
                                Merchant Number:{" "}
                                {dataFormData &&
                                dataFormData.data.clearent_boarding &&
                                dataFormData.data.clearent_boarding
                                    .merchantNumber ? (
                                    <>
                                        {
                                            dataFormData.data.clearent_boarding
                                                .merchantNumber
                                        }{" "}
                                        {dataFormData.data.clearent_boarding
                                            .status == "Boarded" ||
                                            (dataFormData.data.clearent_boarding
                                                .status == "Shipped" && (
                                                <Button
                                                    size="sm"
                                                    onClick={e =>
                                                        toggleShowModalApiKey(
                                                            dataFormData.data
                                                        )
                                                    }
                                                >
                                                    Status:{" "}
                                                    {
                                                        dataFormData.data
                                                            .clearent_boarding
                                                            .status
                                                    }
                                                </Button>
                                            ))}
                                    </>
                                ) : userdata.role != "Merchant" ? (
                                    <Button
                                        size="small"
                                        name="reserve_btn"
                                        type="primary"
                                        onClick={e => handleReserveMID()}
                                        loading={
                                            isFetchingMutateReserveMID ||
                                            isLoadingMutateReserveMID
                                        }
                                    >
                                        Reserve MID
                                    </Button>
                                ) : (
                                    <span className="text-danger">
                                        Pending Review
                                    </span>
                                )}
                            </>
                        }
                        extra={
                            <Space>
                                <Button size="small" type="primary">
                                    View Files
                                </Button>
                                {showFormNotes ? (
                                    <DownCircleOutlined
                                        style={{
                                            fontSize: 25,
                                            cursor: "pointer"
                                        }}
                                        onClick={e => setShowFormNotes(false)}
                                    />
                                ) : (
                                    <LeftCircleOutlined
                                        style={{
                                            fontSize: 25,
                                            cursor: "pointer"
                                        }}
                                        onClick={e => setShowFormNotes(true)}
                                    />
                                )}
                            </Space>
                        }
                    >
                        {showFormNotes && (
                            <Card title="Notes:" size="small">
                                {/* <TextArea
                                    onChange={e => setFormNotes(e.target.value)}
                                    value={formNotes}
                                ></TextArea> */}
                                <div
                                    style={{
                                        border: "0.5px solid #e2e2e2",
                                        padding: 10
                                    }}
                                    contentEditable="true"
                                    dangerouslySetInnerHTML={{
                                        __html: formNotes
                                    }}
                                    onInput={e =>
                                        setFormNotes(e.currentTarget.innerHTML)
                                    }
                                ></div>
                                <Button
                                    style={{ marginTop: 10, float: "right" }}
                                    type="primary"
                                    onClick={e => handleSaveNotes()}
                                    loading={isLoadingSaveFormNotes}
                                >
                                    Save
                                </Button>
                            </Card>
                        )}

                        {dataFormData &&
                            dataFormData.data &&
                            dataFormData.data.clearent_boarding &&
                            dataFormData.data.clearent_boarding
                                .merchantNumber && (
                                <PageBoardingClearentBoardingProcess
                                    formData={dataFormData.data}
                                    inputData={inputData}
                                />
                            )}
                    </Card>
                </Col>
            </Row>
            {showModalApiKey && (
                <ModalApiKey
                    showModalApiKey={showModalApiKey}
                    setShowModalApiKey={setShowModalApiKey}
                    toggleShowModalApiKey={toggleShowModalApiKey}
                    selectedMerchant={selectedMerchant}
                />
            )}
        </Content>
    );
};

export default PageBoardingClearentApplicationView;
