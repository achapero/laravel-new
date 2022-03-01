import { Radio, Form, Select, Divider, Input } from "antd";
import React from "react";
import StepEquipmentChildQuestionaire from "./StepEquipmentChildQuestionaire";

const StepEquipmentParentQuestionaire = (
    question,
    saveCountReq,
    getChildrenQuestions,
    questionArea,
    selectedEquipmentSurvey,
    serialMgmt
) => {
    //console.log("question", question);
    let input;
    if (question.type == "Yes/No") {
        input = (
            <>
                <Radio
                    name={question.question.replace(/ /g, "")}
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[0],
                            "parent"
                        )
                    }
                    value={question.answers[0].selected}
                    checked={question.answers[0].selected}
                >
                    {question.answers[0].answer}
                </Radio>
                <Radio
                    name={question.question.replace(/ /g, "")}
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[1],
                            "parent"
                        )
                    }
                    // value={question.answers[1].selected}
                    // checked={question.answers[1].selected}
                >
                    {question.answers[1] ? question.answers[1].answer : ""}
                </Radio>

                {/* -----1st children here------- */}

                {question.answers[0].selected == true && (
                    <div>
                        {question.children &&
                            question.children.map((_child, key) => {
                                let input = StepEquipmentChildQuestionaire(
                                    question,
                                    _child,
                                    "firstChild",
                                    saveCountReq,
                                    getChildrenQuestions,
                                    questionArea,
                                    selectedEquipmentSurvey,
                                    serialMgmt
                                );
                                return <div key={key}>{input}</div>;
                            })}
                    </div>
                )}
            </>
        );
    }

    if (question.type == "TimeZone") {
        input = (
            <>
                <Select
                    required
                    style={{ width: 400 }}
                    name={question.question.replace(/ /g, "")}
                    value={
                        question.answers[0].answer == null
                            ? ""
                            : question.answers[0].answer
                    }
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[0],
                            "parent"
                        )
                    }
                >
                    <Select.Option value="">-Select-</Select.Option>
                    <Select.Option value="US/Alaska"> US/Alaska</Select.Option>
                    <Select.Option value="US/Pacific">US/Pacific</Select.Option>
                    <Select.Option value="US/Eastern">US/Eastern</Select.Option>
                    <Select.Option value="US/Central">US/Central</Select.Option>
                    <Select.Option value="US/Arizona">US/Arizona</Select.Option>
                    <Select.Option value="US/Mountain">
                        US/Mountain
                    </Select.Option>
                    <Select.Option value="US/Hawaii"> US/Hawaii</Select.Option>
                </Select>
            </>
        );
    }

    if (question.type == "MultipleChoice-SingleSelect") {
        input = (
            <>
                <Select
                    required
                    style={{ width: 400 }}
                    name={question.question.replace(/ /g, "")}
                    value={
                        question.answers[0].answer == null
                            ? ""
                            : question.answers[0].answer
                    }
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[0],
                            "parent"
                        )
                    }
                >
                    <Select.Option value="">-Select-</Select.Option>
                    {question.answers &&
                        question.answers.map((answer, key) => {
                            return (
                                <Select.Option value={answer.id} key={key}>
                                    {answer.answer}
                                </Select.Option>
                            );
                        })}
                </Select>
                <Divider />
                {/* -----1st children here------- */}
                {question.answers.find(p => p.selected == true) && (
                    <div>
                        {question.children &&
                            question.children.map((_child, key) => {
                                let input = StepEquipmentChildQuestionaire(
                                    question,
                                    _child,
                                    "firstChild",
                                    saveCountReq,
                                    getChildrenQuestions,
                                    questionArea
                                );
                                return <div key={key}>{input}</div>;
                            })}
                    </div>
                )}
            </>
        );
    }

    if (question.type == "MultipleChoice-MultiSelect") {
        let options = [];
        question.answers.map((answer, key) => {
            options.push({
                ...answer,
                value: answer.answer,
                label: answer.answer
            });
        });

        input = (
            <>
                <Select
                    mode="multiple"
                    options={options}
                    value={options.filter(p => p.selected == true)}
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[0],
                            "parent"
                        )
                    }
                ></Select>
                <Divider />
                {question.answers.filter(p => p.selected == true).length >
                    0 && (
                    <div>
                        {question.children &&
                            question.children.map((_child, key) => {
                                let _answers = question.answers.find(
                                    p =>
                                        p.selected == true &&
                                        p.id == _child.conditionalOnAnswer
                                );

                                if (_answers) {
                                    let inputFirstChild = StepEquipmentChildQuestionaire(
                                        question,
                                        _child,
                                        "firstChild",
                                        saveCountReq,
                                        getChildrenQuestions,
                                        questionArea
                                    );
                                    return (
                                        <div key={key}>{inputFirstChild}</div>
                                    );
                                }
                            })}
                    </div>
                )}
            </>
        );
    }

    if (question.type == "FreeText" || question.type == "Email") {
        input = (
            <>
                <Input
                    required
                    type={question.type == "FreeText" ? "text" : "email"}
                    style={{
                        width: "400px"
                    }}
                    name={question.question.replace(/ /g, "")}
                    value={
                        question.answers[0].answer == null
                            ? ""
                            : question.answers[0].answer
                    }
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[0],
                            "parent"
                        )
                    }
                />
            </>
        );
    }

    if (question.type == "24-Hour Time (Hour:Minute)") {
        input = (
            <>
                <Input
                    required
                    type="time"
                    style={{
                        width: "400px"
                    }}
                    name={question.question.replace(/ /g, "")}
                    value={
                        question.answers[0].answer == null
                            ? ""
                            : question.answers[0].answer
                    }
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[0],
                            "parent"
                        )
                    }
                />
            </>
        );
    }

    if (
        question.type == "Integer" ||
        question.type == "DollarAmount" ||
        question.type == "Percentage"
    ) {
        let step = {};
        if (question.type != "Integer") {
            step = {
                step: "0.01"
            };
        }

        input = (
            <>
                <Input
                    required
                    type="number"
                    style={{
                        width: "400px"
                    }}
                    {...step}
                    name={question.question.replace(/ /g, "")}
                    value={
                        question.answers[0].answer == null
                            ? ""
                            : question.answers[0].answer
                    }
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            question.answers[0],
                            "parent"
                        )
                    }
                />
            </>
        );
    }
    return input;
};

export default StepEquipmentParentQuestionaire;
