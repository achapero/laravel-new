import React, { useEffect, useState } from "react";
import getUserData from "../../../../../../providers/getUserData";
import {
    Button,
    Card,
    Divider,
    Form,
    notification,
    Select,
    Collapse,
    Popconfirm
} from "antd";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";
import notificationErrors from "../../../../../../providers/notificationErrors";
import StepEquipmentParentQuestionaire from "./StepEquipmentParentQuestionaire";

const StepEquipments = ({
    formData,
    inputData,
    stepsStatuses,
    setStepsStatuses,
    currentStep,
    setCurrentStep
}) => {
    const [
        selectedEquipmentSurveyId,
        setSetSelectedEquipmentSurveyId
    ] = useState();

    let userdata = getUserData();
    let form;

    useEffect(() => {
        if (currentStep == 9) {
            if (stepsStatuses[currentStep].status != "finish") {
                let _steps = [...stepsStatuses];
                _steps[currentStep] = {
                    ..._steps[currentStep],
                    status: "progress"
                };
                setStepsStatuses(_steps);
            }
        }
        return () => {};
    }, [currentStep]);

    const {
        data: dataEquipmentProducts,
        isLoading: isLoadingDataEquipmentProducts
    } = useAxiosQuery(
        "GET",
        "api/v1/clearent/equipment",
        "clearent_boarding_equipment_products",
        res => {
            console.log(res);
        }
    );

    const [selectedEquipmentSurvey, setSelectedEquipmentSurvey] = useState(
        // "RTO-Point of Success (Direct API)"
        ""
    );
    const [equipmentData, setEquipmentData] = useState();
    const [surveyQuestionaires, setSurveyQuestionaires] = useState();

    const [productNames, setProductNames] = useState([]);
    useEffect(() => {
        if (equipmentData) {
            console.log("equipmentData", equipmentData);
            let _order = [];
            equipmentData.orders.map((order, key) => {
                _order.push(order.orderItems[0].productName);
            });

            let _steps = [...stepsStatuses];
            _steps[9] = {
                ..._steps[9],
                title: (
                    <>
                        Equipment ({_order.length}
                        /~)
                    </>
                ),
                status: _order.length > 0 ? "finish" : "progress"
            };
            setStepsStatuses(_steps);
            setProductNames(_order);
        }

        return () => {};
    }, [equipmentData]);
    const {
        mutate: mutateEquipment,
        isLoading: isLoadingDataEquipment
    } = useAxiosQuery(
        "POST",
        `api/v1/clearent/getEquipmentDetails/${formData.clearent_boarding.merchantNumber}`,
        ""
    );

    useEffect(() => {
        getEquipmentData();
        // console.log("selectedEquipmentSurveyId", selectedEquipmentSurveyId);
        return () => {};
    }, [selectedEquipmentSurvey, selectedEquipmentSurveyId]);

    const getEquipmentData = () => {
        let data = {
            equipment: selectedEquipmentSurvey
        };
        // console.log("getEquipmentData", data);
        mutateEquipment(data, {
            onSuccess: res => {
                if (res.data.errors) {
                } else {
                    // //console.log(res);
                    let orders = res.data.orders;
                    let orderItem;
                    if (selectedEquipmentSurvey) {
                        orders.map((order, key) => {
                            // let _orderItem = order.orderItems.find(
                            //     p => p.productName == selectedEquipmentSurvey
                            // );
                            // if (_orderItem) {
                            //     orderItem = _orderItem;
                            // }

                            if (order.orderId == selectedEquipmentSurveyId) {
                                orderItem = order.orderItems[0];
                            }

                            // console.log("orderItem", orderItem);
                        });
                    }

                    if (orderItem) {
                        setSurveyQuestionaires(
                            orderItem.survey.questionAnswerGroup
                        );
                    } else {
                        if (res.survey) {
                            let survey = res.survey.questionAnswerGroup;
                            delete survey.id;

                            if (survey.questionAnswerSets.AutoClose) {
                                survey.questionAnswerSets.AutoClose.map(
                                    (question, key) => {
                                        if (
                                            question.type ==
                                            "24-Hour Time (Hour:Minute)"
                                        ) {
                                            question.answers[0].selected = true;
                                            question.answers[0].answer =
                                                "04:30";
                                        }

                                        if (question.children.length > 0) {
                                            question.children.map(
                                                (child, key) => {
                                                    if (
                                                        child.type ==
                                                        "24-Hour Time (Hour:Minute)"
                                                    ) {
                                                        child.answers[0].selected = true;
                                                        child.answers[0].answer =
                                                            "04:30";
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                            setSurveyQuestionaires(survey);
                        }
                    }

                    setEquipmentData(res.data);
                }
            }
        });
    };

    const getChildrenQuestions = (
        e,
        questionArea,
        parent,
        answer,
        node,
        child
    ) => {
        let _surveyQuestionaires = surveyQuestionaires;
        // console.log("questionArea", questionArea);
        let _questions = _surveyQuestionaires.questionAnswerSets[questionArea];
        // let _parent = _questions.find(p => p.id == parent.id);
        let _ind = _questions.findIndex(x => x.question == parent.question);
        if (node == "parent") {
            // //console.log(parent);
            // //console.log(e, "change multi");
            _questions[_ind].answers.map((_answer, key) => {
                if (e == null) {
                    _answer.selected = false;
                } else {
                    if (typeof e.target === "undefined") {
                        _answer.selected = false;
                        if (Array.isArray(e)) {
                            e.map((option, key) => {
                                if (option.id == _answer.id) {
                                    _answer["value"] = option.answer;
                                    _answer["label"] = option.answer;
                                    _answer.selected = true;
                                }
                            });
                        } else {
                            // let timezones = [
                            //     "US/Alaska",
                            //     "US/Pacific",
                            //     "US/Eastern",
                            //     "US/Central",
                            //     "US/Arizona",
                            //     "US/Mountain",
                            //     "US/Hawaii"
                            // ];
                            // if (timezones.includes(e)) {
                            if (_answer.id == answer.id) {
                                _answer.answer = e;
                                _answer.selected = true;
                            }
                            // }
                        }
                    } else {
                        if (e.target.type == "number") {
                            if (_answer.id == answer.id) {
                                var num = e.target.value;
                                _answer.answer = num;
                            }
                        }
                        if (
                            e.target.type == "text" ||
                            e.target.type == "email" ||
                            e.target.type == "time"
                        ) {
                            if (_answer.id == answer.id) {
                                _answer.answer = e.target.value;
                                _answer.selected = true;
                            }
                        }
                        if (e.target.type == "radio") {
                            // //console.log("radio answer", _answer, answer);
                            if (_answer.id == answer.id) {
                                _answer.selected = e.target.checked;
                            } else {
                                _answer.selected = !e.target.checked;
                            }
                        }

                        if (e.target.type == "select-one") {
                            if (
                                e.target.name ==
                                "Whattimezonedoesyourmerchantoperatein?"
                            ) {
                                if (_answer.id == answer.id) {
                                    _answer.answer = e.target.value;
                                    _answer.selected = true;
                                }
                            } else {
                                if (_answer.id == e.target.value) {
                                    _answer.selected = true;
                                } else {
                                    _answer.selected = false;
                                }
                            }
                        }
                        //changes
                        if (
                            selectedEquipmentSurvey ==
                            "Point of Success (PAX) TESTING ONLY"
                        ) {
                            if (e.target.name == "Doyouhaveareprogram?") {
                                var a = $(
                                    "input[name='" +
                                        e.target.name +
                                        "'][value=true]"
                                ).closest("label:contains('Yes')");
                                if (a[0]) {
                                    setUpdateMgmtUnselect("unselect");
                                } else {
                                    setUpdateMgmtUnselect("");
                                }
                            }
                        }
                    }
                }
            });
        }
        if (node == "firstChild") {
            _questions[_ind].children.map((_child, key) => {
                if (
                    _child.question == child.question &&
                    _child.conditionalOnAnswer == child.conditionalOnAnswer
                ) {
                    _child.answers.map((_answer, key) => {
                        if (typeof e.target == "undefined") {
                            if (_answer.id == e) {
                                _answer.selected = true;
                            } else {
                                _answer.selected = false;
                            }
                        } else {
                            if (e.target.type == "number") {
                                if (_answer.id == answer.id) {
                                    var num = e.target.value;
                                    _answer.answer = num;
                                }
                            }
                            if (
                                e.target.type == "text" ||
                                e.target.type == "email" ||
                                e.target.type == "time"
                            ) {
                                if (_answer.id == answer.id) {
                                    _answer.answer = e.target.value;
                                    _answer.selected = true;
                                }
                            }
                            if (e.target.type == "radio") {
                                if (_answer.id == answer.id) {
                                    _answer.selected = e.target.checked;
                                } else {
                                    _answer.selected = !e.target.checked;
                                }
                            }

                            if (e.target.type == "select-one") {
                                if (_answer.id == e.target.value) {
                                    _answer.selected = true;
                                } else {
                                    _answer.selected = false;
                                }
                            }

                            if (
                                selectedEquipmentSurvey.productName ==
                                "Point of Success (PAX) TESTING ONLY"
                            ) {
                                if (e.target.type == "select-one") {
                                    if (_answer.id == answer.id) {
                                        _answer.answer = e.target.value;
                                        _answer.selected = true;
                                        setUpdateMgmt(e.target.value);
                                        //console.log(e.target.value);
                                    }
                                }
                            }
                        }
                    });
                }
            });
        }
        if (node == "secondChild") {
            _questions[_ind].children.map((_child, key) => {
                _child.children.map((_child1, key) => {
                    if (
                        _child1.question == child.question &&
                        _child1.conditionalOnAnswer == child.conditionalOnAnswer
                    ) {
                        _child1.answers.map((_answer, key) => {
                            if (typeof e.target == "undefined") {
                                if (_answer.id == e) {
                                    _answer.selected = true;
                                } else {
                                    _answer.selected = false;
                                }
                            } else {
                                if (e.target.type == "number") {
                                    console.log(answer.id, e);
                                    if (_answer.id == answer.id) {
                                        var num = e.target.value;
                                        _answer.answer = num;
                                    }
                                }
                                if (
                                    e.target.type == "text" ||
                                    e.target.type == "email" ||
                                    e.target.type == "time"
                                ) {
                                    if (_answer.id == answer.id) {
                                        _answer.answer = e.target.value;
                                        _answer.selected = true;
                                    }
                                }
                                if (e.target.type == "radio") {
                                    if (_answer.id == answer.id) {
                                        _answer.selected = e.target.checked;
                                    } else {
                                        _answer.selected = !e.target.checked;
                                    }
                                }

                                if (e.target.type == "select-one") {
                                    if (_answer.id == e.target.value) {
                                        _answer.selected = true;
                                    } else {
                                        _answer.selected = false;
                                    }
                                }
                            }
                        });
                    }
                });
            });
            // _questions[_ind].children.map((_child, key) => {
            //     _child.children.map((_child1, key) => {
            //         _child1.answers.map((_answer, key) => {
            //             if (e.target.type == "number") {
            //                 if (_answer.id == answer.id) {
            //                     var num = e.target.value;
            //                     var round = parseFloat(num).toFixed(2);
            //                     _answer.answer = round;
            //                 }
            //             }
            //             if (
            //                 e.target.type == "text" ||
            //                 e.target.type == "email" ||
            //                 e.target.type == "time"
            //             ) {
            //                 if (_answer.id == answer.id) {
            //                     _answer.answer = e.target.value;
            //                     _answer.selected = true;
            //                 }
            //             }
            //             if (e.target.type == "radio") {
            //                 if (_answer.id == answer.id) {
            //                     _answer.selected = e.target.checked;
            //                 } else {
            //                     _answer.selected = !e.target.checked;
            //                 }
            //             }

            //             if (e.target.type == "select-one") {
            //                 if (_answer.id == e.target.value) {
            //                     _answer.selected = true;
            //                 } else {
            //                     _answer.selected = false;
            //                 }
            //             }
            //         });
            //     });
            // });
        }
        if (node == "thirdChild") {
            _questions[_ind].children.map((_child, key) => {
                _child.children.map((_child1, key) => {
                    _child1.children.map((_child2, key) => {
                        if (
                            _child2.question == child.question &&
                            _child2.conditionalOnAnswer ==
                                child.conditionalOnAnswer
                        ) {
                            _child2.answers.map((_answer, key) => {
                                if (typeof e.target == "undefined") {
                                    if (_answer.id == e) {
                                        _answer.selected = true;
                                    } else {
                                        _answer.selected = false;
                                    }
                                } else {
                                    if (e.target.type == "number") {
                                        console.log(answer.id, e);
                                        if (_answer.id == answer.id) {
                                            var num = e.target.value;
                                            _answer.answer = num;
                                        }
                                    }
                                    if (
                                        e.target.type == "text" ||
                                        e.target.type == "email" ||
                                        e.target.type == "time"
                                    ) {
                                        if (_answer.id == answer.id) {
                                            _answer.answer = e.target.value;
                                            _answer.selected = true;
                                        }
                                    }
                                    if (e.target.type == "radio") {
                                        if (_answer.id == answer.id) {
                                            _answer.selected = e.target.checked;
                                        } else {
                                            _answer.selected = !e.target
                                                .checked;
                                        }
                                    }

                                    if (e.target.type == "select-one") {
                                        if (_answer.id == e.target.value) {
                                            _answer.selected = true;
                                        } else {
                                            _answer.selected = false;
                                        }
                                    }
                                }
                            });
                        }
                    });
                });
            });
            // _questions[_ind].children.map((_child, key) => {
            //     _child.children.map((_child1, key) => {
            //         _child1.answers.map((_answer, key) => {
            //             if (e.target.type == "number") {
            //                 if (_answer.id == answer.id) {
            //                     var num = e.target.value;
            //                     var round = parseFloat(num).toFixed(2);
            //                     _answer.answer = round;
            //                 }
            //             }
            //             if (
            //                 e.target.type == "text" ||
            //                 e.target.type == "email" ||
            //                 e.target.type == "time"
            //             ) {
            //                 if (_answer.id == answer.id) {
            //                     _answer.answer = e.target.value;
            //                     _answer.selected = true;
            //                 }
            //             }
            //             if (e.target.type == "radio") {
            //                 if (_answer.id == answer.id) {
            //                     _answer.selected = e.target.checked;
            //                 } else {
            //                     _answer.selected = !e.target.checked;
            //                 }
            //             }

            //             if (e.target.type == "select-one") {
            //                 if (_answer.id == e.target.value) {
            //                     _answer.selected = true;
            //                 } else {
            //                     _answer.selected = false;
            //                 }
            //             }
            //         });
            //     });
            // });
        }

        setSurveyQuestionaires({
            ...surveyQuestionaires,
            questionAnswerSets: {
                ...surveyQuestionaires.questionAnswerSets
                //questionArea: _parent
            }
        });
    };

    const {
        mutate: mutatePostEquipment,
        isLoading: isLoadingPostEquipment
    } = useAxiosQuery("POST", "api/v1/clearent/postEquipment", "");
    const {
        mutate: mutateUpdateEquipment,
        isLoading: isLoadingUpdateEquipment
    } = useAxiosQuery("POST", "api/v1/clearent/putEquipment", "");
    const handleSubmitBoarding = e => {
        e.preventDefault();

        let _orders = equipmentData.orders;
        let my_order_key;
        _orders.map((order, key) => {
            // let _temp = order.orderItems.find(
            //     p => p.productName == selectedEquipmentSurvey
            // );
            // if (typeof _temp != "undefined") {
            //     my_order_key = key;
            // }

            if (order.orderId == selectedEquipmentSurveyId) {
                my_order_key = key;
            }
        });

        let orderId = selectedEquipmentSurveyId;

        if (!orderId) {
            let _selectedEquipmentSurvey = dataEquipmentProducts.data.products.content.find(
                p => p.productName == selectedEquipmentSurvey
            );
            let data = {
                merchantNumber: formData.clearent_boarding.merchantNumber,
                status: "Submitted",
                orderItems: [
                    {
                        quantity: 1,
                        manufacturer: _selectedEquipmentSurvey.manufacturer,
                        productName: _selectedEquipmentSurvey.productName,
                        productType: _selectedEquipmentSurvey.productType,
                        survey: {
                            questionAnswerGroup: { ...surveyQuestionaires }
                        }
                    }
                ]
            };
            //changes
            var a = $("input[name='Doyouhaveareprogram?'][value=true]").closest(
                "label:contains('No')"
            );
            if (a[0]) {
                data.orderItems[0].survey.questionAnswerGroup.questionAnswerSets.Setup[0].children[0].answers[0].answer =
                    "";
                data.orderItems[0].survey.questionAnswerGroup.questionAnswerSets.Setup[0].children[0].answers[0].selected = false;
            }
            console.log(data);

            mutatePostEquipment(data, {
                onSuccess: res => {
                    console.log("res", res);
                    if (res.errors.length > 0) {
                        res.errors.map((err, key) => {
                            notification.error({ message: err.message });
                        });
                    } else {
                        notification.success({
                            message: "Equipment Successfully Saved"
                        });
                        // if (res.res) {
                        //     setSetSelectedEquipmentSurveyId(res.res.orderId);
                        // }

                        // setSelectedEquipmentSurvey("");
                        // setSetSelectedEquipmentSurveyId(null);
                        setCurrentStep(currentStep + 1);
                        setAccordionActiveKey(null);
                        getEquipmentData();
                    }
                },
                onError: err => {
                    notificationErrors(err);
                }
            });
        } else {
            let data = {
                merchantNumber: formData.clearent_boarding.merchantNumber,
                status: "Submitted",
                orderId: orderId,
                orderItems: [
                    {
                        ...equipmentData.orders[my_order_key].orderItems[0],
                        survey: {
                            questionAnswerGroup: { ...surveyQuestionaires }
                        }
                    }
                ]
            };
            var a = $("input[name='Doyouhaveareprogram?'][value=true]").closest(
                "label:contains('No')"
            );
            if (a[0]) {
                data.orderItems[0].survey.questionAnswerGroup.questionAnswerSets.Setup[0].children[0].answers[0].answer =
                    "";
                data.orderItems[0].survey.questionAnswerGroup.questionAnswerSets.Setup[0].children[0].answers[0].selected = false;
            }
            mutateUpdateEquipment(data, {
                onSuccess: res => {
                    console.log("res", res);
                    if (res.errors.length > 0) {
                        res.errors.map((err, key) => {
                            notification.error({ message: err.message });
                        });
                    } else {
                        notification.success({
                            message: "Equipment Successfully Saved"
                        });
                        getEquipmentData();
                    }
                },
                onError: err => {
                    notificationErrors(err);
                }
            });
        }
    };

    const [accordionActiveKey, setAccordionActiveKey] = useState(null);

    const {
        mutate: mutateDeleteEquipment,
        isLoading: isLoadingDeleteEquipment
    } = useAxiosQuery("POST", "api/v1/clearent/equipment");
    const handleDeleteEquipment = orderId => {
        mutateDeleteEquipment(
            {
                action: "delete",
                orderId: orderId,
                merchantNumber: formData.clearent_boarding.merchantNumber
            },
            {
                onSuccess: res => {
                    console.log(res);
                    if (res.success) {
                        notification.success({
                            message: "Equipment Order successfully delete"
                        });

                        setAccordionActiveKey(null);
                        getEquipmentData();
                    }
                },
                onError: err => {
                    notificationErrors(err);
                }
            }
        );
    };

    const handleCloneEquipment = orderId => {
        let data = equipmentData.orders.find(p => p.orderId == orderId);
        delete data.orderId;
        //changes
        var a = $("input[name='Doyouhaveareprogram?'][value=true]").closest(
            "label:contains('No')"
        );
        if (a[0]) {
            data.orderItems[0].survey.questionAnswerGroup.questionAnswerSets.Setup[0].children[0].answers[0].answer =
                "";
            data.orderItems[0].survey.questionAnswerGroup.questionAnswerSets.Setup[0].children[0].answers[0].selected = false;
        }
        console.log(data);

        mutatePostEquipment(data, {
            onSuccess: res => {
                console.log("res", res);
                if (res.errors.length > 0) {
                    res.errors.map((err, key) => {
                        notification.error({ message: err.message });
                    });
                } else {
                    notification.success({
                        message: "Equipment Successfully Saved"
                    });
                    // if (res.res) {
                    //     setSetSelectedEquipmentSurveyId(res.res.orderId);
                    // }

                    // setSelectedEquipmentSurvey("");
                    // setSetSelectedEquipmentSurveyId(null);
                    setAccordionActiveKey(null);
                    getEquipmentData();
                }
            },
            onError: err => {
                notificationErrors(err);
            }
        });
    };
    return (
        <>
            <Card>
                <Collapse
                    // defaultActiveKey={["0"]}
                    activeKey={accordionActiveKey}
                    accordion
                >
                    {equipmentData &&
                        equipmentData.orders &&
                        equipmentData.orders.map((order, order_key) => {
                            return (
                                <Collapse.Panel
                                    header={
                                        <div
                                            style={{
                                                display: "inline-block",
                                                width: "80%"
                                            }}
                                            onClick={e => {
                                                setAccordionActiveKey(
                                                    order_key
                                                );
                                                if (
                                                    equipmentData.orders
                                                        .length == order_key
                                                ) {
                                                    // alert("ADD NEW EQUIPMENT");
                                                    setSelectedEquipmentSurvey(
                                                        ""
                                                    );
                                                    setSetSelectedEquipmentSurveyId(
                                                        null
                                                    );
                                                } else {
                                                    setSelectedEquipmentSurvey(
                                                        equipmentData.orders[
                                                            order_key
                                                        ].orderItems[0]
                                                            .productName
                                                    );
                                                    // console.log(
                                                    //     "equipmentData.orders[e].orderId",
                                                    //     equipmentData.orders[e].orderId
                                                    // );
                                                    setSetSelectedEquipmentSurveyId(
                                                        equipmentData.orders[
                                                            order_key
                                                        ].orderId
                                                    );
                                                }
                                            }}
                                        >
                                            {order.orderItems[0].productName}
                                        </div>
                                    }
                                    extra={
                                        <>
                                            <Popconfirm
                                                title="Are you sure you want to Duplicate this equipment order?"
                                                okText="Yes"
                                                onConfirm={e =>
                                                    handleCloneEquipment(
                                                        order.orderId
                                                    )
                                                }
                                            >
                                                <Button>Duplicate</Button>
                                            </Popconfirm>
                                            <Popconfirm
                                                title="Are you sure you want to DELETE this equipment order?"
                                                okText="Yes"
                                                onConfirm={e =>
                                                    handleDeleteEquipment(
                                                        order.orderId
                                                    )
                                                }
                                            >
                                                <Button danger>Delete</Button>
                                            </Popconfirm>
                                        </>
                                    }
                                    key={order_key}
                                >
                                    <form
                                        ref={ref => (form = ref)}
                                        onSubmit={e => handleSubmitBoarding(e)}
                                    >
                                        {surveyQuestionaires &&
                                            surveyQuestionaires.questionAreas.map(
                                                (questionArea, key) => {
                                                    if (
                                                        surveyQuestionaires
                                                            .questionAnswerSets[
                                                            questionArea
                                                        ]
                                                    ) {
                                                        let questions =
                                                            surveyQuestionaires
                                                                .questionAnswerSets[
                                                                questionArea
                                                            ];
                                                        return (
                                                            <Card
                                                                key={key}
                                                                title={
                                                                    questionArea
                                                                }
                                                            >
                                                                {questions.map(
                                                                    (
                                                                        _question,
                                                                        k
                                                                    ) => {
                                                                        let input = StepEquipmentParentQuestionaire(
                                                                            _question,
                                                                            () => {},
                                                                            getChildrenQuestions,
                                                                            questionArea,
                                                                            selectedEquipmentSurvey,
                                                                            () => {}
                                                                        );

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    k
                                                                                }
                                                                                style={{
                                                                                    borderBottom:
                                                                                        "1px solid rgba(0, 0, 0, 0.1)",
                                                                                    paddingTop:
                                                                                        "1.5rem",
                                                                                    paddingBottom:
                                                                                        "1.5rem"
                                                                                }}
                                                                            >
                                                                                {
                                                                                    _question.question
                                                                                }
                                                                                <br />
                                                                                {
                                                                                    input
                                                                                }
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </Card>
                                                        );
                                                    }
                                                }
                                            )}
                                        {selectedEquipmentSurvey &&
                                            userdata.role != "Merchant" && (
                                                <>
                                                    <Divider />
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        loading={
                                                            isLoadingPostEquipment ||
                                                            isLoadingUpdateEquipment
                                                        }
                                                    >
                                                        {productNames.length >
                                                        0 ? (
                                                            <>reValidate</>
                                                        ) : (
                                                            <>Save & Proceed</>
                                                        )}
                                                    </Button>
                                                </>
                                            )}
                                    </form>
                                </Collapse.Panel>
                            );
                        })}

                    <Collapse.Panel
                        header={
                            <div
                                style={{
                                    display: "inline-block",
                                    width: "80%"
                                }}
                                onClick={e => {
                                    setAccordionActiveKey(
                                        equipmentData.orders.length
                                    );

                                    // alert("ADD NEW EQUIPMENT");
                                    setSelectedEquipmentSurvey("");
                                    setSetSelectedEquipmentSurveyId(null);
                                }}
                            >
                                Add New Equipment
                            </div>
                        }
                    >
                        <Card
                            title={
                                <>
                                    Equipment{" "}
                                    {/* {equipmentData &&
                                        equipmentData.orders.length > 0 && (
                                            <small>
                                                (
                                                <strong>
                                                    Currently Active:{" "}
                                                </strong>
                                                {productNames.join(", ")})
                                            </small>
                                        )} */}
                                </>
                            }
                            loading={isLoadingDataEquipment}
                        >
                            <Select
                                style={{ width: "100%" }}
                                loading={isLoadingDataEquipmentProducts}
                                value={selectedEquipmentSurvey}
                                onChange={e => setSelectedEquipmentSurvey(e)}
                                showSearch
                            >
                                {dataEquipmentProducts &&
                                    dataEquipmentProducts.data.products &&
                                    dataEquipmentProducts.data.products.content.map(
                                        (product, key) => {
                                            return (
                                                <Select.Option
                                                    value={product.productName}
                                                    key={key}
                                                >
                                                    {product.productName}
                                                </Select.Option>
                                            );
                                        }
                                    )}
                            </Select>
                            <Divider />
                            {selectedEquipmentSurvey != "" && (
                                <form
                                    ref={ref => (form = ref)}
                                    onSubmit={e => handleSubmitBoarding(e)}
                                >
                                    {surveyQuestionaires &&
                                        surveyQuestionaires.questionAreas.map(
                                            (questionArea, key) => {
                                                if (
                                                    surveyQuestionaires
                                                        .questionAnswerSets[
                                                        questionArea
                                                    ]
                                                ) {
                                                    let questions =
                                                        surveyQuestionaires
                                                            .questionAnswerSets[
                                                            questionArea
                                                        ];
                                                    return (
                                                        <Card
                                                            key={key}
                                                            title={questionArea}
                                                        >
                                                            {questions.map(
                                                                (
                                                                    _question,
                                                                    k
                                                                ) => {
                                                                    let input = StepEquipmentParentQuestionaire(
                                                                        _question,
                                                                        () => {},
                                                                        getChildrenQuestions,
                                                                        questionArea,
                                                                        selectedEquipmentSurvey,
                                                                        () => {}
                                                                    );

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                k
                                                                            }
                                                                            style={{
                                                                                borderBottom:
                                                                                    "1px solid rgba(0, 0, 0, 0.1)",
                                                                                paddingTop:
                                                                                    "1.5rem",
                                                                                paddingBottom:
                                                                                    "1.5rem"
                                                                            }}
                                                                        >
                                                                            {
                                                                                _question.question
                                                                            }
                                                                            <br />
                                                                            {
                                                                                input
                                                                            }
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </Card>
                                                    );
                                                }
                                            }
                                        )}
                                    {selectedEquipmentSurvey &&
                                        userdata.role != "Merchant" && (
                                            <>
                                                <Divider />
                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={
                                                        isLoadingPostEquipment ||
                                                        isLoadingUpdateEquipment
                                                    }
                                                >
                                                    {productNames.length > 0 ? (
                                                        <>reValidate</>
                                                    ) : (
                                                        <>Save & Proceed</>
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                </form>
                            )}
                        </Card>
                    </Collapse.Panel>
                </Collapse>
            </Card>
        </>
    );
};

export default StepEquipments;
