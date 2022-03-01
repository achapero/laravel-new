import React, { useState } from "react";
import { Input, Modal, Alert, Select, Button, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageTicketUpdateAssignedToModal = ({
    showUpdateAssignedTo,
    setShowUpdateAssignedTo,
    selectedId,
    getForms,
    dataTableInfo,
    setDataTableInfo,
}) => {
    const [optionsAdmins, setOptionsAdmins] = useState([]);

    const {
        data: dataGetAdmins,
        isLoading: isLoadinggetAdmins,
        refetch: getAdmins,
        isFetching: isFetchingDataGuidesTable
    } = useAxiosQuery(
        "GET",
        "api/v1/users?not_employee=1",
        "users_getadmins_ticketresponses",
        res => {
            if (res.success) {
                let _options = [];
                // console.log("mcc_codes", res);
                res.data.map((admin, key) => {
                    _options.push({
                        label: admin.name,
                        value: admin.id,
                        role: admin.role
                    });
                    // if (admin.role != "Merchant")
                });
                setOptionsAdmins(_options);
            }
        }
    );

    const [val, setVal] = useState("");
    const updateField = val => {
        setVal(val);
    };

    const {
        mutate: mutateUpdatesubmit,
        isLoading: isLoadingMutateUpdatesubmit
    } = useAxiosQuery(
        "POST",
        `api/v1/ticket/multiUpdateAssignedTo`,
        `mutate_forms_multiupdateassigned`
    );

    const Updatesubmit = () => {
        mutateUpdatesubmit(
            {
                ids: selectedId,
                user_id: val
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        // console.log(res);
                        notification.success({
                            message: "Ticket Successfully Assigned"
                        });
                        setShowUpdateAssignedTo(false);
                        setDataTableInfo({
                            ...dataTableInfo,
                            reload: '3'
                        });
                        getForms();
                    }
                }
            }
        );
    };

    return (
        <Modal
            visible={showUpdateAssignedTo}
            style={{ width: "300px" }}
            title="Assigne To"
            onCancel={() => {
                setShowUpdateAssignedTo(false);
            }}
            footer={[
                <Button
                    key="submit"
                    onClick={() => {
                        Updatesubmit();
                    }}
                    type="primary"
                    loading={isLoadingMutateUpdatesubmit}
                >
                    Submit
                </Button>,
                <Button
                    key="back"
                    onClick={() => {
                        setShowUpdateAssignedTo(false);
                    }}
                >
                    Cancel
                </Button>
            ]}
        >
            <div className="pre-line">
                <Select
                    showSearch
                    placeholder="Search Merchant..."
                    filterOption={(input, option) =>
                        option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                        optionA.children
                            .toLowerCase()
                            .localeCompare(optionB.children.toLowerCase())
                    }
                    onChange={e => updateField(e)}
                    style={{ width: "100%" }}
                >
                    {optionsAdmins.map((el, key) => {
                        return (
                            <>
                                <Select.Option
                                    value={el.value}
                                    data-role={el.role}
                                    key={key}
                                >
                                    {el.label}
                                </Select.Option>
                            </>
                        );
                    })}
                </Select>
            </div>
        </Modal>
    );
};

export default PageTicketUpdateAssignedToModal;
