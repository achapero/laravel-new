import React, { useState } from "react";
import { Input, Modal, Alert, Select, Button, notification } from "antd";
import useAxiosQuery from "../../../../../providers/useAxiosQuery";
const PageTicketUpdateStatusMulti = ({
    showUpdateStatusMulti,
    setShowUpdateStatusMulti,
    selectedId,
    getForms,
    dataTableInfo,
    setDataTableInfo,
}) => {
    const [val, setVal] = useState("");
    const updateField = val => {
        setVal(val);
    };

    const {
        mutate: mutateUpdatesubmit,
        isLoading: isLoadingMutateUpdatesubmit
    } = useAxiosQuery(
        "POST",
        `api/v1/ticket/multiUpdateStatus`,
        `mutate_ticket_page`
    );

    const Updatesubmit = () => {
        mutateUpdatesubmit(
            {
                ids: selectedId,
                status: val
            },
            {
                onSuccess: res => {
                    if (res.success) {
                        // console.log(res);
                        notification.success({
                            message: "Ticket Status Successfully Updated"
                        });
                        setShowUpdateStatusMulti(false);
                        setDataTableInfo({
                            ...dataTableInfo,
                            reload: '4'
                        });
                        getForms();
                    }
                }
            }
        );
    };

    return (
        <Modal
            visible={showUpdateStatusMulti}
            style={{ width: "300px" }}
            title="Update Status"
            onCancel={() => {
                setShowUpdateStatusMulti(false);
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
                        setShowUpdateStatusMulti(false);
                    }}
                >
                    Cancel
                </Button>
            ]}
        >
            <div className="pre-line">
                <Select
                    onChange={e => updateField(e)}
                    style={{ width: "100%" }}
                    placeholder="Select Status"
                >
                    <Select.Option value="Awaiting Customer Reply">
                        Awaiting Customer Reply
                    </Select.Option>
                    <Select.Option value="Awaiting Support Reply">
                        Awaiting Support Reply
                    </Select.Option>
                    <Select.Option value="On Hold">On Hold</Select.Option>
                    <Select.Option value="Closed">Closed</Select.Option>
                    <Select.Option value="Archived">Archive</Select.Option>
                </Select>
            </div>
        </Modal>
    );
};

export default PageTicketUpdateStatusMulti;
