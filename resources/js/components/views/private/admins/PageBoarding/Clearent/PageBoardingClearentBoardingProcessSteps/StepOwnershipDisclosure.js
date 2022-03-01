import { RightOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Divider, notification } from "antd";
import React, { useEffect, useState } from "react";
import useAxiosQuery from "../../../../../../providers/useAxiosQuery";

const StepOwnershipDisclosure = ({
    merchantNumber,
    currentStep,
    stepsStatuses,
    setStepsStatuses,
    setCurrentStep
}) => {
    const [ownershipDisclosure, setOwnershipDisclosure] = useState(null);
    useEffect(() => {
        if (currentStep == 7) {
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
        data: dataGetOwnershipDisclosure,
        isLoading: isLoadingGetOwnershipDisclosure
    } = useAxiosQuery(
        "GET",
        `api/v1/clearent/ownership/${merchantNumber}`,
        `ownership_${merchantNumber}`,
        res => {
            console.log("ownership_", res);
            if (res.success) {
                if (res.data == null) {
                } else {
                    
                    setOwnershipDisclosure(
                        res.data
                            .allPersonsWithOverTwentyFivePercentOwnershipHaveBeenAdded
                    );
                }
            }
        }
    );

    useEffect(() => {
        if (ownershipDisclosure) {
            let _steps = [...stepsStatuses];
            _steps[7] = {
                ..._steps[7],
                title: <>Ownership Disclosure (1/1)</>,
                status: "finish"
            };
            setStepsStatuses(_steps);
        }
        return () => {};
    }, [ownershipDisclosure]);

    const {
        mutate: mutatePostOwnershipDisclosure,
        isLoading: isLoadingPostOwnershipDisclosure
    } = useAxiosQuery(
        "POST",
        "api/v1/clearent/ownership",
        `ownership_${merchantNumber}`
    );
    const {
        mutate: mutateUpdateOwnershipDisclosure,
        isLoading: isLoadingUpdateOwnershipDisclosure
    } = useAxiosQuery("UPDATE", "api/v1/clearent/ownership");
    const updateOwnershipDisclosure = _ownershipDisclosure => {
        let data = {
            allPersonsWithOverTwentyFivePercentOwnershipHaveBeenAdded: _ownershipDisclosure,
            merchantNumber: merchantNumber,
            id: merchantNumber
        };
        setOwnershipDisclosure(_ownershipDisclosure);
        if (ownershipDisclosure == null) {
            mutateUpdateOwnershipDisclosure(data, {
                onSuccess: res => {
                    if (res.success) {
                        if (res.data.errors) {
                            res.data.errors.map((error, key) => {
                                notification.error({
                                    message: error.errorMessage
                                });
                            });
                        } else {
                            notification.success({
                                message: "Ownership Disclosure Updated!"
                            });
                        }
                    }
                }
            });
        } else {
            mutatePostOwnershipDisclosure(data, {
                onSuccess: res => {
                    if (res.success) {
                        if (res.data.errors) {
                            res.data.errors.map((error, key) => {
                                notification.error({
                                    message: error.errorMessage
                                });
                            });
                        } else {
                            notification.success({
                                message: "Ownership Disclosure Updated!"
                            });
                        }
                    }
                }
            });
        }
    };
    return (
        <Card
            title="Ownership Disclosure"
            loading={
                isLoadingGetOwnershipDisclosure ||
                isLoadingPostOwnershipDisclosure ||
                isLoadingUpdateOwnershipDisclosure
            }
        >
            <Checkbox
                onChange={e => updateOwnershipDisclosure(e.target.checked)}
                checked={ownershipDisclosure}
            >
                All Persons With Over 25% Ownership Have Been Added?
            </Checkbox>

            {ownershipDisclosure && (
                <>
                    <Divider />
                    <Button
                        type="primary"
                        icon={<RightOutlined />}
                        style={{ float: "right" }}
                        onClick={e => setCurrentStep(currentStep + 1)}
                    >
                        Next
                    </Button>
                </>
            )}
        </Card>
    );
};

export default StepOwnershipDisclosure;
