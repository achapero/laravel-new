import { Divider, Input, Select } from "antd";
import React from "react";

const StepEquipmentChildQuestionaire = (
    question,
    child,
    childLabel,
    saveCountReq,
    getChildrenQuestions,
    questionArea,
    selectedEquipmentSurvey,
    serialMgmt
) => {
    let input;
    if (child.type == "24-Hour Time (Hour:Minute)") {
        input = (
            <>
                <br />
                {child.question}
                <br />
                <Input
                    type="time"
                    required
                    style={{ width: 400 }}
                    name={child.question.replace(/ /g, "")}
                    value={
                        child.answers[0].answer ? child.answers[0].answer : ""
                    }
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            child.answers[0],
                            childLabel,
                            child
                        )
                    }
                />
            </>
        );
    }
    if (child.type == "MultipleChoice-SingleSelect") {
        input = (
            <>
                <br />
                {child.question}
                <br />
                <Select
                    required
                    style={{ width: 400 }}
                    name={child.question.replace(/ /g, "")}
                    value={
                        child.answers.find(p => p.selected == true) == null
                            ? ""
                            : child.answers.find(p => p.selected == true).id
                    }
                    onChange={e => {
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            child.answers[0],
                            childLabel,
                            child
                        );
                    }}
                >
                    <Select.Option value="">-Select-</Select.Option>
                    {child.answers &&
                        child.answers.map((answer, key) => {
                            return (
                                <Select.Option value={answer.id} key={key}>
                                    {answer.answer}
                                </Select.Option>
                            );
                        })}
                </Select>
                <br />
                <br />
                {/* second child here  */}
                {child.children.length != 0 &&
                    child.children.map((child1, key) => {
                        let answer = child.answers.find(
                            p => p.selected == true
                        );

                        if (answer) {
                            if (child1.conditionalOnAnswer == answer.id) {
                                let inputChild = StepEquipmentChildQuestionaire(
                                    question,
                                    child1,
                                    childLabel == "firstChild"
                                        ? "secondChild"
                                        : "thirdChild",
                                    saveCountReq,
                                    getChildrenQuestions,
                                    questionArea
                                );
                                return <div key={key}>{inputChild}</div>;
                            }
                        }
                    })}
            </>
        );
    }

    if (child.type == "FreeText" || child.type == "Email") {
        input = (
            <>
                <br />
                {child.question}
                <br />
                <Input
                    type={child.type == "FreeText" ? "text" : "email"}
                    required
                    placeholder="-"
                    style={{
                        width: "400px"
                    }}
                    name={child.question.replace(/ /g, "")}
                    value={
                        child.answers[0].answer == null
                            ? ""
                            : child.answers[0].answer
                    }
                    onChange={e =>
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            child.answers[0],
                            childLabel,
                            child
                        )
                    }
                />
            </>
        );
    }

    if (child.type == "Yes/No") {
        input = (
            <>
                <br />
                {child.question}
                <br />
                <Select
                    required
                    style={{ width: 400 }}
                    name={child.question.replace(/ /g, "")}
                    value={
                        child.answers.find(p => p.selected == true) == null
                            ? ""
                            : child.answers.find(p => p.selected == true).id
                    }
                    onChange={e => {
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            child.answers[0],
                            childLabel,
                            child
                        );
                    }}
                >
                    <Select.Option value="">-Select-</Select.Option>
                    {child.answers &&
                        child.answers.map((answer, key) => {
                            return (
                                <Select.Option value={answer.id} key={key}>
                                    {answer.answer}
                                </Select.Option>
                            );
                        })}
                </Select>
                <br />
                <br />
                {child.children.length != 0 &&
                    child.children.map((child1, key) => {
                        let answer = child.answers.find(
                            p => p.selected == true
                        );
                        if (answer) {
                            if (child1.conditionalOnAnswer == answer.id) {
                                let inputChild = StepEquipmentChildQuestionaire(
                                    question,
                                    child1,
                                    childLabel == "firstChild"
                                        ? "secondChild"
                                        : "thirdChild",
                                    saveCountReq,
                                    getChildrenQuestions,
                                    questionArea
                                );
                                return <div key={key}>{inputChild}</div>;
                            }
                        }
                    })}
            </>
        );
    }

    if (
        child.type == "Integer" ||
        child.type == "DollarAmount" ||
        child.type == "Percentage"
    ) {
        let step = {};
        if (question.type != "Integer") {
            step = {
                step: "0.01"
            };
        }

        input = (
            <>
                <br />
                {child.question} <br />
                <Input
                    type="number"
                    {...step}
                    required
                    placeholder="-"
                    style={{
                        width: "400px"
                    }}
                    name={child.question.replace(/ /g, "")}
                    value={
                        child.answers[0].answer == null
                            ? ""
                            : child.answers[0].answer
                    }
                    onChange={e => {
                        getChildrenQuestions(
                            e,
                            questionArea,
                            question,
                            child.answers[0],
                            childLabel,
                            child
                        );
                    }}
                />
            </>
        );
    }
    return input;
};

export default StepEquipmentChildQuestionaire;
